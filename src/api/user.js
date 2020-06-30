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

export function updateUser(data) {
  return request({
    url: '/v1/api/users/' + data.id,
    method: 'put',
    data
  })
}

export function register(data) {
  return request({
    url: '/v1/api/register',
    method: 'post',
    data
  })
}

export function accessToken() {
  return request({
    url: '/v1/api/accesstoken',
    method: 'get'
  })
}
