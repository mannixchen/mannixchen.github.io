---
title: Rxjs 学习
description: 公司的项目大量用到 Rxjs
date: 2024-04-29 13:24:09 +0800
comments: true
categories: [工具, 快捷键]
tags: [效率, 快捷键]
pin: false 
---

## Rxjs 是什么

> 微软 .NET 开发组的一个团队为了给 LinQ 设计扩展机制而引入了 FRP 概念，却发现 FRP 的价值不止于此。于是一个新的项目出现了，它就是 ReactiveX。 RxJS 就是 ReactiveX 在 JavaScript 语言上的实现。



## 总结

### Observable:

> 可以被观察的对象

1. from, of等创建操作符产生的对象都是 Observable 对象, 可以被 Observer 观察

2. 也可以手动创建

   ```ts
   // 创建一个 Observable，发出三个数字
   const observable = new Observable<number>(subscriber => {
     subscriber.next(1);
     subscriber.next(2);
     subscriber.next(3);
     subscriber.complete(); // 发出完成信号
   });
   ```

3. 生成一个可以被观察的 `observable` 对象

### Observer:

> **观察**可以被观察的对象

调用`observable`对象的 `subscribe` 方法, 返回一个 `subscribtion` 对象, 这个`subscribe`方法需要接受的参数可以是一个 Observer的对象, 或者一个执行函数

```ts
const observer = {
  next: (x) => console.log('Observer got a next value: ' + x),
  error: (err) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
// 定义了接收到数据该怎么处理

// 如果只是传入一个执行函数
// 那么这个执行函数也会被包裹进 observer 对象的 next 属性中
```

#### 高阶 `Observable` 

> 决定了`Observable`的串行, 并行, 防抖和节流

`mergeMap`, `concatMap`, `switchMap`, `exhaustMap` 是处理高阶 Observables 的四个主要转换操作符。

**mergeMap**

无序的, 先到先得并行的

**concatMap**

需要等订阅处理完毕才开始关注下一个Observable

**switchMap**

表示会频繁切换, 只关注最新的, 之前未完成的, 会取消订阅

**exhaustMap**

死脑筋, 只关注正在进行的, 无视新来的



### Subject(主体):

> `Subject` 是一种特殊类型的 `Observable`，它允许将值多播到多个 `Observer`。 `Subject`同时实现了 `Observable` 和 `Observer` 所以其也可以作为参数被传如 `subscribe` 方法中

1. 同时订阅多个观察者

   ```ts
   const subject = new Subject<number>();
   
   subject.subscribe({
     next: (v) => console.log(`observerA: ${v}`),
   });
   subject.subscribe({
     next: (v) => console.log(`observerB: ${v}`),
   });
   
   subject.next(1);
   subject.next(2);
   ```

2. `subject`还可以通过 `next`,` complete`, `error`主动控制数据的发送, 完成和报错

### Schedulers(调度器):

> 调度器可以决定Observable 创建以及订阅的时间点(SubscribeOn) , 或者数据发送的时间点(ObserveOn)

#### 调度的范围

1. **`observeOn`**：用于指定 Observable 在何时发送通知给观察者，可以指定在哪个执行上下文中发送通知。
2. **`subscribeOn`**：用于指定 Observable 的创建和订阅操作在何时和何处执行，可以指定在哪个执行上下文中创建 Observable 和订阅观察者。

#### 调度的时机

1. **asapScheduler**: 会将回调放到微任务队列, 和Promise同级别, 在当前事件循环中尽快执行

2. **asyncScheduler**: 会将任务放到宏任务队列, 和setTimeout同级别, 在新的事件循环中的开头执行



```ts
import { of } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { asyncScheduler, asapScheduler } from 'rxjs';

console.log('start');

of('asap').pipe(
  observeOn(asapScheduler)
).subscribe(x => console.log(x));

of('async').pipe(
  observeOn(asyncScheduler)
).subscribe(x => console.log(x));

Promise.resolve().then(() => console.log('promise'));

console.log('end');

// 打印
// start
// end
// asap
// promise
// async
```





## Observable

> 它代表着一个可以被订阅的数据流。Observable 可以用来处理异步和同步的数据流，是 RxJS 中最基本的构建块之一。

1. **表示数据流**：Observable 代表着一个数据序列，可以是静态的值、一系列的事件、异步操作的结果等。
2. **可被订阅**：Observable 可以被观察者订阅，一旦被订阅，它就开始发送数据。
3. **支持数据转换**：可以通过操作符对 Observable 发出的数据进行转换、筛选、组合等操作。
4. **支持错误处理**：Observable 可以在数据流中传播错误，并且可以通过错误处理操作符进行处理。

```js
import { Observable } from 'rxjs';

// 创建一个 Observable，发出三个数字
const observable = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete(); // 发出完成信号
});

// 订阅 Observable
const subscription = observable.subscribe({
  next: value => console.log(value), // 处理每个发出的值
  error: err => console.error(err), // 处理错误
  complete: () => console.log('Complete') // 处理完成信号
});

// 输出：
// 1
// 2
// 3
// Complete

```

在 Observable 的构造函数中，接受一个函数作为参数，这个函数被称为 Observable 的“执行函数”或“生产者函数”。这个函数接受一个参数，通常被命名为 `subscriber`，它代表了一个观察者，用于向 Observable 发送数据、处理错误以及发送完成信号。

具体来说：

- **subscriber 参数**：它是一个观察者对象，用于与 Observable 进行交互。它是一个包含 `next`、`error` 和 `complete` 三个方法的对象。当 Observable 发出新值时，会调用 `next` 方法；当 Observable 发生错误时，会调用 `error` 方法；当 Observable 发出完成信号时，会调用 `complete` 方法。这些方法用于向观察者发送事件通知。

>  Observables 能够同步或异步地传递值。

subscribe()之后, 会执行Observable里面的函数, 具体是同步异步还取决于代码怎么写。





### 创建 Observable

> *可以使用* `new Observable`*。最常见的是， Observable 是使用创建函数创建的，例如* `of`*、*`from`*、*`interval` 等。 以上方式创建的都是 `Observable`

`subscribe` 调用只是一个启动“ Observable 的执行”并将一些值或事件传递给该执行过程的 Observer 的方法。

在 Observable 执行中，可能会传递零个到无限个 Next 通知。如果发送了出错或完成通知，则之后将无法发送任何其它通知。



当 `observable.subscribe` 被调用时，此 Observer 被附加到新创建的 Observable 执行中。此调用还会返回一个对象 `Subscription` ：

`const subscription = observable.subscribe((x) => console.log(x));`

使用 `subscription.unsubscribe()` 你可以取消正在进行的执行：

```ts
import { from } from 'rxjs';

const observable = from([10, 20, 30]);
const subscription = observable.subscribe((x) => console.log(x));
// Later:
subscription.unsubscribe();
```



总结:

`new Observable`, `of`, `from`,  都会返回一个`observable`, 这个 `observable` 可以使用 `subscribe`来订阅

`subscribe` 方法会返回一个 `Subscription` 对象, 这个对象可以调用 `unsubscript` 方法。



## Observer

 Observer 是 Observable 传递的各个值的消费者。 Observer 只是一组回调，对应于 Observable 传递的每种类型的通知：`next`、`error` 和 `complete`。下面是一个典型的 Observer 对象的例子：

```ts
const observer = {
  next: (x) => console.log('Observer got a next value: ' + x),
  error: (err) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
```

要**使用 Observer**，请将其提供给 Observable 的 `subscribe` ：

```ts
observable.subscribe(observer);
```

**Observer 只是具有三个回调的对象，分别用于 Observable 可能传递的每种类型的通知。**

订阅 `Observable` 时，你也可以只提供下一个回调作为参数，而不用附属于 `Observer` 对象，也就是 Observer对象不是 subscribe 所必须的



**也可以传入一个回调函数,** 而不是一个 `Observer` 对象, **因为`subscribe`内部会把他包裹起来, 它将使用回调参数作为 `next` 处理器创建一个 `Observer` 对象。**



## 操作符

### 可联入管道的**操作符**

> 使用语法 `observableInstance.pipe(operator())` 联入 Observables 管道的类型: 其中包括 [`filter(...)`](https://rxjs.tech/api/operators/filter) 和 [`mergeMap(...)`](https://rxjs.tech/api/operators/mergeMap)。
>
> *可联入管道的操作符是一个以 Observable 作为输入并返回另一个 Observable 的函数。这是一个纯操作：之前的 Observable 保持不变。*

**可联入管道的操作符本质上是一个纯函数，它将一个 Observable 作为输入并生成另一个 Observable 作为输出。订阅此输出 Observable 也会同时订阅其输入 Observable。**

map(), first()

管道

`obs.pipe(op1(), op2(), op3(), op4());`

### 创建操作符

> 可以作为独立函数调用以创建新的 Observable。例如： `of(1, 2, 3)` 创建一个 observable
>
> 创建操作符一种函数，可用于根据一些常见预定义行为或联合其它 Observable 来创建一个 Observable。



## 高阶Observable

> 高阶 Observables 是指 Observable 的值本身也是 Observable。在 RxJS 中，这种结构特别有用，可以处理更复杂的异步或基于事件的操作，例如动态启动新的异步操作，并管理这些操作的生命周期。

在 RxJS 中，`mergeMap`, `concatMap`, `switchMap`, `exhaustMap` 是处理高阶 Observables 的四个主要转换操作符。这些操作符将内部的 Observable 展平为一阶 Observable，但各自有不同的行为和用途。下面详细解释这些操作符，并通过代码示例展示如何使用它们。

### 1. `mergeMap`
`mergeMap`（也称为 `flatMap`）将每个源值映射到一个 Observable，然后将这些 Observable 的输出合并到一个单一的 Observable。这意味着，`mergeMap` 不会等待任何 Observable 完成，而是同时订阅所有 Observable。

**适用场景**：当你希望并行处理每个内部 Observable 且不关心其完成顺序时。

**示例代码**：对于每次点击，发起一个 HTTP 请求，并立即处理响应，不等待之前的请求完成。
```javascript
import { fromEvent } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const button = document.getElementById('myButton');

const clicks$ = fromEvent(button, 'click');

const responses$ = clicks$.pipe(
  mergeMap(() => ajax.getJSON('https://api.example.com/data'))
);

responses$.subscribe(response => console.log('Received:', response));
```

### 2. `concatMap`
`concatMap` 与 `mergeMap` 类似，但它会按照内部 Observable 发出的顺序严格处理每个 Observable。新的 Observable 只有在前一个完成后才会开始订阅。

**适用场景**：需要按顺序严格处理异步任务时。

**示例代码**：按点击顺序发起请求，每个请求必须等前一个完成后才开始。
```javascript
import { fromEvent } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const button = document.getElementById('myButton');

const clicks$ = fromEvent(button, 'click');

const responses$ = clicks$.pipe(
  concatMap(() => ajax.getJSON('https://api.example.com/data'))
);

responses$.subscribe(response => console.log('Received:', response));
```

### 3. `switchMap`
`switchMap` 会对每个源值映射到一个 Observable，但它会自动取消之前未完成的 Observable 订阅。它总是只订阅最新的 Observable。

**适用场景**：例如，搜索框自动补全，只关心最新请求的响应。

**示例代码**：搜索框输入处理，每次输入变化时发起新的搜索请求，取消旧的请求。
```javascript
import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const input = document.getElementById('searchInput');

const input$ = fromEvent(input, 'input');

const results$ = input$.pipe(
  switchMap(event => ajax.getJSON(`https://api.example.com/search?q=${event.target.value}`))
);

results$.subscribe(result => console.log('Search Results:', result));
```

### 4. `exhaustMap`
`exhaustMap` 在源 Observable 发出值时，如果当前有一个内部 Observable 在运行，它会忽略新的值。只有当当前 Observable 完成后，它才会处理下一个源值。

**适用场景**：避免因频繁请求而导致的不必要的网络负载，例如，保存按钮快速多次点击时。

**示例代码**：处理保存操作，忽略在当前保存操作未完成时发起的新保存操作。
```javascript
import { fromEvent } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const saveButton = document.getElementById('saveButton');

const saveClicks$ = fromEvent(saveButton, 'click');

const saveResponses$ = saveClicks$.pipe(
  exhaustMap(() => ajax.getJSON('https://api.example.com/save'))
);

saveResponses$.subscribe(response => console.log('Save completed:', response));
```



总结:

mergeMap

无须的先到先得并行的

concatMap

需要等订阅处理完毕才开始关注下一个Observable

switchMap

表示会频繁切换, 只关注最新的, 之前未完成的, 会取消订阅

exhaustMap

死脑筋, 只关注正在进行的, 无视新来的







## 订阅

**什么是订阅？** 订阅是一个表示可释放资源的对象，通常是 Observable 的一次执行。订阅有一个重要的方法 `unsubscribe`，它不接受任何参数，只是释放本订阅所持有的资源。



## 主体

**什么是主体？** RxJS Subject 是一种特殊类型的 Observable，它允许将值多播到多个 Observer。虽然普通的 Observable 是单播的（每个订阅的 Observer 都拥有 Observable 的独立执行），但 Subjects 是多播的。



>  *Subject 类似于 Observable，但可以多播到多个 Observer。Subjects 就像 EventEmitters：它们维护着许多监听器的注册表。

**每个 Subject 都是 Observable。**给定一个 Subject，你可以 `subscribe` 它，提供一个 Observer，它将开始正常接收值。从 Observer 的角度来看，它无法判断 Observable 的执行是来自普通的单播 Observable 还是来自 Subject。

在 Subject 内部，`subscribe` 不会调用一次能给出值的新执行过程。它只是在一个 Observer 列表中注册给定的 Observer，类似于 `addListener` 通常在其它库和语言中的工作方式。

**每个 Subject 也都是 Observer。**它是一个具有方法 `next(v)`、`error(e)` 和 `complete()` 的对象。要为 Subject 提供一个新值，只需调用 `next(theValue)`，它将被多播到注册进来监听 Subject 的 Observer。



多个Observer

```ts
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

subject.next(1);
subject.next(2);

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
```



`Subject` 同时具有 `Observer` 和 `Observable` 的特性。

1. **作为 Observer**：`Subject` 可以作为一个观察者，它可以接收来自其他 Observable 的数据，并将这些数据推送给它的订阅者（观察者）。所以他可以作为`subscribe`的参数
2. **作为 Observable**：`Subject` 同样可以作为一个可观察对象，它可以被其他观察者订阅，从而接收来自它自身的数据流。

> *多播的 Observable 在底层使用 Subject 来让多个 Observer 看到相同的 Observable 执行过程。*





## 调度器

在 RxJS 中，调度器（Schedulers）是用来控制 Observable 的执行时机和执行上下文的工具。调度器可以控制 Observable 在何时以及在哪个执行上下文中发送通知（比如值、错误、完成）给观察者。

### 调度器的作用

1. **控制执行时机**：调度器可以控制 Observable 在何时开始执行以及何时发送通知给观察者，比如立即执行、延迟执行、定时执行等。
2. **控制执行上下文**：调度器可以指定 Observable 在哪个执行上下文（比如当前的事件循环、微任务队列、宏任务队列等）中执行，以控制并发性和异步行为。

### RxJS 中常见的调度器

1. **`observeOn`**：用于指定 Observable 在何时发送通知给观察者，可以指定在哪个执行上下文中发送通知。
2. **`subscribeOn`**：用于指定 Observable 的创建和订阅操作在何时和何处执行，可以指定在哪个执行上下文中创建 Observable 和订阅观察者。

### 示例

```javascript
import { of } from 'rxjs';
import { observeOn, subscribeOn } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';

// 创建一个 Observable，在异步调度器中发送通知
of(1, 2, 3).pipe(
  observeOn(asyncScheduler)
).subscribe(value => console.log('Value:', value));

// 创建一个 Observable，在异步调度器中创建 Observable 和订阅观察者
of(1, 2, 3).pipe(
  subscribeOn(asyncScheduler)
).subscribe(value => console.log('Value:', value));
```

在这个示例中，`observeOn` 指定了 Observable 在异步调度器中发送通知给观察者，而 `subscribeOn` 则指定了 Observable 在异步调度器中创建和订阅。



```ts
import { of } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { asyncScheduler, asapScheduler } from 'rxjs';

console.log('start');

of('asap').pipe(
  observeOn(asapScheduler)
).subscribe(x => console.log(x));

of('async').pipe(
  observeOn(asyncScheduler)
).subscribe(x => console.log(x));

Promise.resolve().then(() => console.log('promise'));

console.log('end');

// 打印
// start
// end
// asap
// promise
// async
```

如上代码:

**asapScheduler**: 会将回调放到微任务队列, 和Promise同级别, 在当前事件循环中尽快执行

**asyncScheduler**: 会将任务放到宏任务队列, 和setTimeout同级别, 在新的事件循环中的开头执行
