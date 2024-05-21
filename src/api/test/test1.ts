import request from '@/lib/request';

export default {
  time() {
    return request({
      url: '/api/test/00',
      method: 'get',
    });
  },
};
