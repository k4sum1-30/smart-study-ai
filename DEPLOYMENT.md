# SmartStudy AI - 快速部署指南

## 🚀 5步完成部署

### 步骤 1: 准备 Vercel 账号

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号注册/登录
3. 完成！完全免费

### 步骤 2: 推送代码到 GitHub

```bash
# 在项目目录下执行
git init
git add .
git commit -m "Initial commit - SmartStudy AI"

# 创建 GitHub 仓库后
git remote add origin https://github.com/your-username/smart-study-ai.git
git branch -M main
git push -u origin main
```

### 步骤 3: 导入项目到 Vercel

1. 登录 Vercel Dashboard
2. 点击 "Add New..." → "Project"
3. 选择 GitHub 仓库 "smart-study-ai"
4. 点击 "Import"

### 步骤 4: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GEMINI_API_KEY` | `your-gemini-api-key` | Google Gemini API密钥 |
| `APP_USERNAME` | `student` | 登录用户名（自定义） |
| `APP_PASSWORD` | `smartstudy2024` | 登录密码（自定义） |

**获取 Gemini API Key:**
1. 访问 [ai.google.dev](https://ai.google.dev)
2. 点击 "Get API Key"
3. 创建新项目或选择现有项目
4. 复制 API Key

### 步骤 5: 部署！

1. 点击 "Deploy"
2. 等待 2-3 分钟构建完成
3. 访问 Vercel 提供的 URL (例如: `your-project.vercel.app`)
4. 使用您设置的用户名/密码登录
5. 完成！🎉

## 📱 使用方法

### 分享给学生

1. 告诉学生访问您的网站 URL
2. 提供统一的登录凭据:
   ```
   用户名: student
   密码: smartstudy2024
   ```
3. 学生可以立即开始使用所有AI学习功能

### 管理访问

**方式 1: 单一共享账号** (最简单)
- 所有学生使用相同的用户名/密码
- 适合小班教学或信任的群体

**方式 2: 多个账号** (更安全)
- 修改 `api/auth.js` 添加多个用户
- 每个学生有独立账号

## 🔧 高级配置

### 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加您的域名 (例如: `study.yourdomain.com`)
3. 按照提示配置 DNS
4. 等待验证完成

### 性能优化

Vercel 自动提供:
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 自动缓存
- ✅ 边缘网络部署

### 监控使用情况

1. Vercel Dashboard → Analytics
2. 查看访问量、性能数据
3. Vercel Dashboard → Logs
4. 查看 API 调用日志

## 💰 成本控制

### Vercel 免费层
- ✅ 每月 100GB 带宽
- ✅ 无限请求
- ✅ 足够支持 100-200 活跃用户

### Gemini API 成本
- 按使用量计费
- 估算: 每个学生每月约 $0.50-1.00
- 50个学生 ≈ $25-50/月

### 降低成本策略
1. 设置 API 请求限制（每用户每天最多X次）
2. 启用缓存（相同问题重复使用结果）
3. 使用免费层模型

## 🔒 安全建议

### 基础安全
- ✅ API密钥存储在环境变量（不在代码中）
- ✅ HTTPS 自动启用
- ✅ 后端代理保护 API 密钥

### 增强安全（可选）
1. 定期更换密码
2. 限制 IP 访问（Vercel Pro）
3. 添加验证码防止暴力破解
4. 实现 token 过期机制

## 📊 监控和维护

### 日常检查
```bash
# 查看部署状态
vercel ls

# 查看最新日志
vercel logs

# 查看环境变量
vercel env ls
```

### 更新应用
```bash
# 修改代码后
git add .
git commit -m "Update: description"
git push

# Vercel 会自动重新部署
```

## 🆘 常见问题

### Q: 部署失败?
**A:** 检查 `package.json` 中的 build 命令，确保本地可以运行 `npm run build`

### Q: API 调用失败?
**A:** 检查 Vercel 环境变量是否正确设置，特别是 `GEMINI_API_KEY`

### Q: 登录失败?
**A:** 确认环境变量 `APP_USERNAME` 和 `APP_PASSWORD` 已设置

### Q: 太慢?
**A:** Vercel 免费层在冷启动时可能较慢，考虑升级到 Pro ($20/月) 获得更好性能

### Q: 想添加更多功能?
**A:** 在本地修改代码，测试后推送到 GitHub，Vercel 会自动部署

## 📞 获取帮助

- Vercel 文档: [vercel.com/docs](https://vercel.com/docs)
- Gemini API 文档: [ai.google.dev/docs](https://ai.google.dev/docs)
- 部署问题: 查看 Vercel Dashboard → Deployments → 错误日志

## ✅ 部署检查清单

部署前:
- [ ] 代码已推送到 GitHub
- [ ] 已有 Gemini API Key
- [ ] 已注册 Vercel 账号

部署时:
- [ ] 导入 GitHub 仓库到 Vercel
- [ ] 设置所有环境变量
- [ ] 点击 Deploy

部署后:
- [ ] 访问 URL 确认网站运行
- [ ] 测试登录功能
- [ ] 测试一个课程的 AI 功能
- [ ] 记录登录凭据分享给学生

恭喜！您的 AI 学习平台已上线！🎓✨

---

**下次更新**: 只需 `git push`，Vercel 会自动部署新版本！
