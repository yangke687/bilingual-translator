# 双语翻译助手 | Bilingual Translator

一个功能强大的英中双语翻译工具，提供个人生词本管理和详细的语言学分析功能，专为专业和个人用途设计。

A powerful English-Chinese bilingual translation tool with personal vocabulary management, and detailed linguistic analysis designed for professional and personal use.

## ✨ 核心特性 | Core Features

### 🔄 智能翻译服务

- **多服务支持**: MyMemory API、LibreTranslate、Google Translate 三重备用机制
- **实时翻译**: 英文 ⇄ 中文双向翻译
- **自动故障转移**: 服务不可用时自动切换到备用服务
- **翻译历史**: 持久化存储所有翻译记录，支持搜索和重用

### 📚 详细语言学信息

- **国际音标**: 英文单词的 IPA 发音符号
- **词性分类**: 名词、动词、形容词等详细标注
- **多重释义**: 提供单词的多种含义和定义
- **用法示例**: 上下文中的实际使用例句
- **同义词**: 相关词汇推荐

### 📖 个人生词本管理

- **分类管理**: 自定义生词分类，支持颜色和描述
- **收藏功能**: 标记重要单词便于快速访问
- **个人备注**:
  - 每个单词支持富文本备注编辑
  - 记忆技巧、使用语境、个人见解
  - 备注内容参与搜索功能
  - 突出显示个人笔记内容
- **安全删除**: 点击删除按钮显示确认弹窗，防止误删
- **智能搜索**: 按文本、翻译或备注内容搜索筛选
- **便捷操作**:
  - 一键复制单词和翻译到剪贴板
  - 文本转语音支持中英文发音
  - 复习跟踪和统计数据

### 🎨 用户体验设计

- **极简界面**: 无品牌标识的纯功能设计，专注内容
- **响应式设计**: 完美适配桌面端和移动端
- **语言切换**: 流畅的动画效果切换源语言和目标语言
- **字符统计**: 输入字符计数和验证提示
- **双语优化**: 针对多语言文本显示优化字符编码

## 🚀 技术架构 | Technology Stack

### 前端技术

- **React 18** + **TypeScript** - 现代化前端框架
- **Tailwind CSS** + **shadcn/ui** - 优雅的 UI 组件库
- **Zustand** - 轻量级状态管理，支持持久化
- **React Router** - 单页应用路由管理
- **Lucide Icons** - 精美的图标系统

### API 集成

- **MyMemory API** - 主要翻译服务（每日1000次免费请求）
- **LibreTranslate** - 开源翻译服务备用
- **Google Translate** - 通过公共代理的备用服务
- **Free Dictionary API** - 英文单词定义、音标和例句

### 数据存储

- **本地存储**: 翻译历史和生词本数据持久化
- **云端存储**: 生词本数据存储在Firebase
- **无需认证**: 完全基于免费API服务，即开即用

## 📁 项目结构 | Project Structure

```
src/
├── components/           # UI组件
│   ├── ui/              # shadcn/ui 预装组件
│   ├── TranslationInterface.tsx    # 主翻译界面
│   ├── TranslationHistory.tsx      # 翻译历史管理
│   ├── DetailedTranslation.tsx     # 详细语言学信息显示
│   ├── VocabularyCategories.tsx    # 生词本分类管理
│   └── VocabularyList.tsx          # 生词列表和备注编辑
├── pages/               # 页面组件
│   ├── HomePage.tsx     # 翻译主页
│   ├── VocabularyPage.tsx # 生词本页面
│   └── NotFoundPage.tsx # 404页面
├── store/               # 状态管理
│   ├── translation-store.ts # 翻译状态和历史
│   └── vocabulary-store.ts  # 生词本管理
├── lib/                 # API服务
│   ├── translation-apis.ts  # 翻译API实现
│   └── dictionary-apis.ts   # 词典API服务
└── hooks/               # 自定义钩子
    └── use-translation.ts   # 翻译逻辑封装
```

## 🔧 开发和部署 | Development & Deployment

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 特性配置

- **无需API密钥**: 所有翻译服务均为免费公开服务
- **高可用性**: 多服务备用确保翻译功能稳定运行
- **离线存储**: 翻译历史和生词本数据保存在本地浏览器

## 📱 使用场景 | Use Cases

- **语言学习**: 构建个人生词本，记录学习笔记
- **专业翻译**: 获取详细的词汇信息和多重释义
- **日常交流**: 快速准确的双语翻译服务
- **文档翻译**: 批量翻译和历史记录管理
- **词汇研究**: 深度语言学分析和例句参考

## 🎯 设计理念 | Design Philosophy

专注于提供**专业、高效、美观**的翻译体验：

- **专业性**: 详细的语言学信息满足专业用户需求
- **高效性**: 智能备用机制确保服务高可用
- **美观性**: 极简设计语言，突出内容本身
- **个性化**: 丰富的生词本管理和个人备注功能

---

_让翻译更智能，让学习更高效_ ✨
