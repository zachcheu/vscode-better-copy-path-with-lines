<p align="center">
  <img src="docs/images/cover.png" alt="Better Copy Path with Lines Cover" width="100%">
</p>

<h1 align="center">
  <img src="images/icon.png" width="32" height="32" alt="Logo" align="top">
  Better Copy Path with Lines
</h1>

<p align="center">
  <strong>Copy file paths with line numbers in one click</strong><br>
  <sub>VS Code · VSCodium · Open VSX</sub>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=MarkShawn2020.better-copy-path-with-lines"><img src="https://img.shields.io/visual-studio-marketplace/v/MarkShawn2020.better-copy-path-with-lines?style=flat&label=VS%20Code&logo=visual-studio-code" alt="VS Code Marketplace"></a>
  <a href="https://open-vsx.org/extension/MarkShawn2020/better-copy-path-with-lines"><img src="https://img.shields.io/open-vsx/v/MarkShawn2020/better-copy-path-with-lines?style=flat&label=Open%20VSX&logo=eclipse" alt="Open VSX"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=MarkShawn2020.better-copy-path-with-lines"><img src="https://img.shields.io/visual-studio-marketplace/i/MarkShawn2020.better-copy-path-with-lines?style=flat&label=downloads" alt="Downloads"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=MarkShawn2020.better-copy-path-with-lines"><img src="https://img.shields.io/visual-studio-marketplace/r/MarkShawn2020.better-copy-path-with-lines?style=flat&label=rating" alt="Rating"></a>
</p>

<p align="center">
  <a href="#">English</a> · <a href="./README_ZH.md">中文文档</a>
</p>

## ⚡ Quick Demo

Right-click in the line number area or editor → Get `src/app.ts:42` instantly.

```
src/components/Button.tsx:42        ← Single line
src/utils/helper.ts:10-20           ← Line range
src/api/client.ts:5, 15, 25         ← Multiple selections
```

**Use cases:**
- 📝 GitHub issues/PRs - Share precise code locations
- 💬 Team chat - Reference specific lines in discussions
- 📚 Documentation - Link to exact code sections
- 🐛 Bug reports - Point to problematic lines

## ✨ Features

### 🎯 Three Ways to Copy

**1. Line Number Gutter** (most common)

![Line number gutter context menu](./images/copy-filepath-with-line-number_gutter.gif)

**2. Editor Area** (current cursor position)

![Editor context menu](./images/copy-filepath-with-line-number_non-selected.gif)

**3. Multi-Selection** (ranges and multiple lines)

![Multi-line selection](./images/copy-filepath-with-line-number_selected.gif)

### 📋 Output Formats

| Format | Example | Use Case |
|--------|---------|----------|
| **Relative** | `src/Button.tsx:42` | GitHub, team collaboration |
| **Absolute** | `/Users/me/project/src/Button.tsx:42` | Local references |
| **Range** | `src/utils.ts:10-20` | Code blocks |
| **Multiple** | `src/api.ts:5, 15, 25` | Scattered references |

### ⚙️ Customizable Settings

```jsonc
{
  "copyPathWithLineNumber.path.separator": "slash",      // "/" | "\" | "system"
  "copyPathWithLineNumber.range.connector": "dash",      // "-" | "~"
  "copyPathWithLineNumber.selection.separator": "comma", // "," | ";" | " "
  "copyPathWithLineNumber.relative.exclude.prefixes": [  // Optional: strip matching relative prefixes
    "compare/*/*"
  ],
  "copyPathWithLineNumber.show.message": true            // Show notification
}
```

Example: if the relative path is `compare/wmvsyynw->xpwonuux/wmvsyynw/src/code.uber.internal/app.ts`
and config contains `compare/*/*`, the copied relative path becomes `src/code.uber.internal/app.ts`.

## 📥 Installation

**VS Code** (Marketplace)
```bash
code --install-extension MarkShawn2020.better-copy-path-with-lines
```

**VSCodium** (Open VSX)
```bash
codium --install-extension MarkShawn2020.better-copy-path-with-lines
```

Or search "Better Copy Path with Lines" in the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`)

## 🎯 Why This Fork?

Enhanced fork of [qishan233/copy-path-with-line-number](https://github.com/qishan233/copy-path-with-line-number) with critical fixes and UX improvements.

| Aspect | Original | This Fork |
|--------|----------|-----------|
| Line gutter | ❌ Broken | ✅ **Fixed** |
| Menu clicks | 3 (submenu) | **2 (direct)** |
| Commands | 4 mixed options | **2 focused** |
| Performance | Baseline | **33% faster** |

**Key improvements:** Fixed VSCode line number API · Removed submenus · Simplified labels · Automated releases

## 🤝 Contributing

Uses automated releases via [Conventional Commits](https://www.conventionalcommits.org/). Push `feat:` or `fix:` commits to trigger auto-publish to both marketplaces.

```bash
git commit -m "feat: new feature"  # → 0.2.0 → 0.3.0
git commit -m "fix: bug fix"       # → 0.2.0 → 0.2.1
git push  # Automatically publishes to VS Code & Open VSX
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 🐛 Issues & Support

Report bugs: [GitHub Issues](https://github.com/MarkShawn2020/vscode-better-copy-path-with-lines/issues)

## 📝 Release Notes

Latest: **v0.2.0** - [View Changelog](./CHANGELOG.md)

### v0.2.0 - Automated Release Pipeline

- ✅ Dual marketplace publishing (VS Code + Open VSX)
- ✅ Auto-versioning with semantic-release
- ✅ Auto-generated CHANGELOG
- ✅ GitHub Actions CI/CD workflow

### v0.1.3 - Improved Defaults

- Changed range connector to `-` (industry standard)
- Better compatibility with GitHub/GitLab

### v0.1.2 - Critical Fix

- Fixed line number gutter context menu
- Improved VSCode API handling

[View full changelog](./CHANGELOG.md)

---

## 📜 License

MIT License

## 🙏 Credits

**Fork of:** [qishan233/copy-path-with-line-number](https://github.com/qishan233/copy-path-with-line-number)
**Maintainer:** [MarkShawn2020](https://github.com/MarkShawn2020)

---

<div align="center">

**Made with ❤️ for developers who share code references frequently**

[⬆ Back to top](#better-copy-path-with-lines)

</div>
