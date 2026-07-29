---
title: "GitHub Pages 搭建博客教程"
date: 2026-07-27T14:30:00+08:00
slug: "github-pages-tutorial"
categories: ["技术"]
tags: ["GitHub", "Hugo", "博客"]
---

使用 GitHub Pages + Hugo 搭建个人博客是一个非常不错的选择，完全免费且构建速度极快。

## 准备工作

在开始之前，你需要：

- 一个 GitHub 账号
- 基本的 Git 操作知识
- 了解 Markdown 语法

## 步骤一：创建仓库

在 GitHub 上创建一个名为 `username.github.io` 的仓库，其中 `username` 是你的 GitHub 用户名。

## 步骤二：安装 Hugo

```bash
# macOS
brew install hugo

# Windows
winget install Hugo.Hugo.Extended

# Linux (snap)
snap install hugo
```

## 步骤三：创建博客

```bash
hugo new site my-blog
cd my-blog
hugo new posts/my-first-post.md
```

## 步骤四：构建与预览

```bash
hugo server -D
```

访问 `http://localhost:1313` 预览效果。

## 步骤五：发布

将代码推送到 GitHub 仓库，通过 GitHub Actions 自动构建部署即可！

## 总结

Hugo 以 Go 语言编写，构建速度比 Jekyll 快 10-100 倍，非常适合技术人员搭建个人博客。
