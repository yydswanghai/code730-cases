function setupAudioMonitor() {
  let audioContext = null;
  let mediaStreamSource = null;
  let analyser = null;
  let recording = false;
  let timer;
  let dataArray;

  function start(callback) {
    if (navigator.mediaDevices.getUserMedia) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (!audioContext) {
        console.error('你的浏览器不支持Web Audio API')
      }
      // 获取音频源
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          // stream: MediaStream
          // 从音频流创建一个音频源节点
          mediaStreamSource = audioContext.createMediaStreamSource(stream);
          // createAnalyser() 创建一个AnalyserNodd ，可以用来获取音频时间和频率数据
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          mediaStreamSource.connect(analyser);// 连接到声源
          dataArray = new Uint8Array(analyser.frequencyBinCount); 

          recording = true;
          // // 定时器来定期更新频率数据
          timer && clearInterval(timer);
          timer = setInterval(() => {  
            // 获取频域数据  
            analyser.getByteFrequencyData(dataArray);  
            callback && callback(dataArray);
          }, 100); // 每100毫秒更新一次  
        })
        .catch(function(err) {
            console.error(err);
        });
    }
  }
  function stop(callback) {
    if (recording) {
      // 停止录音的逻辑（‌这里主要是断开音频连接）‌
      if (mediaStreamSource) {
          mediaStreamSource.disconnect();
      }
      if (audioContext) {
          audioContext.close();
      }
      recording = false;
      timer && clearInterval(timer);
      callback && callback();
      console.info("录音已停止");
      // 如果需要，‌可以在这里输出最后的音量百分比值
      // 但由于我们是在点击停止按钮时立即停止的，‌所以可能没有“最后”的音量值
      // 除非你在其他地方有逻辑来记录这个值
    }
  }

  return {
    start,
    stop
  }
}