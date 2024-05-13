---
title: Mac 环境中 Intellij IDEA 快捷键的整理
description: 花三个小时整理一下快捷键
date: 2024-04-13 08:37:16 +0800
comments: true
categories: [工具, IDE]
tags: [工具, 效率]
pin: true
---

# Intellij IDEA

[快捷键](jetbrains://idea/settings?name=Keymap)

读一下[官方介绍](https://www.jetbrains.com/help/idea/viewing-structure-and-hierarchy-of-the-source-code.html)



> 重要的不是快捷键本身, 而是快捷键所能代表的功能和意义(所以要详细写下按键的意义包括中文英文)。



`⌥ 按住`就会激活其他按钮, 再按一个辅助按钮就相当于激活

关于 Mac ------> Windows键盘的映射有几个规则 (其实只要记住Mac键位就好了, 记得把 `⌘ ` 改成 `Ctrl` 就能解决大部分问题了)
1. 再`Ctrl` 和 `⌘ `不同时使用的大部分情况下, 直接用`Ctrl` 代替` ⌘`, 
2. 不过有几个地方比较特殊 `⌃ + ⌘` ->` Ctrl + Shift + Alt`
	- Select **All Occurrences**: `⌃ + ⌘ + G` - `Ctrl + Shift + Alt + G`
	- 切换全屏: `⌃ + ⌘ + F` - `Ctrl + Shift + Alt + F`
	- 匹配括号Move Caret to **Matching Brace**: `⌃ + M` - `Ctrl + Alt + M` 
	- **列选择**模式: `⌘ + ⇧ + 8` - `Ctrl + Shift + Alt + 8`

## 文件

**New** scratch file: `⌘ + ⇧ + N` ------ `Ctrl + Shift + N`

Copy **path**: `⌘ + ⇧ + C` ------   `Ctrl + Shift + C`



## 界面:

切换 **tab**: `⌘ + ⇧ + [ / ]` ------ ` Ctrl + Shift + [ / ]`

切换项目窗口: `⌘ + ⌥ + Backtick`  ------  `Ctrl + Alt + Backtick`

**Project**: `⌘ + 1` ------ `Alt + 1`

Bookmark: `⌘ + 2` ------ `Alt + 2`

**Commit**: `⌘ + 0` ------ `Alt + 0`

**Git tree**:`⌘ + 9` ------ `Alt + 9`

Structure: `⌘ + 7` ------ `Alt + 7`

Service: `⌘ + 8` ------ `Alt + 8`

Debug: `⌘ + 5` ------ `Alt + 5`

Run: `⌘ + 4` ------ `Alt + 4`

Find: `⌘ + 3` ------ `Alt + 3`

**Terminal**: `⌥ + f12` ------ `Alt + F12`

切换全屏: `⌃ + ⌘ + F` ------ `Ctrl + Alt + Shift + F`





## 编辑:

**Duplicate** line or slection复制行: `⌘ + d` ------ ` Ctrl + D`

**Join** lines合并行:  `⌃ + ⇧ + J` ------  `Ctrl + Shift + J`



Split Line 拆分行: `⌘ + ↵` ------ `Ctrl + enter`

Start **New Line** 新建行: `⇧ + ↵` ------  `Shift + enter`

Start New Line Before Current 向上新建行: `⌘ + ⌥ + ↵`;  ------ `Ctrl + Alt  + enter`



**行上下 (Line Up)**移动 `⌥ + ⇧ + ↑` ------`Alt + Shift + up`

**声明上下 (Statement Up)**移动 `⌘ + ⇧ + ↑` ------`Ctrl + Shift + up`



Add or Remove **Caret**: `⌥ + ⇧ + Click` ------ 添加鼠标光标 ------ `Alt + Shift + click`

Add **Rectangular** Selection on Mouse Drag: `⌘ + ⌥ + ⇧ + Click` ------ 可以矩形添加光标 ------  `Ctrl + Shift + Alt + click`



大小写转换: `⌘ + ⇧ + U` ------ `Ctrl + shift + U`

**Format** 代码: `⌘ + ⌥ + L` ------ `Ctrl + Alt + L`

Format file: `⌘ + ⌥ + ⇧ + L` ------ `Ctrl + Shift + Alt + L`

优化缩进: `⌃ + ⌥ + I` ------ `Ctrl + Alt + I`



## 定位

**Recent** files: `⌘ + E` ------ `Ctrl + E`

Recent location: `⌘ + ⇧ + E` ------  `Ctrl + Shift + E`

Recent changes: `⌥ + ⇧ +C` ------  `Shift + Alt + C`



Jump to **source**: `⌘ + ↓` ------ `Ctrl + down`

Jump to Navigation bar: `⌘ + ↑` ------ `Ctrl + up`



匹配括号Move Caret to **Matching Brace**: `⌃ + M` ------ `Ctrl + Alt + M` 

代码块中移动光标Caret Code Block: `⌘ + ⌥ + [ or ]` (如有选择需求加上 ⇧) ------ `Ctrl + Alt + [/]`

将光标设置为**中心**: `⌃ + L` 

定位上一次后一次编辑点(Back / Forward): `⌘ + [ / ⌘ + ]` ------ `Ctrl + [/]`

折叠和展开当前代码块 (Fold / Expand): `⌘ + ------ / ⌘ + =`  ------  `Ctrl + ------/+`



## 选择:

Find Next / Move to Next Occurrence: `⌘ + G`  ------ `Ctrl + G`

Find Previous / Move to Previous Occurrence: `⌘ + ⇧ + G` ------ `Shift + Alt +G`

Select **All Occurrences**: `⌃ + ⌘ + G` ------ `Ctrl + Shift + Alt + G`

Add Selection for **Next Occurrence**: `⌃ + G`  ------ `Ctrl + G`

Unselect Occurrence: `⌃ + ⇧ + G` ------ `Ctrl + Shift + G`



利用鼠标多选: `⌥ + ⇧ + Double Clik` ------ `Shift + Alt + click`



**列选择**模式: `⌘ + ⇧ + 8` ------ `Ctrl + Shift + Alt + 8`



**扩展选择**: `⌥ + ↑` 反向: `⌥ + ↓` ------ `same`

**Select In**: `⌥ + F1` (将文件在不同的场景下打开, 如: Finder, Terminal, Project View 等) ------ `same`



**File Path (Reveal in Finder)**: `⌘ + ⌥ + F12` ------ `Ctrl + Alt + F12`



## 搜索: 

Find ⌘ + F 全局搜索: `⌘ + ⇧ + F`

Replace: `⌘ + R`

搜索类名 Class: `⌘ + O`

搜索文件名 Files: `⌘ + ⇧ + O`

搜索 Symbols: `⌘ + ⌥ + O`

搜索 Actions: `⌘ + ⇧ + A`

搜索所有: `Double ⇧`

搜索**被引用的地方** (Find Usage) : `⌥ + F7`

## Git:

Git popup: `⌃ + V`

**Commit**: `⌘ + k`

**Update**: `⌘ + t`

Rollback: `⌘ + ⌥ + Z`

**Push**: `⌘ + ⇧ + k`

**下一处(Next Diff)**: `F7`



## 智能:

Find usage in file: `⌘ + F7`

**完成**当前声明: `⌘ + ⇧ + ↵`
