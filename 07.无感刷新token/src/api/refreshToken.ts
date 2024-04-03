import request from './request';
import { getRefreshToken } from './token';

// 等待刷新后，其他的请求在执行
let promise: Promise<any> | null = null;

export async function refreshToken() {
  if (promise) return promise;
  promise = new Promise(async (resolve) => {
    const resp = await request.get('/refresh_token', {
      headers: {
        Authorization: `Bearer ${getRefreshToken()}`
      },
      __isRefreshToken: true
    });
    resolve(resp);
  });
  promise.finally(() => {// 最终，无论完成还是失败都需要清空
    promise = null;
  });
  return promise;
}
// 判断是否为刷新token
export function isRefreshRequest(config: any) {
  return !!config.__isRefreshToken;
}