import { execFile } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { Uri, window, workspace, env } from 'vscode';
import { UriResolverFactory, LineInfoMakerFactory, IUriResolver, ILineInfoMaker } from './resolver_decorator';

const execFileAsync = promisify(execFile);

async function DoCopy(command: CopyCommandType, uri: Uri | any) {

    try {
        var content = await GetCopyContent(command, uri);

        if (!content || content.trim().length === 0) {
            window.showErrorMessage('Failed to copy: generated content is empty');
            return;
        }
    } catch (error: any) {
        window.showErrorMessage('Failed to copy path: ' + error.message);
        return;
    }

    Copy(content);

    TryShowMessage(content);
}

function TryShowMessage(content: string) {
    var config = workspace.getConfiguration('copyPathWithLineNumber');

    if (config.get('show.message') === true) {
        window.showInformationMessage('Copied to clipboard: ' + content);
    }
}


const Copy = (content: string) => {
    env.clipboard.writeText(content);
};

export {
    DoCopy
};

enum CopyCommandType {
    CopyTestTarget,
    CopyRelativePathNoLine,
    CopyRelativePathWithLine,
    CopyAbsolutePathWithLine,
    CopyJjRelativePathNoLine,
    CopyJjRelativePathWithLine,
    CopyJjAbsolutePathNoLine,
    CopyJjAbsolutePathWithLine,
}

class ConcreteCopyCommand implements Command {
    uriResolver: IUriResolver;
    lineInfoMaker: ILineInfoMaker | null;
    needLineInfo: boolean;

    constructor(absolutePath: boolean, needLineInfo: boolean) {
        this.uriResolver = UriResolverFactory.CreateUriResolver(absolutePath);
        this.needLineInfo = needLineInfo;

        if (needLineInfo) {
            this.lineInfoMaker = LineInfoMakerFactory.CreateLineInfoMaker();
        } else {
            this.lineInfoMaker = null;
        }
    }

    async Execute(uri: Uri | any): Promise<string> {
        if (this.needLineInfo && this.lineInfoMaker !== null) {
            let res = this.getPath(uri);
            res += ":" + this.lineInfoMaker.GetLineInfo();
            return res;
        }

        return this.getPaths(uri);
    }

    getPath(uri: Uri | any): string {
        return this.uriResolver.GetPath(uri);
    }

    async getPaths(uri: Uri | any): Promise<string> {
        var res = await this.uriResolver.GetPaths(uri);

        return res.join('\n');
    }
}

class JjPrefixedCopyCommand implements Command {
    baseCommand: Command;

    constructor(baseCommand: Command) {
        this.baseCommand = baseCommand;
    }

    async Execute(uri: Uri | any): Promise<string> {
        const content = await this.baseCommand.Execute(uri);
        const changeId = await GetJjChangeId(uri);
        if (!changeId) {
            return content;
        }

        return content
            .split('\n')
            .map(line => line.trim().length > 0 ? `${changeId} ${line}` : line)
            .join('\n');
    }
}

class TestTargetCopyCommand implements Command {
    async Execute(uri: Uri | any): Promise<string> {
        const targetUri = GetTargetUri(uri);
        if (!targetUri) {
            throw new Error('Cannot copy test target without an active editor or uri');
        }

        const workspaceFolder = workspace.getWorkspaceFolder(targetUri);
        if (!workspaceFolder) {
            throw new Error('Cannot copy test target outside a workspace folder');
        }

        const relativePath = await GetRepoRelativePath(targetUri);
        if (!relativePath || relativePath.trim().length === 0) {
            throw new Error('Cannot derive test target from file path');
        }

        const normalizedRelativePath = relativePath.replace(/\\/g, '/');
        const ext = path.extname(normalizedRelativePath);
        const targetName = GetTestTargetName(ext);
        if (!targetName) {
            throw new Error(`Unsupported file type for test target: ${ext || 'no extension'}`);
        }

        const parentDir = path.posix.dirname(normalizedRelativePath);
        if (parentDir === '.' || parentDir.length === 0) {
            return `//:${targetName}`;
        }

        return `//${parentDir}:${targetName}`;
    }
}

const copyRelativePathNoLineCommand = new ConcreteCopyCommand(false, false);
const copyRelativePathWithLineCommand = new ConcreteCopyCommand(false, true);
const copyJjAbsolutePathNoLineCommand = new ConcreteCopyCommand(true, false);
const copyAbsolutePathWithLineCommand = new ConcreteCopyCommand(true, true);
const copyTestTargetCommand = new TestTargetCopyCommand();

const CommandContainer = new Map<CopyCommandType, Command>([
    [CopyCommandType.CopyTestTarget, copyTestTargetCommand],
    [CopyCommandType.CopyRelativePathNoLine, copyRelativePathNoLineCommand],
    [CopyCommandType.CopyRelativePathWithLine, copyRelativePathWithLineCommand],
    [CopyCommandType.CopyAbsolutePathWithLine, copyAbsolutePathWithLineCommand],
    [CopyCommandType.CopyJjRelativePathNoLine, new JjPrefixedCopyCommand(copyRelativePathNoLineCommand)],
    [CopyCommandType.CopyJjRelativePathWithLine, new JjPrefixedCopyCommand(copyRelativePathWithLineCommand)],
    [CopyCommandType.CopyJjAbsolutePathNoLine, new JjPrefixedCopyCommand(copyJjAbsolutePathNoLineCommand)],
    [CopyCommandType.CopyJjAbsolutePathWithLine, new JjPrefixedCopyCommand(copyAbsolutePathWithLineCommand)],
]);

function GetTestTargetName(extension: string): string | null {
    switch (extension) {
        case '.go':
            return 'go_default_test';
        case '.star':
            return 'star_default_test';
        default:
            return null;
    }
}

async function GetRepoRelativePath(targetUri: Uri): Promise<string | null> {
    try {
        const { stdout } = await execFileAsync(
            'git',
            ['rev-parse', '--show-toplevel'],
            {
                cwd: path.dirname(targetUri.fsPath),
            }
        );

        const gitRoot = stdout.trim();
        if (gitRoot.length > 0) {
            const relativePath = path.relative(gitRoot, targetUri.fsPath);
            if (relativePath.length > 0 && !relativePath.startsWith('..')) {
                return relativePath;
            }
        }
    } catch {
        // Fall back to the VS Code workspace root when the file isn't in a git repo.
    }

    const workspaceRelativePath = workspace.asRelativePath(targetUri, false);
    return typeof workspaceRelativePath === 'string' && workspaceRelativePath.length > 0
        ? workspaceRelativePath
        : null;
}


function GetTargetUri(uri: Uri | any): Uri | undefined {
    if (uri && typeof uri === 'object' && 'uri' in uri && 'lineNumber' in uri) {
        return uri.uri as Uri;
    }

    if (uri instanceof Uri) {
        return uri;
    }

    return window.activeTextEditor?.document.uri;
}

async function GetJjChangeId(uri: Uri | any): Promise<string | null> {
    const targetUri = GetTargetUri(uri);
    if (!targetUri) {
        return null;
    }

    const workspaceFolder = workspace.getWorkspaceFolder(targetUri);
    if (!workspaceFolder) {
        return null;
    }

    try {
        const { stdout } = await execFileAsync(
            'jj',
            [
                '--ignore-working-copy',
                'log',
                '--no-graph',
                '-r',
                'working_copies()',
                '-T',
                'if(current_working_copy, change_id.short() ++ "\\n", "")',
            ],
            {
                cwd: workspaceFolder.uri.fsPath,
            }
        );

        const changeId = stdout.trim();
        return changeId.length > 0 ? changeId : null;
    } catch {
        return null;
    }
}


async function GetCopyContent(commandType: CopyCommandType, uri: Uri | any): Promise<string> {
    var command = CommandContainer.get(commandType);
    if (command === undefined) {
        return "not supported command";
    }

    var res = await command.Execute(uri);
    return res;
}

interface Command {
    Execute(uri: Uri | any): Promise<string>;
}


export {
    CopyCommandType
};
