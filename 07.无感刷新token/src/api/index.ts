import request from './request';

export function login() {
  return request.get('/login');
}

export function reqProtected() {
  return request.get('/protected');
}

export * from './refreshToken';