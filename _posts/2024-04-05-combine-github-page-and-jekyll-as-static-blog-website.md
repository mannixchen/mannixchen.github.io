---
title: 利用 Github Page 和 Jekyll 建立个人博客
description: 利用 Github Page 和 Jekyll 建立个人博客, 同时配置自定义域名, 完全跳过服务器依赖
date: 2024-04-05 13:55:03 +0800
comments: true
categories: [折腾, 建站]
tags: [博客]
pin: false
---

## 利用 Github 仓库部署 Github Page

### Jekyll 构建静态页面

[Jekyll](https://jekyllrb.com/) 是一个简单的静态网站生成器。它将纯文本转换成静态网站和博客，无需使用数据库或复杂的后端服务器。非常适合个人、项目或组织的博客和网站。它由Tom Preston-Werner创建，是GitHub Pages的底层引擎，这意味着你可以免费在GitHub上托管由 Jekyll 生成的网站。

### 选择主题并创建仓库

1. 在[主题商店](https://jamstackthemes.dev/theme/#ssg=jekyll)选择喜欢的主题, 并根据主题创建仓库

   以[chirpy](https://github.com/cotes2020/jekyll-theme-chirpy/) 为例, 你可以利用 [chirpy-starter](https://github.com/cotes2020/chirpy-starter) 直接创建模版

![image-20240405140847500](https://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20240405140847500.png)

​	然后参照 [Getting Started](https://chirpy.cotes.page/posts/getting-started/) 来创建自己的仓库

2. 配置自定义域名

   ![image-20240405141438206](https://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20240405141438206.png)

   并在域名服务商中, 将对应的**自定义域名** 反指向`<username>.github.iio`

3. 将 `Source`设置为 Github Actions, 根据配置好的 actions, 会自动进行部署.

4. 记得配置`_config.yml` 文件的 `url` 等属性



## 利用其他仓库映射子域名

其他静态页面也可以以单独仓库的形式存在, 如 `demo`仓库, 可以通过`<username>.github.io/demo` 的形式访问。



### 根域名的自动跳转

将`www` 指向 `mannixchen.github.io`
将 `@` 指向 Github 的四个 ip, 这个就可以实现根域名跳转 `www`子域名的场景

```txt
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```



## 后续

如果想要搭建更加精彩自定义的博客形式, 还是要认真研读 [Jekyll 官网](https://jekyllrb.com/), 并充分参考[其他案例](https://jamstackthemes.dev/theme/#ssg=jekyll)。

Jekyll 提供的网站服务形式非常适合个人博客, 企业官网, 文档页面等静态展示页面, 且不需要单独服务器的支持, 省钱省力。

不过有关 **SEO** 的支持还是要经常研究, 迄今为止两天, 我都没能在 Google 搜到自己的文章。
