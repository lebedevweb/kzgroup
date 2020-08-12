'use strict'

import Swiper, { Scrollbar, Thumbs, EffectFade } from 'swiper';

Swiper.use([Scrollbar, Thumbs,EffectFade ]);

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import ScrollbarSmoth from 'smooth-scrollbar';


//  высота вьюпорта
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// Функция получения координат элемента
function getCoords(elem) {
	
	let box = elem.getBoundingClientRect();

	return {
		top: Math.round(box.top + scrollbar.offset.y),
		bottom: Math.round(box.bottom + scrollbar.offset.y)
	};
}

// Скролл к определенному элементу
function scrollToTop( element) {
	let elementTopPosition = getCoords(element).top;

	scrollbar.scrollTo(0, elementTopPosition, 600);

}

// Паралакс эффект на картинках


function parallax() {
	let layers = document.getElementsByClassName("parallax__img");
	let layer, speed, yPos;

	for (let i = 0; i < layers.length; i++) {
		layer = layers[i];
		let top = scrollbar.offset.y- getCoords(layer).top;
	
		speed = layer.getAttribute('data-speed');
		let yPos = -(top * speed / 100);
		
		layer.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
	}
}

// Соц.сети

function socialInteraction() {
	let socialBtn = document.querySelectorAll('.social__btn');
	let socialDrop = document.querySelectorAll('.social__dropdown');
	let btnWrap = document.querySelectorAll('.social__btn-item');
	for(let i = 0; i<socialBtn.length; i++){
		socialBtn[i].addEventListener('click', function(){
			socialDrop[i].classList.toggle('active');
			btnWrap[i].classList.toggle('active');


			let socialWrap = document.querySelectorAll('.social__btn-item');

			document.addEventListener('click', function(event){
				for(let i = 0; i<socialWrap.length; i++){
					let isClickInside = socialWrap[i].contains(event.target);
					if (!isClickInside) {
						socialDrop[i].classList.remove('active');
						btnWrap[i].classList.remove('active');
					}
				}
			})
		})

	}
}


// Шапка

function headerShowAndHideDesktop() {
	let traktorsContainer = document.querySelector('.traktors__container');
	let twoScreen = document.querySelector('.kirovets_about');
	
	
	if(getCoords(header).top > 50 && getCoords(twoScreen).top >= scrollbar.offset.y){
		header.classList.add('hide')
	}else if(getCoords(header).top < 0  || getCoords(header).top > 100 && getCoords(twoScreen).top <= scrollbar.offset.y){
		header.classList.remove('hide')
	
		
	}
	if(getCoords(twoScreen).top >= scrollbar.offset.y){
		header.classList.remove('js-scroll');
	}else if(getCoords(header).top > 50 && getCoords(twoScreen).top <= scrollbar.offset.y){
		header.classList.add('js-scroll');
	}
	
	if(traktorsContainer){
		if(getCoords(header).top > getCoords(traktorsContainer).top && getCoords(header).bottom < getCoords(traktorsContainer).bottom){
			header.classList.add('js-hide');
			header.classList.add('js-scroll-hide');
			
		}else if(getCoords(header).top < getCoords(traktorsContainer).top || getCoords(header).bottom > getCoords(traktorsContainer).bottom){
			header.classList.remove('js-hide');
			header.classList.remove('js-scroll-hide');
		}
	}

}


function hideAndShowHeaderMobile() {
	if(scrollbar.offset.y > 0){
		header.classList.add('hide')
	}else if(scrollbar.offset.y == 0 ){
		header.classList.remove('hide')

	}
}
// Инициализация плавного скролла

let options  = {
	damping: 0.02,
	delegateTo: document
}
let options2  = {
	damping: 0.02,
	continuousScrolling: false
	// delegateTo: document
}
let options3  = {
	damping: 0.02,
	continuousScrolling: false
	// delegateTo: document
}


const breakpoint = window.matchMedia( '(min-width:767px)' );
const header = document.querySelector('.header');

// Кнопка для вызова попапа на стр кировец
let btnMore;
// Определения координат для GSAP относительно плавного скролла
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) {
      scrollbar.scrollTop = value;
    }
    return scrollbar.scrollTop;
  },
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  }
});

let containerScroll = document.querySelector('.scroll');
let scrollbar;
	if(containerScroll){
		scrollbar = ScrollbarSmoth.init(containerScroll, options);
		scrollbar.addListener(ScrollTrigger.update);


		scrollbar.addListener(() => {
			parallax();
			showAndHideYearNav()
		})
		if ( breakpoint.matches === true ) {
			scrollbar.addListener(() => {
				
				if(header){	
	
					headerShowAndHideDesktop();

				}
			})
		}else if ( breakpoint.matches === false ) {
			scrollbar.addListener(() => {
				hideAndShowHeaderMobile();
			})
		}
		
		
	}


let popupWrap = document.querySelectorAll('.scroll-popup');
for(let i=0; i<popupWrap.length; i++){
	let scrollbarPopup = ScrollbarSmoth.init(popupWrap[i], options2);
	scrollbarPopup.addListener(ScrollTrigger.update);
}
let containerNavScroll = document.querySelector('.scroll');
let scrollbarNav;
if(containerNavScroll){
	scrollbarNav = ScrollbarSmoth.init(containerNavScroll, options3);
	scrollbarNav.addListener(ScrollTrigger.update);
}





// Инициализация свайперов
	let swiperStatistics;
	let swiperTabFeature;
	const enableSwiper = function(){
		swiperStatistics = new Swiper('.kirovets_statistics__slider',{
			scrollbar: {
				el: '.swiper-scrollbar',
			},
		});
		swiperTabFeature = new Swiper('.kirovets_tabs__features',{
			// autoHeight: true,
			scrollbar: {
				el: '.swiper-scrollbar',
			},
		});
	}
	let swiperTabThumbs = new Swiper('.kirovets_tabs__list-wrap', {

		slidesPerView: 2,

		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	});
	
	let swiperTab = new Swiper('.kirovets_tabs__container',{
	
		thumbs: {
			swiper: swiperTabThumbs
		},
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
	});



	function setMainSwiperMouseOver() {
		swiperTab.detachEvents();
		// swiperTab.mousewheel.disable();
	}

	function setMainSwiperMouseOut() {
		swiperTab.attachEvents();
		// swiperTab.mousewheel.enable();
	}



	let InnerSliders = document.querySelectorAll('.kirovets_tabs__features');

	

	const breakpointChecker = function() {
		// if larger viewport and multi-row layout needed
		if ( breakpoint.matches === true ) {

			if (swiperStatistics != null) {
				swiperStatistics.destroy(true, true);
				}

				if (swiperTabFeature != null) {
					swiperTabFeature.destroy(true, true);
				}

				for(let i = 0; i<InnerSliders.length; i++){
					InnerSliders[i].removeEventListener('mouseover', setMainSwiperMouseOver);
					InnerSliders[i].removeEventListener('mouseout', setMainSwiperMouseOut);		  	
				}

					// Анимация элементов
				gsap.utils.toArray('.is-animate').forEach(element => {

					let parallax = element.getAttribute('data-speed');
					let speed = parallax * 100 + '%';
					gsap.fromTo(element, {
						duration: 5,
						y: speed
					}, {
						y: "0%",
						force3D: true,
						scrollTrigger: {
							trigger: element,
							scrub: true,
							// start: "top top"
						} 
					});
				});

				btnMore = document.querySelectorAll('.traktors__text-wrap--desktop .button-more--traktors');

		} else if ( breakpoint.matches === false ) {
			


			for(let i = 0; i<InnerSliders.length; i++){
				InnerSliders[i].addEventListener('mouseover', setMainSwiperMouseOver);
				InnerSliders[i].addEventListener('mouseout', setMainSwiperMouseOut);		  	
			}
				
			return enableSwiper();

			btnMore = document.querySelectorAll('.traktors__text-wrap--tablet .button-more--traktors');

		}
	};


	breakpoint.addListener(breakpointChecker);

	breakpointChecker();

// Конец свайперов


// Плавный ссылки в годах
	const makeNavLinksSmooth = ( ) => {
		const navLinks = document.querySelectorAll( '.traktors__nav-link' );
		const section  = document.querySelectorAll('.traktors');
		for ( let n = 0; n<navLinks.length; n++ ) {
			// if ( navLinks.hasOwnProperty( n ) ) {
				navLinks[ n ].addEventListener( 'click', e => {
					// const id = section[ n ].id;
					e.preventDefault( );
				
			
					scrollToTop(section[n]);
				
				} );
			// }
		}
	}
	
// Наблюдение за ссылками при скролле
	const spyScrolling = ( ) => {
		const sections = document.querySelectorAll( '.traktors' );
	
			const scrollPos = scrollbar.offset.y
	
			// считывает или устанавливает количество пикселей, прокрученных от верха элемент 
			for ( let s in sections )
				if ( sections.hasOwnProperty( s ) && getCoords(sections[ s ]).top-100  <= scrollPos ) {

					const id = sections[ s ].id;
					document.querySelector( '.traktors__nav-link.active' ).classList.remove( 'active' );
					document.querySelector( `a[href*=${ id }]` ).classList.add( 'active' );

				}
		
	}


	// Скрытие / открытие навигации по годам
	function showAndHideYearNav() {
		let yearNav = document.querySelector('.traktors__nav');
		if(yearNav){
			document.addEventListener('DOMContentLoaded', function(){
				yearNav.style.opacity = "0";
			})
			let containerNav = document.querySelector('.traktors__container');
			let yearNavTopY = getCoords(yearNav).top;
			let yearNavBottomY = getCoords(yearNav).bottom;		
			let containerNavTopY = getCoords(containerNav).top;
			let containerNavBottomY = getCoords(containerNav).bottom;
	
			if(yearNavTopY >= containerNavTopY && yearNavBottomY < containerNavBottomY){
				yearNav.style.opacity = "1";
				yearNav.style.pointerEvents = "auto";
				yearNav.style.zIndex = "5";
				spyScrolling( );
		
			}else if(yearNavTopY <= containerNavTopY || yearNavBottomY >= containerNavBottomY){
				yearNav.style.opacity = "0";
				yearNav.style.pointerEvents = "none";
				yearNav.style.zIndex = "-1";
			}
			
			makeNavLinksSmooth( );

		}
	}
	
		
	


	


	// Видео
	let videoMain = document.querySelector('.parallax__img-video');

	if(videoMain){
		let btnPlay = document.querySelector('.kirovets_button__video-controls--play');
	
		let btnSound = document.querySelector('.kirovets_button__video-controls--sound');


		function playPauseMedia() {
			if(videoMain.paused) {
				videoMain.style.display = "block";
				videoMain.play();
			
				btnPlay.classList.add('active');
			} else {
				videoMain.pause();
				btnPlay.classList.remove('active');
			}
		}

		function soundOnOffMedia(){
			if(videoMain.muted){
				videoMain.muted = false;
				btnSound.classList.remove('active');
			}else{
				videoMain.muted = true;
				btnSound.classList.add('active');
			}
		}

		btnSound.addEventListener('click', soundOnOffMedia);
		btnPlay.addEventListener('click', playPauseMedia);
	}
	

	if(document.body.classList.contains("kirovets")){


	// Анимация

		gsap.utils.toArray('.traktors__number-icon').forEach(element => {
			ScrollTrigger.create({
				trigger: element,
				scrub: true,
				toggleClass: 'is-inview',
				// this toggles the class again when you scroll back up:
				toggleActions: 'play none none none',
				// this removes the class when the scrolltrigger is passed:
				// once: true,
			});
		});

		gsap.utils.toArray('.traktors__info-wrap').forEach(element => {
			ScrollTrigger.create({
				trigger: element,
				start: 'bottom bottom',
				scrub: true,
				toggleClass: 'is-inview-line',
				// this toggles the class again when you scroll back up:
				toggleActions: 'play none none none',
				// this removes the class when the scrolltrigger is passed:
				// once: true,
			});
		});
		gsap.utils.toArray('.button-more--traktors').forEach(element => {
			ScrollTrigger.create({
				trigger: element,
				start: 'bottom bottom',
				scrub: true,
				toggleClass: 'is-inview-line',
				// this toggles the class again when you scroll back up:
				toggleActions: 'play none none none',
				// this removes the class when the scrolltrigger is passed:
				// once: true,
			});
		});


		gsap.fromTo(".title--inner-main",{
			y: '130%',
			rotateX: "-40deg",
			opacity: 0 
				}, {
					y: "0%",
				rotateX: 0,
				opacity: 1,

				duration: 2,
				stagger: .13,
				ease: "power3.out",
				delay: .2,

			}
		);



		gsap.fromTo(".title--inner",{
		y: '130%',
		rotateX: "-40deg",
		opacity: 0 
			}, {
				y: "0%",
			rotateX: 0,
			opacity: 1,

			duration: 2,
			stagger: .13,
			ease: "power3.out",
			delay: .2,
			// force3D: true,
			scrollTrigger: {
				trigger: ".title--inner",
				// scrub: true,
				start: "bottom bottom"
			} 
		}
		);

		gsap.fromTo(".footer__outer",{
			y: '-20%',
			}, {
			y: "0%",
			duration: 0.3,

			ease: "none",
			// pin: true,
			// force3D: true,
			scrollTrigger: {
				trigger: ".kirovets_statistics",
				start: 'bottom bottom',
				// pin: true,
				toggleActions: "play reverse play reverse"
				// scrub: true,
				// pinSpacing: false
				// start: "top c"
			} 
		}
		);


	gsap.utils.toArray('.statictics--inner').forEach(element => {
		gsap.fromTo(element, {
			opacity: 0,
			y: "25px"
		}, {
			y: "0%",
			duration: 1,
			opacity: 1 ,
			stagger: .2,
			// ease: "ease",
			scrollTrigger: {
				trigger: element,
				// scrub: true,
				start: "bottom bottom"
			} 
		});
	});


		gsap.fromTo(".title--inner-main",{
			y: '130%',
			rotateX: "-40deg",
			opacity: 0 
			}, {
				y: "0%",
			rotateX: 0,
			opacity: 1,

			duration: 2,
			stagger: .13,
			ease: "power3.out",
			delay: .2,
					
		}
	);

	gsap.utils.toArray('.button-line').forEach(element => {
		ScrollTrigger.create({
			trigger: element,
			toggleClass: 'is-inview',
		});
	});
}



let socialContainer = document.querySelector('.social__btn-list');
if(socialContainer){
	socialInteraction()
}


// Меню

let burger = document.querySelector('.js-nav-toggle');

if(burger){
	let btnSearch = document.querySelector('.js-search-text');
	let dropList = document.querySelectorAll('.js-dropdown');

	let navList = document.querySelector('.nav_list');
	let navLink = navList.querySelectorAll('.nav_link');

	burger.addEventListener('click', function(){
		document.body.classList.toggle('has-nav-open');
		document.body.classList.remove('has-search-open');
		scrollbarNav.setPosition(0, 0);

		for (let i = 0; i < navLink.length; i++) {
			navLink[i].addEventListener('mouseover', function() {
				navLink[i].classList.add('active');
			})
			navLink[i].addEventListener('mouseleave', function() {
				navLink[i].classList.remove('active');
			})
			
		}
	})
	btnSearch.addEventListener('click', function(){
		document.body.classList.toggle('has-search-open');
		
	})

	if ( window.screen.width < 1199 ) {

		for(let i = 0; i<dropList.length; i++){
			dropList[i].addEventListener('click', function(event){
				
				// this.querySelector('.c-nav_dropdown').classList.add('active');
				this.querySelector('.nav_dropdown').classList.toggle('active');

				if(!this.contains(event.target)){
					this.classList.remove('active');
					this.querySelector('.js-dropdown-list').classList.remove('active');
				}
			})
		}
	}	
}

let popup = document.querySelectorAll('.popup_kirovets');

			for(let i = 0; i<popup.length; i++){
				let number = popup[i].querySelector('.traktors__number--popup');
				let numbers = number.querySelectorAll('.traktors__number-icon');
				for(let i = 0; i<numbers.length; i++){
					numbers[i].classList.remove('is-inview');
				}
				btnMore[i].addEventListener('click', function(event){
					event.preventDefault();
					popup[i].classList.add('active');
					for(let i = 0; i<numbers.length; i++){
						numbers[i].classList.add('is-inview');
					}
					
					let btnBack = popup[i].querySelector('.popup_kirovets__back');




					btnBack.addEventListener('click', function(event){
						popup[i].classList.remove('active');
						for(let i = 0; i<numbers.length; i++){
							numbers[i].classList.remove('is-inview');
						}
				});
				
					let btnClose = popup[i].querySelector('.popup_kirovets__close');

					btnClose.addEventListener('click', function(event){
							popup[i].classList.remove('active');
							for(let i = 0; i<numbers.length; i++){
								numbers[i].classList.remove('is-inview');
							}
					});

			})

			
		}







// accordion
let acc = document.getElementsByClassName("akcioner-info__accordion-item");
let menu = document.getElementsByClassName("akcioner-info__menu-icon");
let contactNavItem = document.getElementsByClassName("contacts-sidebar__nav-item");
let navItem = document.getElementsByClassName("contacts-navigation-list__item");
let actionerNavItem = document.getElementsByClassName('akcioner-navigation-list__item-active');
let contactsMenuItem = document.getElementsByClassName('contacts-navigation-list__item-active');
let contactsMenu = document.getElementsByClassName("contacts-menu-container");

let i;
			
			

for (i = 0; i < acc.length; i++) {
	acc[i].addEventListener("click", function() {
		this.classList.toggle("active");
	});
}

for (i = 0; i < menu.length; i++) {
	menu[i].addEventListener("click", function() {
		this.classList.toggle("active");
	});
}

for (i = 0; i < contactsMenuItem.length; i++) {
	contactsMenuItem[i].addEventListener("click", function() {
		this.classList.toggle("active");
	});
}

for (i = 0; i < actionerNavItem.length; i++) {
	actionerNavItem[i].addEventListener("click", function() {
		this.classList.toggle("active");
	});
}

for (i = 0; i < contactNavItem.length; i++) {
	contactNavItem[i].addEventListener("click", function() {
		let current = document.getElementsByClassName("active");
		current[0].className = current[0].className.replace(" active", "");
		this.className += " active";
	});
}

for (i = 0; i < navItem.length; i++) {
	navItem[i].addEventListener("click", function() {
		let current = document.getElementsByClassName("contacts-navigation-list__item-active");
		current[0].className = current[0].className.replace(" contacts-navigation-list__item-active", "");
		this.className += " contacts-navigation-list__item-active";
	});
}







