# Hello World

for file in \_posts/\*; do
echo $file
last_change=$(git log -1 --pretty="format:%ct" --date=short $file)
echo $last_change
done
