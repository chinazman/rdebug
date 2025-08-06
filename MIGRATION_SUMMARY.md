# 数据库迁移总结：SQLite → MySQL

## 🎯 迁移概述

项目已成功从 SQLite 数据库迁移到 MySQL 数据库。

## 📝 主要更改

### 1. Prisma Schema 更新
- **文件**: `prisma/schema.prisma`
- **更改**: 将 `provider` 从 `"sqlite"` 改为 `"mysql"`
- **字段类型优化**: 
  - `message` 字段改为 `@db.MediumText`
  - `stack` 字段改为 `@db.MediumText`
  - `domStructure` 字段改为 `@db.MediumText`

### 2. 依赖包更新
- **文件**: `package.json`
- **新增**: `mysql2` 包 (版本 ^3.6.5)
- **新增脚本**:
  - `db:migrate` - 创建并应用数据库迁移
  - `db:deploy` - 部署数据库迁移（生产环境）
  - `db:reset` - 重置数据库
  - `db:setup` - 设置数据库结构（推荐）
  - `setup:mysql` - 快速设置MySQL环境

### 3. Docker 配置更新
- **文件**: `docker-compose.yml`
- **新增**: MySQL 8.0 服务
- **配置**:
  - 数据库名称: `rdebug`
  - 用户名: `rdebug`
  - 密码: `password`
  - 端口: `3306`

### 4. 文档更新
- **README.md**: 已包含 MySQL 相关信息
- **USAGE.md**: 更新为 MySQL 配置
- **MYSQL_SETUP.md**: 新增 MySQL 设置指南

### 5. 脚本文件
- **scripts/setup-mysql.sh**: Linux/macOS 设置脚本
- **scripts/setup-mysql.bat**: Windows 设置脚本
- **scripts/init-mysql.sql**: MySQL 初始化脚本

## 🚀 快速开始

### 使用 Docker Compose
```bash
# 启动应用和MySQL
docker-compose up -d

# 运行数据库设置
npm run db:setup
```

### 本地开发
```bash
# 1. 安装MySQL 8.0+
# 2. 运行设置脚本
npm run setup:mysql

# 3. 生成Prisma客户端
npm run db:generate

# 4. 运行数据库设置
npm run db:setup

# 5. 启动开发服务器
npm run dev
```

## 🔧 环境变量配置

创建 `.env` 文件：
```env
DATABASE_URL="mysql://root:password@localhost:3306/rdebug"
NODE_ENV=development
```

## 📊 数据库结构

### ErrorLog 表
- `id`: 主键 (String)
- `url`: 页面URL (String)
- `message`: 异常信息 (String, MEDIUMTEXT)
- `stack`: 堆栈信息 (String?, MEDIUMTEXT)
- `userAgent`: 用户代理 (String)
- `timestamp`: 时间戳 (DateTime)
- `sessionId`: 会话ID (String)

### DomSnapshot 表
- `id`: 主键 (String)
- `url`: 页面URL (String)
- `domStructure`: DOM结构 (String, MEDIUMTEXT)
- `userAgent`: 用户代理 (String)
- `timestamp`: 时间戳 (DateTime)
- `sessionId`: 会话ID (String)
- `clickCount`: 点击次数 (Int)

## 🔍 字段类型优化

为了支持更长的文本内容，以下字段使用了 `MEDIUMTEXT` 类型：

- **message**: 异常信息，支持最大 16MB 文本
- **stack**: 堆栈信息，支持最大 16MB 文本  
- **domStructure**: DOM结构，支持最大 16MB 文本

这比默认的 `VARCHAR(191)` 更适合存储大量文本数据。

## ⚠️ 注意事项

1. **数据迁移**: 如果从 SQLite 迁移现有数据，需要手动导出导入
2. **性能**: MySQL 相比 SQLite 有更好的并发性能
3. **备份**: 建议定期备份 MySQL 数据
4. **安全**: 生产环境请使用强密码和适当的用户权限
5. **文本长度**: MEDIUMTEXT 字段支持最大 16MB 内容

## 🎉 迁移完成

项目现在使用 MySQL 数据库，具有更好的性能和可扩展性！ 