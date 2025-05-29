import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/marketlaunchtask/getmarketlaunchtasklist',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailListApi = (params) => {
  return request({
    url: '/marketlaunchtask/getmarketlaunchtaskinfolist',
    method: 'post',
    data: params
  })
}

// 新建
export const addEditDataApi = (params) => {
  return request({
    url: '/marketlaunchtask/domarketlaunchtask',
    method: 'post',
    data: params
  })
}
