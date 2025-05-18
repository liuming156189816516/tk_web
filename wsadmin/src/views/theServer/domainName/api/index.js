import request from '@/utils/request'

// 素材-列表
export const getDataApi = (params) => {
  return request({
    url: '/domain/getdomainlist',
    method: 'post',
    data: params
  })
}
