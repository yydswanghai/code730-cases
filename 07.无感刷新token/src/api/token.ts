export function getToken() {
  return localStorage.getItem('__token__');
}

export function setToken(token: string) {
  localStorage.setItem('__token__', token);
}

export function getRefreshToken() {
  return localStorage.getItem("__refresh_token__");
}

export function setRefreshToken(token: string) {
  localStorage.setItem("__refresh_token__", token);
}