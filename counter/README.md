# AITI 参与计数

`GET /participation` 返回 `{"total": 0}` 形式的累计次数。`POST /participation` 接收一条完成事件，正文是 32 个小写十六进制字符组成的随机编号。数据库只保存编号和汇总数字。

## 本地联调

在 `counter/` 运行以下命令。数据库使用默认的本地持久化目录。

```sh
npx wrangler@4.166.0 d1 migrations apply aiti-participation --local
npx wrangler@4.166.0 dev --var SITE_ORIGIN:http://localhost:5173
```

在 `web/.env.local` 设置 `VITE_PARTICIPATION_API_URL=http://localhost:8787/participation`，用 `http://localhost:5173/AITI/` 打开开发服务器。只有在提供接口地址时，前端才请求计数服务。

## 正式部署

在 `counter/` 登录项目使用的 Cloudflare 账号，应用数据库迁移，再部署 Worker。

```sh
npx wrangler@4.166.0 login --device --scopes account:read workers_scripts:write d1:write
npx wrangler@4.166.0 d1 migrations apply aiti-participation --remote
npx wrangler@4.166.0 deploy
```

Pages 部署工作流默认使用 `https://aiti-participation.gmh06-aiti.workers.dev/participation`。如需更换地址，设置仓库 Actions 变量 `AITI_PARTICIPATION_API_URL`，再运行 Pages 部署工作流。前端仍部署在 GitHub Pages，Worker 检查完成事件的 `Origin` 请求头。
