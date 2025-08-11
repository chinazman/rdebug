# RDebug - 埋点搜集系统

一个简单的网站异常和DOM结构搜集系统，基于 Next.js + Prisma + MySQL + shadcn/ui 构建。

## 功能特性

### 采集网站功能
- 🚀 **现代化界面**: 使用 shadcn/ui 组件库，界面美观现代
- 📊 **数据统计**: 实时显示异常记录、DOM快照、网络请求、活跃会话等统计信息
- 🔍 **数据查看**: 支持分页查看异常记录、DOM快照和网络请求
- 📝 **详细信息**: 查看异常堆栈、DOM结构、网络请求详情等详细信息
- 🎯 **脚本生成**: 自动生成嵌入脚本，方便集成到业务网站

### 业务网站功能
- ⚡ **异常捕获**: 自动捕获所有JavaScript异常和Promise拒绝
- 🖱️ **快速点击检测**: 2秒内点击3次触发DOM快照
- 🌐 **网络请求监控**: 自动捕获所有AJAX网络请求（fetch和XMLHttpRequest）
- 📡 **数据发送**: 自动将数据发送到采集网站
- 🔒 **会话管理**: 为每个用户生成唯一会话ID
- 🛡️ **错误处理**: 完善的错误处理，不影响主站功能
- 🔄 **循环防护**: 自动排除发送到采集网站的请求，避免循环

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **数据库**: MySQL
- **ORM**: Prisma
- **UI组件**: shadcn/ui + Tailwind CSS
- **图标**: Lucide React
- **类型安全**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

创建 `.env` 文件并配置数据库连接：

```env
DATABASE_URL="mysql://username:password@localhost:3306/rdebug"
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构
npm run db:push
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 使用方法

### 1. 生成嵌入脚本

1. 访问首页
2. 在"嵌入脚本"标签页中配置服务器地址
3. 点击"生成并复制脚本标签"
4. 将生成的脚本标签添加到您的网站HTML中

### 2. 查看搜集的数据

- **异常记录**: 访问 `/errors` 页面查看所有异常信息
- **DOM快照**: 访问 `/snapshots` 页面查看DOM结构快照
- **网络请求**: 访问 `/network-requests` 页面查看所有AJAX网络请求

### 3. 测试功能

在集成了脚本的网站中：
- 触发JavaScript异常会自动发送到采集网站
- 在2秒内快速点击3次会触发DOM快照

## API 接口

### 异常数据
- `POST /api/errors` - 接收异常数据
- `GET /api/errors` - 获取异常列表（支持分页和筛选）

### DOM快照
- `POST /api/dom-snapshots` - 接收DOM快照
- `GET /api/dom-snapshots` - 获取DOM快照列表（支持分页和筛选）

### 网络请求
- `POST /api/network-requests` - 接收网络请求数据
- `GET /api/network-requests` - 获取网络请求列表（支持分页和筛选）

### 脚本生成
- `GET /api/script` - 生成嵌入脚本

## 数据库结构

### ErrorLog 表
- `id`: 主键
- `url`: 页面URL
- `message`: 异常信息
- `stack`: 堆栈信息（可选）
- `userAgent`: 用户代理
- `timestamp`: 时间戳
- `sessionId`: 会话ID

### DomSnapshot 表
- `id`: 主键
- `url`: 页面URL
- `domStructure`: DOM结构（长文本）
- `userAgent`: 用户代理
- `timestamp`: 时间戳
- `sessionId`: 会话ID
- `clickCount`: 点击次数

### NetworkRequest 表
- `id`: 主键
- `url`: 请求URL
- `method`: 请求方法（GET、POST等）
- `status`: 响应状态码
- `statusText`: 响应状态文本
- `responseTime`: 响应时间（毫秒）
- `requestHeaders`: 请求头信息
- `responseHeaders`: 响应头信息
- `requestBody`: 请求体
- `responseBody`: 响应体
- `error`: 错误信息（如果有）
- `userAgent`: 用户代理
- `timestamp`: 时间戳
- `sessionId`: 会话ID

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 数据库操作
npm run db:generate  # 生成 Prisma 客户端
npm run db:push      # 推送数据库结构
npm run db:studio    # 打开 Prisma Studio
```

## 部署

### 本地部署
1. 配置数据库
2. 设置环境变量
3. 运行 `npm run build && npm run start`

### 云部署
推荐使用 Vercel 进行部署：
1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

## 注意事项

- 确保数据库连接正常
- 生产环境请配置正确的服务器地址
- 建议添加适当的访问控制和日志记录
- 定期清理旧数据以节省存储空间

## 许可证

MIT License 