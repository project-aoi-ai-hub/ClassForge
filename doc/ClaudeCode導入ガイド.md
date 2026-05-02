# Claude Code CLI 導入・設定プラン

Claude Code を CLI で利用し、クレジット（トークン）消費を抑えながら効率的に開発するための設定を完了しました。

## 1. 導入手順（ユーザー様での操作）

Windows の PowerShell で以下のコマンドを実行してください。

```powershell
# インストール
irm https://claude.ai/install.ps1 | iex

# 認証（ブラウザが開きます）
claude auth login

# プロジェクトディレクトリへ移動
cd d:\Google\Antigravity\10_ClassForge\ClassForge\class-forge

# 起動
claude
```

## 2. 設定済みの内容

以下のファイルを作成・更新し、Claude Code が無駄な動きをしないように最適化しました。

- **[.claudeignore](file:///d:/Google/Antigravity/10_ClassForge/ClassForge/class-forge/.claudeignore)**: `node_modules` やビルド成果物、画像ファイルなどを Claude が読み込まないように除外設定しました。これにより、初回インデックス時のトークン消費を大幅に削減できます。
- **[CLAUDE.md](file:///d:/Google/Antigravity/10_ClassForge/ClassForge/class-forge/CLAUDE.md)**: プロジェクトの技術スタック（Next.js, Prisma, Tailwind v4 等）やビルドコマンドを記載しました。Claude がこれを見ることにより、誤ったコマンドの実行や不要な質問を減らし、結果としてクレジットを節約します。

## 3. クレジットを節約する使い方のコツ

1. **`--once` モードの活用**:
   対話型セッションを維持せず、単発の指示で終わらせることで無駄なコンテキストの積み重なりを防げます。
   ```bash
   claude --once "src/components/Button.tsx のタイポを修正して"
   ```
2. **Antigravity との使い分け**:
   - **Antigravity (私)**: 全体的な設計、新しい機能の実装計画の策定、複雑な依存関係の解決など、大きなコンテキストが必要なタスク。
   - **Claude Code**: 個別のファイルの微修正、ユニットテストの作成、特定のバグ修正、コミットメッセージの生成など、局所的で即時性の高いタスク。
3. **適切なコンテキスト提供**:
   「全部やって」ではなく「このファイルとこのファイルを見て、○○を修正して」と対象を絞ることで、読み込まれるトークン量を制御できます。

## 4. 便利なコマンドとメンテナンス

### ログアウトする方法
一時的に利用を停止する場合や、別の個人アカウントに切り替えたい場合は、以下のコマンドを実行して認証情報を解除できます。
```powershell
claude /logout
```

### 再ログインする方法
ログアウト後や認証が切れた場合は、以下のコマンドで再度ブラウザ認証を行います。
```powershell
claude auth login
```

### 対話モードを終了する方法
Claude Code のセッションを終了するには、ターミナルで `exit` と入力するか、`Ctrl + C` を押してください。

---
上記の設定で、CLI 版の Claude Code をこのプロジェクトですぐに使い始めることができます。
