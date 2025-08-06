# GitHub Secrets 设置指南

## 步骤 1: 获取 Docker Hub Token

1. 访问 [Docker Hub](https://hub.docker.com/) 并登录
2. 点击右上角的用户名，选择 "Account Settings"
3. 在左侧菜单中点击 "Security"
4. 点击 "New Access Token"
5. 输入Token名称（例如：github-actions）
6. 选择权限范围（建议选择 "Read & Write"）
7. 点击 "Generate"
8. **重要**: 复制生成的Token并保存到安全的地方

## 步骤 2: 在 GitHub 仓库中设置 Secrets

1. 打开你的 GitHub 仓库
2. 点击 "Settings" 标签
3. 在左侧菜单中点击 "Secrets and variables" > "Actions"
4. 点击 "New repository secret"
5. 添加以下两个 secrets：

### DOCKERHUB_USERNAME
- Name: `DOCKERHUB_USERNAME`
- Value: 你的 Docker Hub 用户名

### DOCKERHUB_TOKEN
- Name: `DOCKERHUB_TOKEN`
- Value: 你在步骤 1 中生成的 Docker Hub Token

## 步骤 3: 验证设置

1. 推送代码到主分支或创建版本标签
2. 检查 GitHub Actions 是否正常运行
3. 验证 Docker Hub 中是否出现了新的镜像

## 故障排除

### 如果 Docker 登录失败：
- 检查 DOCKERHUB_USERNAME 是否正确
- 确认 DOCKERHUB_TOKEN 是否有效
- 验证 Token 是否有足够的权限

### 如果镜像推送失败：
- 确认 Docker Hub 仓库存在
- 检查网络连接
- 验证 Token 是否过期

## 安全建议

- 定期轮换 Docker Hub Token
- 使用最小权限原则
- 监控 GitHub Actions 日志
- 不要在代码中硬编码敏感信息 