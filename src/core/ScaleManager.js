import { BW, BH, DPR_CAP, MAX_CSS_HEIGHT } from '../config/constants.js';

export class ScaleManager {
  constructor(canvas) {
    this._canvas = canvas;
    this._scale = 1;
    this._rect = canvas.getBoundingClientRect();
    this._resizeRaf = 0;

    this._onResize = this._scheduleResize.bind(this);
    this._onOrientationChange = this._handleOrientationChange.bind(this);
    this._onViewportChange = this._handleViewportChange.bind(this);

    this._bindEvents();
    this._tryLockPortrait();
    this._resize();
  }

  get scale() {
    return this._scale;
  }

  get rect() {
    return this._rect;
  }

  get baseWidth() {
    return BW;
  }

  get baseHeight() {
    return BH;
  }

  refreshRect() {
    this._rect = this._canvas.getBoundingClientRect();
    return this._rect;
  }

  _bindEvents() {
    window.addEventListener('resize', this._onResize);
    window.addEventListener('orientationchange', this._onOrientationChange);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this._onViewportChange);
      window.visualViewport.addEventListener('scroll', this._onViewportChange);
    }
  }

  _tryLockPortrait() {
    if (!screen.orientation?.lock) {
      return;
    }

    screen.orientation.lock('portrait').catch(() => {});
  }

  _handleOrientationChange() {
    this._scheduleResize();
  }

  _handleViewportChange() {
    this._scheduleResize();
  }

  _scheduleResize() {
    if (this._resizeRaf) {
      return;
    }

    this._resizeRaf = requestAnimationFrame(() => {
      this._resizeRaf = 0;
      this._resize();
    });
  }

  _resize() {
    const dpr = this._getDevicePixelRatio();
    const viewport = this._getViewportSize();
    const cssSize = this._computeCssSize(viewport.width, viewport.height);

    this._applyCanvasCssSize(cssSize.width, cssSize.height);
    this._applyCanvasPixelSize(cssSize.width, cssSize.height, dpr);

    this._scale = this._canvas.width / BW;
    this.refreshRect();
  }

  _getDevicePixelRatio() {
    return Math.min(window.devicePixelRatio || 1, DPR_CAP);
  }

  _getViewportSize() {
    const viewport = window.visualViewport;

    return {
      width: viewport?.width || window.innerWidth,
      height: viewport?.height || window.innerHeight || screen.height,
    };
  }

  _computeCssSize(viewportWidth, viewportHeight) {
    const aspectRatio = BW / BH;

    let height = Math.min(viewportHeight, MAX_CSS_HEIGHT);
    let width = height * aspectRatio;

    if (width > viewportWidth) {
      width = viewportWidth;
      height = width / aspectRatio;
    }

    return {
      width: Math.floor(width),
      height: Math.floor(height),
    };
  }

  _applyCanvasCssSize(width, height) {
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;
  }

  _applyCanvasPixelSize(width, height, dpr) {
    this._canvas.width = Math.floor(width * dpr);
    this._canvas.height = Math.floor(height * dpr);
  }

  destroy() {
    if (this._resizeRaf) {
      cancelAnimationFrame(this._resizeRaf);
      this._resizeRaf = 0;
    }

    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('orientationchange', this._onOrientationChange);

    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this._onViewportChange);
      window.visualViewport.removeEventListener('scroll', this._onViewportChange);
    }
  }
}
