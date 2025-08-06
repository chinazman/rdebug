# 部署指南

本项目使用GitHub Actions实现自动化CI/CD流程，支持自动构建、测试、打包Docker镜像并发布到Docker Hub。

## 🚀 快速开始

### 1. 设置GitHub Secrets

在GitHub仓库设置中添加以下Secrets：

- `DOCKERHUB_USERNAME`: 你的Docker Hub用户名
- `DOCKERHUB_TOKEN`: 你的Docker Hub访问令牌

#### 获取Docker Hub Token：
1. 登录 [Docker Hub](https://hub.docker.com/)
2. 进入 Account Settings > Security
3. 创建新的Access Token
4. 复制Token并保存到GitHub Secrets

### 2. 触发自动部署

#### 方式一：推送代码到主分支
```bash
git push origin main
```

#### 方式二：创建版本标签
```bash
# 小版本更新 (0.1.0 -> 0.1.1)
npm run version:patch

# 功能版本更新 (0.1.0 -> 0.2.0)
npm run version:minor

# 大版本更新 (0.1.0 -> 1.0.0)
npm run version:major
```

#### 方式三：手动创建标签
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 📋 CI/CD 流程说明

### 触发条件
- 推送到 `main` 或 `develop` 分支
- 创建版本标签 (格式: `v*`)
- 创建Pull Request到 `main` 分支

### 执行步骤

1. **测试阶段**
   - 安装依赖
   - 运行代码检查 (ESLint)
   - 运行测试 (如果存在)
   - 构建应用

2. **构建和部署阶段** (仅在推送时执行)
   - 登录Docker Hub
   - 构建Docker镜像
   - 推送到Docker Hub
   - 创建GitHub Release (仅版本标签)

### 镜像标签策略

- `latest`: 主分支的最新版本
- `develop`: develop分支的版本
- `v1.0.0`: 具体版本标签
- `1.0`: 主版本号
- `1`: 大版本号

## 🐳 Docker 部署

### 本地构建和运行

```bash
# 构建镜像
npm run docker:build

# 运行容器
npm run docker:run

# 使用docker-compose
docker-compose up -d
```

### 从Docker Hub拉取

```bash
# 拉取最新版本
docker pull your-username/rdebug:latest

# 运行容器
docker run -p 3000:3000 your-username/rdebug:latest
```

## 🔧 环境变量

### 必需的环境变量
- `DATABASE_URL`: 数据库连接字符串 (如果使用数据库)

### 可选的环境变量
- `NODE_ENV`: 运行环境 (production/development)
- `PORT`: 应用端口 (默认: 3000)

## 📊 监控和健康检查

应用提供了健康检查端点：
- URL: `http://localhost:3000/api/health`
- 返回应用状态、时间戳和运行时间

## 🔍 故障排除

### 常见问题

1. **构建失败**
   - 检查代码语法错误
   - 确保所有依赖都已安装
   - 查看GitHub Actions日志

2. **Docker镜像推送失败**
   - 验证Docker Hub凭据
   - 检查网络连接
   - 确认Docker Hub仓库存在

3. **应用启动失败**
   - 检查环境变量配置
   - 验证数据库连接
   - 查看容器日志: `docker logs <container-id>`

### 调试命令

```bash
# 查看容器日志
docker logs <container-id>

# 进入容器调试
docker exec -it <container-id> /bin/sh

# 检查容器状态
docker ps -a

# 查看镜像信息
docker images
```

## 📝 版本管理

### 语义化版本控制

- `patch`: 修复bug (0.1.0 -> 0.1.1)
- `minor`: 新功能 (0.1.0 -> 0.2.0)
- `major`: 重大变更 (0.1.0 -> 1.0.0)

### 版本发布流程

1. 开发完成后，选择合适的版本更新类型
2. 运行对应的版本更新命令
3. GitHub Actions自动构建和发布
4. 检查Docker Hub确认镜像已发布
5. 验证GitHub Release已创建

## 🔒 安全注意事项

- 不要在代码中硬编码敏感信息
- 使用环境变量管理配置
- 定期更新依赖包
- 监控安全漏洞
- 使用私有仓库存储敏感镜像

## 📞 支持

如果遇到问题，请：
1. 查看GitHub Actions日志
2. 检查Docker Hub仓库状态
3. 验证环境变量配置
4. 联系项目维护者 