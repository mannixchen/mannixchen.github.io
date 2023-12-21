# 本地 git 仓同步到 github 新库
要将现有的本地Git项目同步到GitHub作为一个新仓库，可以按照以下步骤操作：

1. **在GitHub上创建新仓库**：
    - 登录GitHub，点击右上角的 "+" 图标，选择“New repository”。
    - 填写仓库名称、描述，并选择公开或私有仓库，然后点击“Create repository”, 不需要任何初始化, 给个名字就行。

2. **在本地项目中初始化Git（如果尚未初始化）**：
    - 打开终端（或命令提示符），切换到项目目录。
    - 输入 `git init` 初始化Git仓库。

3. **添加GitHub仓库为远程仓库**：
    - 在终端中，输入 `git remote add origin your-repository-url`，将GitHub仓库URL替换成你刚创建的仓库的URL。
    - 我这里 url 是:`git@github.com:mannixchen/react-ecosystem-learn.git` 本地已经配好 ssh
4. **添加、提交并推送本地更改**：
    - 输入 `git add .` 添加所有更改。
    - 输入 `git commit -m "Initial commit"` 提交更改。
    - 输入 `git push -u origin main`（或 `master`，取决于你的默认分支名）将更改推送到GitHub仓库。我这边是 main

完成这些步骤后，你的本地项目就会作为一个新仓库出现在GitHub上。


# 拉取新的仓库

1. **打开终端**（在Windows上是命令提示符或Git Bash）。

2. **定位到你想放置项目的目录**。使用`cd`命令来改变当前目录。

3. **执行克隆命令**。输入命令 `git clone [repository URL]`，其中 `[repository URL]` 是你想克隆的GitHub仓库的URL。例如：

   ```
   git clone https://github.com/example-user/example-repo.git
   ```

   这会创建一个包含GitHub仓库所有内容的新目录。

4. **进入项目目录**。克隆完成后，进入新创建的项目目录：

   ```
   cd example-repo
   ```

确保你已安装Git并有访问GitHub仓库的权限。如果仓库是私有的，你可能需要输入GitHub的用户名和密码或使用SSH密钥。

