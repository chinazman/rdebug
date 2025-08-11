# 网络请求监控功能

## 功能概述

RDebug 现在支持监控和记录页面中的所有 AJAX 网络请求，包括：

- **Fetch API** 请求
- **XMLHttpRequest** 请求
- 请求和响应详情
- 响应时间统计
- 错误请求识别

## 工作原理

### 1. 请求拦截

脚本通过重写以下原生方法来实现请求拦截：

```javascript
// 拦截 XMLHttpRequest
XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.send

// 拦截 Fetch API
window.fetch
```

### 2. 循环防护

为了避免无限循环，脚本会自动排除发送到采集网站的请求：

```javascript
// 检查是否是sendData请求，如果是则跳过
if (xhr._rdebugUrl && xhr._rdebugUrl.includes('/api/')) {
  return originalXHRSend.apply(this, arguments);
}
```

### 3. 数据收集

对于每个网络请求，脚本会收集以下信息：

- **基本信息**: URL、请求方法、状态码
- **时间信息**: 响应时间、时间戳
- **请求详情**: 请求头、请求体
- **响应详情**: 响应头、响应体
- **错误信息**: 网络错误、HTTP错误
- **会话信息**: 用户代理、会话ID

## 使用方法

### 1. 集成脚本

在您的网站中添加 RDebug 脚本：

```html
<script src="http://localhost:3000/api/script?serverUrl=http://localhost:3000"></script>
```

### 2. 查看数据

访问网络请求监控页面：
- URL: `http://localhost:3000/network-requests`
- 功能：查看所有捕获的网络请求

### 3. 测试功能

访问测试页面：
- URL: `http://localhost:3000/test`
- 功能：测试不同类型的网络请求

## 数据展示

### 主列表
- **时间**: 请求发生的时间
- **方法**: HTTP请求方法（GET、POST等）
- **URL**: 请求的目标地址
- **状态**: HTTP状态码
- **响应时间**: 请求耗时
- **会话ID**: 用户会话标识

### 详细信息
- **请求头**: 完整的请求头信息
- **请求体**: 发送的数据
- **响应头**: 服务器返回的头信息
- **响应体**: 服务器返回的数据
- **错误信息**: 如果有错误，显示错误详情

### 分类视图
- **错误请求**: 显示所有4xx和5xx状态码的请求
- **慢请求**: 显示响应时间超过1000ms的请求
- **详细信息**: 显示所有请求的完整信息

## 性能考虑

### 1. 数据量控制
- 响应体大小限制：避免记录过大的响应
- 请求头过滤：只记录重要的头信息
- 自动清理：定期清理旧数据

### 2. 网络影响
- 异步发送：不影响主请求的性能
- 错误处理：网络错误不会影响主功能
- 循环防护：避免无限循环

### 3. 存储优化
- 数据库索引：优化查询性能
- 分页查询：避免一次性加载大量数据
- 数据压缩：减少存储空间

## 配置选项

### 脚本配置
```javascript
const config = {
  serverUrl: 'http://localhost:3000',
  sessionId: generateSessionId(),
  // 可以添加更多配置选项
};
```

### 数据库配置
```sql
-- 网络请求表索引
CREATE INDEX idx_network_requests_timestamp ON NetworkRequest(timestamp);
CREATE INDEX idx_network_requests_sessionId ON NetworkRequest(sessionId);
CREATE INDEX idx_network_requests_url ON NetworkRequest(url);
```

## 故障排除

### 1. 请求未被记录
- 检查脚本是否正确加载
- 确认请求URL不包含 `/api/`
- 查看浏览器控制台是否有错误

### 2. 数据不显示
- 检查数据库连接
- 确认API端点正常工作
- 查看服务器日志

### 3. 性能问题
- 检查网络请求频率
- 确认数据库性能
- 考虑增加数据清理策略

## 扩展功能

### 1. 自定义过滤
可以添加自定义过滤规则，例如：
- 排除特定域名
- 只记录特定类型的请求
- 设置响应时间阈值

### 2. 实时监控
可以添加WebSocket支持，实现实时数据推送：
- 实时显示新请求
- 实时统计信息
- 实时错误告警

### 3. 数据分析
可以添加数据分析功能：
- 请求频率统计
- 响应时间分布
- 错误率分析
- 用户行为分析

## 安全考虑

### 1. 数据隐私
- 避免记录敏感信息（如密码）
- 考虑数据脱敏
- 遵守隐私法规

### 2. 访问控制
- 限制API访问权限
- 添加身份验证
- 记录访问日志

### 3. 数据保护
- 定期备份数据
- 加密敏感信息
- 设置数据保留策略 