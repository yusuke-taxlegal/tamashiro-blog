# 2026-09-29 サンプル記事3本の削除

## 依頼
以下はサンプル記事のため削除する。
- https://ysk.life/blog/chatgpt-business-nyumon/
- https://ysk.life/blog/google-workspace-nyumon/
- https://ysk.life/blog/jizokuka-hojo-2025/

## 実施内容
- 記事本文を削除: `src/content/blog/{chatgpt-business-nyumon,google-workspace-nyumon,jizokuka-hojo-2025}.md`
- 各記事専用のヒーロー画像を削除（他記事からの参照なしを確認）: `src/assets/blog/{practical-ai-workshop,google-workspace-office,subsidy-application}.jpg`
- `lib/engagement/articles.json` を再生成（25件→22件）
- テスト・検証スクリプトのサンプル記事IDを既存記事に差し替え
  - chatgpt-business-nyumon → chatgpt-desktop-work-setup
  - google-workspace-nyumon → google-workspace-gmail-gemini-productivity

## 触っていないもの
- `logs/` 配下の過去の記録（履歴なので残す）
- 本番D1に残っている3記事の閲覧数・リアクションの記録（表示対象から外れるだけで実害なし）

## 検証
- `npm run build` 成功、`dist` 内に3記事のslugが残っていないことを確認
- `npm run test:engagement` 8/8、`npm run test:engagement:sync` 2/2 合格
- `npm run check:affiliate` 問題なし
