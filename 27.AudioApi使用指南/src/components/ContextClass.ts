export function isWin() {
  return typeof window !== 'undefined'
}
/**
 * 初始化音频上下文
 */
export function getAudioContext() {
  if (isWin()) {
    const win = window as Window
    let contextClass = window.AudioContext || win.webkitAudioContext || win.mozAudioContext || win.oAudioContext || win.msAudioContext;
    return contextClass ? new contextClass() : null
  } else {
    return null
  }
}