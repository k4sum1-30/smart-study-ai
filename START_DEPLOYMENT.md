# 🚀 SmartStudy AI - 立即部署指南

## 第一步：安装必要工具 ✅

### 1. 安装 Git
如果还没有安装 Git：

**Windows:**
1. 访问 https://git-scm.com/download/win
2. 下载并安装
3. 重启终端

**验证安装:**
```bash
git --version
```

### 2. 注册 GitHub 账号
1. 访问 https://github.com
2. 点击 "Sign up"
3. 完成注册

### 3. 注册 Vercel 账号
1. 访问 https://vercel.com
2. 使用 GitHub 账号登录（推荐）
3. 授权 Vercel 访问 GitHub

### 4. 获取 Gemini API Key
1. 访问 https://ai.google.dev
2. 点击 "Get API Key"
3. 创建或选择项目
4. 复制 API Key **（保存好！）**

---

## 第二步：准备代码 📝

### 1. 创建 .gitignore 文件（如果没有）
确保项目有 `.gitignore` 文件，包含：
```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

### 2. 初始化 Git 仓库
在项目根目录运行：
```bash
git init
git add .
git commit -m "Initial commit: SmartStudy AI ready for deployment"
```

---

## 第三步：创建 GitHub 仓库 📦

### 方式1: 通过 GitHub 网站
1. 访问 https://github.com/new
2. 仓库名: `smart-study-ai`
3. 设置为 **Public** 或 **Private**
4. **不要**勾选任何初始化选项
5. 点击 "Create repository"

### 方式2: 使用 GitHub CLI (可选)
```bash
gh repo create smart-study-ai --public --source=. --remote=origin
```

### 连接仓库并推送
GitHub 会显示类似这样的命令：
```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-study-ai.git
git branch -M main
git push -u origin main
```

**复制并运行这些命令！**

---

## 第四步：部署到 Vercel 🚀

### 1. 导入项目
1. 访问 https://vercel.com/dashboard
2. 点击 "Add New..." → "Project"
3. 找到并选择 `smart-study-ai` 仓库
4. 点击 "Import"

### 2. 配置项目设置
**Framework Preset**: Vite
**Root Directory**: `./`
**Build Command**: `npm run build`
**Output Directory**: `dist`

### 3. 添加环境变量 🔑
点击 "Environment Variables"，添加：

| Name | Value | 说明 |
|------|-------|------|
| `GEMINI_API_KEY` | `粘贴您的API Key` | 从 ai.google.dev 获取 |
| `APP_USERNAME` | `student` | 登录用户名（可自定义） |
| `APP_PASSWORD` | `smartstudy2024` | 登录密码（可自定义） |

**重要**: 点击每个变量旁的 "Add" 按钮

### 4. 部署！
1. 点击 "Deploy"
2. 等待 2-3 分钟 ☕
3. 看到 "Congratulations!" 页面

---

## 第五步：测试网站 ✨

### 1. 访问您的网站
Vercel 会提供类似这样的 URL：
```
https://smart-study-ai-xxx.vercel.app
```

### 2. 测试登录
- 用户名: `student` (或您设置的)
- 密码: `smartstudy2024` (或您设置的)

### 3. 测试功能
1. 选择 "Data Structures" 课程
2. 点击任一 Lecture 的 "Quiz"
3. 等待 AI 生成题目
4. 确认功能正常！

---

## 第六步：分享给学生 🎓

### 创建使用说明
```
📚 SmartStudy AI - AI学习平台

🌐 网址: https://your-app.vercel.app

🔐 登录信息:
   用户名: student
   密码: smartstudy2024

📖 使用指南:
1. 访问网站
2. 使用上述账号登录
3. 选择课程
4. 开始 AI 辅助学习！

💡 功能:
- 智能复习测验
- 个性化 Quiz
- AI 代码解释
- 自动生成演示文稿
```

---

## 常见问题 🆘

### Q: 部署失败，显示 "Build Error"
**解决方案:**
1. 检查本地是否能运行 `npm run build`
2. 查看 Vercel 的 Build Logs
3. 确保 `package.json` 中有正确的 scripts

### Q: 登录后 API 调用失败
**解决方案:**
1. 检查 Vercel 环境变量是否正确设置
2. 查看 Functions Logs
3. 确认 `GEMINI_API_KEY` 有效

### Q: 显示 404 Not Found
**解决方案:**
1. 检查 `vercel.json` 配置
2. 确保 build 输出目录是 `dist`
3. 重新部署

### Q: 想更新代码
**解决方案:**
```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push

# Vercel 会自动重新部署！
```

---

## 下一步优化 🎯

### 1. 自定义域名
```
Vercel Dashboard → Settings → Domains
添加: study.yourdomain.com
```

### 2. 性能监控
```
Vercel Dashboard → Analytics
查看访问量、加载时间
```

### 3. 添加多个用户
编辑 `api/auth.js`:
```javascript
const validUsers = {
  'student1': 'pass1',
  'student2': 'pass2',
  'teacher': 'teacherpass'
};
```

### 4. 设置使用限制
添加速率限制防止 API 滥用

---

## 🎉 完成检查清单

部署完成后确认：

- [ ] Git 已安装并配置
- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] 环境变量已设置（3个）
- [ ] 网站可以访问
- [ ] 登录功能正常
- [ ] AI 功能正常工作
- [ ] 已保存网站 URL
- [ ] 已保存登录凭据
- [ ] 已分享给学生

---

## 📞 需要帮助？

**如果遇到任何问题：**
1. 查看 Vercel Deployment Logs
2. 查看 Functions Logs
3. 检查浏览器 Console (F12)
4. 参考本文档的常见问题

**Vercel 文档**: https://vercel.com/docs
**Gemini API 文档**: https://ai.google.dev/docs

---

## 🎊 恭喜！

您的 AI 学习平台已成功上线！

学生们现在可以：
- ✅ 随时随地访问
- ✅ 使用强大的 AI 功能
- ✅ 在任何设备上学习
- ✅ 享受个性化学习体验

**记住**: 每次 `git push`，网站都会自动更新！

部署愉快！🚀
