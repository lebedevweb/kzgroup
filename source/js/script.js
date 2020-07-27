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
		scrollbar: {
			el: '.swiper-scrollbar',
		},
	});
}



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
	 } else if ( breakpoint.matches === false ) {
		 
			
		return enableSwiper();

	 }
};



// keep an eye on viewport size changes
breakpoint.addListener(breakpointChecker);
// kickstart
breakpointChecker();
