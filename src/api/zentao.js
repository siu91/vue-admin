import request from '@/utils/request'

export function ztProductList(data) {
  return request({
    url: '/v1/api/zentao/products',
    method: 'get'
  })
}

export function ztProductProjectList(productId) {
  return request({
    url: '/v1/api/zentao/' + productId + '/projects',
    method: 'get'
  })
}
