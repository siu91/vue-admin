import request from '@/utils/request'

export function gitlabProjectList() {
  return request({
    url: '/v1/api/gitlab/projects',
    method: 'get'
  })
}
