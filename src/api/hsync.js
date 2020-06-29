import request from '@/utils/request'

export function connectProject(data) {
  return request({
    url: '/v1/syncs',
    method: 'post',
    data
  })
}
