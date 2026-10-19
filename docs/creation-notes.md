> 第一版创作记录（30张）。当前60张、即时揭晓和打包下载功能以项目README为准。

# 听见画面

30 支内地、香港和台湾摇滚及独立乐队的摄影意象猜谜网站。每张照片独立使用 ImageGen 内置工具生成，原始规格 1024 × 1536（竖版 2:3）。混合彩色极简风景、静物与黑白人文摄影语言；图片为 AI 创作，非真实拍摄或乐队官方作品。

## 本地运行

无需安装依赖：

```sh
python3 -m http.server 4318 --bind 127.0.0.1 --directory dist
```

浏览器访问 http://127.0.0.1:4318。

## 体验

- 图册默认隐藏乐队名字；点击照片打开谜面。
- 输入猜测可选；支持常见繁简体、乐队和乐团后缀。
- 点击揭晓，或猜中后，严格等待三秒再显示名字。
- 切换作品、关闭弹窗会取消倒数，防止串题。
- 本浏览器保存揭晓进度；可筛选、随机选择与重置。
- 答案出现后可下载无字 PNG 原图。
- 手机与桌面布局、键盘焦点、Escape 关闭、左右方向键切换、减少动态效果支持。

## 资产与创作记录

`content.json` 保存全部 30 个名字、地区、宽泛风格与逐张英文创作提示词。`photos-a.json`、`photos-b.json`、`photos-c.json` 保存原始生成路径与提示词。原图位于 `dist/assets/01.png` 至 `30.png`；同目录 `.webp` 是 640px 列表预览，`-full.webp` 是 1024px 查看版。优化只进行缩放与编码，不改变内容。

运行 `python3 optimize_assets.py` 可用本机 cwebp 重新生成缺失的预览。`dist/data.json` 为公开页面内容，不含完整创作提示词。

## 内容边界

本项目按知名度与团名可视化潜力挑选，不是知名度排行榜，包含独立流行、迷幻流行与电子摇滚等相邻风格。画面是团名文字意象的独立解读，不声称解释名称真实来源。图中的人数不代表乐队实际成员人数。

## 查阅资料

- [Spotify 二手玫瑰及相关艺人资料](https://open.spotify.com/intl-id/artist/3GieaM4fCTs5MgbdHrNOgG)
- [澎湃新闻：从草东街派对到草东没有派对](https://www.thepaper.cn/newsDetail_forward_1575534)
- [盘尼西林官方账号入口](https://linktr.ee/penicillin_official)
- [落日飞车官方微博](https://www.weibo.com/6250697503/PxIIttler)
- [太极乐队资料](https://zh.wikipedia.org/wiki/太極樂隊)
- [唐朝乐队资料](https://bandchina.com/portal/article/index.html?cid=8&id=653)

风格标签为便于理解的宽泛描述；未加入易过期的成员阵容、演出信息或排名。
