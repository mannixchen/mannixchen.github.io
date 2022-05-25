## 数据库约束

1. NOT NULL
2. UNIQUE
3. PRIMARY KEY
4. FOREIGN KEY
5. CHECK (在 mysql 中此约束无效)



### not null

1. sql null, 不区分大小写
2. 所有数据类型都可以是 null



### unique

> 唯一约束, 列不可以出现重复值, 但是可以出现多个 null

1. 创建 unique 列的时候, 会相应的创建唯一索引
2. 如果要为 **多列** 建立唯一约束, 或者为唯一约束指定约束名, 就只能用表级约束语法
   1. 表级约束语法通常以 constraint 开头, 约束名随后, 在后面接约束的定义
3. 可以为多列建立唯一约束组用圆括号括起来
4. **删除** 约束, mysql 用的是 `drop index 约束名` 语法





### primary key

> 相当于非空 + 唯一

1. mysql 总是将主键约束名定位 `PRIMARY`
2. 建立主键约束使用 primary key 关键字
3. **删除** 可以用 `drop primary key` 关键字
4. 使用 add 添加主键约束
5. 通常搭配使用 `auto_increment`实现自增



### foreign key

1. 通常用于保证一个或两个数据表之间的参照完整性
2. 应该使用表级约束语法建立外键约束
3. 使用 references 关键词建立引用





## 索引

是存放在 模式(schema) 中的一个数据库对象.  其可以独立存放, 但是不可独立存在, 必须从属于一个数据表, 可以通过快速路径访问方法, 从而减少磁盘 i/o





## 视图

一种数据的逻辑显示, 而视图的本质, 其实就是被命名的sql查询语句



## dml语句

1. insert into
2. update
3. delete from





## 单表查询

1. select column1, colomn2 from 数据源 [where condition]
2. 数据列可以作为变量直接进行运算
3. distinct 可以去除后面字段组合的重复值