const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevButton = document.querySelector('.slider-control.prev');
const nextButton = document.querySelector('.slider-control.next');
const heroSlider = document.querySelector('.hero-slider');
const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
let currentSlide = 0;
let autoplayId;
let startX = 0;
let startY = 0;
let isDraggingSlide = false;

if (navToggle && siteHeader) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 760) {
        siteHeader.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      siteHeader.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function showSlide(index) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
    dots[idx].classList.toggle('active', idx === index);
  });
}

function goToNextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function goToPrevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

function restartAutoplay() {
  clearInterval(autoplayId);
  autoplayId = setInterval(goToNextSlide, 4300);
}

if (slides.length > 0 && dots.length === slides.length) {
  autoplayId = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 4300);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      restartAutoplay();
    });
  });

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      goToNextSlide();
      restartAutoplay();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      goToPrevSlide();
      restartAutoplay();
    });
  }

  if (heroSlider) {
    const onPointerDown = (event) => {
      if (event.target.closest('.slider-control')) {
        return;
      }

      isDraggingSlide = true;
      startX = event.clientX;
      startY = event.clientY;
      heroSlider.classList.add('dragging');
    };

    const onPointerUp = (event) => {
      if (!isDraggingSlide) {
        return;
      }

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const swipeThreshold = 45;

      isDraggingSlide = false;
      heroSlider.classList.remove('dragging');

      if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          goToNextSlide();
        } else {
          goToPrevSlide();
        }
        restartAutoplay();
      }
    };

    heroSlider.addEventListener('pointerdown', onPointerDown);
    heroSlider.addEventListener('pointerup', onPointerUp);
    heroSlider.addEventListener('pointercancel', () => {
      isDraggingSlide = false;
      heroSlider.classList.remove('dragging');
    });
    heroSlider.addEventListener('pointerleave', () => {
      isDraggingSlide = false;
      heroSlider.classList.remove('dragging');
    });
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    const fullImage = item.getAttribute('data-full');
    lightboxImage.src = fullImage;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});
