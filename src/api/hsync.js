import request from '@/utils/request'

export function connectProduct(data) {
  return request({
    url: '/v1/syncproducts',
    method: 'post',
    data
  })
}

export function syncProudctList(data) {
  return request({
    url: '/v1/syncproducts/page',
    method: 'post',
    data
  })
}

export function updateProductSync(data) {
  return request({
    url: '/v1/syncproducts/' + data.id,
    method: 'put',
    data
  })
}

export function deleteProductSync(id) {
  return request({
    url: '/v1/syncproducts/' + id,
    method: 'delete'
  })
}

export function syncProjectList(data) {
  return request({
    url: '/v1/syncprojects/page',
    method: 'post',
    data
  })
}

export function updateProjectSync(data) {
  return request({
    url: '/v1/syncprojects/' + data.id,
    method: 'put',
    data
  })
}

export function deleteProjectSync(id) {
  return request({
    url: '/v1/syncprojects/' + id,
    method: 'delete'
  })
}
