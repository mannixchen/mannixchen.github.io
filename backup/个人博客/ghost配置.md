# ghost博客配置

## ghost汉化

> `目录:` 主题名如默认主题-themes\casper

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



## ghost 添加搜索功能



