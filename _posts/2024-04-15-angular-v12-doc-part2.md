---
title: Angular V12 文档学习与整理(二) - 概念篇 + 表单
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

