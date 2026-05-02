# ClassForge プロジェクトガイドライン

## ビルド・開発コマンド
- 開発サーバー起動: `npm run dev`
- プロジェクトビルド: `npm run build`
- リンター実行: `npm run lint`
- Prisma スキーマ生成: `npx prisma generate`
- DB マイグレーション適用: `npx prisma db push`
- シードデータ投入: `npm run seed`

## 技術スタック
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: Prisma v7, PostgreSQL
- **Auth**: NextAuth.js v5 (Auth.js)
- **Styling**: Tailwind CSS v4

## コーディング規約
- コンポーネントは `src/components` に配置
- 型定義は `src/types` または各ファイル内で定義
- サーバーアクションは `src/app/actions` などを活用
- 命名はキャメルケース（ファイル名は一部パスに合わせてケバブケース）

## 優先事項
- 型安全性の確保（TypeScript のエラーを無視しない）
- パフォーマンスの最適化（React Server Components の活用）
- セキュリティの考慮（NextAuth.js による適切な認可）
