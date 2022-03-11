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
  // 要将副作用函数从对应key 的依赖集合中去掉
  effectFn.deps.forEach(deps => {
    deps.delete(effectFn)
  })
  effectFn.deps.length = 0
}
// 注册函数
function effect (fn) {
  // 1. 创建一个副作用函数(直接或间接影响到其他函数的执行, 比如改变了一个全局变量)
  const effectFn = () => {
    console.log("🚀 ~ file: demo.js ~ line 28 ~ effectFn ~ effectFn")
    // 每次调用副作用函数, 都会先清理 副作用函数.deps 中存放的依赖集合
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  // deps用来收集
  effectFn.deps = []
  effectFn()
}
function track (target, key) {
  if(!activeEffect) return
  let depsMap = bucket.get(target)
  if(!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  // deps 为依赖集合(副作用函数)
  let deps = depsMap[key]
  if(!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  // 副作用函数的 deps (effectFn.deps)收集了跟他有关系的依赖集合, 也就是说, 依赖集合收集 effectFn, 同时 effectFn.deps 也收集着依赖结合
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}
function trigger(target, key) {
  let depsMap = bucket.get(target)
  if(!depsMap) return
  let effectSet = depsMap.get(key)
  effectSet && effectSet.forEach(fn => fn())
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
