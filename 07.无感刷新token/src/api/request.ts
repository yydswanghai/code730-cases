import axios from 'axios';
import { setToken, setRefreshToken, getToken } from './token';
import { refreshToken, isRefreshRequest } from './refreshToken';

const ins = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

ins.interceptors.response.use(async (res) => {
  if (res.headers.authorization) {
    const token = res.headers.authorization.replace('Bearer ', '');
    setToken(token);
    ins.defaults.headers.Authorization = `Bearer ${token}`;
  }
  if (res.headers.refreshtoken) {
    const refreshToken = res.headers.refreshtoken.replace('Bearer ', '');
    setRefreshToken(refreshToken);
  }
  if (res.data.code === 401 && !isRefreshRequest(res.config)) {// 无权限，不针对“刷新token”
    const ret: any = await refreshToken();// 刷新token
    if (ret.code === 0) {// 刷新成功
      res.config.headers.Authorization = `Bearer ${getToken()}`;// 设置新的token再去请求
      const resp = await ins.request(res.config);// 重新请求
      return resp;
    } else {// 登录逻辑
      console.log('请重新走登录', ret);
      return res.data;
    }
  }
  return res.data;
});

export default ins;