### 添加 `keyword`

<img src="http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220823132016159.png" alt="image-20220823132016159" style="zoom: 50%;" />

快捷键: `CMD+K`

### 节奏卡点

可以选中音频轨道, 根据音乐节奏, 直接用 `M` 在轨道上打标记, 方便卡点

### 关键帧

通过 `opt + k` 可以在当前轨道上添加关键帧

### 卸载多余插件

https://zhuanlan.zhihu.com/p/87309977



### 看入门视频-总结

[连接](https://www.youtube.com/watch?v=3pGGTkeazH0)

#### 项目解构

项目结构 **资源库 -> 事件 -> 项目**

<img src="http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220827224848156.png" alt="image-20220827224848156" style="zoom: 33%;" />

<img src="http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220827225001209.png" alt="image-20220827225001209" style="zoom: 25%;" />



#### 用 image capture 整理素材, 导入

1. 把文件保存在原位置, 将节省更多的应用空间
2. 注意关键词选项, 导入时候可以根据文件夹目录进行整理
3. 关于转码, 转码本身会浪费许多时间, 根据卡顿情况进行转码代理



### 剪辑常见操作

1. 出入点选择

   1. 鼠标选择
   2. `i`: 入点, `o` 出点
   3. 取消选择: `opt+x`

2. 浏览素材

   1. 鼠标
   2. `L`: 向前, `K`: 暂停, `J`: 后退
   3. 左右键可以按照每一帧进行移动, 辅助`shift` 可以多帧移动

3. 添加静帧

   1. `shift+h`

4. 添加空隙用来吸附音乐 `opt+w`

   1. ![image-20220828103402357](http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220828103402357.png)
   2. ![image-20220828103158044](http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220828103158044.png)

5. 不要默认粘贴到主时间线, 可以使用: `opt + v`

6. 取消已经选择的出入点: `opt+x`

7. 将片段从故事情节提取, 以致不影响当前时间线 `opt+cmd+↑`

8. 时间线复制素材

   1. `opt+拖拽`直接复制到指定位置

9. 复制粘贴属性

   1. 在 Final Cut Pro [时间线](https://support.apple.com/zh-cn/guide/final-cut-pro/aside/ver4cdefe82/10.6.2/mac/11.5.1)中[选择](https://support.apple.com/zh-cn/guide/final-cut-pro/aside/verb97d0afe/10.6.2/mac/11.5.1)一个片段，然后选取“编辑”>“拷贝”（或按下 Command-C）。

   2. 选择要应用属性的片段，然后选取“编辑”>“粘贴属性”（或按下 Shift-Command-V）。

10. 添加片段

   `QWED` 分别是第二视频轨道, 中间插入, 末尾插入, 在主轨道覆盖, `qwe` 更加常用

11. ![image-20220827234351758](http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220827234351758.png)

12. ![image-20220827234807050](http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220827234807050.png)

13. 裁剪片段的方法:

    1. `b` 切割删除
    2. 用`,` `shift+,` 向左还原/缩短片段, 用 `.` `shift+.`向右缩减/还原片段
    3. **按下`b`不立马松开, 切割完再松开, 或者按`cmd+b`**
    4. 用r按住不松, 然后delete删除
    5. 定位好播放头, 用 `opt+[` 就能快速删除片段左边的部分
    6. 连接片段和主时间线片段解耦删除: `opt+cmd+del`

    #### 速度变化 `ctrl+r`

    1. 切割变速区域 `shift + b`

    

    

    

    #### 按住`~` 取消时间线和辅助素材的吸附功能

    #### 上面有白色边线, 可以手动选 modify -> render selection渲染片段, 

    不卡就不用使用了

    **播放** 有个后台渲染选项, 大多数人关闭即可

    ![image-20220828000434799](http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220828000434799.png)

    因为, 每次用光标移动素材打断渲染导致卡顿, 系统cpu调度问题

#### 剪辑完成后删除渲染和代理文件, 减少硬盘占有

文件 -> 删除生成的资源库文档

#### 恰到好处的时间线: `shift+z`

#### 音频两端有个点可以调节声音渐变

![](http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220828000935632.png)

#### 声音控制在 -6 - 0 比较好



#### 字幕

1. `ctrl + t`添加常用字幕
2. `q` `shift+q` 在光标左右添加字幕
3. `r`选中区间, 再接`q`添加精准字幕
4. 换行回车, 退出编辑 `cmd` + 回车
5. 日常字幕可以**使用剪映来生成免费的字幕**



#### 录音

录音就用mac录音, 然后用一键优化就可以了

#### 转场

`cmd+t` 添加默认转场



#### 导出

可以选默认-> 导出为电脑 -> 就是mp4格式的导出了



#### **多视频对齐**

![image-20220904130827345](http://bucket-picbed.oss-cn-shanghai.aliyuncs.com/img/image-20220904130827345.png)







## 调色

1. movies > movie templates -> 放入图层(白平衡+风格纠正)
2. 打开cmd+7, 示波器, 选择 waveform + luma
3. 曝光调整黑色拉倒0, 高光拉倒100超一点
4. 整体风格调整, 比如偏暖或偏冷, 用全局调色, 进行全局色温调整, 已经开始引领风格
5. 随后进行风格调色
   1. 调高饱和度, 然后降低肤色的饱和度
   2. 先提升你想强调的颜色(低和中), 然后通过高光和全局来平衡吊绿色或者品红
   3. 这样就可以创造自己的风格
6. 