'use strict';

///////////////////////////////////////

//! SELECT ELEMENTS

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const navLinks = document.querySelector('.nav__links');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');

const images = document.querySelectorAll('img[data-src]');

///////////////////////////////////////
//! Modal window

const openModal = function (e) {
  //* prevent default handle
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(modal => modal.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////

//! Smooth Scrolling to Section one after click on scroll button

btnScrollTo.addEventListener('click', function (e) {
  //* Get all information about section one
  const s1Coords = section1.getBoundingClientRect();

  console.log(s1Coords);

  //* get Curent scroll

  console.log(window.pageXOffset, window.pageYOffset);
  console.log(window.scrollX, window.scrollY);

  //* get view port

  console.log(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  );

  //* scrooling without smooth => old Way

  // window.scrollTo(
  //   s1Coords.left + window.scrollX,
  //   s1Coords.top + window.scrollY
  // );

  //* scrooling with smooth => old Way

  // window.scrollTo({
  //   left: s1Coords.left + window.scrollX,
  //   top: s1Coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  //* Scrooling with smooth => new way with support with advanced browser
  section1.scrollIntoView({ behavior: 'smooth' });
});

//! Smooth Scrolling to Section one after click on nav links

// navLinks.forEach(function (navLink) {
//   navLink.addEventListener('click', function (e) {
//     //* prevent default handle
//     e.preventDefault();
//     // console.log('LINKS');
//     // console.log(navLink.getAttribute('href'));

//     // const href = this.getAttribute('href');
//     const href = e.currentTarget.getAttribute('href');
//     // const href = navLink.getAttribute('href');
//     document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//* using Event Delegation
//*TODO (1. Add Event Listener to common parent element)
//*TODO (2. Determine what element orginated the event)

navLinks.addEventListener('click', function (e) {
  //* prevent default handle
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
});

//! Tabbed Elements

tabContainer.addEventListener('click', function (e) {
  // console.log(e.target);
  const target = e.target.closest('.operations__tab');

  //* remove operations__tab--active from all
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  //* preveent make error if click in any where expect the buttons
  if (!target) return;

  //* Add operations__tab--active class to target
  target.classList.add('operations__tab--active');

  tabContents.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${target.dataset.tab}`)
    .classList.add('operations__content--active');
});

//! Hover Links on navbar

//* Handle over function
const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(sibling => {
      // this => is refernce to parameter on bind argument
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleOver.bind(0.5));
nav.addEventListener('mouseout', handleOver.bind(1));

//* Mouseover => hover
// nav.addEventListener('mouseover', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;

//     const sibling = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     sibling.forEach(sibling => {
//       if (sibling !== link) sibling.style.opacity = 0.5;
//     });
//     logo.style.opacity = 0.5;
//   }
// });

//* mouseout

// nav.addEventListener('mouseout', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;

//     const sibling = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     sibling.forEach(sibling => (sibling.style.opacity = 1));
//     logo.style.opacity = 1;
//   }
// });

//! Sticy navbar => old way

// window.addEventListener('scroll', function () {
//   if (this.window.scrollY >= section1.getBoundingClientRect().top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

//! Sticky navbar => new way

const navHeight = ~~nav.getBoundingClientRect().height; //* get rid of any deciaml number => ~~

//* call back function

const stickyNav = function (entries) {
  //* destructuring to get first element
  const [entry] = entries;

  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

//* oberserver options

const navOptions = {
  root: null,
  threshold: 0,
  rootmargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, navOptions);

headerObserver.observe(header);

//! reaval element

const observer = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const observerOption = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(observer, observerOption);

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//! Loading Lazy Image

console.log(images);

const lazyOptions = {
  root: null,
  threshold: 0,
};

const lazyObserver = function (entries, observer) {
  const [entry] = entries;

  console.log(entry);

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  if (!entry.isIntersecting) return;

  observer.unobserve(entry.target);
};

const lazyImage = new IntersectionObserver(lazyObserver, lazyOptions);

images.forEach(image => {
  lazyImage.observe(image);
});

//! Slider

const slides = document.querySelectorAll('.slide');

const btnRight = document.querySelector('.slider__btn--right');

const btnLeft = document.querySelector('.slider__btn--left');

let currentSlider = 0;

let maxSlider = slides.length - 1;

const goToSlide = function (currentSlide) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
  });
};

// slides.forEach(function (slide, index) {
//   slide.style.transform = `translateX(${100 * index})%`;
// });

//* create dots

const dotsContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, index) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

goToSlide(0);
createDots();
activateDots(0);

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    // console.log(e.target.dataset.slide);

    const dot = e.target.dataset.slide;

    e.target.classList.add('dots__dot--active');
    goToSlide(dot);
    activateDots(dot);
  }
});

const nextSlider = function () {
  if (maxSlider === currentSlider) {
    currentSlider = 0;
  } else {
    currentSlider++;
  }

  // console.log(currentSlider);

  // slides.forEach(function (slide, index) {
  //   slide.style.transform = `translateX(${100 * (index - currentSlider)}%)`;
  // });

  goToSlide(currentSlider);
  activateDots(currentSlider);
};

btnRight.addEventListener('click', nextSlider);

const previousSlider = function () {
  if (currentSlider > 0) {
    currentSlider--;
  } else {
    currentSlider = maxSlider;
  }

  goToSlide(currentSlider);
  activateDots(currentSlider);
};

btnLeft.addEventListener('click', previousSlider);

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = 'message';
// });
