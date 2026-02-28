#!/usr/bin/env node
/**
 * ビルドスクリプト: CSS/JSをminifyしてdist/に出力
 * - public/style.css → dist/style.min.css
 * - public/app.js → dist/app.min.js
 * - コンテンツハッシュ付きファイル名でキャッシュバスティング
 */
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// distディレクトリをクリーンアップ
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

async function build() {
  // CSS minify
  const cssResult = await esbuild.build({
    entryPoints: [path.join(PUBLIC_DIR, 'style.css')],
    bundle: false,
    minify: true,
    write: false,
    loader: { '.css': 'css' },
  });
  const cssContent = cssResult.outputFiles[0].text;
  const cssHash = crypto.createHash('md5').update(cssContent).digest('hex').slice(0, 8);
  const cssFileName = `style.${cssHash}.min.css`;
  fs.writeFileSync(path.join(DIST_DIR, cssFileName), cssContent);

  // JS minify
  const jsResult = await esbuild.build({
    entryPoints: [path.join(PUBLIC_DIR, 'app.js')],
    bundle: false,
    minify: true,
    write: false,
    target: ['es2020'],
    loader: { '.js': 'js' },
  });
  const jsContent = jsResult.outputFiles[0].text;
  const jsHash = crypto.createHash('md5').update(jsContent).digest('hex').slice(0, 8);
  const jsFileName = `app.${jsHash}.min.js`;
  fs.writeFileSync(path.join(DIST_DIR, jsFileName), jsContent);

  // マニフェストファイル（ファイル名マッピング）を生成
  const manifest = {
    'style.css': cssFileName,
    'app.js': jsFileName,
  };
  fs.writeFileSync(path.join(DIST_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // サイズレポート
  const origCssSize = fs.statSync(path.join(PUBLIC_DIR, 'style.css')).size;
  const origJsSize = fs.statSync(path.join(PUBLIC_DIR, 'app.js')).size;

  console.log('Build complete!');
  console.log(`  CSS: ${(origCssSize / 1024).toFixed(1)}KB → ${(cssContent.length / 1024).toFixed(1)}KB (${cssFileName})`);
  console.log(`  JS:  ${(origJsSize / 1024).toFixed(1)}KB → ${(jsContent.length / 1024).toFixed(1)}KB (${jsFileName})`);
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
