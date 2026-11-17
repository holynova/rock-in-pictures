<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="听见画面 Sound in Sight — 60 幅摄影意象，猜 60 支华语乐队">
</p>

<p align="center">
  <a href="https://xiaosang.cc/rock-in-pictures/">▶ 在线猜谜 Play Online</a>
  ·
  <a href="https://github.com/holynova/rock-in-pictures">GitHub 仓库</a>
</p>

把 60 支华语摇滚及独立乐队的名字，变成 60 幅写实摄影风格的 AI 影像：二手玫瑰是一朵被转赠的玫瑰，橘子海是海面上漂着的一只橙子。先看图猜名字，点击后立即揭晓；支持线索、随机浏览、繁简体答案、进度保存与单张原图和全套 ZIP 下载。照片均为 1024×1536 竖版 2:3，包含极简风景、静物、黑白人文与超现实场景。非乐队官方作品。

60 Chinese rock and indie band names turned into 60 photographic riddles: Second Hand Rose is a rose being passed on; Orange Ocean is a single orange floating on a still sea. Guess the name from the image, click to reveal instantly — with optional clues, random browsing, Traditional/Simplified answers, saved progress, and single or full-ZIP original downloads. Every photo is a 1024×1536 portrait. Not affiliated with the bands.

## 截图 / Screenshots

<p align="center">
  <img src="./assets/readme/screenshot-collection.jpg" width="800" alt="作品集首页：每一张，都是一个名字。60 幅竖版摄影谜面，附揭晓进度与打包下载">
</p>

<p align="center">
  <img src="./assets/readme/photo-sample.jpg" width="300" alt="第 01 幅谜面：旧货市场里，两只布满皱纹的手传递一朵微蔫的红玫瑰——二手玫瑰">
</p>

## 内容 / Contents

- **60 支乐队**：内地 42、台湾 13、香港 5；二手玫瑰、橘子海、新裤子、刺猬、痛仰、万能青年旅店、五条人、海龟先生、木马、黑豹、唐朝、逃跑计划、落日飞车、草东没有派对、茄子蛋……
- **每幅的画法**：团名文字意象的独立解读，不声称解释名称真实来源；图中的人数不代表乐队实际成员人数。
- **每幅都有线索**：一句中文提示（如二手玫瑰：「一朵被转赠的浪漫。」）与一句英文创作提示词（见 `content.json`）。
- **风格**：极简风景、静物、黑白人文、超现实场景混合；全部 AI 创作，非真实拍摄。

## 功能 / Features

- **看图猜名**：图册默认隐藏乐队名字，点击照片打开谜面，点击立即揭晓。
- **答题输入**：可先输入猜测；支持繁简体、「乐队」「乐团」后缀与别名。
- **线索与随机**：每幅一句线索；「随机看一张」任意抽一幅。
- **进度保存**：揭晓进度存在浏览器本地，可按「尚未揭晓 / 已经见面」筛选，可重置。
- **下载**：答案出现后可下载无字 PNG 原图；全套 60 张可打包下载一个 ZIP（约 145 MB，分 8 段传输）。
- **无障碍**：手机与桌面布局、键盘焦点、Esc 关闭、左右方向键切换、减少动态效果。

## 本地运行 / Run Locally

零依赖，`dist/` 就是发布内容：

```sh
python3 -m http.server 4318 --bind 127.0.0.1 --directory dist
# 打开 http://127.0.0.1:4318
```

校验（数据、图片与下载清单是否一致）：

```sh
python3 validate.py
```

## 技术 / Tech

- 零框架静态站：`dist/` 是纯 HTML + CSS + JS，数据是 `dist/data.json`（60 条，不含完整创作提示词）。
- 图片三级：原始 PNG（`dist/assets/NN.png`，60 张，共约 152 MB）+ 640px 列表预览 WebP + 1024px 查看版 WebP（各 60 张）。
- 打包下载用 8 个 20 MB 分段（`dist/downloads/parts/`）+ `manifest.json`（SHA-256 校验），`scripts/build-downloads.py` 生成。
- 创作记录见 `docs/creation-notes.md`（第一版 30 张的记录，当前 60 张以本 README 为准）。

```
content.json            60 条完整数据：名字、地区、风格、线索、英文提示词、别名
dist/data.json          公开页面数据（不含完整提示词）
dist/assets/            60 张原始 PNG + 120 张 WebP（预览 / 查看版）
dist/downloads/         全套 ZIP 分段 + manifest.json
photos-*.json           原始生成路径与提示词（含第二辑）
validate.py             数据与资产一致性校验
```

## English

**Sound in Sight** turns 60 Chinese rock and indie band names into 60 photographic riddles — guess the name from the image, click to reveal instantly.

- **60 bands**: mainland China 42, Taiwan 13, Hong Kong 5 — Second Hand Rose, Orange Ocean, New Pants, Hedgehog, Miserable Faith, Omnipotent Youth Society, Wu Tiao Ren, and more.
- **Every riddle has a clue**: one Chinese hint per photo, plus the full English generation prompt in `content.json`.
- **Play**: hidden names by default; optional answer input (Traditional/Simplified tolerant, band-name suffixes and aliases accepted); random pick; progress saved locally with unrevealed/revealed filters and reset.
- **Download**: full-resolution PNG per photo after reveal, or all 60 in one ZIP (~145 MB, 8 segments with SHA-256 manifest).
- **Run it**: `python3 -m http.server 4318 --bind 127.0.0.1 --directory dist` — zero dependencies. Verify with `python3 validate.py`.
- **Tech**: plain HTML/CSS/JS static site; 60 original PNGs (~152 MB) + 120 WebP derivatives (640px list / 1024px view).
