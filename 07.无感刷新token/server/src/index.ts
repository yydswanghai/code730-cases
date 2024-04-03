import Koa from 'koa';
import Router from 'koa-router';
import jwt from 'jsonwebtoken';

const app = new Koa();
const router = new Router({
  prefix: '/api'
});

let token = '';
let refresh_token = '';
let tokenExpiration = new Date().getTime() + 24 * 60 * 60 * 1000;
// 生成token的密钥
const secretKey = 'hello_your_key';
const sign = (data: string, expiresIn: string) => {// 颁发
  return jwt.sign({ data }, secretKey, { expiresIn });
}
const verify = (_token: any) => {// 验证
  if (!_token) return null;
  // 兼容 bearer token
  const arr = _token.split(' ');
  _token = arr.length === 1 ? arr[0] : arr[1];
  try {
    return jwt.verify(_token, secretKey);
  } catch (error) {
    console.log('失败：jwt验证过期')
    return null;
  }
}
const getRandom = () => Math.random().toString(36).substr(2);

// 中间件，用于检查token是否有效
function checkToken(ctx, next) {
  const requestToken = ctx.request.headers.authorization;
  const decoded = verify(requestToken);
  if (decoded) {
    next();
  } else {
    ctx.body = {
      code: 401,
      msg: 'Unauthorized '
    };
  }
}

// 登录，获取token
router.get('/login', async (ctx, next) => {
  token = sign(getRandom(), '3s');
  refresh_token = sign(getRandom(), '2h');
  ctx.set('authorization', `Bearer ${token}`);
  ctx.set('refreshtoken', `Bearer ${refresh_token}`);
  ctx.body = {
      code: 0,
      msg: '登录成功',
      data : {
        token,
        refresh_token,
        expires_in: Math.round((tokenExpiration - new Date().getTime()) / 1000) // 返回token过期时间
      }
  };
});

/**
 * 刷新token
 * 请求时，需要请求头带上之前给用户端的长 refresh_token
 * 响应给用户端短 token
 */
router.get('/refresh_token', async (ctx, next) => {
  const requestRefreshToken = ctx.request.headers.authorization;
  const decoded = verify(requestRefreshToken);
  if (decoded) {
    token = sign(getRandom(), '3s');
    ctx.set('authorization', `Bearer ${token}`);
    ctx.body = {
        code: 0,
        msg: '刷新token成功',
    };
  } else {
    ctx.body = {
      code: 403,
      msg: '请重新登录'
    }
  }
});

// 权限接口，需要有效的token
router.get('/protected', checkToken, async (ctx, next) => {
  ctx.body = {
    code: 0,
    msg: '',
    data: {
        content: '受保护的接口！'
    }
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});