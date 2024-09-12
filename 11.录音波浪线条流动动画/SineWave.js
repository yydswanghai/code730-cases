class SineWave {
  constructor(option = {}) {
    const { el, waves, initialize, resizeEvent } = option;
    if (!el) {
      throw new Error('No Canvas Selected');
    }
    this.el = el;
    this.ctx = this.el.getContext('2d');
    
    if (!waves || waves.length === 0) {
      throw new Error('No waves specified');
    }
    this.waves = waves || [];

    this.speed = option.speed || 10;
    this.amplitude = option.amplitude || 50;
    this.wavelength = option.wavelength || 50;
    this.segmentLength = option.segmentLength || 10;
    this.lineWidth = option.lineWidth || 2;
    this.time = option.time || 0;
    this.strokeStyle = option.strokeStyle || 'rgba(0, 0, 0, 0.3)';
    this.width = option.width || document.documentElement.clientWidth; // cvs宽
    this.height = option.height || this.width / 2; // cvs高
    this.WidthRatio = this.width / document.documentElement.clientWidth; // 宽度比例
    this.HeightRatio = this.height / document.documentElement.clientHeight; //高度比例

    this._resizeWidth();
    window.addEventListener('resize', this._resizeWidth.bind(this));
    if (resizeEvent) {
      this.resizeEvent = resizeEvent;
    }
    this.resizeEvent();
    window.addEventListener('resize', this.resizeEvent.bind(this));
    if (typeof initialize === 'function') {
      initialize.call(this);
    }
    this.loop();
  }

  _resizeWidth() {
    this.width = this.el.width = this.WidthRatio * document.documentElement.clientWidth;
    this.height = this.el.height = this.HeightRatio * document.documentElement.clientHeight;
    this.waveWidth = this.width * 0.95;
    this.waveLeft = this.width * 0.025;
  }

  resizeEvent() {
    // const style = this.ctx.createLinearGradient(0, 0, this.width, 0);
    // style.addColorStop(0, 'rgba(22, 183, 35, 1)');
    // style.addColorStop(0.3, 'rgba(222, 227, 16, 0.7)');
    // style.addColorStop(0.5, 'rgba(14, 159, 225, 0.8)');
    // style.addColorStop(0.8, 'rgba(227, 41, 16, 0.7)');
    // style.addColorStop(1, 'rgba(222, 88, 233, 1)');
    const style = this.strokeStyle;
    let i = -1;
    const len = this.waves.length;
    while (++i < len) {
      this.waves[i].strokeStyle = style;
    }
  }
  
  loop() {
    this.clear();
    this.update();
    window.requestAnimationFrame(this.loop.bind(this));
  }

  clear() {
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }

  update(c) {
    this.time -= 0.007;
    if (typeof c === 'undefined') {
      c = this.time;
    }
    let i = -1;
    let len = this.waves.length;
    while (++i < len) {
      const d = this.waves[i].timeModifier || 1;
      this.drawSine(c * d, this.waves[i]);
    }
    i = void 0;
    len = void 0;
  }

  ease(b, a) {
    const PI2 = Math.PI * 2;
    const HALFPI = Math.PI / 2;
    return a * (Math.sin(b * PI2 - HALFPI) + 1) * 0.5;
  }

  drawSine(d, wave) {
    wave = wave || {};
    let amplitude = wave.amplitude || this.amplitude;
    let wavelength = wave.wavelength || this.wavelength;
    let lineWidth = wave.lineWidth || this.lineWidth;
    let strokeStyle = wave.strokeStyle || this.strokeStyle;
    let segmentLength = wave.segmentLength || this.segmentLength;
    let e = d;
    let f = 0;
    let a = this.amplitude;
    let g = this.height / 2;
    const ctx = this.ctx;
    ctx.lineWidth = lineWidth; // * this.dpr
    ctx.strokeStyle = strokeStyle;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(0, g);
    ctx.lineTo(this.waveLeft, g);
    for (let b = 0; b < this.waveWidth; b += segmentLength) {
      e = d * this.speed + (-g + b) / wavelength;
      f = Math.sin(e);
      a = this.ease(b / this.waveWidth, amplitude);
      ctx.lineTo(b + this.waveLeft, a * f + g);
      a = void 0;
    }
    ctx.lineTo(this.width, g);
    ctx.stroke();
    wave = void 0;
    amplitude = void 0;
    wavelength = void 0;
    lineWidth = void 0;
    strokeStyle = void 0;
    segmentLength = void 0;
    e = void 0;
    f = void 0;
  }
}
