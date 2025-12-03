# Robotics Course - Open-Ended Question Optimization

## 📋 Summary

根据用户需求，对"Introduction to Robotics"课程的大题（Open-Ended Questions）进行了专门优化，使其生成机器人学相关的数学题目，而不是编程题。

## 🎯 主要更改

### 1. **services/gemini.ts**
- 在 `generateQuiz` 函数中添加了 `courseTitle` 参数
- 根据课程名称判断是否为机器人学课程
- 为机器人学课程创建专门的题目生成逻辑

### 2. **App.tsx**
- 更新所有 `generateQuiz` 调用，传入 `course.title` 参数
- 确保题目生成器能识别当前课程类型

## 📚 机器人学大题类型

当检测到"Robotics"课程时，生成的开放式问题将涵盖：

1. **轨迹规划** (Trajectory Planning)
   - 多项式插值方法

2. **坐标变换** (Coordinate Transformations)
   - 齐次变换矩阵
   - 旋转矩阵
   - 位置和姿态计算

3. **运动学** (Kinematics)
   - D-H参数
   - 正运动学
   - 逆运动学

4. **雅可比矩阵** (Jacobian Matrices)
   - 计算方法
   - 奇异配置分析

5. **相机模型** (Camera Models)
   - 针孔投影模型
   - 图像平面坐标计算

## ✨ 关键特性

### 对于机器人学课程：
- ✅ **纯数学问题** - 不包含任何编程或代码要求
- ✅ **LaTeX公式** - 使用正确的数学符号（如 $\theta$, $\begin{bmatrix}...\end{bmatrix}$）
- ✅ **详细解答** - 包含分步骤的数学推导过程
- ✅ **清晰标注** - 问题陈述包含所有必要的已知条件
- ❌ **无代码片段** - 不生成 `codeSnippet` 字段

### 对于其他课程（如数据结构）：
- ✅ 保持原有的编程题目格式
- ✅ 包含代码模板
- ✅ 支持多种编程语言

## 🔧 技术实现

```typescript
// 检测课程类型
const isRoboticsCourse = courseTitle?.toLowerCase().includes('robotics');

// 根据课程类型生成不同的prompt
if (isRoboticsCourse) {
  // 生成机器人学数学题目
  prompt = `...Mathematical / Analytical Problems...`;
} else {
  // 生成编程题目
  prompt = `...Coding / Handwritten Code Questions...`;
}
```

## 📝 题目示例格式

### 机器人学课程示例：
```
问题：Consider an ideal robot motion trajectory with the following constraints:
- at t = 0s: θ(0) = 0, θ̇(0) = 0
- at t = 5s: θ(5) = 1rad, θ̇(5) = 0

Please use cubic polynomial interpolation method to solve the trajectory's exact polynomial form.

解答：包含完整的数学推导过程，使用LaTeX公式显示矩阵和方程式。
```

### 数据结构课程示例：
```
问题：(20 points) Implement a binary search tree insertion algorithm.
Students may answer using any programming language or pseudocode.

代码模板：提供starter code
解答：包含完整的代码实现和逻辑解释
```

## ✅ 测试建议

1. 进入"Introduction to Robotics"课程
2. 点击"Midterm Exam"或"Final Exam"
3. 检查生成的开放式问题是否：
   - 是纯数学题目
   - 使用了LaTeX公式
   - 没有代码模板
   - 包含详细的数学推导

## 🎨 公式渲染

所有数学公式已通过KaTeX正确渲染：
- 行内公式：$\theta$, $R_x$
- 块级公式：矩阵、方程组
- 角标和上标：正确对齐
- 特殊符号：希腊字母、运算符

---

更新完成时间：2025-12-02
