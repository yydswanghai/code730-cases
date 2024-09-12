SineWaveGenerator.prototype.speed = 10;
SineWaveGenerator.prototype.amplitude = 50;
SineWaveGenerator.prototype.wavelength = 50;
SineWaveGenerator.prototype.segmentLength = 10;
SineWaveGenerator.prototype.lineWidth = 2;
SineWaveGenerator.prototype.time = 0;
SineWaveGenerator.prototype.strokeStyle = "rgba(255, 255, 255, 0.2)";
function SineWaveGenerator(options) {
    Object.assign(this, options || {});
    if (!this.el) {
        throw "No Canvas Selected";
    }
    if (!this.waves.length) {
        throw "No waves specified";
    }
    this.ctx = this.el.getContext("2d");
    this._resizeWidth();
    window.addEventListener("resize", this._resizeWidth.bind(this));
    this.resizeEvent();
    window.addEventListener("resize", this.resizeEvent.bind(this));
    if (typeof this.initialize === "function") {
        this.initialize.call(this)
    }
    this.loop()
}
;
SineWaveGenerator.prototype.resizeEvent = function() {}
;
SineWaveGenerator.prototype._resizeWidth = function() {
    this.dpr = window.devicePixelRatio || 1;
    this.width = this.el.width = window.innerWidth * this.dpr;
    this.height = this.el.height = window.innerHeight * this.dpr;
    this.el.style.width = window.innerWidth + "px";
    this.el.style.height = window.innerHeight + "px";
    this.waveWidth = this.width * 0.95;
    this.waveLeft = this.width * 0.025
}
;
SineWaveGenerator.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height)
}
;
SineWaveGenerator.prototype.update = function(c) {
    this.time = this.time - 0.007;
    if (typeof c === "undefined") {
        c = this.time
    }
    var a = -1;
    var b = this.waves.length;
    while (++a < b) {
        var d = this.waves[a].timeModifier || 1;
        this.drawSine(c * d, this.waves[a])
    }
    a = void 0;
    b = void 0
}
;
var PI2 = Math.PI * 2;
var HALFPI = Math.PI / 2;
SineWaveGenerator.prototype.ease = function(b, a) {
    return a * (Math.sin(b * PI2 - HALFPI) + 1) * 0.5
}
;
SineWaveGenerator.prototype.drawSine = function(d, wave) {
    wave = wave || {};
    amplitude = wave.amplitude || this.amplitude;
    wavelength = wave.wavelength || this.wavelength;
    lineWidth = wave.lineWidth || this.lineWidth;
    strokeStyle = wave.strokeStyle || this.strokeStyle;
    segmentLength = wave.segmentLength || this.segmentLength;
    var e = d;
    var f = 0;
    var a = this.amplitude;
    var g = this.height / 2;
    this.ctx.lineWidth = lineWidth * this.dpr;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(0, g);
    this.ctx.lineTo(this.waveLeft, g);
    for (var b = 0; b < this.waveWidth; b += segmentLength) {
        e = (d * this.speed) + (-g + b) / wavelength;
        f = Math.sin(e);
        a = this.ease(b / this.waveWidth, amplitude);
        this.ctx.lineTo(b + this.waveLeft, a * f + g);
        a = void 0
    }
    this.ctx.lineTo(this.width, g);
    this.ctx.stroke();
    wave = void 0;
    amplitude = void 0;
    wavelength = void 0;
    lineWidth = void 0;
    strokeStyle = void 0;
    segmentLength = void 0;
    e = void 0;
    f = void 0
}
;
SineWaveGenerator.prototype.loop = function() {
    this.clear();
    this.update();
    window.requestAnimationFrame(this.loop.bind(this))
}
;