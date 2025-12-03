# Robot Arm Diagram Generation Feature

## 📋 功能说明

为机器人学课程的开放式数学题目自动生成机械臂结构示意图。

## ✨ 主要特性

### 1. **自动生成图片描述**
当AI生成机器人学开放式问题时，会同时创建 `diagramPrompt` 字段，包含：
- 机器人配置（如"3-DOF RRR manipulator"）
- 连杆长度和关节类型
- 坐标系位置和方向
- 关节角度或位置
- 视觉元素（坐标轴箭头、标签、尺寸）
- 样式说明："Technical diagram, clean lines, labeled axes, engineering schematic style"

### 2. **题目展示优化**
在QuizRunner组件中添加了专门的机器人配置图区域：
- 📸 图标指示有配图可用
- 显示机器人配置的文字描述
- 💡 提示学生可以通过可视化帮助解题

## 🔧 技术实现

### 数据结构更新

```typescript
export interface QuizQuestion {
  // ... 其他字段
  diagramPrompt?: string;  // AI生成的图片描述
  diagramUrl?: string;     // 生成的图片URL（待实现）
}
```

### 生成流程

1. **题目生成阶段** (`gemini.ts`)
   ```typescript
   // AI生成题目时包含diagramPrompt
   {
     type: 'OPEN',
     question: '计算3-DOF机械臂的运动学...',
     diagramPrompt: 'Technical diagram of a 3-DOF RRR manipulator with...',
     explanation: '解答步骤...'
   }
   ```

2. **图片生成阶段** (`App.tsx`)
   ```typescript
   // 在quiz生成后，为每个有diagramPrompt的题目生成图片
   if (q.type === 'OPEN' && q.diagramPrompt) {
     // 使用generate_image工具生成技术图纸
     q.diagramUrl = await generateImage(q.diagramPrompt);
   }
   ```

3. **显示阶段** (`QuizRunner`)
   ```tsx
   {currentQ.diagramPrompt && (
     <div className="mb-6 p-4 bg-slate-50">
       <h4>Robot Configuration Diagram</h4>
       <p>{currentQ.diagramPrompt}</p>
       {currentQ.diagramUrl && <img src={currentQ.diagramUrl} />}
     </div>
   )}
   ```

## 📝 生成示例

### 问题类型1：D-H参数问题
**diagramPrompt:**
```
Technical engineering diagram of a 3-DOF RRR manipulator. 
Show coordinate frames {0}, {1}, {2}, {3} at base and each joint.
Link lengths: l1=0.5m, l2=0.4m, l3=0.3m. 
Display D-H parameter table overlay.
Joint angles: θ1=0°, θ2=90°, θ3=-45°.
X-axes in red, Z-axes in blue.
Engineering schematic style, white background.
```

### 问题类型2：轨迹规划
**diagramPrompt:**
```
2D plot showing robot arm trajectory. 
Start position: (0,0), End position: (1,1).
Path shown as cubic polynomial curve.
Time markers at t=0s, t=2.5s, t=5s.
Velocity vectors displayed at key points.
Grid background with axis labels.
```

### 问题类型3：坐标变换
**diagramPrompt:**
```
Two coordinate frames C and D in 3D space.
Frame C at origin with standard orientation.
Frame D displaced by (2,10,2) and rotated 90° about Y-axis.
Show transformation matrix notation.
Dashed lines connecting corresponding axes.
Clear axis labels with subscripts.
Technical diagram style.
```

## 🎨 显示效果

题目页面会显示：

```
┌─────────────────────────────────────────┐
│ Question: Consider a 3-DOF RRR          │
│ manipulator with the following...      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📸 Robot Configuration Diagram          │
│                                         │
│ Technical diagram of a 3-DOF RRR       │
│ manipulator with link lengths...        │
│                                         │
│ 💡 Tip: Visualize this configuration   │
│    to help solve the problem           │
└─────────────────────────────────────────┘

[答题区域...]
```

## 🔄 未来增强

由于当前图片生成API配额限制，实际图片生成功能可以通过以下方式实现：

1. **方案1：外部API**
   - 集成DALL-E、Midjourney等图片生成服务
   - 专门针对技术图纸优化

2. **方案2：预生成图库**
   - 为常见机器人配置预先生成图片
   - 通过模板匹配选择合适图片

3. **方案3：SVG动态生成**
   - 使用D3.js或类似库动态绘制
   - 完全由前端生成，无需API调用

## ✅ 当前状态

- ✅ 数据结构已添加 `diagramPrompt` 和 `diagramUrl` 字段
- ✅ AI会生成详细的图片描述
- ✅ UI已准备好显示图片描述
- ✅ 图片框架已就位
- ⏳ 实际图片生成待API配额恢复或实现替代方案

## 📊 用户体验

即使没有实际图片，当前实现也提供了价值：
- 详细的文字描述帮助学生可视化问题
- 提示学生自己绘制示意图
- 为将来的图片生成预留了接口

---

更新时间：2025-12-02
