export function createTransitionState() {
  return {
    phase: 'idle',
    t: 0,
    diveY: 0,
    overlay: 0,
    popScale: 1,
    popAlpha: 0,
    popY: 0,
    ripple: 0,

    contentAlpha: 0,
    contentY: 0,
    buttonAlpha: 0,
    buttonY: 0,

    title: '',
    sub: '',
    btn: '',
    icon: null,
    onConfirm: null,
  };
}
