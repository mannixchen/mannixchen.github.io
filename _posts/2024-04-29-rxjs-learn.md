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



