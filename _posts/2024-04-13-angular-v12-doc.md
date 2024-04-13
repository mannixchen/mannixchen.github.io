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

> **模块, 组件, 服务**本质上都是**使用了装饰器的类**, 装饰器会标识他们的类型, 并给其提供元数据, 来告诉 Angular 如何使用它们

### NgModule

> **Angular 的架构设计都是围绕着 NgModule 来构建的, 用来组织和模块化代码。**它定义了应用如何组成, 提供了`declarations`, `imports`, `exports`, `providers`, `bootstrap` 等属性来实现功能的整合和划分, **建立连接和引用关系, 以组合成一个整体**。通常一个应用包含一个根模块`AppModule`和多个特性模块。

**declarations**: 用来声明 `Components/Directives/Pipes`, 只有被声明的组件, 指令和管道才能在模块中使用

**imports**: 模块所以来的其他模块, 导入了其他模块, **就能使用那些模块提供的** `Components/Directives/Pipes`

**exports:** 导出那些希望可以**被其他模块使用**的那些: 组件, 指令, 管道, 甚至该模块拥有的其他模块

**providers**: 用来注册该模块需要使用的服务(Service)提供者, **这些服务可以在该模块的所有组件,指令, 管道, 甚至其他服务中被注入和使用**

**bootstrap**: 指定应用的主组件, 一般只在根模块中使用

借助上面的属性可以实现模块化和服用, 来让其支持懒加载。

将你的代码组织成一些清晰的特性模块, 可以帮助管理复杂的开发工作, 并实现可复用设计。



### 服务 Service

> 服务本身指的是**逻辑的抽象和复用**的一种机制, 它通常是实现单一的目的, 或者多个相关功能的**类**。**通过依赖注入(DI)系统, 可以被任何部分如: 组件, 其他的服务, 或者指令所重用。** 以达到**关注点分离** (**将数据处理, 业务规则, 工具函数分离到服务中**, 而让**组件关心视图和用户的交互**), 可复用, 可测试的目的。

#### 在模块和组件中

service:

```ts
import { Injectable } from '@angular/core';

@Injectable() // 注意这里没有使用 providedIn
export class ModuleScopedService {
  constructor() { }

  getServiceMessage(): string {
    return 'This service is provided by a specific NgModule.';
  }
}

```

module:

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleScopedService } from './module-scoped.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ModuleScopedService] // 在这里提供服务
})
export class SomeFeatureModule { }

```

`ModuleScopedService`服务将仅在`SomeFeatureModule`模块及其组件和注入的服务中可用。如果`SomeFeatureModule`是惰性加载的，那么`ModuleScopedService`服务的每个实例也将是独立的，仅限于每个模块的实例。



#### 服务自身注册

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() { }

  getServiceMessage(): string {
    return 'This is a global service accessible throughout the application.';
  }
}
```

直接通过`providedIn: 'root'`注册到全局`root`, 可以直接在整个应用中被注入和使用, 无需额外的注册步骤

`providedIn` 还有一些其他选项:

1. **`root`**

   最常用选项, 它会把服务注册为全局单例, 还支持 <u>Angular</u> 的 <u>tree-shake</u>, 如果服务没有被用到, 就不会包含在最终的生产包中。

2. **`platform`**

   适合一个页面引导了多个 <u>Angular</u> 应用的情况

3. **`any`**

   为每个木块提供一个服务的新的实例, 而不是一个全局单例

4. **`SomeModule`**

   只在指定的模块和其子模块中使用, 实例的作用域被限定在这个模块中, 这种情况通常可以在模块的`providers`数组中实现

#### 单例和多例

**单例服务（Singleton）**

单例服务在应用的生命周期内只被创建一次，所有组件共享同一个服务实例。这意味着单例服务可以用来共享数据和逻辑。

场景:

* 全局状态管理 - 身份验证状态, 全局应用配置
* 公共工具服务 - 日志服务, 错误处理服务
* 数据服务 - 公用数据

**多例服务（Non-Singleton）**

多例服务每次注入时都会创建一个新的实例，不同的组件或模块使用的是不同的服务实例。这意味着每个服务实例可以维护自己的状态。

* 组件特定的状态管理
* 懒加载模块的独立性
* 可配置服务

##### 单例的情况

- `providedIn: 'root'`：服务在整个应用中都是单例的。Angular在应用启动时创建服务的单个实例，并在应用的所有部分共享这个实例。这是最常用的方法来创建全局单例服务。
- `providedIn: 'platform'`：服务在所有应用中是单例的，适用于一个页面上有多个Angular应用的情况。
- 当服务在根模块（`AppModule`）的`providers`数组中注册时，服务通常是单例的，因为根模块的注入器是全应用级别的。
- 当服务在**非懒加载**的特性模块中注册时，如果**这些特性模块是通过根模块的`imports`数组导入的**，服务实例也将是单例的，因为它们共享同一个注入器。

##### 多例的情况

- `providedIn: 'any'`：每个懒加载模块都会得到服务的一个新实例，对于根模块及其同步加载的模块，服务也是单例的。但是，对于每个懒加载的模块，Angular会为其创建服务的新实例。

- 当服务在**懒加载模块**的`providers`数组中注册时，每个懒加载模块实例都会获得服务的一个新实例。这是因为懒加载模块拥有自己的注入器。
- 当服务在**组件的`providers`数组**中注册时，每个组件实例都会获得服务的一个新实例，服务的生命周期与组件实例绑定。



#### 异同

> 这两种声明服务的方式, 给了开发者更多的灵活和控制权

**相同点**

1. 这两种方式**都用在 Angular 的依赖注入系统中注册服务**, 可以让其自动创建实例, 并注入到组件, 指令以及其他服务中
2. 使用方式一致, 通过组件或者服务的构造函数进行注入

**不同点**

1. 注册位置不同
2. 作用域不同: **`providers `更尝尝用来注入不同模块级别的私有域服务, `ProvidedIn` 更尝尝用来注册全局可用的单例服务, (虽然他们彼此都可以实现全局或局部)**
3. `providedIn` 支持 tree-shake, 而`providers`不支持;
4. 早期只支持 `providers`, Angular 6 后支持 `providedIn`

**总结**

`ProvidedIn`适合全局, `providers`适合控制精准注册颗粒度。



#### 最佳实践

- **全局单例服务**最适合使用`providedIn: 'root'`或在根模块的`providers`中注册，适用于全应用共享的服务。
- **懒加载模块的多例服务**应该在懒加载模块的`providers`中注册，确保每个模块实例都有自己的服务实例。
- **组件级的多例服务**应该在组件的`providers`数组中注册，使服务与组件实例的生命周期相绑定。

#### 原理

>  `constructor(private logService: LogService) { }`

* 当你使用`providedIn`属性或在`NgModule`的`providers`数组中注册一个服务时，Angular的DI系统会**记录这个服务及其提供方式的信息**。这相当于告诉Angular：“这里有一个可以创建和提供`LogService`实例的配方。”

* 当Angular需要创建一个组件的实例时，它会**首先检查该组件的构造函数**，**看看组件是否声明了任何依赖（即构造函数的参数**）。如果构造函数有参数，Angular会根据参数的**类型**（在上述示例中是`LogService`）到自己的**注入器**中查找对应的服务提供者。

* 找到服务提供者后，Angular的DI系统会负责创建服务的实例（如果服务是单例且之前已被创建，则直接提供已有的实例），并**将这个实例注入到组件的构造函数**中。这个过程是自动完成的，开发者**无需手动创建服务实例或显式传递它们**。

* 一旦服务实例被注入到组件中，组件就可以自由地使用这个服务了。在上述示例中，`LogService`的实例被保存在了`MyComponent`的私有成员`logService`中，因此`MyComponent`的任何方法都可以通过`this.logService`访问到`LogService`提供的功能。

Angular的DI系统底层使用了TypeScript的**装饰器（Decorators）和反射（Reflection）API来实现**。装饰器提供了元数据（Metadata），而反射API使Angular能够在运行时读取这些元数据，从而了解如何创建和提供依赖。







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



## 模版

> 将 HTML 和 Angular 的指令和绑定标记组合在一起, 在渲染前格式化这些 HTML



