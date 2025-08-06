# 故障排除指南

## 构建错误：Module not found: Can't resolve '@/components/ui/card'

### 问题描述
在GitHub Actions或Docker构建过程中，出现以下错误：
```
Failed to compile.
./src/app/errors/page.tsx
Module not found: Can't resolve '@/components/ui/card'
```

### 原因分析
这个问题通常由以下原因引起：

1. **TypeScript路径别名解析问题**：在Docker构建环境中，`@/*` 路径别名可能没有正确解析
2. **文件复制顺序问题**：在Docker构建过程中，文件复制顺序可能导致模块解析失败
3. **依赖安装问题**：某些依赖可能没有正确安装

### 解决方案

#### 方案1：验证本地构建
首先确保本地构建正常：
```bash
npm run build
```

#### 方案2：检查TypeScript配置
确保 `tsconfig.json` 中的路径配置正确：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 方案3：更新Dockerfile
使用以下优化的Dockerfile：
```dockerfile
# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装依赖
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# 构建阶段
FROM base AS builder
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
```

#### 方案4：添加调试信息
在GitHub Actions中添加调试步骤：
```yaml
- name: Debug build
  run: |
    echo "=== Node.js version ==="
    node --version
    echo "=== npm version ==="
    npm --version
    echo "=== File structure ==="
    ls -la
    echo "=== Source structure ==="
    ls -la src/
    echo "=== Components structure ==="
    ls -la src/components/ui/
    echo "=== TypeScript check ==="
    npx tsc --noEmit
    echo "=== Building ==="
    npm run build
```

#### 方案5：临时使用相对路径
如果问题持续存在，可以临时使用相对路径：
```typescript
// 替换
import { Card } from '@/components/ui/card';

// 为
import { Card } from '../../components/ui/card';
```

### 预防措施

1. **定期更新依赖**：保持所有依赖包的最新版本
2. **使用TypeScript检查**：在构建前运行 `npx tsc --noEmit`
3. **本地测试**：在推送代码前先在本地测试构建
4. **监控构建日志**：密切关注GitHub Actions的构建日志

### 常见问题

#### Q: 为什么本地构建成功但Docker构建失败？
A: 这通常是因为Docker构建环境与本地环境不同，特别是文件系统、Node.js版本或依赖安装方式。

#### Q: 如何确保路径别名正确工作？
A: 确保 `tsconfig.json` 和 `next.config.js` 配置正确，并在构建前运行TypeScript检查。

#### Q: 构建失败时如何调试？
A: 使用上述调试步骤，检查文件结构、依赖安装和TypeScript配置。

### 联系支持
如果问题仍然存在，请：
1. 检查GitHub Actions日志
2. 验证所有配置文件
3. 尝试在本地重现问题
4. 联系项目维护者 