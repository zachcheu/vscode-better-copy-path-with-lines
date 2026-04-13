import * as vscode from 'vscode';
import { DoCopy, CopyCommandType } from './facade';

export function activate(context: vscode.ExtensionContext) {
	const testTarget = vscode.commands.registerCommand('markshawn2020.copy.test.target', (uri) => {
		DoCopy(CopyCommandType.CopyTestTarget, uri);
	});

	const relativePathNoLine = vscode.commands.registerCommand('markshawn2020.copy.relative.path.no.line', (uri) => {
		DoCopy(CopyCommandType.CopyRelativePathNoLine, uri);
	});

	const relativePathWithLine = vscode.commands.registerCommand('markshawn2020.copy.relative.path.line', (uri) => {
		DoCopy(CopyCommandType.CopyRelativePathWithLine, uri);
	});

	const absolutePathWithLine = vscode.commands.registerCommand('markshawn2020.copy.absolute.path.line', (uri) => {
		DoCopy(CopyCommandType.CopyAbsolutePathWithLine, uri);
	});

	const jjRelativePathNoLine = vscode.commands.registerCommand('markshawn2020.copy.jj.relative.path.no.line', (uri) => {
		DoCopy(CopyCommandType.CopyJjRelativePathNoLine, uri);
	});

	const jjRelativePathWithLine = vscode.commands.registerCommand('markshawn2020.copy.jj.relative.path.line', (uri) => {
		DoCopy(CopyCommandType.CopyJjRelativePathWithLine, uri);
	});

	const jjAbsolutePathNoLine = vscode.commands.registerCommand('markshawn2020.copy.jj.absolute.path.no.line', (uri) => {
		DoCopy(CopyCommandType.CopyJjAbsolutePathNoLine, uri);
	});

	const jjAbsolutePathWithLine = vscode.commands.registerCommand('markshawn2020.copy.jj.absolute.path.line', (uri) => {
		DoCopy(CopyCommandType.CopyJjAbsolutePathWithLine, uri);
	});

	context.subscriptions.push(
		testTarget,
		relativePathNoLine,
		relativePathWithLine,
		absolutePathWithLine,
		jjRelativePathNoLine,
		jjRelativePathWithLine,
		jjAbsolutePathNoLine,
		jjAbsolutePathWithLine
	);
}

export function deactivate() { }
