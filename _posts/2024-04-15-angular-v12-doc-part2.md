---
title: Angular V12 文档学习与整理(二) - 概念篇2
description: 新入公司使用 Angular 12, 特此学习和理解
date: 2024-04-15 10:20:43 +0800
comments: true
categories: [编程, 前端, Angular]
tags: [技术, Angular]
pin: false 
---

## 组件

### 视图封装模式

> 视图封装模式定义了组件样式的**隔离性和暴露性**, 使用`encapsulation:`元数据属性来进行设置

- `ShadowDom` 模式使用浏览器原生的 Shadow DOM 实现。组件的视图被附加到这个 Shadow DOM 中，组件的样式也被包含在这个 Shadow DOM 中。(译注：不进不出，**没有样式能进来，组件样式出不去**。全局样式进不来)
- `Emulated` 模式（**默认值**）通过预处理（并改名）CSS 代码来模拟 Shadow DOM 的行为，以达到把 CSS 样式局限在组件视图中的目的。 更多信息。(译注：只进不出，**全局样式能进来，组件样式出不去** 注意: **仅仅是全局样式可以进**, 父组件的样式进不来。) 

  不过可以通过强制穿透的方式, 在父组件中将 css 传进来, 在父组件的样式中使用特定的选择器（如`::ng-deep`，虽然已被弃用但仍然可用）可以强制样式穿透封装边界，影响子组件。例如：

  ```css
  :host ::ng-deep .some-class {
    /* styles that will penetrate to child components */
  }
  ```

- `None` 意味着 Angular 不使用视图封装。 Angular **会把 CSS 添加到全局样式中**。而不会应用上前面讨论过的那些作用域规则、隔离和保护等。 从本质上来说，这跟把组件的样式直接放进 HTML 是一样的。(译注：**能进能出。**)

```ts
// warning: few browsers support shadow DOM encapsulation at this time
encapsulation: ViewEncapsulation.ShadowDom
```

### 组件之间的交互

#### `@input`

> 可以利用 @input 装饰器进行父传子

```ts
// 子组件
export class HeroChildComponent {
  @Input() hero!: Hero;
  @Input('master') masterName = ''; // tslint:disable-line: no-input-rename
}
```

第二个 `@input`的参数 `master` 的意思是, 接受父组件传过来的 `master`值, 并用 `masterName` 来接受。

```ts
// 父组件
  template: `
    <h2>{{master}} controls {{heroes.length}} heroes</h2>
    <app-hero-child *ngFor="let hero of heroes"
      [hero]="hero"
      [master]="master">
    </app-hero-child>
  `
```

**利用`@input` 的`setter` 来监听处理属性值的变化**

> 可以拦截父组件传来的数值, 并进行进一步的处理

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-name-child',
  template: '<h3>"{{name}}"</h3>'
})
export class NameChildComponent {
  @Input()
  get name(): string { return this._name; }
  set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>';
  }
  private _name = '';
}
```



**利用`ngOnChanges()` 来监听输入属性值的变化**

> 当需要监视多个、交互式输入属性的时候，本方法比用属性的 setter 更合适。

```ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-version-child',
  template: `
    <h3>Version {{major}}.{{minor}}</h3>
    <h4>Change log:</h4>
    <ul>
      <li *ngFor="let change of changeLog">{{change}}</li>
    </ul>
  `
})
export class VersionChildComponent implements OnChanges {
  @Input() major = 0;
  @Input() minor = 0;
  changeLog: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        const from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.changeLog.push(log.join(', '));
  }
}
```



#### 如果父组件想拿到子组件的方法和数据:

**利用 模板变量**

```ts
// 父组件

import { Component } from '@angular/core';
import { CountdownTimerComponent } from './countdown-timer.component';

@Component({
  selector: 'app-countdown-parent-lv',
  template: `
  <h3>Countdown to Liftoff (via local variable)</h3>
  <button (click)="timer.start()">Start</button>
  <button (click)="timer.stop()">Stop</button>
  <div class="seconds">{{timer.seconds}}</div>
  <app-countdown-timer #timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownLocalVarParentComponent { }
```

模板中可以利用` timer` 模板变量来获取到组件实例, 然后通过 `timer.property` 获取到子组件的数据

不足: 模板变量只能在模板中被使用, 如果想在组件的逻辑代码中使用需要寻找其他方式



**@viewChild**

>  利用`@viewChild` 可以直接在父组件中引入子组件的引用

把子组件的视图插入到父组件类需要做一点额外的工作。

1. 首先，你必须**导入对装饰器 `ViewChild` 以及生命周期钩子 `AfterViewInit` 的引用。**

2. 接着，通过 `@ViewChild` 属性装饰器，将子组件 `CountdownTimerComponent` 注入到私有属性 `timerComponent` 里面。

3. 组件元数据里就不再需要 `#timer` 本地变量了。而是把按钮绑定到父组件自己的 `start` 和 `stop` 方法，使用父组件的 `seconds` 方法的插值来展示秒数变化。

这些方法可以直接访问被注入的计时器组件。

`ngAfterViewInit()` 生命周期钩子是非常重要的一步。**被注入的计时器组件只有在 Angular 显示了父组件视图之后才能访问**，所以它先把秒数显示为 0.

然后 Angular 会调用 `ngAfterViewInit` 生命周期钩子，但这时候再更新父组件视图的倒计时就已经太晚了。Angular 的单向数据流规则会阻止在同一个周期内更新父组件视图。应用在显示秒数之前会被迫*再等一轮*。

使用 `setTimeout()` 来等下一轮，然后改写 `seconds()` 方法，这样它接下来就会从注入的这个计时器组件里获取秒数的值。



```ts
import { AfterViewInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { CountdownTimerComponent } from './countdown-timer.component';

@Component({
  selector: 'app-countdown-parent-vc',
  template: `
  `,
})
export class CountdownViewChildParentComponent implements AfterViewInit {

  @ViewChild(CountdownTimerComponent) // 引入
  private timerComponent!: CountdownTimerComponent; // 用 timerCompoent 接受, 然后可以使用

  seconds() { return 0; }

  ngAfterViewInit() {
    // 只有在视图初试完之后才可以使用
    setTimeout(() => this.seconds = () => this.timerComponent.seconds, 0);
  }

  start() { this.timerComponent.start(); }
  stop() { this.timerComponent.stop(); }
}
```

#### 利用共享服务实现数据共享





### 组件的样式

**宿主元素**是指一个Angular组件在DOM中的直接父节点，它是Angular组件模板的容器。当你在Angular应用中声明并使用一个组件时，这个组件会**被Angular渲染到一个DOM元素中**，这个DOM元素就被称为**该组件的宿主元素。**



#### :host

`:host`选择器是一个特殊的CSS伪类选择器，用于在组件的样式中选**择组件宿主元素本身**。在Angular中，每个组件都是通过其宿主元素插入到DOM中的，宿主元素就是组件模板对应的DOM元素。使用`:host`选择器，开发者可以定义仅应用于宿主元素的样式，而**不影响宿主元素内部或外部的其他元素。**

> 只会影响宿主元素本身，不会直接影响宿主元素的子元素。这是因为`:host`选择器特别针对组件的宿主元素，允许开发者为宿主元素定制样式，而不干扰组件内部的样式或外部元素。

#### :host-content

`:host-context()`是一个CSS伪类函数，用于在Angular中应用样式，但与`:host`选择器不同，`:host-context()`允许组件的样式基于宿主元素的祖先元素的某些条件来应用。

```css
:host-context(.theme-light) h2 {
  background-color: #eef;
}
// 只有当某个祖先元素有 CSS 类 theme-light 时，才会把 background-color 样式应用到组件内部的所有 <h2> 元素中。
```

#### 已弃用 `/deep/`、`>>>` 和 `::ng-deep`

任何带有 `::ng-deep` 的样式都会变成全局样式。为了把指定的样式限定在当前组件及其下级组件中，请确保在 `::ng-deep` <u>之前带上 `:host` 选择器</u>。如果 `::ng-deep` 组合器在 `:host` 伪类之外使用，该样式就会污染其它组件。

```css
:host ::ng-deep h3 {
  font-style: italic;
}
```

### 内容投影 Content Injection

> 其实就类似于 Vue 中的插槽



#### 单插槽内容投影 - 默认插槽

```ts
// 子组件的创建:
import { Component } from '@angular/core';

@Component({
  selector: 'app-zippy-basic',
  template: `
  <h2>Single-slot content projection</h2>
  <ng-content></ng-content> // 存放内容的地方
`
})
export class ZippyBasicComponent {}

// 子组件模板的使用
<app-zippy-basic>
  <p>Is content projection cool?</p>
</app-zippy-basic>
// p 标签就会被插入到 <ng-content> 的位置
```

>  `ng-content` 元素是一个占位符，它不会创建真正的 DOM 元素。`ng-content` 的那些自定义属性将被忽略。

#### 多插槽内容太投影 - 具名插槽

> 每个插槽可以**指定一个 CSS 选择器**，该选择器会决定将哪些内容放入该插槽。

```ts
// 子组件的创建
import { Component } from '@angular/core';

@Component({
  selector: 'app-zippy-multislot',
  template: `
  <h2>Multi-slot content projection</h2>
  <ng-content></ng-content>
  <ng-content select="[question]"></ng-content>
`
})
export class ZippyMultislotComponent {}

// 父组件模板
<app-zippy-multislot>
  <p question>  
    Is content projection cool?
  </p>
  <p>Let's learn about content projection!</p>
</app-zippy-multislot>
```

**使用 `question` 属性的内容**将投影到带有 **`select=[question]` 属性**的 `ng-content` 元素。



#### 利用 ng-template ng-container 以及内容投影来做条件渲染

> ng-template 是个抽象容器, 直接使用它并不会被渲染, 必须搭配**结构指令** 才能够被条件渲染
>
> - **`*ngIf`**: 可以用来根据条件来决定是否渲染 `ng-template` 中的内容。
> - **`*ngFor`**: 用于循环渲染一组数据，每次循环都会渲染 `ng-template` 中的内容。
> - **`*ngTemplateOutlet`**: 允许将定义好的模板插入到文档的其他地方，从而复用模板内容。
>
> ng-container: 将模版元素组织在一起而不必创建多余的 DOM, 很适合做条件渲染, 分组渲染, 以及引用渲染(利用 `*ngTemplateOutlet`引用模版变量), 类似于 Vue 中的 `<template>`标签。

结合`ng-template`、`ng-container`和内容投影（通常称为“插槽”）来实现条件渲染，可以让你创建更加灵活和动态的组件。这种方法特别适用于当你想在父组件中定义内容，并根据某些条件在子组件中渲染这些内容时。

##### 步骤1: 定义内容投影插槽

在子组件中，你可以使用`<ng-content>`标签来指定一个或多个内容投影插槽。如果需要，可以通过选择器区分不同的插槽。 - 适合默认插槽和具名插槽

**子组件模板 (child.component.html)**

```html
<div>
  <!-- 默认插槽 -->
  <ng-content></ng-content>

  <!-- 条件插槽 -->
  <ng-container *ngTemplateOutlet="condition ? templateRef : null"></ng-container>
</div>
```

在这里，`ng-container`结合`*ngTemplateOutlet`被用来根据条件`condition`**渲染一个模板**引用`templateRef`。 

其实也就是利用` ng-container` 来做条件渲染, `ng-container`允许你使用Angular指令，如结构性指令，而不实际创建额外的DOM元素。这种方式特别适合于不想添加额外标记但需要应用结构性逻辑（如条件渲染或循环）的场景。

##### 步骤2: 在子组件类中定义条件和模板引用

**子组件类 (child.component.ts)**

```typescript
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
})
export class ChildComponent {
  @Input() condition: boolean;
  @Input() templateRef: TemplateRef<any>;
}
```

在子组件类中，通过`@Input()`装饰器接受一个条件`condition`和一个模板引用`templateRef`。

##### 步骤3: 父组件使用子组件并传递内容

在父组件中，你可以定义内容，并使用`<ng-template>`将其标记为可投影内容。然后，将这些内容传递给子组件。

**父组件模板 (parent.component.html)**

```html
<app-child [condition]="true" [templateRef]="template">
  <p>这是总是可见的内容。</p>
</app-child>

<ng-template #template>
  <p>这是条件性渲染的内容。</p>
</ng-template>
```

**`<ng-template>` 不会直接渲染到DOM中**，而是可以在需要时被动态渲染。这使得`ng-template`成为定义可重用、有条件渲染或动态渲染内容的理想选择。

在这个例子中，`<p>这是总是可见的内容。</p>`将总是被渲染在子组件的默认插槽中。而`<ng-template #template>`定义的内容则根据父组件传递给子组件的`[condition]`值来决定是否在子组件中渲染。

将 `ng-template` 作为一个变量 `template` 传给了 `templateRef`

##### 总结

这种方法允许你在父组件中定义可以根据条件渲染的内容，并通过子组件的逻辑来控制这些内容的显示。这样不仅增加了组件间的互动性，也提高了组件的复用性和灵活性。通过`ng-template`、`ng-container`和内容投影的结合使用，Angular应用可以实现复杂的条件渲染逻辑，同时保持模板的清晰和组织。



#### 

#### 利用指令来引用 ng-template

在Angular中，可以通过创建一个指令来引用并操作`ng-template`。这通常涉及到使用`TemplateRef`来获取对`ng-template`的引用，然后**通过指令中的逻辑来决定如何、何时渲染这个模板**。

##### 步骤1: 创建一个自定义指令

首先，你需要创建一个自定义指令。在这个指令中，你将使用Angular的依赖注入系统来注入`TemplateRef`对象，这个对象是`ng-template`的一个引用。

**custom.directive.ts**

```typescript
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCustomDirective]'
})
export class CustomDirective {
  constructor(private templateRef: TemplateRef<any>) {
    // templateRef是对ng-template的引用
  }
}
```

##### 步骤2: 在组件模板中使用`ng-template`和自定义指令

接下来，在你的组件模板中，使用`ng-template`定义一块模板内容，并用你的**自定义指令作为一个属性来标记这个`ng-template`。**

**component.html**

```html
<ng-template appCustomDirective>
  <div>这是通过自定义指令引用的ng-template内容。</div>
</ng-template>
```

##### 步骤3: 在指令中操作`ng-template`

在自定义指令的构造函数中，`TemplateRef`的实例（即`templateRef`）就是对上述`ng-template`的引用。你可以在指令的类中保存这个引用，并根据需要使用它。

##### 总结

通过使用自定义指令与`ng-template`结合。这种模式让你可以控制模板的渲染时机和方式，适用于多种应用场景，如创建条件渲染逻辑、动态表单控件、弹出窗口等。

`ngProjectAs`是Angular中的一个特殊属性，它允许你改变内容投影（Content Projection）的选择器匹配方式。这个属性非常有用，特别是在你需要将内容投影到特定的`<ng-content>`插槽，但又不想在父组件中明确设置选择器时。

#### `ngProjectAs`的用途

通常，Angular根据选择器来决定如何将父组件的内容投影到子组件的`<ng-content>`标签中。**`ngProjectAs`让你可以“伪装”你的内容，使其匹配子组件中不同的选择器，**而不必在父组件的模板中实际使用那些选择器。

##### 如何使用`ngProjectAs`

假设你有一个带有多个插槽（使用不同选择器）的子组件：

**子组件模板 (sub-component.html)**

```html
<div class="header">
  <ng-content select=".header-content"></ng-content>
</div>
<div class="body">
  <ng-content select=".body-content"></ng-content>
</div>
```

在没有`ngProjectAs`的情况下，父组件需要使用对应的类来匹配这些插槽：

**父组件模板 (parent-component.html)**

```html
<app-sub-component>
  <div class="header-content">这是头部内容</div>
  <div class="body-content">这是主体内容</div>
</app-sub-component>
```

使用`ngProjectAs`，你可以避免在父组件的模板中设置这些类，而是使用`ngProjectAs`来指定内容应该投影到哪个`<ng-content>`插槽：

**父组件模板 (parent-component.html)** 使用`ngProjectAs`

```html
<app-sub-component>
  <div ngProjectAs=".header-content">这是头部内容</div>
  <div ngProjectAs=".body-content">这是主体内容</div>
</app-sub-component>
```

这样，即使父组件中的`<div>`元素没有直接使用`.header-content`或`.body-content`类，Angular也会将这些`<div>`元素正确地投影到子组件的对应`<ng-content>`插槽中。

##### 为什么使用`ngProjectAs`

- **灵活性**：`ngProjectAs`提供了一种灵活的方式来控制内容投影，特别是当组件的使用者不想或不能直接在其内容上设置特定的选择器时。
- **封装性**：它允许子组件定义更具体的内容投影策略，而不需要暴露这些细节给父组件。
- **清晰性**：对于父组件的模板来说，`ngProjectAs`使得模板保持了更高的清晰度和可读性，因为它避免了直接在内容上使用可能与组件内部实现细节相关的选择器。

总之，`ngProjectAs`是一个强大的工具，能够提高Angular应用的**内容投影的灵活性和封装性**，让你可以更精细地控制内容如何被投影到子组件中。

### 动态组件

在 Angular 中，动态组件加载允许应用在运行时动态地加载和渲染组件。这对于需要根据条件加载不同内容的应用来说非常有用，比如基于用户的操作显示不同的用户界面元素，或者在不同的场景下加载不同的组件来提升应用的性能。

#### 动态组件加载的核心概念

要实现动态组件加载，Angular 提供了几个关键的概念：

- **ComponentFactoryResolver**：用于解析组件的工厂，**可以根据给定的组件类型动态创建组件的实例。**
- **ViewContainerRef**：表示**视图容器的引用**，可以**用来动态添加或移除视图。**
- **ComponentRef**：表示动态加载的**组件的引用**，可以**用来与该组件进行交互。**

#### 实现步骤

为了使用指令作为锚点动态加载组件，我们可以定义一个指令来代替 `ng-template` 的使用。这个指令将直接应用到一个容器元素上（例如，一个 `div` 或 `ng-container`），并在该元素上提供一个 `ViewContainerRef` 用于动态组件的加载。

##### 步骤 1: 创建动态组件加载指令

首先，我们需要创建一个新指令，它将作为动态组件加载的锚点。

**dynamic-anchor.directive.ts**:

```typescript
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicAnchor]'
})
export class DynamicAnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
```

这个指令非常简单，它通过**依赖注入获取当前元素的 `ViewContainerRef`，**并将其公开，以便可以在父组件中使用。

##### 步骤 2: 宿主组件以使用新指令

使用这个新的动态加载指令。

**host.component.ts** :

```typescript
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { DynamicComponent } from './dynamic.component';
import { DynamicAnchorDirective } from './dynamic-anchor.directive';
import { ComponentFactoryResolver } from '@angular/core';

@Component({
  selector: 'app-host',
  template: `<div appDynamicAnchor></div>`
})
export class HostComponent implements AfterViewInit {
  @ViewChild(DynamicAnchorDirective) dynamicAnchor: DynamicAnchorDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    this.loadDynamicComponent();
  }

  loadDynamicComponent() {
    const viewContainerRef = this.dynamicAnchor.viewContainerRef;
    viewContainerRef.clear();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicComponent);
    viewContainerRef.createComponent(componentFactory);
  }
}
```

这里我们**通过 `@ViewChild` 装饰器获取 `DynamicAnchorDirective` 的实例**，进而获得与指令关联的 `ViewContainerRef`。然后，我们使用这个 `ViewContainerRef` 来动态加载 `DynamicComponent`。

##### 步骤 3: 更新 AppModule

确保你的 `AppModule` 包含了新指令的声明，同时注册了动态组件和宿主组件。

**app.module.ts** (修改后):

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DynamicComponent } from './dynamic.component';
import { HostComponent } from './host.component';
import { DynamicAnchorDirective } from './dynamic-anchor.directive';

@NgModule({
  declarations: [
    AppComponent,
    DynamicComponent,
    HostComponent,
    DynamicAnchorDirective // 新增指令声明
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DynamicComponent]
})
export class AppModule { }
```

#### Angular 元素

> Angular 元素是 Angular 的一项功能，允许你将 Angular 组件打包为 Web Components，这是一组浏览器标准，使得你可以创建可重用的自定义元素，并在任何 HTML 页面上使用它们，无论页面使用的是什么框架或不使用框架。这意味着你可以把 Angular 功能作为自定义 HTML 标签在非 Angular 项目中使用，极大地提高了组件的可重用性和互操作性。

##### 自定义元素的创建步骤：

1. **创建一个 Angular 组件**： 这个组件将被打包成自定义元素。组件可以包含你需要的任何模板、绑定和依赖注入。
2. **将 Angular 组件转换为自定义元素**： 使用 Angular 的 `createCustomElement` 函数从 @angular/elements 包中将组件包装为自定义元素。这个函数需要组件类和一个注入器作为参数，并**返回一个可以定义为自定义元素的类。**
3. **注册自定义元素**： 使用原生的 `customElements.define` 方法**注册自定义元素**。这将告诉浏览器你的自定义标签是什么，并且怎样处理它。



## 指令

### trackBy

> trackBy 的值是一个返回值的函数

`trackBy` 是 Angular 中的一个用于 `*ngFor` 指令的选项，它的主要目的是提高列表渲染性能。在使用 `*ngFor` 迭代显示数据列表时，如果列表数据发生变化（例如，元素被添加、移除或排序），默认情况下，Angular 会重新渲染整个列表的 DOM 元素。这在处理大量数据时会导致性能问题。

通过使用 `trackBy` 函数，Angular 可以跟踪每个元素的身份，**只对那些改变了的元素进行 DOM 更新，而不是整个列表。**这样，对于那些未改变的元素，Angular 不会重新渲染它们的 DOM，从而提高了渲染性能。

#### 如何使用 `trackBy`

要使用 `trackBy`，你需要在模板中的 `*ngFor` 指令上设置它，并提供一个跟踪函数。这个跟踪函数接收两个参数：迭代的索引和当前项的数据对象。它需要返回一个唯一标识符（如 ID）来表示每个元素的身份。

#### 示例：

假设你有一个显示用户列表的组件，用户数据是一个包含多个用户对象的数组，每个用户对象都有一个唯一的 `id` 属性。

**组件类 (TypeScript)**:

```typescript
export class UsersComponent {
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  trackByUserId(index: number, user: any): number {
    return user.id;
  }
}
```

**模板 (HTML)**:

```html
<ul>
  <li *ngFor="let user of users; trackBy: trackByUserId">{{ user.name }}</li>
</ul>
```

在这个示例中，`trackByUserId` 函数通过返回用户的 `id` 属性作为唯一标识符，使 Angular 能够跟踪每个用户项的身份。如果 `users` 数组发生变化，Angular 会使用这个标识符来确定哪些项是新增的、哪些需要被重新渲染，哪些可以保持不变。这样，只有变化的项才会导致 DOM 更新，从而提升了性能。

### NgSwitch

> 就像 JavaScript 的 `switch` 语句一样。`NgSwitch` 会根据切换条件显示几个可能的元素中的一个。Angular 只会将选定的元素放入 DOM。



```html
<div [ngSwitch]="currentItem.feature">
  <app-stout-item    *ngSwitchCase="'stout'"    [item]="currentItem"></app-stout-item>
  <app-device-item   *ngSwitchCase="'slim'"     [item]="currentItem"></app-device-item>
  <app-lost-item     *ngSwitchCase="'vintage'"  [item]="currentItem"></app-lost-item>
  <app-best-item     *ngSwitchCase="'bright'"   [item]="currentItem"></app-best-item>
<!-- . . . -->
  <app-unknown-item  *ngSwitchDefault           [item]="currentItem"></app-unknown-item>
</div>
```

### `NgNonBindable`

`ngNonBindable` 会停用模板中的插值、指令和绑定。

将 `ngNonBindable` 应用于元素将停止对该元素的子元素的绑定。但是，`ngNonBindable` 仍然允许指令在应用 `ngNonBindable` 的元素上工作。
