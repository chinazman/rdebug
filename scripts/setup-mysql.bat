@echo off
chcp 65001 >nul

echo 🚀 开始设置 MySQL 数据库...

REM 检查是否安装了 MySQL
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL 未安装，请先安装 MySQL 8.0 或更高版本
    echo 下载地址: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo 📦 创建数据库...
echo 请输入 MySQL root 密码:
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS rdebug;"

echo 📝 创建环境配置文件...
(
echo DATABASE_URL="mysql://root:password@localhost:3306/rdebug"
echo NODE_ENV=development
) > .env

echo ✅ 环境配置完成！
echo.
echo 📋 下一步操作：
echo 1. 修改 .env 文件中的数据库密码
echo 2. 运行: npm run db:generate
echo 3. 运行: npm run db:migrate
echo 4. 运行: npm run dev
echo.
echo 🎉 MySQL 设置完成！
pause 