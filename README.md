# 3D Data Sphere Editor

## About / 简介
**[English]**
This is a Single Page Application (SPA) providing an interactive 3D spherical shell architecture. The core and panels can be dynamically customized using the built-in sidebar editor. It is entirely a client-side application without any server-side logic required.

**[中文]**
这是一个单页应用 (SPA)，提供了一个具有互动性的 3D 球壳结构渲染。可以通过内置的侧边侧编辑器动态自定义内核以及周围切片的图像。这完全是一个纯前端的客户端应用程序，绝对不依赖任何后端服务端逻辑。

---

## Features / 功能特性
- **[EN]** Interactive 3D Sphere rendered utilizing `@react-three/fiber` and `three.js`.
- **[ZH]** 交互式的 3D 球体，基于 `@react-three/fiber` 和 `three.js` 渲染。
- **[EN]** Support uploading local images or specifying external URLs.
- **[ZH]** 支持上传本地图片或指定外部图片 URL。
- **[EN]** Completely dynamic "Image Pool" acting as random texture fallbacks for sphere panels.
- **[ZH]** 完全动态的“图片库”，可为球壳切片随机提供备选贴图。

---

## Build & Development / 构建与开发

**[English]**
Prerequisites: Node.js (v18 or higher recommended).

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:3000`.*
3. **Build for production:**
   ```bash
   npm run build
   ```
   *This compiles the TypeScript code and bundles the React application into static files within the `dist/` directory.*

**[中文]**
前置环境要求：Node.js（推荐 v18 或更高版本）。

1. **安装依赖:**
   ```bash
   npm install
   ```
2. **启动本地开发服务器:**
   ```bash
   npm run dev
   ```
   *应用程序将在预览地址 `http://localhost:3000` 运行。*
3. **打包生产环境:**
   ```bash
   npm run build
   ```
   *这个指令会编译 TypeScript 代码，并将打包和压缩后的前端静态文件输出到 `dist/` 目录中。*

---

## Deployment / 部署指南

**[English]**
Since this is a fully static client-side application, you can host the generated `dist/` folder on any static hosting provider.

- **Vercel / Netlify:** Connect your GitHub repository to Vercel/Netlify. The platform will *automatically* install dependencies (`npm install`). Set the Build Command to `npm run build` and the Output Directory to `dist`.
- **GitHub Pages:** You can deploy the `dist/` contents to the `gh-pages` branch using GitHub Actions (ensure your workflow includes an `npm install` step before building).
- **Nginx / Custom Server:** Run `npm install` then `npm run build` locally, then copy all contents from the `dist/` directory into your Nginx/Apache `html` directory.

**[中文]**
由于它完全是一个静态客户端单页应用，您可以把打包出来的 `dist/` 目录部署到任何支持静态网页托管的服务提供商。云端部署平台会自动处理依赖的安装。

- **Vercel / Netlify:** 将你的 GitHub 仓库绑定到 Vercel 或是 Netlify。平台会**自动安装依赖**（隐式执行 `npm install`）。构建命令 (Build Command) 填写 `npm run build`，输出目录配置为 `dist`。
- **GitHub Pages:** 你可以使用 GitHub Actions 直接把 `dist/` 目录生成的内容推送到 `gh-pages` 分支来进行部署（请确保你的 workflow 在构建前包含了 `npm install` 步骤）。
- **Nginx 或自建服务器:** 本地依次执行 `npm install` 和 `npm run build` 进行打包。把生成的 `dist/` 下面的所有文件丢进你的 Nginx 或 Apache 的静态网页暴露目录中即可。
