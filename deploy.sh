#!/bin/bash

# RDebug 部署脚本
echo "🚀 开始部署 RDebug..."

# 1. 构建项目
echo "📦 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建成功！"

# 2. 创建部署包
echo "📁 创建部署包..."
DEPLOY_DIR="deploy"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# 复制必要文件
cp -r .next $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
cp package-lock.json $DEPLOY_DIR/
cp next.config.js $DEPLOY_DIR/
cp -r prisma $DEPLOY_DIR/
cp .env $DEPLOY_DIR/ 2>/dev/null || echo "⚠️  .env 文件不存在，请手动创建"

# 3. 创建启动脚本
cat > $DEPLOY_DIR/start.sh << 'EOF'
#!/bin/bash
echo "🚀 启动 RDebug..."

# 安装依赖
npm install --production

# 生成 Prisma 客户端
npx prisma generate

# 启动应用
npm start
EOF

chmod +x $DEPLOY_DIR/start.sh

# 4. 创建 PM2 配置
cat > $DEPLOY_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'rdebug',
    script: 'npm',
    args: 'start',
    cwd: './',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# 5. 创建 Dockerfile
cat > $DEPLOY_DIR/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用文件
COPY .next ./.next
COPY next.config.js ./
COPY prisma ./prisma

# 生成 Prisma 客户端
RUN npx prisma generate

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
EOF

# 6. 创建 docker-compose.yml
cat > $DEPLOY_DIR/docker-compose.yml << 'EOF'
version: '3.8'

services:
  rdebug:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
EOF

echo "✅ 部署包创建完成！"
echo ""
echo "📁 部署文件位置: $DEPLOY_DIR/"
echo ""
echo "🚀 部署方法："
echo "1. 传统部署: 上传 $DEPLOY_DIR/ 到服务器，运行 ./start.sh"
echo "2. Docker部署: cd $DEPLOY_DIR && docker-compose up -d"
echo "3. PM2部署: cd $DEPLOY_DIR && pm2 start ecosystem.config.js"
echo ""
echo "📋 部署检查清单："
echo "- [ ] 服务器已安装 Node.js 18+"
echo "- [ ] 环境变量已配置"
echo "- [ ] 端口 3000 可用"
echo "- [ ] 数据库权限正确" 