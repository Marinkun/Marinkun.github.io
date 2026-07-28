# Haokun's Blog

这是我的个人博客，使用 GitHub Pages + Jekyll 搭建。

## 访问地址

https://haokun.github.io

## 本地运行

### 环境要求

- Ruby 3.0+
- Bundler

### 安装依赖

```bash
bundle install
```

### 本地预览

```bash
bundle exec jekyll serve
```

然后访问 http://localhost:4000 查看博客。

## 写文章

在 `_posts` 目录下创建新的 Markdown 文件，文件名格式为：

```
YYYY-MM-DD-文章标题.md
```

文件开头需要包含 Front Matter：

```yaml
---
layout: post
title: "文章标题"
date: 2026-07-28 10:00:00 +0800
categories: [分类]
tags: [标签1, 标签2]
---
```

## 目录结构

```
.
├── _config.yml      # Jekyll 配置文件
├── _posts/          # 博客文章
│   └── YYYY-MM-DD-article.md
├── about.md         # 关于页面
├── index.md         # 首页
├── Gemfile          # Ruby 依赖
└── README.md
```

## 许可证

MIT License
