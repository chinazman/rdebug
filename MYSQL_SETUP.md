# MySQL 数据库设置

本项目已从SQLite迁移到MySQL数据库。

## 环境变量配置

创建 `.env` 文件并添加以下配置：

```env
# 开发环境
DATABASE_URL="mysql://root:password@localhost:3306/rdebug"

# 生产环境
# DATABASE_URL="mysql://username:password@your-mysql-host:3306/database_name"
```

## 使用Docker Compose运行（推荐）

1. 启动应用和MySQL数据库：
```bash
docker-compose up -d
```

2. 等待MySQL启动后，运行数据库设置：
```bash
npm run db:setup
```

## 本地开发

### 方法1：使用Docker（推荐）

1. 启动MySQL容器：
```bash
docker-compose up db -d
```

2. 安装依赖：
```bash
npm install
```

3. 生成Prisma客户端：
```bash
npm run db:generate
```

4. 设置数据库结构：
```bash
npm run db:setup
```

5. 启动开发服务器：
```bash
npm run dev
```

### 方法2：本地MySQL

1. 安装MySQL 8.0或更高版本
2. 创建数据库并设置权限：
```sql
CREATE DATABASE rdebug;
CREATE USER 'rdebug'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON rdebug.* TO 'rdebug'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'rdebug'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

3. 安装依赖：
```bash
npm install
```

4. 生成Prisma客户端：
```bash
npm run db:generate
```

5. 设置数据库结构：
```bash
npm run db:setup
```

6. 启动开发服务器：
```bash
npm run dev
```

## 数据库管理命令

- `npm run db:generate` - 生成Prisma客户端
- `npm run db:setup` - 设置数据库结构（推荐，避免权限问题）
- `npm run db:push` - 推送数据库结构
- `npm run db:migrate` - 创建并应用数据库迁移
- `npm run db:deploy` - 部署数据库迁移（生产环境）
- `npm run db:reset` - 重置数据库
- `npm run db:studio` - 打开Prisma Studio查看数据

## 字段类型优化

为了支持更长的文本内容，以下字段使用了 `MEDIUMTEXT` 类型：

- **message**: 异常信息，支持最大 16MB 文本
- **stack**: 堆栈信息，支持最大 16MB 文本  
- **domStructure**: DOM结构，支持最大 16MB 文本

这比默认的 `VARCHAR(191)` 更适合存储大量文本数据。

## 解决权限问题

如果遇到 "User was denied access" 错误：

1. **使用 `db:setup` 而不是 `db:migrate`**：
   ```bash
   npm run db:setup
   ```

2. **确保使用root用户**：
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/rdebug"
   ```

3. **给用户足够权限**：
   ```sql
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   ```

## 注意事项

1. 确保MySQL服务正在运行
2. 检查数据库连接字符串格式正确
3. 首次运行使用 `npm run db:setup` 而不是 `npm run db:migrate`
4. 生产环境请使用强密码和适当的用户权限
5. 如果使用Docker，确保容器正常启动
6. MEDIUMTEXT 字段支持最大 16MB 内容，适合存储大量文本数据 