let activeEffect // 表示当前激活的副作用函数
const bucket = new WeakMap() // 容器需要是一个弱Map, 解决引用问题
const data = {
  age: 11
}
// 注册函数
function effect (fn) {
  activeEffect = fn
  fn()
}
function track (target, key) {
  if(!activeEffect) return
  let depsMap = bucket.get(target)
  if(!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let effectSet = depsMap[key]
  if(!effectSet) {
    depsMap.set(key, (effectSet = new Set()))
  }
  effectSet.add(activeEffect)
}
function trigger(target, key) {
  let dep = bucket.get(target)
  if(!dep) return
  let keySet = dep.get(key)
  keySet && keySet.forEach(fn => fn())
}
const obj = new Proxy(data, {
  get: function (target, key) {
    track(target, key)
    return target[key]
  },
  set: function(target, key, value) {
    target[key] = value
    trigger(target,key)
    
  }
})

effect(() => {
  document.body.innerHTML = obj.age
  console.log("🚀 ~ file: demo.js ~ line 44 ~ effect ~ innerHTML")
})
setTimeout(() => {
  obj.age = 800
}, 1000)
