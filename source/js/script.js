'use strict'


import Swiper, { Scrollbar } from 'swiper';


Swiper.use([Scrollbar]);


let swiperStatistics
let swiperTabFeature
const enableSwiper = function(){
	swiperStatistics = new Swiper('.kirovets_statistics__slider',{
		scrollbar: {
			el: '.swiper-scrollbar',
		},
	});
	swiperTabFeature = new Swiper('.kirovets_tabs__features',{
		autoHeight: true,
		scrollbar: {
			el: '.swiper-scrollbar',
		},
	});
}

let swiperTab = new Swiper('.kirovets_tabs__container',{
	// mousewheel: {
  //   invert: true,
  // },
});
// let swiperTabNav = new Swiper('.swiper-container', {
  
// });
let btnTab = document.querySelectorAll('.kirovets_tabs__nav-btn');
var activesBtn = document.getElementsByClassName('active');

for(let i = 0; i<btnTab.length; i++){
	btnTab[i].addEventListener('click', function(){
		var currentActive = activesBtn[0];
		if (currentActive){
			currentActive.classList.remove("active");
		}
		if (currentActive !== this){
      this.classList.add("active");
  	}
		
		swiperTab.slideTo(i);
		btnTab[i].classList.add('active')
	})
}


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







