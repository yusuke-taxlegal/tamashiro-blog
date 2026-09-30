# 2026-09-30 共有用画像（OGP）をJPEGへ変更

- きっかけ: Google ChatでTypeless記事のリンクにプレビューが出なかった
  - 調査の結果、Google Chatは一般サイトのリンクにプレビューを出さない（Typeless公式のPNG OGPでも出ない）ため、サイト側の問題ではなかった
  - ただし og:image がWebPで、LINEなどWebP非対応のアプリで画像が出ない恐れがあった
- 対応: `src/components/BaseHead.astro` で、heroImage（ImageMetadata）を `getImage` によりJPEG（幅最大1200px、quality 82）へ変換して og:image / twitter:image に使う
  - 記事ページ内に表示する画像はWebPのまま
  - heroImageなしのページは従来どおり `/images/ysk-life-og.png`
- 検証: ビルド後、全23記事の og:image がJPEGファイルとして dist に存在（80〜165KB、1200x800）
