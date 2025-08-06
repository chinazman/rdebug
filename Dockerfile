# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine3.19 AS base

# 安装依赖阶段
FROM base AS deps
# 检查https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# 安装依赖
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# 构建阶段
FROM base AS builder
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制所有源代码
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

# 确保TypeScript配置正确
RUN npx tsc --noEmit

# 构建应用
RUN npm run build

# 生产阶段
FROM base AS runner
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

ENV NODE_ENV=production
# 在Linux上，需要明确设置用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public

# 设置正确的权限
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# 自动利用输出跟踪来复制必要的文件
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 启动应用
CMD ["node", "server.js"] 