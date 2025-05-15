async function handlePixiv() {
  const url = document.getElementById('pixiv-url').value.trim();
  const results = document.getElementById('results');
  results.innerHTML = 'Pixivページを解析中ですわ…';

  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    const html = data.contents;

    // 画像URL抽出
    const imageUrls = [...html.matchAll(/https:\/\/i\.pximg\.net\/img-original\/[^"]+\.(jpg|png)/g)]
      .map(match => match[0]);

    if (imageUrls.length === 0) {
      results.innerHTML = '申し訳ありませんが、画像が見つかりませんでしたわ。';
      return;
    }

    results.innerHTML = `見つかった画像数：${imageUrls.length}枚\nExifチェック中ですわ…\n`;

    for (const imgUrl of imageUrls) {
      results.innerHTML += `\n${imgUrl}\n`;

      try {
        const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imgUrl)}`;
        const imgRes = await fetch(proxiedUrl);
        const blob = await imgRes.blob();
        const exif = await exifr.parse(blob);

        if (exif) {
          results.innerHTML += '→ Exifメタデータがございますわ！\n';
        } else {
          results.innerHTML += '→ Exifメタデータはございませんでしたわ。\n';
        }
      } catch (err) {
        results.innerHTML += `→ エラーで確認できませんでしたわ：${err.message}\n`;
      }
    }
  } catch (error) {
    results.innerHTML = 'Pixivページの取得に失敗いたしましたわ：' + error.message;
  }
}
