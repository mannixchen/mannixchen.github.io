---
title: Angular V12 文档学习与整理(三) - 表单
description: 新入公司使用 Angular 12, 特此学习和理解
date: 2024-04-17 10:09:29 +0800
comments: true
categories: [编程, 前端, Angular, 表单]
tags: [技术, Angular]
pin: false 
---

## 两种表单类型

> Angular 提供了两种不同的方法来通过表单处理用户输入：响应式表单和模板驱动表单。

- **响应式表单** 提供对底层表单**对象模型直接、显式的访问**。它们与模板驱动表单相比，更加健壮：它们的可扩展性、可复用性和可测试性都更高。
- **模板驱动表单** <u>依赖**模板中的**指令来创建和操作底层的对象模型</u>。它们对于向应用<u>添加一个简单的表单非常有用</u>，比如电子邮件列表注册表单。它们很容易添加到应用中，但在扩展性方面不如响应式表单。



响应式表单和模板驱动型表单都会跟踪<u>用户与之交互的表单输入元素</u>和<u>组件模型中的表单数据</u>之间的值变更。这两种方法共享同一套底层构建块，**只在如何创建和管理常用表单控件实例方面有所不同**



响应式表单的基础类

- **FormControl**：管理单个表单控件的值和有效性状态。它对应于 HTML 表单控件，如 `<input>`、`<select>`、`<textarea>` 等。
- **FormGroup**：管理一组 `FormControl` 实例的值和状态。它可以看作是一个可以包含其他控件的容器，用于将多个控件作为一个整体管理。
- **FormArray**：管理动态数量的 `FormControl` 实例的值和状态。与 `FormGroup` 类似，但用于管理控件的有序集合，如动态添加或删除控件。
- **AbstractControl**：是 `FormControl`、`FormGroup` 和 `FormArray` 的基类。提供了一些共通的属性和方法，如 `value`、`valid`、`setValue()` 和 `patchValue()` 等。
- **ControlValueAccessor** 用于在 Angular 的 `FormControl` 实例和原生 DOM 元素之间创建一个桥梁。

模版表单的指令

> 模板驱动表单相比响应式表单更加简单，它主要通过指令来工作，而不是依赖明确的类。但是，背后仍然有一些与响应式表单共享的基础设施，如 `FormControl`、`FormGroup`。在模板驱动表单中，这些通常是隐式创建的，由 Angular 自动处理。

- **NgModel**：用于在模板驱动表单中创建和管理 `FormControl` 实例，并绑定 HTML 表单元素如 `<input>` 到数据模型。
- **NgForm**：代表整个表单，用于管理表单下的所有 `NgModel` 实例。通常是自动创建和管理的，不需要显式声明。





## 响应式表单

想要使用响应式表单, 先要导入响应式表单的模块

```ts
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // other imports ...
    ReactiveFormsModule
  ],
})
```



`FormArray` 和 `FormGroup` 都是 Angular 响应式表单中的核心概念，它们提供了不同的方式来管理表单控件。虽然它们在许多方面都很相似，但主要区别在于如何组织表单控件。

> FormGroup 是有键名的形式, 而 FormArray 是无键名的, 但是有序地, 可以用来动态添加/移动组件

### `FormGroup`

- **用途**：`FormGroup` 用于将一组不同或相同的表单控件作为一个单元管理。它是一个对象，其中的每个属性对应于一个 `FormControl`，可以表示一个输入字段。
- **结构**：在 `FormGroup` 中，每个控件都有一个名称，通过这个名称可以访问控件。因此，`FormGroup` 的结构是固定的，每个控件都被显式地声明。
- **场景**：如果你的表单结构是固定的，例如一个注册表单，包含姓名、电子邮件、密码等字段，那么 `FormGroup` 是一个合适的选择。

```ts
loginForm = new FormGroup({
  email: new FormControl(''),
  password: new FormControl('')
});

```

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="email">Email:</label>
    <input type="email" formControlName="email">
  </div>
  <div>
    <label for="password">Password:</label>
    <input type="password" formControlName="password">
  </div>
  <button type="submit">Login</button>
</form>

```

`formControlName` 指令则用于将每个输入字段绑定到 `FormGroup` 中的相应 `FormControl` 上。

### `FormArray`

- **用途**：`FormArray` 用于管理一组动态的表单控件。这些控件可以是 `FormControl`、`FormGroup` 或其他 `FormArray` 的任意组合，它们不必具有相同的结构。
- **结构**：与 `FormGroup` 不同，`FormArray` 中的控件是通过数组索引进行访问的，因此它们不需要有名字。这允许 `FormArray` 动态添加或移除控件。
- **场景**：如果你需要处理一个动态数量的相同类型的控件，比如在一个表单中用户可以添加多个电话号码，`FormArray` 就非常有用。

```ts
hobbiesForm = new FormGroup({
  hobbies: new FormArray([
    new FormControl('Cooking'),
    new FormControl('Reading')
  ])
});

```

```html
<div>
  <div *ngFor="let hobby of hobbies.controls; let i = index">
    <input type="text" [formControlName]="i">
    <button (click)="removeHobby(i)">Remove</button>
  </div>
  <button (click)="addHobby()">Add Hobby</button>
</div>

```



### 总结

- 使用 `FormGroup` 来处理结构固定、具有明确字段的表单。
- 使用 `FormArray` 来处理需要动态添加或移除控件的情况，或者控件数量和结构不固定的场景。

## 嵌套表单组

在创建表单组的时候, 可以嵌套其他表单组, 或表单数组。

利用 `[formGroupName]` 指令来指定签到的表单组具体是哪个



## FormBuilder

`FormBuilder` 是 Angular 中的一个**服务**，用于简化响应式表单控件（如 `FormGroup`、`FormControl`、`FormArray`）的创建过程。使用 `FormBuilder`，你可以通过更简洁、更易读的语法来构建表单模型，而不是直接实例化 `FormGroup`、`FormControl` 和 `FormArray` 类。这使得代码更加清晰



```ts
// 创建 FormGroup
this.myForm = this.fb.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  email: ['']
});
 
// 创建 FormArray

this.myForm = this.fb.group({
  emails: this.fb.array([
    this.fb.control('')
  ])
});

// 创建嵌套
this.myForm = this.fb.group({
  personalInfo: this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  }),
  addressInfo: this.fb.group({
    street: [''],
    city: [''],
    zip: ['', Validators.pattern(/^\d{5}$/)]
  })
});

```



## 校验

模版表单的校验比较无脑:

https://v12.angular.cn/guide/form-validation#validating-input-in-template-driven-forms

通过的模版变量的引用来判断显示什么提示信息



响应式表单:

> 在响应式表单中，事实之源是其组件类。不应该通过模板上的属性来添加验证器，而应该在组件类中直接把证器函数添加到表单控件模型上（`FormControl`）。

验证函数

验证器函数可以是同步函数，也可以是异步函数。

- **同步验证器**：这些同步函数接受一个控件实例，然后返回一组验证错误或 `null`。你可以在实例化一个 `FormControl` 时把它作为构造函数的**第二个参数传**进去。
- **异步验证器** ：这些异步函数接受一个控件实例并返回一个 Promise 或 Observable，它稍后会发出一组验证错误或 `null`。在实例化 `FormControl` 时，可以把它们作为**第三个参数传入**。

把这些函数**放到一个数组中传入来支持多个验证器**。



**异步验证**在同步验证完成后才会发生，并且只有在同步验证成功时才会执行。如果更基本的验证方法已经发现了无效输入，那么这种检查顺序就可以让表单避免使用昂贵的异步验证流程（例如 HTTP 请求）。

为了防止异步校验的性能浪费, 更改updateOn 的触发时机为 `blur`或`submit`



更多的校验细节, 看文档的实现。 这部分比较细分, 可以用的时候再看。



## 构建动态表单

> 利用元数据动态的基于配置构造表单, 在我司有大量应用

比如文档中要动态渲染一个调查问卷: 

我们可以根据职能划分出以下部分

1. 单个**问题的组件** `question.component.ts`
2. 将单个问题组合起来的**表单组件** `form.component.ts`
3. 用来**获取元数据**的 `questions.service.ts` (一般是异步的, 在` app.component.ts`中获取)
4. 将元数据转换成响应式表单可以理解的数据类型 (**数据转换**, 在`form.component.ts` 中获取)

这个案例完美表现出了关注点分离的合理性和清晰性

各司其职













