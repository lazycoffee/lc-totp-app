# LC TOTP 移动端应用

## 项目简介
基于 React Native 开发的双因素认证（2FA）移动端应用，支持 TOTP（时间基动态密码）生成与管理，提供安全、便捷的多账户二次验证解决方案。

## 核心功能
- **TOTP 配置管理**：支持添加/编辑/查看 TOTP 配置（包含预设平台优化）
- **动态 OTP 生成**：实时计算并显示 6-12 位动态密码，支持 SHA-1/256/512 算法
- **剩余时间可视化**：通过进度条直观展示当前 OTP 有效剩余时间
- **多语言支持**：内置中文/英文双语切换
- **便捷交互**：底部弹窗（Bottom Sheet）设计，列表项快速操作

## 技术栈
- 前端框架：React Native（Expo 开发环境）
- 状态管理：React Hooks + MMKV 本地存储
- 表单验证：react-hook-form
- 弹窗组件：@gorhom/bottom-sheet
- OTP 计算：otplib
- 多语言：i18next

## 安装与运行
1. 克隆项目
```bash
 git clone https://github.com/your-username/lc-totp-app.git
 cd lc-totp-app
```
2. 安装依赖
```bash
 npm install
```
3. 启动开发
```bash
 npm start # 选择运行平台（Android/iOS/Web）
```

## 使用指南
1. **添加配置**：点击首页右下角「+」按钮，填写/选择 TOTP 参数后点击确定
2. **查看 OTP**：在列表项点击「▶」按钮启动计算，自动显示当前动态密码及剩余时间进度条
3. **编辑配置**：点击列表项进入编辑页面，修改后保存自动更新
4. **切换语言**：（待完善，后续通过设置页面实现）

## 文档目录
- [交互设计文档](doc/ux.md)：详细描述页面布局与交互逻辑
- [代码设计文档](doc/code.md)（待完善）：架构说明与核心模块解析

## 贡献与反馈
欢迎提交 Issues 或 Pull Requests，共同优化 TOTP 管理体验！