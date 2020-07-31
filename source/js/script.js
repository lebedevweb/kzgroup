'use strict'



import Swiper, { Scrollbar, Thumbs } from 'swiper';


Swiper.use([Scrollbar, Thumbs ]);

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);





document.addEventListener('DOMContentLoaded', function(){
	let swiperStatistics
	let swiperTabFeature
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
		// spaceBetween: 10,
		slidesPerView: 2,
		// freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
	});
	
	let swiperTab = new Swiper('.kirovets_tabs__container',{
		// mousewheel: {
		//   invert: true,
		// },
		thumbs: {
			swiper: swiperTabThumbs
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

	const breakpoint = window.matchMedia( '(min-width:767px)' );

	const breakpointChecker = function() {
		// if larger viewport and multi-row layout needed
		if ( breakpoint.matches === true ) {

			if (swiperStatistics != null) {
				swiperStatistics.destroy(true, true);
				}

				if (swiperTabFeature != null) {
					swiperTabFeature.destroy(true, true);
				}
				// fire small viewport version of swiper
			// else if a small viewport and single column layout needed

			for(let i = 0; i<InnerSliders.length; i++){
				InnerSliders[i].removeEventListener('mouseover', setMainSwiperMouseOver);
				InnerSliders[i].removeEventListener('mouseout', setMainSwiperMouseOut);		  	
			}
		} else if ( breakpoint.matches === false ) {
			

		
			for(var i = 0; i<InnerSliders.length; i++){
				InnerSliders[i].addEventListener('mouseover', setMainSwiperMouseOver);
				InnerSliders[i].addEventListener('mouseout', setMainSwiperMouseOut);		  	
			}
				
			return enableSwiper();

		}
	};



	// keep an eye on viewport size changes
	breakpoint.addListener(breakpointChecker);
	// kickstart
	breakpointChecker();

})






	// helper functions
	const MathUtils = {
			// map number x from range [a, b] to [c, d]
			map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
			// linear interpolation
			lerp: (a, b, n) => (1 - n) * a + n * b
	};

	// body element
	const body = document.body;
	
	// calculate the viewport size
	let winsize;
	const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
	calcWinsize();
	// and recalculate on resize
	window.addEventListener('resize', calcWinsize);

	// scroll position and update function
	let docScroll;
	const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop;
	window.addEventListener('scroll', getPageYScroll);

	// Item
	class Item {
			constructor(el) {
					// the .item element
					this.DOM = {el: el};
					// the inner image
					this.DOM.image = this.DOM.el.querySelector('.parallax__img');
					this.renderedStyles = {
							// here we define which property will change as we scroll the page and the items is inside the viewport
							// in this case we will be translating the image on the y-axis
							// we interpolate between the previous and current value to achieve a smooth effect
							innerTranslationY: {
									// interpolated value
									previous: 0, 
									// current value
									current: 0, 
									// amount to interpolate
									ease: 0.1,
									// the maximum value to translate the image is set in a CSS variable (--overflow)
									maxValue: parseInt(getComputedStyle(this.DOM.image).getPropertyValue('--overflow'), 10),
									// current value setter
									// the value of the translation will be:
									// when the item's top value (relative to the viewport) equals the window's height (items just came into the viewport) the translation = minimum value (- maximum value)
									// when the item's top value (relative to the viewport) equals "-item's height" (item just exited the viewport) the translation = maximum value
									setValue: () => {
											const maxValue = this.renderedStyles.innerTranslationY.maxValue;
											const minValue = -1 * maxValue;
											return Math.max(Math.min(MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, minValue, maxValue), maxValue), minValue)
									}
							}
					};
					// set the initial values
					this.update();
					// use the IntersectionObserver API to check when the element is inside the viewport
					// only then the element translation will be updated
					this.observer = new IntersectionObserver((entries) => {
							entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0);
					});
					this.observer.observe(this.DOM.el);
					// init/bind events
					this.initEvents();
			}
			update() {
					// gets the item's height and top (relative to the document)
					this.getSize();
					// sets the initial value (no interpolation)
					for (const key in this.renderedStyles ) {
							this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
					}
					// translate the image
					this.layout();
			}
			getSize() {
					const rect = this.DOM.el.getBoundingClientRect();
					this.props = {
							// item's height
							height: rect.height,
							// offset top relative to the document
							top: docScroll + rect.top 
					}
			}
			initEvents() {
					window.addEventListener('resize', () => this.resize());
			}
			resize() {
					// on resize rest sizes and update the translation value
					this.update();
			}
			render() {
					// update the current and interpolated values
					for (const key in this.renderedStyles ) {
							this.renderedStyles[key].current = this.renderedStyles[key].setValue();
							this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
					}
					// and translates the image
					this.layout();
			}
			layout() {
					// translates the image
					this.DOM.image.style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}%,0)`;
			}
	}

	// SmoothScroll
	class SmoothScroll {
			constructor() {
					// the <main> element
					this.DOM = {main: document.querySelector('main')};
					// the scrollable element
					// we translate this element when scrolling (y-axis)
					this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
					// the items on the page
					this.items = [];
					[...this.DOM.main.querySelectorAll('.parallax__item')].forEach(item => this.items.push(new Item(item)));
					// here we define which property will change as we scroll the page
					// in this case we will be translating on the y-axis
					// we interpolate between the previous and current value to achieve the smooth scrolling effect
					this.renderedStyles = {
							translationY: {
									// interpolated value
									previous: 0, 
									// current value
									current: 0, 
									// amount to interpolate
									ease: 0.1,
									// current value setter
									// in this case the value of the translation will be the same like the document scroll
									setValue: () => docScroll
							}
					};
					// set the body's height
					this.setSize();
					// set the initial values
					this.update();
					// the <main> element's style needs to be modified
					this.style();
					// init/bind events
					this.initEvents();
					// start the render loop
					requestAnimationFrame(() => this.render());
			}
			update() {
					// sets the initial value (no interpolation) - translate the scroll value
					for (const key in this.renderedStyles ) {
							this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
					}   
					// translate the scrollable element
					this.layout();
			}
			layout() {
					// translates the scrollable element
					this.DOM.scrollable.style.transform = `translate3d(0,${-1*this.renderedStyles.translationY.previous}px,0)`;
			}
			setSize() {
					// set the heigh of the body in order to keep the scrollbar on the page
					body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
			}
			style() {
					// the <main> needs to "stick" to the screen and not scroll
					// for that we set it to position fixed and overflow hidden 
					this.DOM.main.style.position = 'fixed';
					this.DOM.main.style.width = this.DOM.main.style.height = '100%';
					this.DOM.main.style.top = this.DOM.main.style.left = 0;
					this.DOM.main.style.overflow = 'hidden';
			}
			initEvents() {
					// on resize reset the body's height
					window.addEventListener('resize', () => this.setSize());
			}
			render() {
					// update the current and interpolated values
					for (const key in this.renderedStyles ) {
							this.renderedStyles[key].current = this.renderedStyles[key].setValue();
							this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
					}
					// and translate the scrollable element
					this.layout();
					
					// for every item
					for (const item of this.items) {
							// if the item is inside the viewport call it's render function
							// this will update the item's inner image translation, based on the document scroll value and the item's position on the viewport
							if ( item.isVisible ) {
									item.render();
							}
					}
					
					// loop..
					requestAnimationFrame(() => this.render());
			}
	}

	/***********************************/
	/********** Preload stuff **********/

	// Preload images
	const preloadImages = () => {
			return new Promise((resolve, reject) => {
					imagesLoaded(document.querySelectorAll('.parallax__img'), {background: true}, resolve);
			});
	};
	
	// And then..
	preloadImages().then(() => {
			// Remove the loader
			document.body.classList.remove('loading');
			// Get the scroll position
			getPageYScroll();
			// Initialize the Smooth Scrolling
			new SmoothScroll();
	});




	function visible(target, newClass) {
	
		let targetPosition = {
			top: window.pageYOffset + target.getBoundingClientRect().top,
			left: window.pageXOffset + target.getBoundingClientRect().left,
			right: window.pageXOffset + target.getBoundingClientRect().right,
			bottom: window.pageYOffset + target.getBoundingClientRect().bottom
		},
		
		windowPosition = {
			top: window.pageYOffset,
			left: window.pageXOffset,
			right: window.pageXOffset + document.documentElement.clientWidth,
			bottom: window.pageYOffset + document.documentElement.clientHeight
		};
	
		if (targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
			targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
			targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
			targetPosition.left < windowPosition.right) { // Если позиция левой стороны элемента меньше позиции правой чайти окна, то элемент виден справа
				 target.classList.add(newClass);
			} else {
				target.classList.remove(newClass);
			};
	};

	function animate(itemClass, animateClass){
		let items = document.querySelectorAll(itemClass);
		let pageFlag = document.querySelector('body').classList.contains('kirovets');
			window.addEventListener('scroll', function() {
			
					for(let i = 0; i< items.length; i++){
						visible (items[i], animateClass);	
					
				
					}
			});
				for(let i = 0; i< items.length; i++){
					visible (items[i], animateClass);	
				}
			
				// document.addEventListener("DOMContentLoaded", function() {
				
				// 		for(let i = 0; i< items.length; i++){
				// 			visible (items[i], animateClass);	
				// 		}
					
				// });
	}

		// animate('.traktors__number-icon', 'is-inview' );
	
		gsap.utils.toArray('.traktors__number-icon').forEach(element => {
			ScrollTrigger.create({
				trigger: element,
				toggleClass: 'is-inview',
				// this toggles the class again when you scroll back up:
				toggleActions: 'play none none none',
				// this removes the class when the scrolltrigger is passed:
				once: true,
			});
		});
	
		
	





	function getCoords(elem) {

		let box = elem.getBoundingClientRect();
	
		return {
			top: Math.round(box.top + pageYOffset),
			bottom: Math.round(box.bottom + pageYOffset)
		};
	}



	
	const makeNavLinksSmooth = ( ) => {
		const navLinks = document.querySelectorAll( '.traktors__nav-link' );
	
		for ( let n in navLinks ) {
			if ( navLinks.hasOwnProperty( n ) ) {
				navLinks[ n ].addEventListener( 'click', e => {
				
					// e.preventDefault( );
					
					// document.querySelector( navLinks[ n ].hash )
					// 	.scrollIntoView( {
					// 		behavior: "smooth"
					// 	} );
					document.querySelector( '.active' ).classList.remove( 'active' );
					navLinks[ n ].classList.add( 'active' );

				} );
			}
		}
	}
	
	const spyScrolling = ( ) => {
		const sections = document.querySelectorAll( '.traktors' );
	
		// window.onscroll = ( ) => {
			const scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
	
			// считывает или устанавливает количество пикселей, прокрученных от верха элемент 
			for ( let s in sections )
				if ( sections.hasOwnProperty( s ) && getCoords(sections[ s ]).top  <= scrollPos ) {

					const id = sections[ s ].id;
					document.querySelector( '.active' ).classList.remove( 'active' );
					document.querySelector( `a[href*=${ id }]` ).classList.add( 'active' );
				}
		// }  
	}

	let yearNav = document.querySelector('.traktors__nav');
	let containerNav = document.querySelector('.traktors__container');
	
	document.addEventListener('DOMContentLoaded', function(){
		yearNav.style.opacity = "0";
	})
	window.addEventListener('scroll', function(){
		let yearNavTopY = getCoords(yearNav).top;
		let yearNavBottomY = getCoords(yearNav).bottom;

		
		let containerNavTopY = getCoords(containerNav).top;
		let containerNavBottomY = getCoords(containerNav).bottom;

		if(yearNavTopY >= containerNavTopY && yearNavBottomY < containerNavBottomY){
			yearNav.style.opacity = "1";


			spyScrolling( );
			// makeNavLinksSmooth( );
	

		}else if(yearNavTopY <= containerNavTopY || yearNavBottomY >= containerNavBottomY){
			yearNav.style.opacity = "0";
		}
	})
	makeNavLinksSmooth( );
	// makeNavLinksSmooth( );
	// spyScrolling( );
	



	window.addEventListener("scroll", function(event) {
		let	topDistance = this.pageYOffset;
		let layers = document.querySelectorAll('.parallax__img--kirovets_about');

			
		for ( let i = 0;  i < layers.length; i++) {
			let depth = layers[i].dataset.depth;
			let movement = -(topDistance * depth);
			let translate3d = 'translate3d(0, ' + movement + 'px, 0)';
			layers[i].style['-webkit-transform'] = translate3d;
			layers[i].style['-moz-transform'] = translate3d;
			layers[i].style['-ms-transform'] = translate3d;
			layers[i].style['-o-transform'] = translate3d;
			layers[i].style.transform = translate3d;
		}
	});
	


	let btnPlay = document.querySelector('.kirovets_button__video-controls--play');
	let videoMain = document.querySelector('.parallax__img-video');
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
			start: "bottom bottom"
		} 
	}
);




gsap.utils.toArray('.statictics--inner').forEach(element => {
	gsap.fromTo(element, {
		y: "105%"
	}, {
		y: "0%",
		duration: 3,
		stagger: .2,
		ease: "expo.out",
		scrollTrigger: {
			trigger: element,
			start: "bottom bottom"
		} 
	});
});



// accordion
let acc = document.getElementsByClassName("akcioner-info__accordion-item--title-arrow");
let menu = document.getElementsByClassName("akcioner-info__menu-icon");
let i;

for (i = 0; i < acc.length; i++) {
	acc[i].addEventListener("click", function() {
		let item = this.parentElement;
		item.parentNode.classList.toggle("active");
	});
}

for (i = 0; i < menu.length; i++) {
	menu[i].addEventListener("click", function() {
		let item = this.parentElement;
		item.parentNode.classList.toggle("active");
	});
}
