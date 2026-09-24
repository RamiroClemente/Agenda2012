(() => {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const viewport = root.querySelector('.carousel__viewport');
  const track = root.querySelector('.carousel__track');
  const slides = [...root.querySelectorAll('.carousel__slide')];
  const prev = root.querySelector('.carousel__button--prev');
  const next = root.querySelector('.carousel__button--next');
  const current = root.querySelector('[data-current]');
  const total = root.querySelector('[data-total]');

  let index = 0;
  let startX = null;
  let deltaX = 0;

  const pad = value => String(value).padStart(2, '0');
  total.textContent = pad(slides.length);

  const render = () => {
    track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
    current.textContent = pad(index + 1);
  };

  const go = nextIndex => {
    index = (nextIndex + slides.length) % slides.length;
    render();
  };

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));

  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') go(index - 1);
    if (event.key === 'ArrowRight') go(index + 1);
  });

  viewport.addEventListener('pointerdown', event => {
    startX = event.clientX;
    deltaX = 0;
    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport.addEventListener('pointermove', event => {
    if (startX !== null) deltaX = event.clientX - startX;
  });

  const endSwipe = () => {
    if (startX === null) return;
    if (Math.abs(deltaX) > 45) go(index + (deltaX < 0 ? 1 : -1));
    startX = null;
    deltaX = 0;
  };

  viewport.addEventListener('pointerup', endSwipe);
  viewport.addEventListener('pointercancel', endSwipe);

  render();
})();