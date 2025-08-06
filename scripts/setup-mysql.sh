#!/bin/bash

# MySQL 设置脚本
echo "🚀 开始设置 MySQL 数据库..."

# 检查是否安装了 MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL 未安装，请先安装 MySQL 8.0 或更高版本"
    echo "下载地址: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# 创建数据库
echo "📦 创建数据库..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS rdebug;"

# 创建 .env 文件
echo "📝 创建环境配置文件..."
cat > .env << EOF
DATABASE_URL="mysql://root:password@localhost:3306/rdebug"
NODE_ENV=development
EOF

echo "✅ 环境配置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 修改 .env 文件中的数据库密码"
echo "2. 运行: npm run db:generate"
echo "3. 运行: npm run db:migrate"
echo "4. 运行: npm run dev"
echo ""
echo "🎉 MySQL 设置完成！" 