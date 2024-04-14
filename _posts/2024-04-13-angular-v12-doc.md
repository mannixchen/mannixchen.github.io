---
title: Angular V12 文档学习与整理(一) - 概念篇
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



> **模块, 组件, 服务**本质上都是**使用了装饰器的类**, 装饰器会标识他们的类型, 并给其提供元数据, 来告诉 Angular 如何使用它们

## NgModule

> **Angular 的架构设计都是围绕着 NgModule 来构建的, 用来组织和模块化代码。**它定义了应用如何组成, 提供了`declarations`, `imports`, `exports`, `providers`, `bootstrap` 等属性来实现功能的整合和划分, **建立连接和引用关系, 以组合成一个整体**。通常一个应用包含一个根模块`AppModule`和多个特性模块。

**declarations**: 用来声明 `Components/Directives/Pipes`, 只有被声明的组件, 指令和管道才能在模块中使用

**imports**: 模块所以来的其他模块, 导入了其他模块, **就能使用那些模块提供的** `Components/Directives/Pipes`

**exports:** 导出那些希望可以**被其他模块使用**的那些: **组件, 指令, 管道, 甚至该模块拥有的其他模块**, 要想哪些被使用, 就需要先 **exports**

**providers**: 用来注册该模块需要使用的服务(Service)提供者, **这些服务可以在该模块的所有组件,指令, 管道, 甚至其他服务中被注入和使用**

**bootstrap**: 指定应用的主组件, 一般只在根模块中使用

借助上面的属性可以实现模块化和服用, 来让其支持懒加载。

将你的代码组织成一些清晰的特性模块, 可以帮助管理复杂的开发工作, 并实现可复用设计。



## 服务 Service

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

> 组件继承自指令, 并在指令的基础上扩展出了模版和样式的功能

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

> Angular Core 库中定义了生命周期钩子接口来响应组件或者指令生命周期中的事件, 每个接口都有一个唯一的钩子方法, 方法名字是在接口名前加上 `ng`, 比如`OnInit`接口的实现方法叫做 `ngOnInit()`

**生命周期顺序**

| 钩子方法                  | 用途                                                         | 时机                                                         |
| :------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `ngOnChanges()`           | 响应输入属性值的变化，执行一些依赖于输入属性值的操作。       | 在 `ngOnInit()` 之前以及所绑定的一个或多个输入属性的值发生变化时都会调用。 |
| `ngOnInit()`              | 初始化组件的逻辑，如获取外部数据、设置默认值。               | 在第一轮 `ngOnChanges()` 完成之后调用，只调用**一次**。此时组件的数据绑定已经完成，所有输入属性都已经被设置，组件已经准备好根据这些输入数据进行初始化操作了。通常，你会在`ngOnInit`中进行如数据加载、订阅设置等初始化工作。 |
| `ngDoCheck()`             | 如果你需要进行自定义的变更检测逻辑，可以在这里实现。         | 紧跟在每次执行变更检测时的 `ngOnChanges()` 和 首次执行变更检测时的 `ngOnInit()` 后调用。 |
| `ngAfterContentInit()`    | 初始化那些依赖于内容投影的任务。                             | 第一次 `ngDoCheck()` 之后调用，只调用一次。                  |
| `ngAfterContentChecked()` | 每次变更检测后需要执行的与内容投影相关的响应。               | `ngAfterContentInit()` 和每次 `ngDoCheck()` 之后调用         |
| `ngAfterViewInit()`       | 初始化那些依赖于视图的任务，**如访问DOM元素**、设置子组件的属性。 | 第一次 `ngAfterContentChecked()` 之后调用，只调用一次。      |
| `ngAfterViewChecked()`    | 每次变更检测后需要执行的与视图相关的响应。                   | `ngAfterViewInit()` 和每次 `ngAfterContentChecked()` 之后调用。 |
| `ngOnDestroy()`           | 清理工作，如取消订阅、停止定时器。                           | 在 Angular 销毁指令或组件之前立即调用。                      |

过度使用`ngDoCheck`和`ngAfterViewChecked`可能会导致性能下降，因为它们在每次变更检测循环中都会被调用。

## 模版

> 将 HTML 和 Angular 的指令和绑定标记组合在一起, 在渲染前格式化这些 HTML

### 模板的标记(markup)

Angular 的标记（markup）是指用于构建 Angular 应用的 HTML 模板中的特定语法和结构。这些标记允许开发者使用 Angular 的**数据绑定、指令、组件**等功能来创建动态和响应式的网页应用。

1. **插值表达式(Interpolation)**

   在 HTML 中嵌入一个 JavaScript 的表达式值, Angular 会计算该值, 并插入到 DOM 中的相应位置。

   `<p>{{ titile }}</p>`

2. **属性绑定 (Property Binding)**

   将元素的属性或者组件的属性绑定到表达式, 当表达式的值变化时, 属性的值也会更新

   `<img [src]="imageUrl">`

3. **事件绑定 (Event Binding)** 

   用来监听元素上的事件, 并执行表达式或者方法

   `<button (click)="save()">Save</button>`

4. **双向数据绑定 (Two-Way Binding)**

   将表单元素的值和组件类的属性绑定在一起, 实现双向数据绑定

   `<input [(ngModel)]="name">`

5. **结构指令(Structural Directives)**

   结构: `*directive=“express”`

   用途: **修改 DOM 的结构**, 例如添加, 移除, 替换元素。

   如: `*ngIf` 条件渲染 `*ngFor` 列表渲染

   `<div *ngIf="isLoggedIn">Welcome back!</div>`

   当你在一个元素上使用 `*` 前缀的结构指令时，Angular 会将该元素包裹在一个 `<ng-template>` 标签中。**语法糖**

   ```tsx
   <div *ngIf="isVisible">Hello, Angular!</div>
   ↓
   <ng-template [ngIf]="isVisible">
     <div>Hello, Angular!</div>
   </ng-template>
   
   //直接使用 [ngIf] 这样的绑定形式而不通过 <ng-template> 是不正确的，这不符合 Angular 结构性指令的预期使用方式。
   ```

   

6. **属性指令 (Attribute Directives)**

   用途: 用来更改元素的外观和行为 (不改变 DOM 结果) 类似于 Vue 中的`:Class`

   `<div [ngClass]="{ active: isActive }">Content</div>`

#### 属性绑定和属性指令的异同

> 看似语法相似, 但是服务于不同的目的, 实现细节也有所不定

属性绑定的数据流向是单向的, 从组件 -> 模版

指令用于修改 DOM 的外观, 行为和布局, 其分为三种: 组件, 结构指令, 和属性指令

**相同**

1. 相似的语法, 都是用方括号`[]` (双向绑定用 `[()]`)

**不同**

1. 属性只是数据的流动, 而属性指令则会添加额外的行为或者逻辑, 如改变样式等
2. 属性指令是特殊的, 因为他们是 Angular 定义的用于执行更复杂逻辑的特殊标记



#### 双向数据绑定和单项数据绑定的区别

单向数据绑定将数据的流动限制为单一方向。在 Angular 中，有两种单向数据绑定：

- **从组件到视图**：使用**插值表达式**（`{{value}}`）或属性绑定（`[property]="value"`）将组件的数据显示在视图上。当数据在组件中更新时，视图将自动反映这些更改，但视图中的用户操作不会直接更新组件中的数据。
- **从视图到组件**：使用**事件绑定**（`(event)="handler()"`）监听视图中的事件（如用户输入），并在组件中执行相应的操作。这允许组件响应视图中的用户操作，但不直接涉及数据的自动更新。

**双向数据绑定**同时结合了从组件到视图和从视图到组件的数据流，创建了一个数据循环。这意味着当数据在组件中更新时，视图将自动更新以反映这些更改；同时，当用户在视图中进行操作（如填写表单）时，组件的数据也会自动更新。Angular 通过 `[(ngModel)]` 语法实现双向数据绑定。

- `ngModel` 是 Angular 的一个指令，用于在表单元素上实现双向数据绑定。<u>它属于 FormsModule</u>，需要在应用模块中导入 FormsModule 才能使用。(feature module)
- 使用 `[(ngModel)]` 绑定时，方括号 `[ngModel]` 表示数据从组件流向视图（属性绑定），圆括号 `(ngModelChange)` 表示数据从视图流回组件（事件绑定）。这两种绑定结合起来实现了数据的双向同步。(内部结构)
- `[(ngModel)]` 的工作原理是通过监听表单元素的值的变化，并更新组件中的属性值；同时，当组件中的属性值变化时，也会更新表单元素的显示值。指定了**利用组件的哪个具体的值**, 来连接双向绑定。

#### 自定义属性

> Angular 中有类似于 Vue 中的自定义属性, Vue 中使用`:customProp` 来传递, `props` 或 `defineProps`来接受, 而 Angular 使用 ` @Input() myProperty: string;` 来接受

子组件接受:

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<p>{{ myProperty }}</p>`,
})
export class MyComponent {
  @Input() myProperty: string;
}

```

父组件中传递:

```ts
<app-my-component [myProperty]="'Hello, Angular!'"></app-my-component>

```

**指令的自定义属性**

指令的定义:

```ts
import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }
}

```

指令的使用: 

```ts
<div [appHighlight]="'yellow'">Highlighted text</div>

```

指令定义了`appHighlight`作为选择器, 那么, **只要在组件或元素标签内写上 `appHignlight`就表示运用了该指令**

```ts
<p appHighlight>Hover over me to see the highlight!</p>
```

写成`[appHighlight]="'yellow'"`是为了给指令传值



### 模版变量

> 模版变量在模版内部创建一个**局部变量**, 可以引用模版的 DOM 元素或指令或组件实例, 以及基于这些元素和指令进行一些操作

#### 引用 DOM 元素

1. 定义模版变量 -  形式: 以 `#` 或`ref-` 前缀开头来定义模版变量

​	`<input #myInput type="text">` -> 此处的`myInput` 引用了`input`元素

2. 使用模版变量 (在所在模版上下文中引用)

   `<button (click)="logValue(myInput.value)">Log Input Value</button>`

   此处直接访问 `input`的 `value`值

#### 引用组件

```ts
<app-child #childComp></app-child>
<button (click)="callChildMethod(childComp)">Call Child Method</button>
```

其中`childComp`引用了 `app-child` 组件实例, 使得父组件中可以调用子组件的方法

#### 引用指令

> 如果想要引用指令实例, 需要确保指令有一个导出的别名。利用`exportAs` 来完成

1. 定义一个指令并导出 (利用`exportAs`)

   ```ts
   import { Directive, HostListener } from '@angular/core';
   
   @Directive({
     selector: '[appHighlight]',// 这个定义了怎么在模版中使用
     exportAs: 'appHighlight' // 定义了一个可以被引用的 name
   })
   export class HighlightDirective {
     private isHighlighted = false;
   }
   
   ```

2. 在模版中引用指令实例

   ```ts
   <div appHighlight #myHighlight="appHighlight"> // appHighlight就是导出名字, myHighlight 指向了导出的的指令实例
     Hover over me!
   </div>
   <button (click)="logHighlightStatus(myHighlight)">Is Highlighted?</button>
   ```

3. `exportAs`

   不适用`exportAs`, 指令实例本身就不能直接通过模版变量被引用和访问。

#### 模版的作用域

 [结构型指令](https://v12.angular.cn/guide/built-in-directives)（如 `*ngIf` 和 `*ngFor` 或 `<ng-template>` 同样充当了模板的边界。你不能在这些边界之外访问其中的模板变量。

## 管道

> 就类似于Vue 中的 filter

`{{interpolated_value | pipe_name}}`





## 事件

### HTML 原生事件

**鼠标事件**

- **click**：元素被点击时触发。
- **dblclick**：元素被双击时触发。
- **mousedown**：鼠标按钮被按下时触发。
- **mouseup**：鼠标按钮被释放时触发。
- **mouseenter**：鼠标指针移入元素范围时触发。
- **mouseleave**：鼠标指针离开元素范围时触发。
- **mousemove**：鼠标指针在元素内部移动时触发。

**键盘事件**

- **keydown**：按下键盘按键时触发。
- **keyup**：释放键盘按键时触发。
- **keypress**：字符被输入到文档中时触发（已废弃，不推荐使用）。

**表单事件**

- **submit**：表单提交时触发。
- **change**：元素的值改变时触发（对于 `<input>`, `<select>`, 和 `<textarea>`）。
- **input**：用户输入到 `<input>` 或 `<textarea>` 时触发。
- **focus**：元素获得焦点时触发。
- **blur**：元素失去焦点时触发。

**触摸事件**

- **touchstart**：触摸点被放置在触摸屏上时触发。
- **touchmove**：触摸点在屏幕上移动时触发。
- **touchend**：触摸点从屏幕上移开时触发。

**拖放事件**

- **dragstart**：用户开始拖动元素时触发。
- **drag**：元素被拖动时触发。
- **drop**：拖动元素被放置到目标位置时触发。

**滚动事件**

- **scroll**：元素或者页面滚动时触发。

### 自定义事件

> 主要用于组件之间的通信, 尤其是父子组件的关系中, 子组件通过自定义事件向父组件发送消息或者数据

在子组件中使用 `@Output()` 装饰器和 `EventEmitter` 类来定义一个自定义事件。子组件可以在特定时机触发这个事件，并可选地传递数据给监听这个事件的父组件。

```ts
// 子组件Component
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<button (click)="sendMessage()">Send Message</button>`
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage() {
    this.messageEvent.emit('Hello from Child Component!');
  }
}

// 父组件html模版
<app-child (messageEvent)="receiveMessage($event)"></app-child>

```



**@Output**

`@Output` 装饰器是 Angular 框架中的一个关键特性，用于在组件或指令中定义事件发射器（`EventEmitter`），使得它们能够向外部发射事件。

用于将**类的属性**标记为**输出属性**，该属性**可以绑定到父组件的事件**。

### 指令事件

> 用于从指令向宿主组件或其他监听者发送消息。使得指令可以和外部环境交互, 换地状态, 用户行为或者其他事件。

```ts
// 指令
@Output() directiveEvent = new EventEmitter<any>();

// 使用指令的组件模板
<div appDirective (directiveEvent)="handleDirectiveEvent($event)"></div>

```



### 区别

- **上下文**：自定义事件通常用于组件之间的交互，而指令事件则用于指令与其宿主组件或其他监听者之间的交互。
- **触发源**：自定义事件由组件内部逻辑触发，通常与用户交互有关；指令事件通常由指令封装的 DOM 操作或其他特定逻辑触发。
- **目的**：虽然两者都是为了实现 Angular 中的通信，但自定义事件更侧重于组件层面的数据传递，而指令事件则侧重于从指令到组件的通信



## 原理图

> Angular 的原理图是一个强大的工具，它通过自动化代码生成和项目修改任务，提高了开发效率，减少了重复劳动。

用途涉及:

1. **代码生成**：快速生成项目中的常见代码模式，如组件、服务、模块、管道等。
2. **项目更新**：自动化执行项目升级过程中的代码修改，帮助开发者将项目迁移到新版本的 Angular。
3. **添加新特性**：通过 `ng add` 命令将新的库或工具集成到现有项目中，原理图会负责相应的配置和代码更改。
4. **代码重构**：自动化一些重构任务，比如修改组件的选择器或模板URL等。
5. **自定义操作**：开发者可以创建自定义原理图来实现特定的项目修改或代码生成任务。

内置原理图:

`ng generate component my-new-component`

`ng g c my-new-component`





