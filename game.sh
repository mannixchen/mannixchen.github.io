

          for file in _posts/*; do
            echo "Processing file: $file"
            pretty_name=$(basename "$file")
            url_name=$(basename "$file" | sed 's/ /%20/g')
            lastDate=$(git log -1 --format="%ad" --date=short -- $url_name)
            echo "1 $lastDate"
          done


do
            echo " $(git log -1 --format="%ad" --date=short -- _posts/Hello Web.md) $(git log -1 --format="%ad" --date=short -- $pretty_name)"
done