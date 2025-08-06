# RDebug 使用说明

## 🚀 项目已成功启动！

### 访问地址
- **主页**: http://localhost:3000
- **错误日志页面**: http://localhost:3000/errors
- **DOM快照页面**: http://localhost:3000/snapshots
- **测试页面**: http://localhost:3000/test

### 主要功能

#### 1. 生成嵌入脚本
1. 访问主页 http://localhost:3000
2. 点击"生成脚本"按钮
3. 复制生成的JavaScript代码
4. 将代码嵌入到您的业务网站中

#### 2. 查看收集的数据
- **错误日志**: 查看所有JavaScript异常信息
- **DOM快照**: 查看用户快速点击时捕获的页面DOM结构

#### 3. 测试功能
访问 http://localhost:3000/test 页面可以测试：
- 触发JavaScript错误
- 触发Promise异常
- 测试快速点击功能（2秒内点击3次）

### 技术特性
- ✅ Next.js 14 + App Router
- ✅ Prisma ORM + MySQL数据库
- ✅ shadcn/ui + Tailwind CSS
- ✅ 实时数据收集
- ✅ 分页显示
- ✅ 响应式设计

### 数据库
- MySQL数据库
- 使用Prisma Studio查看数据: `npx prisma studio`
- 数据库连接配置在 `.env` 文件中

### 开发命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run db:generate  # 生成Prisma客户端
npm run db:migrate   # 运行数据库迁移
npm run db:studio    # 打开数据库管理界面
```

### 嵌入脚本功能
嵌入脚本会自动：
1. 捕获所有JavaScript异常
2. 监听用户快速点击（2秒内3次点击）
3. 发送DOM结构快照
4. 生成唯一会话ID进行跟踪

现在您可以开始使用这个埋点收集系统了！ 