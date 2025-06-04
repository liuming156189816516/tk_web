import request from '@/utils/request'

// 获取
export const getTaskConfigApi = (params) => {
  return request({
    url: '/taskconfig/gettaskconfiginfo',
    method: 'post',
    data: params
  })
}

// 获取
export const editTaskConfigApi = (params) => {
  return request({
    url: '/taskconfig/dotaskconfiginfo',
    method: 'post',
    data: params
  })
}
