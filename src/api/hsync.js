import request from '@/utils/request'

export function connectProject(data) {
  return request({
    url: '/v1/syncs',
    method: 'post',
    data
  })
}

export function syncList(data) {
  return request({
    url: '/v1/syncs/page',
    method: 'post',
    data
  })
}

export function deleteSync(id) {
  return request({
    url: '/v1/syncs/' + id,
    method: 'delete'
  })
}

export function updateSync(data) {
  return request({
    url: '/v1/syncs/' + data.id,
    method: 'put',
    data
  })
}
