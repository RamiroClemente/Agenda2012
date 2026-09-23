(() => {
  const prices = {
    book: { GBP: 2945, EUR: 3430 },
    case: { GBP: 3145, EUR: 3660 }
  };
  let currency = 'GBP';
  const isSpanish = document.documentElement.lang === 'es';

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = button.dataset.language === 'es' ? 'es.html' : 'index.html';
    });
  });

  const currencyButtons = [...document.querySelectorAll('[data-currency]')];
  const priceElements = [...document.querySelectorAll('[data-price-key]')];

  function formatPrice(value) {
    const locale = isSpanish ? 'es-ES' : currency === 'GBP' ? 'en-GB' : 'en-IE';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value);
  }

  function renderPrices() {
    priceElements.forEach((el) => {
      const key = el.dataset.priceKey;
      el.textContent = formatPrice(prices[key][currency]);
    });
    currencyButtons.forEach((button) => {
      const active = button.dataset.currency === currency;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  currencyButtons.forEach((button) => button.addEventListener('click', () => {
    currency = button.dataset.currency;
    renderPrices();
  }));
  renderPrices();

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
  const pad = (n) => String(n).padStart(2, '0');
  total.textContent = pad(slides.length);

  const render = () => {
    track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
    current.textContent = pad(index + 1);
  };
  const go = (n) => {
    index = (n + slides.length) % slides.length;
    render();
  };

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(index - 1);
    if (e.key === 'ArrowRight') go(index + 1);
  });
  viewport.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    deltaX = 0;
  });
  viewport.addEventListener('pointermove', (e) => {
    if (startX !== null) deltaX = e.clientX - startX;
  });
  const end = () => {
    if (startX === null) return;
    if (Math.abs(deltaX) > 45) go(index + (deltaX < 0 ? 1 : -1));
    startX = null;
    deltaX = 0;
  };
  viewport.addEventListener('pointerup', end);
  viewport.addEventListener('pointercancel', end);
  render();
})();