## JDBC

1. mysql 默认地址`/usr/local/mysql/bin/mysql -u root -p`
2. 两种存储机制, 其中`InnoDB` 增加了事务的支持. 这也是默认机制.

> jdbc 是java 提供的一套接口, 而各个数据库厂商, 根据解决自行实现驱动, 其模仿了odbc 的设计



## SQL

可以使用标准sql语句进行数据库操作, 其是所有关系数据库都通用的命令语句



DBA: database admin数据库管理员

SQL 语句的关键字不区分大小写

区分以下几种语句

1. 查询语句, 最复杂最丰富
2. DML data manipulation language
3. DDL data definition language
4. DCL data control language - 一般进行用户授权等操作只由 dba 进行控制管理
5. 事务控制语句

### DDL

> 进行创建, 删除, 修改数据库对象的操作

`数据表` 是存储数据的逻辑单元,  但不是唯一的数据库对象, 还包括

1. 表
2. 数据字典
3. 约束
4. 视图
5. 索引
6. 函数
7. 存储过程
8. 触发器



DDL 语句



create 创建表(创建列, 使用子查询, 在建表的同时插入子表一样的数据)

alter 修改表(添加列, 修改列, 删除列, 重命名表, 替换新列(change))

drop 删除表

truncate 表, 截断表