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

export function changePassword(data) {
  return request({
    url: '/v1/api/password',
    method: 'post',
    data
  })
}

export function usePageList(data) {
  return request({
    url: '/v1/api/users',
    method: 'post',
    data
  })
}
