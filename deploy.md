# RDebug 部署指南

## 📦 打包文件位置
打包后的文件在 `.next` 目录中，包含：
- `.next/static/` - 静态资源（CSS、JS、图片）
- `.next/server/` - 服务端代码
- `.next/standalone/` - 独立部署包（如果启用）

## 🚀 部署方法

### 方法1：传统服务器部署

#### 1. 准备文件
```bash
# 构建项目
npm run build

# 需要上传的文件：
- .next/          # 构建文件
- public/         # 静态资源（如果有）
- package.json    # 依赖配置
- package-lock.json
- next.config.js  # Next.js配置
- prisma/         # 数据库配置
- .env           # 环境变量
```

#### 2. 服务器环境要求
- Node.js 18+ 
- npm 或 yarn
- 支持 SQLite 或 MySQL

#### 3. 服务器部署步骤
```bash
# 1. 上传文件到服务器
scp -r .next package.json package-lock.json next.config.js prisma/ .env user@your-server:/path/to/app/

# 2. 在服务器上安装依赖
npm install --production

# 3. 生成 Prisma 客户端
npx prisma generate

# 4. 启动应用
npm start
```

#### 4. 使用 PM2 管理进程
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "rdebug" -- start

# 设置开机自启
pm2 startup
pm2 save
```

### 方法2：Docker 部署

#### 1. 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public
COPY next.config.js ./
COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. 构建和运行
```bash
# 构建镜像
docker build -t rdebug .

# 运行容器
docker run -p 3000:3000 rdebug
```

### 方法3：Vercel 部署（最简单）

#### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

#### 2. 部署
```bash
vercel
```

#### 3. 环境变量配置
在 Vercel 控制台设置：
- `DATABASE_URL` - 数据库连接字符串

### 方法4：静态导出（不推荐，因为需要API）

如果需要静态导出，需要修改 `next.config.js`：
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
}

module.exports = nextConfig
```

然后运行：
```bash
npm run build
```

## 🔧 环境配置

### 生产环境变量 (.env.production)
```env
DATABASE_URL="file:./prod.db"
NODE_ENV=production
```

### 数据库配置
- **开发环境**: SQLite (`file:./dev.db`)
- **生产环境**: 建议使用 MySQL 或 PostgreSQL

## 📊 性能优化

### 1. 启用压缩
```javascript
// next.config.js
const nextConfig = {
  compress: true,
}
```

### 2. 启用缓存
```javascript
// next.config.js
const nextConfig = {
  generateEtags: true,
}
```

## 🔍 监控和日志

### 1. 使用 PM2 监控
```bash
pm2 monit
pm2 logs rdebug
```

### 2. 添加日志记录
```javascript
// 在 API 路由中添加日志
console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
```

## 🛡️ 安全配置

### 1. 设置 CORS 限制
```javascript
// src/lib/cors.ts
export function withCors(request: NextRequest, response: NextResponse) {
  // 限制特定域名
  response.headers.set("Access-Control-Allow-Origin", "https://your-domain.com");
  // ... 其他配置
}
```

### 2. 添加速率限制
```bash
npm install express-rate-limit
```

## 📝 部署检查清单

- [ ] 构建成功 (`npm run build`)
- [ ] 环境变量配置正确
- [ ] 数据库连接正常
- [ ] CORS 配置正确
- [ ] 端口配置正确
- [ ] 域名解析正确
- [ ] SSL 证书配置（如需要）
- [ ] 防火墙规则配置
- [ ] 监控和日志配置

## 🆘 常见问题

### 1. 端口被占用
```bash
# 查看端口占用
netstat -tulpn | grep :3000

# 杀死进程
kill -9 <PID>
```

### 2. 数据库权限问题
```bash
# 确保数据库文件可写
chmod 666 prod.db
```

### 3. 内存不足
```bash
# 增加 Node.js 内存限制
node --max-old-space-size=4096 npm start
``` 