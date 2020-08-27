import request from '@/utils/request' // 引入请求方法
// ========================== 语音播报模板  ==============================
// 查询模板列表
export function queryTemplateList(query) {
  return request({
    url: '/broad/manage/queryBroadCast',
    method: 'post',
    data: query
  })
}
// 新增模板
export function createTemplate(data) {
  return request({
    url: '/broad/manage/save',
    method: 'post',
    data
  })
}
// 获取语音模板类型
export function getsubType(data) {
  return request({
    url: '/sys/dict/selectDictList',
    method: 'post',
    data
  })
}
// 删除模板
export function deleteTemplate(data) {
  return request({
    url: '/broad/manage/delete/' + data,
    method: 'post'
  })
}
// 删除多个模板
export function deleteSomeTemplate(data) {
  return request({
    url: '/broad/manage/deleteBatch',
    method: 'post',
    data
  })
}
// 查看信息
export function seeTemplateInfo(data) {
  return request({
    url: '/broad/manage/listDetail?id=' + data,
    method: 'post'
  })
}
// 修改内容
export function updateTemplateInfo(data) {
  return request({
    url: '/broad/manage/update',
    method: 'post',
    data
  })
}
// ========================== 收费规则  ==============================
// 查询模板列表
export function queryRulesList(data) {
  return request({
    url: '/park/billRules/query',
    method: 'post',
    data
  })
}
