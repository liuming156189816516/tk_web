// 上传文件
import request from '@/utils/request';

export const uploadFileApi = (params) => {
  return request({
    url: '/material/upload',
    method: 'post',
    data: params
  })
}
