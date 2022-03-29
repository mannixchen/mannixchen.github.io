# Getting Started

## Intoduction


### 单词 vocabulary

---

`author`- 编写

`abbreviated /ə'brivɪ'et/ as SFC` - 用 SFC 缩写

`as the name suggests,`- 顾名思义

`encapsulates` - 封装

`be it simple or complex.  `- 无论是简单还是复杂。

`Prerequisites `-  前提；必要条件 

`grasp the basics `- 掌握基础知识

`Prior experience `- 先前的经验

`Progressive /prə'ɡrɛsɪv/ `- 逐步发生的，逐步发展的

`extremely diverse /dɪ'vɝs/ ` - 各式各样的.. 及其多样化

`the things we build on the web may vary drastically /ˈdræstɪklɪ/ in form and scale. `- 在形式和规模上可能有很大的不同。 (vary变化 drastically大大地彻底的)

`With that in mind `- 考虑到这一点

`Vue is designed to be flexible and incrementally  /ɪnkrə'məntl/ adoptable.`- Vue旨在灵活且逐步采用 (增量可采用性)。

`intimidating `- 令人惊恐的;骇人的;令人胆怯的 

`tackle /ˈtækəl/ more ambitious goals `- 实现更远大的目标

`veteran /'vɛtərən/ ` - 老手

`optimal /'ɑptəml/` - 同 optimum 最优的最佳的最适宜的

`leverage /'lɛvərɪdʒ/` - 利用

`you can pick the optimal way to leverage Vue based on the problems you are trying to solve`- 你可以挑选最后方式来利用 vue , 基于你尝试解决的问题

`retain `- 保持

`adapt `- 适合

`defining feature` - 最典型的特征

`if your use case warrants /'wɔrənt/ a build setup. `  - 如果你的案例保证了了 warrants 保证

`dedicated /'dɛdə'ketɪd/ section` dedicated 为…专门设计 You can learn more about the [how and why of SFC](https://vuejs.org/guide/scaling-up/sfc.html) in its dedicated section

`typically` - 一般的

`compile-time transforms` - 编译时转换

`boilerplate/'bɔɪlɚplet/` - 样板文件

`on top of `- 在…上面

`aligns` - 对准, 使成为一条直线 which typically aligns better with a class-based mental model

`effectively /ɪ'fɛktɪvli/` - 实际上,事实上

`In return,` - 反过来

`patterns`-模式

`going over all content ` - 浏览所有内容



---

### Vue can be used in different ways:

1. Enhancing static HTML without a build step - 增强静态html
2. Embed as Web Components on any page - 作为网络组件嵌入在任何 page
3. Single-Page Application (SPA)
4. Server-SideRendering (SSR)
5. Static-Site-Generation (SSG)
6. Targeting desktop, mobile, WebGL or even the terminal

Despite the flexibility, the core knowledge about how Vue works is shared across all these use cases (核心知识在这 6 个使用场景共享). 



### Single-File Components

> A Vue SFC, as the name suggests, encapsulates the component's logic (JavaScript), template (HTML), and styles (CSS) in a single file.

- SFC is a defining feature of Vue, 

### API Style

Vue components can be authored in two different API styles: **Options API** and **Composition API**.

With Composition API,  we define a component’s logic using imported API functions. 

The `setup` attribute is a hint that makes Vue perform compile-time transforms that allow us to use Composition API with less boilerplate. For example, **imports and top-level variables / functions** declared in `<script setup>` are directly usable in the template.

### Which to choose ?

the Options API is implemented on top of the Composition API! 

The **Options API** is centered around (以… 为中心) the concept of a "component instance" (`this` as seen in the example), which typically aligns better (更好的对齐, 更符合) with a class-based mental model for users coming from OOP language backgrounds.

The **Composition API** is centered around declaring reactive state variables directly in a function scope, and composing state from multiple functions together to handle complexity. It is more free-form, and requires understanding of how reactivity works in Vue to be used effectively. In return, its flexibility enables more powerful patterns for organizing and reusing logic.



## Quick Start

### Vocabulary

---

`identical` - 完全一样的

`scaffolding /'skæfəldɪŋ/ tool` - 脚手架工具

`for now` - 眼下, 当下, 暂时如此 simply choose `No` by hitting enter for now (暂时选 No)

`viable/ˈvaɪəbəl/ ` - 可行的

`underlying build tool Vite` - 底层的构建工具

`ship your app to production` - 将你的产品交付生产

`consistency` 连贯性;一致性

`primarily` 主要的

`chromium/'kromɪəm/` 谷歌浏览器的, 铬元素, 金属风格

---

### With build tools
>
>To create a build-tool-enabled Vue project on your machine

```sh
npm init vue@latest
```

### Without build tools

```html
<script src="https://unpkg.com/vue@3"></script>

<div id="app">{{ message }}</div>

<script>
  Vue.createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

But if we want to use ES modules for consistency , use the following HTML instead:

```html
<script type="importmap">
  // importmap only works in chromium-based browsers like chrome or edge

  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

### [Serving over HTTP](https://vuejs.org/guide/quick-start.html#serving-over-http)

If we want to split code into separate js files, we need to author like this

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```



Run `npx serve` from the command line in the same directory where your HTML is. Or it desn’t work.



Use **es6-string-html** in es6 HTML strings, it will get hightlight support







# Essentials

## Create a Vue Application

### Vocabulary

---

`expects` 期望, 需要

`registrations/'rɛdʒɪ'streʃən/`  注册

`descendent/dɪˈsɛndənt/` 子孙 后代



---

### The Root Component

The object we pass to `createApp` is a component, and it’s a root component.

### Mounting the App

An application instance won't render anything until its `.mount()` method is called. 





## Template syntax

---

`declaratively/dɪ'klærətɪv/`  声明的

`underlying component` 底层的组件

`syntactically /sin'tæktikli/ ` 语法层面上 syntactically valid HTML(语法合规的 HTML)

`spec-compliant ` 符合规范的

`compliant /kəm'plaɪənt` 服从的, 顺从的

`hood` 盖子, 引擎盖, 罩子

`Under the hood` 藏在表面之下的机制或结构, 在后台

`reactivity[ˌri:æk'tɪvɪti] ` 反应度；反应能力；活动性, 反应性

`intelligently /ɪnˈtelɪdʒəntli/` 聪明的明智的

`DOM manipulations  [məˌnɪpjəˈleɪʃ(ə)n] ` 操作操纵

`Interpolation [ɪnˌtɚpəˈleɪʃən] ` 插入文字

`curly braces` 花括号 `{}`

`corresponding /ˌkɔrəˈspɑndɪŋ/` 相应的

`interprets/ɪnˈtɜrprət/` 解释

`directive /daɪˈrektɪv/` 指示,命令

`arbitrary` 任意的 武断的

`XSS vulnerability/ˌvʌlnərə'biliti/ ` 缺陷弱点

---

Render function does not enjoy the same level of compile-time optimizations  as templates.









