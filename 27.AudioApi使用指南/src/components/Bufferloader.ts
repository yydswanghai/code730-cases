/**
 * AudioContext.decodeAudioData 解码处理
 */

export const fetchData = (context: AudioContext, url: string) => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`fetchData() HTTP error, status = ${response.status}`)
      }
      return response.arrayBuffer();
    })
    .then(arrayBuffer => {
      return context.decodeAudioData(arrayBuffer, (buffer) => {
        console.log('音频解码成功', buffer)
      }, (error) => {
        console.error('音频解码失败', error)
      })
    })
}

export const BufferLoader = async (context: AudioContext, urls: string[]) => {
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const r = await fetchData(context, urls[i]);
    results.push(r);
  }
  return results;
}