import request from '@/utils/request'

// 上传
export const uploadSliceFileApi = (params) => {
  return request({
    url: '/demo/uploadchunk',
    method: 'post',
    data: params,
    type: 'demo'
  })
}

// 合并
export const mergeFragmentFileApi = (params) => {
  return request({
    url: '/demo/mergechunks',
    method: 'post',
    data: params,
    type: 'demo'
  })
}
