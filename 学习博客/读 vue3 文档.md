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







