export function filterAsyncRouter(asyncRouterMap) {
  if (!asyncRouterMap) return []

  function _iter(before) {
    const after = Object.assign({}, before)
    if (after.component) {
      //   after.component = import('@/layout/' + after.component + '.vue')
      after.component = require('@/views/' + after.component + '.vue').default
    }
    if (after.children && after.children.length > 0) {
      after.children = filterAsyncRouter(after.children)
    }
    return after
  }

  return asyncRouterMap.map(_iter)
}
