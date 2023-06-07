const set = new Set([1])
set.forEach(item => {
  set.delete(1)
  set.add(1)
  console.log('遍历中...')
})
