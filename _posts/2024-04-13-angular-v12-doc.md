---
title: Angular V12 文档学习与整理
description: 新入公司使用 Angular 12, 特此学习和理解
date: 2024-04-13 21:27:55 +0800
comments: true
categories: [编程, 前端, Angular]
tags: [技术, Angular]
pin: false 
---

## 轮廓 - 重要的概念

* 组件
* 模版
* 依赖注入

### 众多自带库

* 路由
* 表单
* HttpClient
* 动画
* PWA - Progressive Web Application (渐进式网络应用) 能够提供类似于原生英勇的体验, 核心优势是可以在离线或者网络比较差的环境下运行, 另外还有很好的加载速度和更加丰富的交互性
* 原理图 (Schematics` [美 /skiːˈmætɪk/]示意图`)  - 是一个强大的工具, 可以用来自动化项目中常见的开发任务和变更管理



## 架构

### NgModule

> **Angular 的架构设计都是围绕着 NgModule 来构建的, 用来组织和模块化代码。**它定义了应用如何组成, 提供了`declarations`, `imports`, `exports`, `providers`, `bootstrap` 等属性来实现功能的整合和划分, **建立连接和引用关系, 以组合成一个整体**。通常一个应用包含一个根模块`AppModule`和多个特性模块。

**declarations**: 用来声明 `Components/Directives/Pipes`, 只有被声明的组件, 指令和管道才能在模块中使用

**imports**: 模块所以来的其他模块, 导入了其他模块, **就能使用那些模块提供的** `Components/Directives/Pipes`

**exports:** 导出那些希望可以**被其他模块使用**的那些: 组件, 指令, 管道, 甚至该模块拥有的其他模块

**providers**: 用来注册该模块需要使用的服务(Service)提供者, **这些服务可以在该模块的所有组件,指令, 管道, 甚至其他服务中被注入和使用**

**bootstrap**: 指定应用的主组件, 一般只在根模块中使用

借助上面的属性可以实现模块化和服用, 来让其支持懒加载。



### 构建顺序

1. 入口文件 `main.ts`

   负责引导和启动应用的根模块: **AppModule**, 调用`platformBrowserDynamic().bootstrapModule(AppModule)` 来启动应用, `platformBrowserDynamic`是一个用于在客户端应用中启动模块的方法，它利用了浏览器的动态编译。

2. 根模块`app.module.ts`

   利用`@NgModule`装饰器来定义: **组件, 指令, Pipe, 其他模块, Bootstrap**

   **并将 Bootstrap 中的主组件插入到`index.html`中。**
3. 主组件 `app.component.ts`

   定义了形态, 数据和逻辑

4. `angualr.json` 配置 `Angular CLI` 如何构建项目, 包括项目入口, 输出路径, 使用环境和文件。





## 组件

组件的构成

* HTML **模版**, 用于渲染内容
* **定义行为的 Typescript 类**
* **一个 CSS 选择器**, 定义组件在模板中的使用位置(以哪个 DOM 名字存在)
* (可选) 适配模板的 CSS 样式



### 组件的创建

#### 使用 Angular CLI (Command Line Interface)

运行 `ng generate component <component-name>` 命令，其中 `<component-name>` 是新组件的名字。

默认情况下, 会创建以下内容:

1. 一个`<component-name>`为名的文件夹
2. 一个`<component-name>.component.ts`的组件文件
3. 一个`<component-name>.component.html`的模版文件
4. 一个`<component-name>.component.css`的样式文件
5. 一个`<component-name>.component.spec.ts`的测试文件

#### 手动

1. 在项目目录下
2. 创建一个名为`<component-name>.component.ts`的文件
3. 在文件顶部引入: `import { Component } from ‘@angular/core`
4. 添加一个装饰器`@Component({})`
5. 指定组件的 CSS 选择器, 模版或模板文件, 以及样式

```ts
@Component({
  selector: 'app-component-overview',
  templateUrl: './component-overview.component.html',
  styleUrls: ['./component-overview.component.css']
})
```

6. 添加**该组件的类, 用来定义组件的状态和行为**

```ts
export class ComponentOverViewComponent {
  
}
```

#### CSS 选择器

> 用来**指定该组件渲染的位置**, 每个组件必有。

Angular 会寻找改名字的**标签**, 并将该模版渲染在这个位置

也就是这里的 `selector` 对应的就是以该模版名字命名的**标签对**

#### 模板

> **定义了组件渲染的内容**

两种渲染方式(对应两个字段)

1. 利用外部文件渲染

   `templateUrl: ‘./yourFilePath’`

2. 利用模板文本渲染

   `template: '<h1>Hello World!</h1>',`

   如果有**跨越多行的需求, 用模版字符串**

   ```ts
     template: `<h1>Hello World!</h1>
                <p>This template definition spans
                 multiple lines.</p>`
   ```

***注意, 以上两个字段不能同时存在***

#### 样式

> 同上, 定义组件的样式, 也可以用两个字段表示: styleUrls, styles



### 生命周期



