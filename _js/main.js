$(function(){
	var Module = (function () {
		var html = $('html'),
			isMobile;

		// On load/resize, toggle a class between mobile/desktop mode
		var deviceClass = function () { //-------Public Method
			if ($(window).width() < 751 && !(new RegExp('MSIE [78]')).exec(navigator.userAgent)) {
				if (!html.hasClass('isMobile')) {
					html.addClass('isMobile').removeClass('isDesktop');
					isMobile = true;
					$('#location-selector').trigger('change');
				}
								
			} else {
				if (!html.hasClass('isDesktop')) {
					html.addClass('isDesktop').removeClass('isMobile');
					isMobile = false;
					$('#location-selector').trigger('change');
				}
			}
		}

		var general = function () { //-------Public Method

			// bxSlider carousels
			$('.bxslider').bxSlider();
			$('.event-carousel').bxSlider();
			$('.isDesktop .news-slider').bxSlider();
			$('.isDesktop .highlight-slider').bxSlider();

			// Ministry navigation slide
			$('.main-nav ul li').on('click', function(e) {
				if($(this).hasClass('ministry')){
					e.preventDefault();
					$('.ministry-nav').slideDown(500);
					$('nav li a').removeClass('selected');
					$('a', this).addClass('selected');
				} else {
				$('.ministry-nav').slideUp(500);
				}
			});

			// Close navigation slider
			$('.ministry-nav .icon-cancel').on('click', function(){
				$('.ministry-nav').slideUp(500);
			});	


			// Ministry links and contents
			var $ministryLink = $('.ministry-items li a');

			$ministryLink.click(function(e){
				e.preventDefault();

				//To show clicked link as active
				$('.ministry-items li a.selected').removeClass('selected');
				$(this).addClass('selected');
				
				//Which content to show			
				var $contentToShow = $(this).attr('data-contentId');

				//Which content to hide
				$('.ministry-content-item.active').hide(function(){
					$(this).removeClass('active');
					$('#'+ $contentToShow).show(function(){
						$(this).addClass('active');
					});
				});
			});


			// Click view calendar event - add class
			$('.view-calendar').on('click', function(e) {
				e.preventDefault();
				$('.events-calendar').toggleClass('selected');
				scrollToTop();
			});

			// Closing the calender slide
			$('.icon-cancel').on('click', function(){
				$('.events-calendar').removeClass('selected');
			});

			// Click view event block
			$('.event-block').on('click', function() {
				//On-click add color to the date slide event content
				$(this).toggleClass('clicked');
				$('.event-content', this).slideToggle();
			});

			// Scroll posioning on sticky header
			$(window).scroll(function(){
				if($(window).scrollTop() >= 42) {
					$('.isDesktop header').addClass('fixed');
				} else {
					$('.isDesktop header').removeClass('fixed');
				}
			});

			function scrollToTop() {
				$("html, body").animate({ scrollTop: 0 }, 600);
			}
			// Scroll to top
			$('.back-to-top').click(function(e){
				e.preventDefault();
				scrollToTop()
			});
		}

		return {
			deviceClass: deviceClass,
			general: general
		};

	})();

	//------- Calling Public Methods
	Module.deviceClass();
	Module.general();

	$(window).resize(function () {
		var html = $('html');

		Module.deviceClass();
	});

});
