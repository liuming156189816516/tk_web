import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/material/getmaterialcollectortasklist',
    method: 'post',
    data: params
  })
}

// 新建 编辑 删除
export const addEditDataApi = (params) => {
  return request({
    url: '/material/domaterialcollectortask',
    method: 'post',
    data: params
  })
}

// 批量关闭
export const batchCloseDataApi = (params) => {
  return request({
    url: '/material/batchclosematerialcollectortask',
    method: 'post',
    data: params
  })
}

// 批量去重
export const batchSortDataApi = (params) => {
  return request({
    url: '/material/batchdedupmaterialcollectortask',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailListApi = (params) => {
  return request({
    url: '/material/getmaterialcollectortaskinfolist',
    method: 'post',
    data: params
  })
}

// 账号分组列表
export const getAccountGroupApi = (params) => {
  return request({
    url: '/marketlaunchtask/getgrouplist',
    method: 'post',
    data: params
  })
}

// 导入素材库
export const saveMaterialDataApi = (params) => {
  return request({
    url: '/material/savededupvideotomaterial',
    method: 'post',
    data: params
  })
}
