'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');

//TABBED COMPONENT
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//NAV
const nav = document.querySelector('nav');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//Smooth button Scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation

//1. Add event Listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Active tab
  tabs.forEach(function (t) {
    t.classList.remove('operations__tab--active');
  });
  clicked.classList.add('operations__tab--active');

  //Remove content for all tabs before then readding
  tabsContent.forEach(function (t) {
    t.classList.remove('operations__content--active');
  });

  //Activate content area
  //clicked-data-set tab gives the number which points to which tab so we have the right content. Then adds content active class
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation - fades out the elements from the navagation that are not being hovered
function handleHover(e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5)); //does same as above just looks cleaner
nav.addEventListener('mouseout', handleHover.bind(1)); //does same as above just looks cleaner

///////////////////////////////////////
//STICKY NAVIGATION
const navHeight = nav.getBoundingClientRect().height;

const headerObsOptions = {
  root: null, //indicates we are looking for viewport
  threshold: 0, //when 0 percent of the header is in view
  rootMargin: `-${navHeight}px`,
};

function stickyNav(entries) {
  const [entry] = entries;

  //if the target is not intersecting the root. Add sticky nav
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickyNav, headerObsOptions);

headerObserver.observe(header);

///////////////////////////////////////
//REVEAL SECTIONS
const allSections = document.querySelectorAll('.section');

const sectionOptions = {
  root: null,
  threshold: 0.15,
};

function revealSection(entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  //stop observing after everything loaded before
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, sectionOptions);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
});

///////////////////////////////////////
//LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll('img[data-src]'); //select all the images that have the property data-src

function loadImg(entries, observer) {
  const entry = entries[0];
  // console.log(entry.target);

  //guard clause
  if (!entry.isIntersecting) return;

  //Replace src(lazy img) with data-src(full res img)
  entry.target.src = entry.target.dataset.src;

  //load img and do nothing
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imgObserver = new IntersectionObserver(loadImg, imgOptions);

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
//SLIDER COMPONENT

function slider() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlides = slides.length;

  //Functions
  function createDots() {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  createDots();

  //show highlighted dot. Fiirst removes highlight from all dot, then adds it to correct dot based on active slide - which we get from data-slide=""
  function activateDot(slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  //logic for changing slides - Slides are all horizontally next to each other. transform(shift) slides to either side based on which slide we are currently on
  function goToSlide(slide) {
    slides.forEach(
      (s, index) =>
        (s.style.transform = `translateX(${100 * (index - slide)}%)`)
    );
  }

  goToSlide(0);
  activateDot(0);

  //next slide
  function nextSlide() {
    //if max number of slides reached go back to first slide
    if (currSlide === maxSlides - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }

    goToSlide(currSlide);
    activateDot(currSlide);
  }

  function prevSlide() {
    if (currSlide === 0) {
      currSlide = maxSlides;
    }
    currSlide--;
    goToSlide(currSlide);
    activateDot(currSlide);
  }

  function init() {
    goToSlide(0);
    createDots();
    activateDot(0);
  }

  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //navigate keys with slides
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlideSlide();
  });

  //Change slide on dot click
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;

      goToSlide(slide);
      activateDot(slide);
    }
  });
}
slider();

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
