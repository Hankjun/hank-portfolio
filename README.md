# HANK · Personal website & little shop

静态站点。保留米白、深墨绿、赤陶橙和 HANK 品牌系统。首页只展示三项旗舰服务；完整目录位于 `/shop/`。右上角可切换中文与英文。

## 修改内容

- `data/flagships.json`：三项旗舰服务与详情页。
- `data/products.json`：全部商品。分类为 `knowledge`、`training`、`projects`、`organization`、`cocreation`；`published: false` 不出现在页面、计数和咨询清单中。
- `data/services.json`：16 项 Work 标签。
- `data/cases.json`：项目实践；补充客户确认的交付物、结果或评价后更新。不要填入未经确认的经营数据。
- `data/brands.json`：已提供的合作品牌标志。自有 IP 与未具名设计标记不作为客户品牌展示。
- `data/channels.json`：微信、GitHub，以及待配置的 Email、预约、LinkedIn、WhatsApp。只有 `published: true` 且提供有效地址的渠道才启用。
- `i18n/zh.json` 与 `i18n/en.json`：界面文案；每项商品、服务和案例同时维护中英文内容。
- `data/config.json`：默认中文、公开 canonical 地址、培训价格与可选统计服务。

新增商品只需在 `data/products.json` 添加同结构记录，使用唯一 ID、SKU，并填写双语字段、分类、标签、价格与状态。页面会自动筛选和计算数量；未发布记录保留为草稿。

## 构建与预览

```sh
node scripts/build-site.mjs
python3 -m http.server 8765
```

构建生成首页、小铺、三个服务详情页、三个实践详情页、WORK 16 双语研究入口和 sitemap。生成后的 HTML 自带中文正文，不依赖 JavaScript 才能阅读；浏览器加载后启用语言切换、过滤与咨询清单。

GitHub Pages 从 main 根目录发布。Sites 使用同一页面与数据，同步到它的 `dist/` 静态目录后发布。根目录的旧版页面与货架源文件保存在 `archive/2026-11-01-before-refactor/`；WORK 16 的完整中文书稿和练习工具保留原有路径。

## 价格与咨询

标准培训每课时 299 元，课程制 1,200 元 / 月（4 课时）。连续 2 个月 2,160 元，3 个月 2,880 元。所选课程是同一学习周期内的方向，不逐门乘以月费；超出当前周期容量时先确认排期。定制项目、企业培训与多人拼课单独询价。英文版显示 International pricing on request，未擅自换算汇率。

清单和语言偏好保存在当前浏览器，存储不可用时仍可使用页面。项目简报可复制、下载，或复制后打开微信二维码。没有在线付款与自动发消息。配置可用 Email 后，邮件按钮会用 mailto 带入简报主题与正文。

## 联系与统计的配置

邮箱与预约统一填写 `data/config.json` 的 `contact.email`、`contact.bookingUrl`，填写有效地址后自动启用。LinkedIn 和 WhatsApp 仍在 `data/channels.json` 中配置 URL 与发布状态。

统计默认关闭。确认统计账户和站点后，在 `data/config.json` 的 analytics 填入 provider（plausible 或 umami）、src 与 domain（Umami 为 website ID）。事件包括 project_brief_create、brief_copy、brief_download、shortlist_change、shortlist_open、wechat_qr_open、email_enquiry、outbound_click；不发送简报内容或联系信息。

## 媒体与保留内容

Logo 使用保留 alpha 的 WebP，原透明 PNG 与原图保留。视频采用 1280×720 H.264/AAC、faststart，保留封面与 preload=none。分享图为 `assets/hank-social-card.png`，可编辑的版式源为 `assets/social-card.html`。

WORK 16 研究入口为双语；完整书稿、PDF 课件和练习工具仍为中文原稿，英文入口明确标注。12 门研究课件链接已与实际 PDF 文件名核对。

## 联系地址（本轮配置入口）

在 `data/config.json` 的 `contact` 中填写 `email` 和 `bookingUrl`，无需修改页面代码或再改渠道开关。有效邮箱/预约 URL 填入后，联系区自动显示对应链接；英文版顺序为 Email、微信、预约。留空时不展示空地址入口。

合作简报和选购清单均提供“用邮件发送”，以 mailto 打开已带入主题与正文的邮件草稿；邮箱留空时草稿不预填收件人。浏览器不会自动发送邮件。
