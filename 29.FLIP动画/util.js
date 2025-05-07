/**
 * 详解请看：https://zhuanlan.zhihu.com/p/712766286
 * @param {Element} target dom元素
 */
function flip(target) {
  const children = Array.from(target.children)

  // first
  const startPositions = new WeakMap()
  children.forEach(el => {
    startPositions.set(el, el.getBoundingClientRect())

    let cancelId = -1
    function update() {
      startPositions.set(el, el.getBoundingClientRect())
      cancelId = requestAnimationFrame(update)
    }

    el.addEventListener('transitionstart', () => { cancelId = requestAnimationFrame(update) })
    el.addEventListener('transitionend', () => void cancelAnimationFrame(cancelId))
    el.addEventListener('transitioncancel', () => void cancelAnimationFrame(cancelId))
  })

  // 如果是增加元素，它会有 addedNodes 属性数组表示被加入容器的元素；
  // 如果是移除元素，它会有 removedNodes 属性数组表示被移除的元素
  const observer = new MutationObserver(domList => {
    const newElements = domList.map(item => Array.from(item.addedNodes))
      .reduce((result, subList) => result.concat(subList), [])

      newElements.forEach(el => {
        // Last: 记录每个元素的最终位置
        const end = el.getBoundingClientRect()
        const start = startPositions.get(el)

        // Invert: 计算 “反向” 偏移量
        const deltaX = start.left - end.left
        const deltaY = start.top - end.top

        // 此时，需要更新元素的位置，设置到 startPositions 里面
        startPositions.set(el, end)

        // 如果元素 “原地不动”，那么跳过后续流程
        if (deltaX === 0 && deltaY === 0) {
          return
        }

        el.style.transition = null
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`

        // Play: 播放动画应用变换
        requestAnimationFrame(() => {
          el.style.transition = `transform 1s`
          el.style.transform = ''
        })

        el.addEventListener('transitionend', () => {
          el.style.transition = null
          el.style.transform = null
        }, { once: true })
      })
  })

  observer.observe(target, { childList: true })
}