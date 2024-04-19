---
title: Angular V12 文档学习与整理(四) - 路由
description: 新入公司使用 Angular 12, 特此学习和理解
date: 2024-04-19 13:17:27 +0800
comments: true
categories: [编程, 前端, Angular, 路由]
tags: [技术, Angular]
pin: false 
---

## 创建

1. 创建带路由的应用:

`ng new routing-app --routing `:

这个 `–routing`的意思就是立即为此 app 配置路由, 这会在应用的根模块（默认是`AppModule`）中添加一个路由模块（`AppRoutingModule`），并设置好基本的路由配置文件。

2. 将路由模块导入到`app.module`
3. 在 `app-routing.module` 中声明 `routes: Routes`

```ts 
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
];
```

4. 将路由应用到项目

```ts
<h1>Angular Router App</h1>
<!-- This nav gives you links to click, which tells the router which route to use (defined in the routes constant in  AppRoutingModule) -->
<nav>
  <ul>
    <li><a routerLink="/first-component" routerLinkActive="active">First Component</a></li>
    <li><a routerLink="/second-component" routerLinkActive="active">Second Component</a></li>
  </ul>
</nav>
<!-- The routed views render in the <router-outlet>-->
<router-outlet></router-outlet>
```

`RouterModule.forRoot`方法用于在Angular应用的根模块中配置路由。这个方法接受一个路由定义数组（`Routes`）作为参数，并返回一个配置了路由的模块。

- **参数**：路由定义数组`Routes`。每个路由定义包含一个路径（`path`）、一个组件（`component`），以及可选的子路由（`children`）、路由守卫（`canActivate`）、懒加载模块（`loadChildren`）等。
- **返回值**：一个配置了路由的模块，这个模块应被导入到应用的根模块中。
- 

## 路由的顺序

路由的顺序很重要，因为 `Router` 在匹配路由时使用“先到先得”策略，所以应该在不那么具体的路由**前面放置更具体的路由。**首先列出静态路径的路由，然后是一个与默认路由匹配的空路径路由。[通配符路由](https://v12.angular.cn/guide/router#setting-up-wildcard-routes)是最后一个，因为它匹配每一个 URL，只有当其它路由都没有匹配时，`Router` 才会选择它。



## 路由传值

你可以使用 [ActivatedRoute](https://v12.angular.cn/api/router/ActivatedRoute) 接口, `ActivatedRoute`是一个服务，它提供了关于与当前路由有关的信息，比如路由参数、静态数据、URL等。

- **获取路由参数**：如果你的路由路径定义了参数（比如`/product/:id`），你可以使用`ActivatedRoute`来获取这些参数的值。
- **获取查询参数和片段**：你可以获取到URL的查询参数（即URL中`?`后面的部分）和片段（即URL中`#`后面的部分）。
- **获取路由的静态数据**：可以访问通过路由配置传递给路由的静态数据。
- **观察路由和参数的变化**：`ActivatedRoute`提供了若干Observable对象，你可以订阅这些Observable以响应路由或参数的变化。

1. 把 `ActivatedRoute` 和 `ParamMap` 导入到组件。
2. 通过把 `ActivatedRoute` 的一个实例添加到你的应用的构造函数中来注入它：

```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  id: string;

  constructor(private route: ActivatedRoute) { } // 注入 ActivatedRoute 实例

  ngOnInit(): void {
    // 使用ActivatedRoute
  }
}

```

3. 获取参数的两种方式: 使用`ActivatedRoute`的`snapshot`属性或`params` Observable来获取路由参数。

```ts
// snapshot
ngOnInit(): void {
  this.id = this.route.snapshot.paramMap.get('id');
}


// params (Observable 对象)
ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.id = params['id'];
  });
}

```



4. 获取查询数据

```ts
// snapshot
ngOnInit(): void {
  let page = this.route.snapshot.queryParamMap.get('page');
}
// queryParams
ngOnInit(): void {
  this.route.queryParams.subscribe(queryParams => {
    let page = queryParams['page'];
  });
}

```

### 总结

`ActivatedRoute`是Angular路由系统的一部分，它允许你访问当前路由的信息，如参数、查询参数、URL片段等。



## 通配符路由

通配符路由（Wildcard Route）在Angular路由系统中用于匹配那些没有对应到任何其他路由的URL路径。它通常用作捕获所有未知或未处理的路由请求，比如显示一个404错误页面，或者将用户重定向到应用的某个默认页面, 以`**`的方式告诉 Angular 这是一个通配符路由。

```ts
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  // 其他路由配置...
  { path: '**', component: PageNotFoundComponent } // 通配符路由，用于匹配所有未知的路径
];
```

## 路由重定向

要设置重定向，请使用重定向源的 `path`、要重定向目标的 `component` 和一个 `pathMatch` 值来配置路由，以告诉路由器该如何匹配 URL。

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```



## 编程式导航

```ts

goToItems() {
  this.router.navigate(['items'], { relativeTo: this.route });
}
```

## 查询查询参数与片段

在Web开发中，访问查询参数和片段（URL中的`?key=value`结构和`#fragment`部分）是一种获取从URL传递的数据的常见方式。

在Angular中，你可以通过`ActivatedRoute`服务来访问当前路由的查询参数和片段。`ActivatedRoute`提供了`queryParams`和`fragment`的Observable，你可以订阅这些Observable以响应URL的变化。



## 特性路由模块和主路由模块的结合

将特性路由模块与主路由模块结合起来，主要用于组织和划分应用的不同功能区域，提高模块化和可维护性。这通常涉及到特性模块的懒加载，从而**实现按需加载特性模块**，优化应用启动时间和性能。下面我将说明如何将特性路由模块与主路由模块结合起来，使用**懒加载**的方式。

### 1. 定义特性路由模块

首先，你需要创建一个特性模块并为其定义路由。这里以一个名为`ProductsModule`的特性模块为例，该模块包含产品列表的路由。

```ts

// products.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  { path: '', component: ProductListComponent }
];

@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)  // 使用forChild来定义特性路由
  ]
})
export class ProductsModule { }
```

### 2. 配置主路由模块以实现懒加载

在应用的主路由模块（通常是`AppRoutingModule`），你将通过**特定的语法来配置懒加载的路由**，指向你的特性模块。注意，路径中不再直接引用组件，而是使用`loadChildren`函数来指定模块文件和模块类名。

```ts

// app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  // 其他路由配置...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]  // 重新导出RouterModule，使其指令在AppModule中可用
})
export class AppRoutingModule { }
```

在这个例子中，当用户访问`/products`路径时，`ProductsModule`将会被懒加载。`loadChildren`方法接受一个箭头函数，这个函数动态导入特性模块，并返回一个`Promise`，该`Promise`解析为模块对象，然后使用`.then(m => m.ProductsModule)`来指定需要加载的模块。

### 3. 确保AppModule导入AppRoutingModule

最后，确保你的根模块`AppModule`已经导入了`AppRoutingModule`，这样主路由配置才会生效。

```ts
typescriptCopy code
// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule  // 主路由模块导入
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

通过这种方式，特性路由模块（和它们的路由）与主路由模块结合到一起，实现了功能区域的模块化和路由的懒加载。这种模式对于构建大型和性能优化的Angular应用至关重要。


待续, 下面关注路由的路由守卫, 懒加载等等问题。
