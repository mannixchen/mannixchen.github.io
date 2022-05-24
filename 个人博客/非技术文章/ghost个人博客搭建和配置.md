# ghost个人博客搭建 ( centos 7 ) 和配置 ( 汉化 - 搜索 - 评论 )

> 为啥一定要是自己的博客呢? 掘金, 博客园, 知乎, 简书不香吗? 他们有天然的粉丝优势, `SEO` 优势,  可无奈都有广告植入, 并且都不太`自我`, 我这里所追求的**自我**, 就是一个可定制化外观, 系统相对健全的, 并且带有发布后台的博客系统, 所以我最终选择了轻量化的 `ghost` 博客应用

## 如何安装ghost

首先贴一下官网链接 [ghost](https://ghost.org/docs/), 官网推荐 `Ubuntu` 进行配置, 然而, 我的腾讯云安装的是 `CentOS7` , 不过我还是找到了一篇手把手的 [`CentOS` 教程](https://www.alibabacloud.com/help/zh/doc-detail/50604.htm), 整个坐下来, 一次报错都没遇到, 强烈推荐直接阅读跟着后面做. :smile:

> 如果你已经安装了 `nodejs` 那么你可以安装一下 [`n`](https://www.npmjs.com/package/n) 来做一下 `node` 版本管理

### 步骤一: 首先你得有一台服务器

### 步骤二: 在者你需要部署一下 web 环境, 安装 SSH 终端工具

1. 添加 `Nginx` 软件库。

   ```bash
   rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
   ```

   软件包中包含的软件及版本为：`nginx/1.10.2`

   **说明** 您下载的版本可能与此不同，请以实际情况为准。

2. 安装 `Nginx`

   ```bash
   yum -y install nginx
   ```

3. 设置Nginx服务器自动启动。

   ```
   systemctl enable nginx.service
   ```

4. 启动Nginx并查看Nginx服务状态。

   ```
   systemctl start nginx.service
   systemctl status nginx.service
   ```

5. 在浏览器中输入IP地址，可以看到默认的Nginx网页。

   ![nginx网页](https://static-aliyun-doc.oss-accelerate.aliyuncs.com/assets/img/zh-CN/3412649951/p12474.png)

### 步骤三：安装Ghost

1. 更新系统。确保您的服务器系统处于最新状态。

   ```
   yum -y update
   ```

2. 安装Node.js。

   1. 安装EPEL。

      ```
      yum install epel-release -y
      ```

   2. 安装Node.js和npm。

      ```
      yum install nodejs npm --enablerepo=epel
      ```

   3. 安装node.js管理工具。

      ```
      npm install -g n
      ```

   4. 安装稳定版本的node.js。

      本示例安装node.js的版本为`12.16.3`。

      ```
      n 12.16.3
      ```

   5. 运行命令**n**，选择已安装的node.js 12.16.3版本。

   6. 编辑环境配置文件。

      ```
      vim ~/.bash_profile
      ```

   7. 按i进入编辑模式，在文件末尾添加下列信息。

      ```
      export N_PREFIX=/usr/local/bin/node
      export PATH=$N_PREFIX/bin:$PATH
      ```

      编辑完成后按esc键，输入`:wq`保存并退出文件。

   8. 执行以下命令使配置生效。

      ```
      source ~/.bash_profile
      ```

   9. 安装进程管理器，来控制Node.js应用程序。

      进程管理器可以保持应用程序一直处于运行状态。

      ```
      npm install pm2 -g
      ```

   10. 运行`node -v`和`npm -v`命令，检查Node.js的版本。

3. 安装Ghost。

   1. 创建Ghost安装目录。

      ```
      mkdir -p /var/www/ghost
      ```

   2. 进入Ghost安装目录，下载最新版本的Ghost安装包。

      ```
      cd /var/www/ghost
      wget https://ghost.org/zip/ghost-latest.zip
      mv ghost-latest.zip ghost.zip
      ```

   3. 解压Ghost安装包。

      ```
      yum install unzip -y
      unzip ghost.zip
      ```

   4. 安装gcc和c++编译器。

      ```
      yum -y install gcc gcc-c++
      ```

   5. 使用npm安装Ghost。

      ```
      npm install -production
      ```

   6. 运行`npm start`命令启动Ghost，检查是否安装成功。

      启动成功示例如下，您可以按Ctrl+C组合键关闭Ghost。

      ```
      [2020-04-13 04:00:01] INFO Ghost is running in development...
      [2020-04-13 04:00:01] INFO Listening on: 127.0.0.1:2368
      [2020-04-13 04:00:01] INFO Url configured as: http://121.196.*.*/
      [2020-04-13 04:00:01] INFO Ctrl+C to shut down
      [2020-04-13 04:00:01] INFO Ghost boot 2.185s
      ```

   7. 修改/var/www/ghost/core/shared/config/env目录下的config.development.json文件。

      ```
      vi /var/www/ghost/core/shared/config/env/config.development.json
      ```

   8. 配置config.development.json文件中的**URL**为Ghost博客的域名。

      ![ghost1](https://static-aliyun-doc.oss-accelerate.aliyuncs.com/assets/img/zh-CN/3412649951/p98140.png)按下esc退出编辑模式，并输入`:wq`保存并退出。

4. 配置Nginx作为Ghost的反向代理。

   1. 进入Nginx配置目录。

      ```
      cd /etc/nginx/conf.d/
      ```

   2. 新建Ghost博客的Nginx配置文件。

      ```
      vim /etc/nginx/conf.d/ghost.conf
      ```

   3. 将以下内容输入到ghost.conf中，把**server_name**改成Ghost实际的域名。

      ```
      upstream ghost {
          server 127.0.0.1:2368;
      }
      server {
          listen      80;
          server_name myghostblog.com;
      
          access_log  /var/log/nginx/ghost.access.log;
          error_log   /var/log/nginx/ghost.error.log;
      
          proxy_buffers 16 64k;
          proxy_buffer_size 128k;
      
          location / {
              proxy_pass  http://ghost;
              proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
              proxy_redirect off;
      
              proxy_set_header    Host            $host;
              proxy_set_header    X-Real-IP       $remote_addr;
              proxy_set_header    X-Forwarded-For $proxy_add_X_forwarded_for;
              proxy_set_header    X-Forwarded-Proto https;
          }
      }
      ```

   4. 修改默认的配置文件default.conf为default.conf.bak，使Nginx只应用于ghost.conf。

      ```
      mv default.conf default.conf.bak
      ```

   5. 重启Nginx服务。

      ```
      systemctl restart nginx.service
      ```

5. 启动Ghost。

   ```
   cd /var/www/ghost/
   npm start
   ```

6. 访问Ghost博客。

   1. 在浏览器输入http://公网IP或http://域名，访问Ghost。

      ![Ghost网页](https://static-aliyun-doc.oss-accelerate.aliyuncs.com/assets/img/zh-CN/3412649951/p12480.png)

      **说明** 如果访问出现502，请检查是否是防火墙的问题，可以关闭防火墙。

   2. 如果需要对博客进行编辑修改，在浏览器输入http://公网IP/ghost。

      ![修改博客](https://static-aliyun-doc.oss-accelerate.aliyuncs.com/assets/img/zh-CN/3412649951/p12481.png)

### 步骤四：购买域名

您可以给自己的网站设定一个单独的域名。这样您的用户可以使用易记的域名访问您的网站，而不需要使用复杂的IP地址。

建议登录阿里云购买域名。详情请参见[注册通用域名](https://www.alibabacloud.com/help/zh/doc-detail/54068.htm#task-1830383)。

### 步骤五：备案

对于域名指向中国内地服务器的网站，必须进行网站备案。在域名获得备案号之前，网站无法开通使用。

阿里云有代备案系统，方便您进行备案。备案免费，审核时间一般为20天左右，请您耐心等待。

### 步骤六：配置域名解析

您需要在阿里云万网上配置域名解析之后，用户才能通过域名访问您的网站。具体操作请参见[设置域名解析](https://www.alibabacloud.com/help/doc-detail/58131.htm)。



## 配置 ghost

> 关于如何配置 `ghost` 我也找到一篇[很不错的博文](https://huhao.ai/ghost-casper-theme-commets-search-toc-highlight/), 介绍的很详细, 所要作的也只是做一些样式修改

### 配置搜索

> [点击直达](https://huhao.ai/ghost-casper-theme-commets-search-toc-highlight/#-flexsearch) 作者用的 `flexsearch` 我感觉效果特别好, 以下为转自原作者

**操作步骤**

- Step1: 在导航栏最右边增加搜索入口，partials/site-nav.hbs

```
<button class="m-icon-button in-menu-main js-open-search" aria-label="Open search">
    <span class="icon-search"></span>
</button>
```

- Step2: 新增search icon和close icon
  使用bootstrap的icon，直接用绘制，不用额外引入字体文件，简单便捷
- search图标：partials/icons/search.hbs

```html
<svg class="bi bi-search" width="16px" height="16px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
    <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
</svg>
```

HTML

Copy

- close图标：partials/icons/x.hbs

```html
<svg class="bi bi-x" width="24px" height="24px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
    <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
</svg>
```

HTML

Copy

[bootstrap-icons](https://icons.getbootstrap.com/)

- Step3：新增搜索框及partials/search.hbs

```html
<div class="m-search js-search">
  <button class="m-icon-button outlined as-close-search js-close-search" aria-label="Close search">
    <span class="icon-close">{{> "icons/x"}}</span>
  </button>
  <div class="m-search__content">
    <form class="m-search__form">
      <fieldset>
        <span class="icon-search m-search-icon">{{> "icons/search"}}</span>
        <input type="text" class="m-input in-search js-input-search" placeholder="{{t "Type to search"}}" aria-label="Type to search">
      </fieldset>
    </form>
    <div class="js-search-results hide"></div>
    <p class="m-not-found align-center hide js-no-results">
      {{t "No Results."}}
    </p>
  </div>
</div>
```

HTML

Copy

- Step4: 在default.hbs中增加search框

```html
......
{{!-- All the main content gets inserted here, index.hbs, post.hbs, etc --}}
{{{body}}}

{{!-- Search form --}}
{{> search}}
......
```

HTML

Copy

- Step5: 在partials/site-nav.hbs中增加搜索入口

```html
<button class="m-icon-button in-menu-main js-open-search" aria-label="Open search">
    <span class="icon-search">{{> "icons/search"}}</span>
</button>
```

HTML

Copy

- Step6: 新增search.css样式表

```css
:root,[data-theme=dark] {
        --background-color:#111;
        --primary-foreground-color:#ccc;
        --secondary-foreground-color:#fff;
        --primary-subtle-color:#2c2fe6;
        --secondary-subtle-color:#141920;
        --titles-color:#b4b4b4;
        --link-color:#2c2fe6;
        --primary-border-color:#1d1d1d;
        --secondary-border-color:#0f0f0f;
        --article-shadow-normal:0 4px 5px 5px rgba(0,0,0,0.1);
        --article-shadow-hover:0 4px 5px 10px rgba(0,0,0,0.1);
        --transparent-background-color:rgba(0,0,0,0.99);
        --footer-background-color:#080808;
        --submenu-shadow-color-opacity:0.55;
        --button-shadow-color-normal:rgba(10,10,10,0.5);
        --button-shadow-color-hover:rgba(10,10,10,0.5);
        --toggle-darkmode-button-color:#efd114;
        --table-background-color-odd:#050505;
        --table-head-border-bottom:#1d1d1d;
}

.clearfix:after,.clearfix:before {
    content: " ";
    line-height: 0;
    display: table
}

.clearfix:after {
    clear: both
}

.clearfix {
    *zoom:1}

.content-centered,.m-hero,.m-icon-button {
    display: flex;
    align-items: center;
    justify-content: center
}

.hide {
    display: none
}

.m-icon-button {
    color: var(--titles-color);
    font-size: 1.125rem;
    border: 0;
    outline: 0;
    padding: 0;
    cursor: pointer;
    background-color: transparent
}

.m-icon-button.outlined {
    border-radius: 50%;
    border: 1px solid var(--primary-foreground-color)
}

.m-icon-button.filled {
    background-color: var(--background-color);
    border-radius: 50%;
    -o-box-shadow: 0 2px 4px var(--button-shadow-color-normal),0 0 0 transparent;
    box-shadow: 0 2px 4px var(--button-shadow-color-normal),0 0 0 transparent;
    transition: all .25s cubic-bezier(.02,.01,.47,1)
}

.m-icon-button.filled:hover {
    -o-box-shadow: 0 4px 8px var(--button-shadow-color-hover),0 0 0 transparent;
    box-shadow: 0 4px 8px var(--button-shadow-color-hover),0 0 0 transparent
}

.m-icon-button.in-mobile-topbar {
    width: 65px;
    height: 100%
}

.m-icon-button.as-close-menu {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    font-size: .625rem;
    z-index: 2
}

@media only screen and (min-width: 48rem) {
    .m-icon-button.as-close-menu {
        display:none!important
    }
}

.m-icon-button.as-close-search {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    font-size: .625rem;
    z-index: 2
}

@media only screen and (min-width: 48rem) {
    .m-icon-button.as-close-search {
        top:30px;
        right: 30px;
        width: 42px;
        height: 42px;
        font-size: .875rem
    }
}

@media only screen and (min-width: 80rem) {
    .m-icon-button.as-close-search {
        top:40px;
        right: 40px;
        width: 50px;
        height: 50px
    }
}

.m-icon-button.in-menu-main {
    display: none
}

@media only screen and (min-width: 48rem) {
    .m-icon-button.in-menu-main {
        display:flex;
        width: 26px;
        height: 25px
    }
}

.m-icon-button.more {
    font-size: 6px;
    z-index: 6;
    position: relative
}

.m-icon-button.more.active {
    color: var(--primary-subtle-color)
}

.m-icon-button.in-pagination-left,.m-icon-button.in-pagination-right {
    width: 40px;
    height: 40px;
    font-size: .625rem
}

@media only screen and (min-width: 48rem) {
    .m-icon-button.in-pagination-left,.m-icon-button.in-pagination-right {
        width:46px;
        height: 46px;
        font-size: .688rem
    }
}

.m-icon-button.in-pagination-left {
    margin-right: 30px
}

.m-icon-button.in-pagination-right {
    margin-left: 30px
}

.m-icon-button.in-featured-articles {
    position: absolute;
    color: #fff;
    font-size: .875rem;
    width: 29px;
    height: 22px;
    bottom: 16px;
    z-index: 2
}

@media only screen and (min-width: 48rem) {
    .m-icon-button.in-featured-articles {
        bottom:36px
    }
}

.m-icon-button.in-featured-articles.slick-prev {
    right: 52px
}

@media only screen and (min-width: 48rem) {
    .m-icon-button.in-featured-articles.slick-prev {
        right:72px
    }
}

.m-icon-button.in-featured-articles.slick-next {
    right: 16px
}

@media only screen and (min-width: 48rem) {
    .m-icon-button.in-featured-articles.slick-next {
        right:36px
    }
}

.m-icon-button.in-recommended-articles {
    position: absolute;
    font-size: .625rem;
    width: 40px;
    height: 40px;
    top: 200px;
    z-index: 2;
    transform: translateY(-50%)
}

.m-icon-button.in-recommended-articles.slick-prev {
    left: 0
}

.m-icon-button.in-recommended-articles.slick-next {
    right: 0
}

.m-icon-button.as-load-comments {
    position: relative;
    width: 60px;
    height: 60px;
    font-size: 1.25rem;
    margin: 0 auto;
    z-index: 2
}

@media only screen and (min-width: 48rem) {
    .m-icon-button.as-load-comments {
        width:80px;
        height: 80px;
        font-size: 1.625rem
    }
}

.m-icon-button.in-share {
    color: var(--titles-color);
    font-size: .75rem;
    text-decoration: none;
    width: 31px;
    height: 31px;
    margin: 0 25px
}

@media only screen and (min-width: 64rem) {
    .m-icon-button.in-share {
        font-size:.875rem;
        width: 40px;
        height: 40px;
        margin: 0 0 20px
    }
}

@media only screen and (min-width: 80rem) {
    .m-icon-button.in-share {
        font-size:1rem;
        width: 50px;
        height: 50px
    }
}

.m-icon-button.progress {
    position: relative
}

.m-icon-button.progress svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0
}

.m-icon-button.progress svg circle {
    stroke: var(--primary-subtle-color);
    transform-origin: 50% 50%;
    transform: rotate(-90deg);
    transition: stroke-dashoffset .2s
}


.m-search {
    visibility: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    overflow-y: auto;
    z-index: 2;
    background-color: var(--transparent-background-color);
    -webkit-overflow-scrolling: touch;
    transform: scale(1.2);
    transition: all .4s cubic-bezier(.165,.84,.44,1)
}

.m-search.opened {
    visibility: visible;
    opacity: 1;
    z-index: 1000;
    transform: scale(1)
}

.m-search__content {
    padding: 80px 20px 40px;
    margin: 0 auto
}

@media only screen and (min-width: 48rem) {
    .m-search__content {
        padding-top:100px;
        padding-bottom: 50px;
        max-width: 700px
    }
}

@media only screen and (min-width: 80rem) {
    .m-search__content {
        padding-left:0;
        padding-right: 0
    }
}

@media only screen and (min-width: 90rem) {
    .m-search__content {
        max-width:800px
    }
}

.m-search__form {
    margin-bottom: 30px
}

@media only screen and (min-width: 48rem) {
    .m-search__form {
        max-width:500px;
        margin: 0 auto 45px
    }
}

.m-search-icon {
    position: absolute;
    top: 45%;
    left: 15px;
    color: #9b9b9b;
    font-size: 1rem;
    font-weight: 500;
    pointer-events: none;
    transform: translateY(-45%)
}

@media only screen and (min-width: 48rem) {
    .m-search-icon {
        font-size:1.25em;
        left: 25px
    }
}

.m-result {
    border-bottom: 1px solid var(--primary-border-color)
}

.m-result.last {
    border-bottom: 0
}

.m-result__link {
    display: block;
    width: 100%;
    height: 100%;
    padding: 10px 0
}

@media only screen and (min-width: 48rem) {
    .m-result__link {
        padding:15px 0
    }
}

.m-result__title {
    color: var(--primary-foreground-color);
    letter-spacing: .3px;
    line-height: 1.4;
    font-size: 1rem;
    font-weight: 400;
    margin: 0 0 5px
}

@media only screen and (min-width: 48rem) {
    .m-result__title {
        letter-spacing:.4px;
        font-size: 1.25rem;
        margin-bottom: 10px
    }
}

@media only screen and (min-width: 80rem) {
    .m-result__title {
        font-size:1.375rem
    }
}

.m-result__date {
    color: var(--titles-color);
    letter-spacing: .2px;
    font-size: .813rem
}

@media only screen and (min-width: 48rem) {
    .m-result__date {
        letter-spacing:.3px;
        font-size: .938rem
    }
}


*,:after,:before {
    background-repeat: no-repeat;
    box-sizing: border-box
}

.m-not-found {
    color: var(--primary-foreground-color);
    line-height: 1.3;
    font-size: .875rem;
    font-weight: 600
}

.m-not-found.in-recent-articles {
    margin-left: 20px
}

@media only screen and (min-width: 48rem) {
    .m-not-found.in-recent-articles {
        margin-left:0
    }
}

.l-post-content input,.l-post-content select,.l-post-content textarea,.m-input {
    color: var(--primary-foreground-color);
    letter-spacing: .2px;
    line-height: 1.3;
    font-size: 1rem;
    width: 100%;
    border-radius: 5px;
    padding: 11px 15px;
    border: 1px solid var(--primary-border-color);
    outline: 0;
    background-color: var(--background-color)
}

.l-post-content input.in-search,.l-post-content select.in-search,.l-post-content textarea.in-search,.m-input.in-search {
    font-weight: 600;
    padding-left: 40px
}

@media only screen and (min-width: 48rem) {
    .l-post-content input.in-search,.l-post-content select.in-search,.l-post-content textarea.in-search,.m-input.in-search {
        font-size:1.25rem;
        padding: 15px 30px 15px 60px
    }
}

.l-post-content input.in-subscribe-section,.l-post-content select.in-subscribe-section,.l-post-content textarea.in-subscribe-section,.m-input.in-subscribe-section {
    margin-bottom: 15px
}
```

CSS

Copy

- Step7: 获取content-api.min.js放入assets/js/lib目录

```shell
wget https://unpkg.com/@tryghost/content-api@1.4.1/umd/content-api.min.js assets/js/lib
```

Shell

Copy

- Step8: 在default.hbs文件加载search.css并新增搜索触发、索引、搜索代码

```html
<link rel="stylesheet" type="text/css" href="{{asset "built/search.css"}}" />

<script>
function formatDate(date) {
    if (date) {
        return new Date(date).toLocaleDateString(
            document.documentElement.lang,
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        )
    }

    return ''
}

$(document).ready(() => {
    const $body = $('body')
    const $openSearch = $('.js-open-search')
    const $closeSearch = $('.js-close-search')
    const $search = $('.js-search')
    const $inputSearch = $('.js-input-search')
    const $searchResults = $('.js-search-results')
    const $searchNoResults = $('.js-no-results')

    let flexIndexZh = null
    let flexIndexEn = null

    function trySearchFeature() {
        if (typeof ghostSearchApiKey !== 'undefined' && typeof ghostHost !== 'undefined') {
            getAllPosts(ghostHost, ghostSearchApiKey)
        } else {
            $openSearch.css('visibility', 'hidden')
            $closeSearch.remove()
            $search.remove()
        }
    }

    function toggleScrollVertical() {
        $body.toggleClass('no-scroll-y')
    }

    function getAllPosts(host, key) {
        const api = new GhostContentAPI({
            url: host,
            key,
            version: 'v2'
        })
        const allPosts = []
        const docOption = {
            doc: {
                id: "id",
                field: [
                    "title",
                    "html",
                    "custom_excerpt"
                ]
            }
        }
        const flexOptionsZh = {
            encode: false,
            tokenize: function(str){
                return str.replace(/[\x00-\x7F]/g, "").split("");
            }
        }

        const flexOptionsEn = {
            encode: 'advanced',
            tokenize: 'forward'
        }

        api.posts.browse({
            limit: 'all',
            fields: 'id, title, url, published_at, custom_excerpt, html'
        })
            .then((posts) => {
                for (var i = 0, len = posts.length; i < len; i++) {
                    allPosts.push(posts[i])
                }

                //fuse = new Fuse(allPosts, fuseOptions)

                flexIndexZh = new FlexSearch(Object.assign({}, flexOptionsZh, docOption))
                flexIndexZh.add(allPosts)

                flexIndexEn = new FlexSearch(Object.assign({}, flexOptionsEn, docOption))
                flexIndexEn.add(allPosts)
            })
            .catch((err) => {
                console.log(err)
            })

    }

    $openSearch.click(() => {
        $search.addClass('opened')
        setTimeout(() => {
            $inputSearch.focus()
        }, 400);
        toggleScrollVertical()
    })

    $closeSearch.click(() => {
        $inputSearch.blur()
        $search.removeClass('opened')
        toggleScrollVertical()
    })

    $inputSearch.keyup(() => {
        if ($inputSearch.val().length > 0 && flexIndexEn && flexIndexZh) {
            const resultsZh = flexIndexZh.search($inputSearch.val())
            const resultsEn = flexIndexEn.search($inputSearch.val())

            const results = resultsZh.concat(resultsEn)
            let htmlString = ''

            if (results.length > 0) {
                let duplicate_ids = []
                for (var i = 0, len = results.length; i < len; i++) {
                    if (results[i].id in duplicate_ids)
                        continue
                    htmlString += `
  <article class="m-result">\
    <a href="${results[i].url}" class="m-result__link">\
      <h3 class="m-result__title">${results[i].title}</h3>\
      <span class="m-result__date">${formatDate(results[i].published_at)}</span>\
    </a>\
  </article>`
                    duplicate_ids.push(results[i].id)
                }

                $searchNoResults.hide()
                $searchResults.html(htmlString)
                $searchResults.show()
            } else {
                $searchResults.html('')
                $searchResults.hide()
                $searchNoResults.show()
            }
        } else {
            $searchResults.html('')
            $searchResults.hide()
            $searchNoResults.hide()
        }
    })

    trySearchFeature()
})
</script>
```

HTML

Copy

Step9: 打包新主题并上传ghost后台

Step10: 在ghost后台传递使用content-api.min.js的关键参数
需要先在ghost后台新增自定义插件并获取content api key

```html
<script>
  const ghostHost = 'https://huhao.ai'
  const ghostSearchApiKey = 'd017b25xxxxxxx59c08f3'     //ghost后台获取的content api key
</script>
```

HTML

Copy

其他参考

- [ghost官网集成search360](https://ghost.org/tutorials/adding-search-to-a-ghost-theme/)

### 配置汉化

> 目录:` 主题名如默认主题-themes\casper

1. 在该目录下新建`locales`文件夹, 并新增zh-CN.json文件, 输入以下内容, 并将设置里面的语言换成文件名: `zh-CN`

   ```json
   {
     "More Posts": "更多内容",
     "Loading": "正在载入",
     "Page Not Found": "无法找到页面",
     "Recent Posts": "近期更新",
     "Home Page": "主页",
     "Back": "返回",
     "Subscribe": "Subscribe",
     "Subscribe to {blogtitle}": "Subscribe to {blogtitle}",
     "Subscribed!": "Subscribed!",
     "with the email address": "with the email address",
     "Email": "邮件",
     "Your email address": "你的邮件地址",
     "You've successfully subscribed to": "You've successfully subscribed to",
     "Featured Post": "加星内容",
     "Share on Twitter": "分享至Twitter",
     "Share on Facebook": "分享至Facebook",
     "Share on LinkedIn": "分享至LinkedIn",
     "Share on Pinterest": "分享至Pinterest",
     "Share via Email": "分享至邮件",
     "A collection of posts": "共有 0 篇",
     "A collection of 1 post": "共有 1 篇",
     "A collection of % posts": "共有 % 篇",
     "1 post": "1 篇",
     "% posts": "% 篇",
     "Copy link": "拷贝链接",
     "Link copied to clipboard": "链接已被拷贝至剪贴板",
     "Search": "搜索",
     "Search {blogtitle}": "搜索 {blogtitle}",
     "Type to Search": "请输入搜索内容",
     "Navigation": "导航",
     "Newsletter": "Newsletter",
     "Published with {ghostlink}": "使用{ghostlink}发布/ ",
     "You Might Be Interested In": "你可能感兴趣的内容",
     "Tags": "热门标签",
     "Advertise": "广告",
     "Comments": "评论（需翻墙）",
     "1 min read": "1 分钟读完",
     "% min read": "约 % 分钟读完",
     "See all % posts": "查看其余 % 篇"
   }
   ```

   

2. 普通的汉化, 直接可以更改hbs文件中的英文

3. 对于需要获取 `%` 作为数量统计的部分要使用对于语言替换的, 要做语法特殊处理

   ```html
   <footer class="read-next-card-footer">
       <a href="{{#../primary_tag}}{{url}}{{/../primary_tag}}">{{plural meta.pagination.total empty='No
           posts' singular='% post' plural=(t 'See all % posts')}}
           →</a>
   </footer>
   < !-- 首先对要进行处理的文字段加上{{}}
   然后再具体的文字部位用(t ****)来进行国际化处理~ -- >
   ```

   4. 然后一个个替换就可以了



### 配置文章目录

> [点击直达](https://huhao.ai/ghost-casper-theme-commets-search-toc-highlight/#-)

### 语法高亮

>  **核心**: 引入 `Prismjs` 下载的 js 和 css 代码引入, 然后插入以下代码即可

```html
<!--在Header中微调字体大小-->
<style>
    pre[class*=language-] {
        margin: 1.75em 0;
        font-size: 1.4rem;
    }
</style>

<!--在Footer中调整pre样式，增加line-numbers样式-->
<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        document.querySelectorAll('pre[class*=language-]').forEach(function(node) {
            node.classList.add('line-numbers');
		});
        Prism.highlightAll();
    });
</script>
```



###  根据上述博文配置会遇到几个问题, 特此记录

1. 代码块在移动端下会有显示 bug , 需要自己修改一下 css , 长度 100%

   ```css
   /* 注释掉prism.css文件下的如下属性 */
   div.code-toolbar {
       /*添加 width 100*/
       	width: 100%;
   
   }
   ```

   ![](https://raw.githubusercontent.com/mannixchan/Pics/master/img/20210309080612.png)

2. 点击搜索之后, 弹出来的搜索框, 会有被背景图遮挡一会儿的 bug, 貌似这个和搜索框的 `css transition` 属性有关系, 没想到怎么解决, 但是禁用了该 `css` 属性, 虽然跳出来有点生硬, 但是比之前好一些

   ```css
   /* 注释掉search.css文件下的如下属性 */
   .m-search {
   transition: all .4s cubic-bezier(.165,.84,.44,1);
   }
   ```

   ![image-20210309080254158](https://raw.githubusercontent.com/mannixchan/Pics/master/img/image-20210309080254158.png)



## 总结

有时间, 想把自己博客定制的很漂亮的话, 还是需要好好研究一下 `ghost` 官方文档

官网链接 [ghost](https://ghost.org/docs/),

感谢以上收录的两个作者, 让我博客搭建的前所未有的顺利~