import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/api/auth',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/v1/api/userinfos',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/v1/api/signout',
    method: 'get'
  })
}
