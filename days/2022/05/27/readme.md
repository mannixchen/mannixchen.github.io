# 

```sql



select teacher_id  teacherbanana, teacher_name  name1 from teacher_table ;
# 列别名和表别名
select teacher_id + 5 myId, teacher_name 老师名 from teacher_table t;

# 在多列间使用运算符
select teacher_id + 5 MYID , concat(teacher_name, teacher_id) 老师名 
from teacher_table
where teacher_id * 2 > 3;

# 不出现列名的情况
select 5+4 
from teacher_table
where 2 < 9;

select 5 + 4 from dual;

# 使用 distinc 去除重复行
select distinct student_name, java_teacher
from student_table;

# 比较运算符 -> >, >=, <, <=, = (相等), <> (不相等)
# 赋值运算符 -> :=

# in 比较运算符
select * 
from student_table 
where 2 in (student_id, java_teacher);

# between 
select * from student_table 
where student_id between 2 and 4;

select * from student_table 
where 2 between java_teacher and student_id;

# 使用 like 进行模糊索索
SELECT * FROM student_table
WHERE student_name LIKE '张_';

SELECT * FROM student_table
WHERE student_name LIKE '张%';

# 转义 _
SELECT * FROM student_table
WHERE student_name LIKE '\_%';

# 转义 \ mysql 没法 使用 escape 显式转义
SELECT * FROM student_table
WHERE student_name LIKE '\_%' 

# is null 测试是否为 null
select * from student_table
where student_name is null;
```

