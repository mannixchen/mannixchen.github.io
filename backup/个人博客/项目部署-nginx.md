# Nginx

> 高并发, 占用更少的内存和资源, 善于处理静态文件
>
> 配置简单(nginx.conf), 运行简单

#### 安装

......

```js
--ubuntu
apt install nginx
--判断是否安装成功
nginx -v
--三个常用目录
1.etc/nginx
2./var/log/nginx 日志目录
3. /usr/share/nginx/html/ 默认首页目录

常用操作内容:
1. nginx/conf.d 	// 配置文件目录
2. nginx/nginx.conf // 全局配置文件 -> 通过inclue导入配置文件 include /etc/nginx/conf.d/*.conf;





```

 

#### 远程连接配置文件

>  vscode为例

```js
1. 安装SFTP 插件
2. 控制面板-> 输入sftp
3. 自动生成文件进行配置
4. 右键downloadfolder
```

![](https://raw.githubusercontent.com/mannixchan/Pics/master/img/20210228162439.png)

> 连接完就可以在vscode中进行文本编辑



#### nginx配置段

```nginx
user -用户名
worker_processes -多进程
pid -指定进程号的
events {
    worker_conection: -最多连接数
}
http {
     -可以导入server配置段内容
        server {
        listen 80 -必填
        server_name: -给你的监听的服务命名一个名字, 也可以不指定
        location / { -匹配规则
            root /etc/nginx/html; -指定文件目录
            index index.html; -指定返回的首页文件
        }
    }
}
-一般我们在conf.d中进行server配置

```

![](https://raw.githubusercontent.com/mannixchan/Pics/master/img/http-Nginx-http-conf.png)

```js
nginx -t //测试nginx是否测试通过
nginx -s reload // nginx重载

```

####  nginx路径匹配优先级

```nginx
# 通用匹配
location / {
    return 400; -返回状态码
}
# 精确匹配 优先级最高***
location = / {
	return 400;
}
# 优先匹配 优先级别第二**
location ~ / {
    return 402;
}
```



#### try_files 和return的使用区别

```nginx
# try_files 对根路径匹配无效
location /a { 
    #try_files 无法处理根路径
    try_files $uri $uri/ =400;
}
# try_files 配合@使用 
location /a { 
    #try_files 无法处理根路径
    try_files $uri $uri/ @meiduo;
}
location @meiduo {
    return 402;
}
#return 使用跳转
location / {
    return 302 http://www.baidu.com;  -return 重定向
}
```

#### 匹配路径后面的斜杠问题

```nginx
location /a { #没有斜杠  ip/a && ip/a/都可以访问
    return 400;  
}
location /a/ #加了斜杠  ip/a 不可以访问
```

#### root和alias使用和区别

```nginx

#根路径
location / {
    root /etc/nginx/html
    # 如果指定目录下, 会自动加载index.html
    # 如果想指定其他文件, 添加index属性
    index 8000.html
}

location / {
    alias /etc/nginx/html/
    # alias后面需要加上斜杠
}
#指定路径
location /a {
    root /etc/nginx/html
    # 是无法默认加载指定路径下的index.html
}

location /a {
    alias /etc/nginx/html
    # alias可以默认访问到路径下的index.html
}
```

#### 访问权限控制

```nginx
# 我允许指定客户端来访问我
location / {
    stub_status on; # 返回nginx的状态信息
    allow 10.211.55.30; # 指定哪个ip的客户端访问 
    deny all; # 除了允许的其他都拒绝
}
```

#### 目录下载控制

```nginx
location /download {
    alias /etc/nginx;
    autoindex on; #开启目录下载服务
    
}
```



#### 反向代理的使用

> 可以隐藏服务器ip

`举个例子: `请求域名的80端口, 此时nginx再把请求转发到了8000端口

```js
# proxy.conf
server {
    listen ip:80
    location / {
        proxy_pass http://ip:8000; # 用户访问80, 此时代理给了8000, 让下面的8000端口来处理
    }
}
server {
    listen ip: 8000;
    location / {
      root /etc/nginx/html;
      index 8000.html
    }
}
```



#### 负载均衡的使用

```nginx
#负载均衡的启用
upstream name {
    #默认是轮询
    server ip:8000;
    server ip:8001;
    server ip:8002;
    #加权轮询
    server ip:8000 weight=1;
    server ip:8001 weight=2;
    server ip:8002 weight=3; #权重越大, 出现的机率越高, 数字越大权重越大
    # ip_hash
    #第一次请求的时候, 会分配一个服务端ip, 以后的所有请求都是用第一次的服务ip
    ip_hash; #开通ip_hash访问 
    server ip:8000 ;
    server ip:8001 ;
    server ip:8002 ;
}
server {
    listen 80;
    location / {
        proxy_pass http://upstream-name 
    }
}
# 代理为upstream, 可以解决负载均衡的问题, 访问http://upstream-name分流访问指定的server, 释放服务器压力(默认是轮询的方法-一个个来)
```

#### 日志使用

> `/var/log/nginx`

`定制日志内容`: nginx.conf

配置日志格式使用的是`log_format`属性

![](https://raw.githubusercontent.com/mannixchan/Pics/master/img/20210301125118.png)

![带准确ip日志详细配置](https://raw.githubusercontent.com/mannixchan/Pics/master/img/20210301125410.png)

```nginx
#logging setting
#需求: 在转发时候携带上真实ip地址, 需要在转发时候把地址放到header里面
```

![](https://raw.githubusercontent.com/mannixchan/Pics/master/img/20210228181731.png)

![](https://raw.githubusercontent.com/mannixchan/Pics/master/img/20210228182047.png)





#### 部署实践

> 重定向到其他网站

```nginx
        location / {
            return 302 http://www.baidu.com;
        }
```

> 在服务器配置了多个服务, 想通过不同网址后缀, 访问不同的服务

```nginx
        listen 8000;
		location /sell {
            proxy_pass http://127.0.0.1:8010;
        }
        location /music {
            proxy_pass http://127.0.0.1:8020;
        }
#想通过-网址/sell -网址/music访问到不同的项目, 静态文件地址, 并且反向代理到其他端口
    server {
        listen 8020;
        location /music {
            alias /root/www/vueMusci;
        }
#此时访问8000/music, 就会转发到8020/music, 注意转发的时候会带着/music一起转发, 所以配置8020要带着/music
#注意-root和alias的用法
    #exeample
        server {
        listen 8020;
        location /music {
            alias /root/www/vueMusci; #此时会默认寻找/root/www/vueMusci下的index.html
        }
        
         server {
        listen 8020;
        location /music {
            root /root/www/vueMusci; #会寻找/root/www/vueMusci/music下的index.html, root会拼接location觉得地址
        }
    # 所以一般/...一般使用alias, 除了根目录都用alias
```

