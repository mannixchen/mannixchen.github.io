// 分支切换与cleanup
/**
 * 解决的问题: 
 * - 某些条件下无需使用时候, deps 无需连接副作用函数, 比如, 在我不需要渲染 text 的时候, 在改变text时候, 也会对副作用函数产生额外的计算
 * 解决的方案:
 * - cleanup: 在每次执行副作用函数的时候, 先清空该副作用函数所有的引用依赖 deps, 然后在执行该副作用函数时候, 重新计算(自动添加)引用关系, 就不用担心无效的引用关系
 */
let activeEffect // 表示当前激活的副作用函数
const bucket = new WeakMap() // 容器需要是一个弱Map, 解决引用问题
const data = {
  ok: true,
  text: 'morning chen'
}
function cleanup(effectFn) {
  for(let i = 0, l = effectFn.deps.length; i < l; i++) {
    // 把依赖集合清空
    effectFn.deps[i].delete(effectFn)
  }
  effectFn.deps.length = 0
}
// 注册函数
function effect (fn) {
  const effectFn = () => {
    console.log('excute effect function.....')
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}
function track (target, key) {
  console.log('excute get fn....')
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
  activeEffect.deps.push(effectSet)
}
function trigger(target, key) {
  console.log('excute set fn....')
  let depsMap = bucket.get(target)
  if(!depsMap) return
  let effects = depsMap.get(key)
  effects && effects.forEach(fn => {
    console.log('foreach....', effects, depsMap)
    fn()
  })
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
  document.body.innerHTML = obj.ok ? obj.text : 'not'
})
window.obj = obj
