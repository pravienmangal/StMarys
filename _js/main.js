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

		var cookieWarning = function() { //-------Private Method
			$('.cookie-warning .button').on('click', function(e) {
				e.preventDefault();
				$('.cookie-warning').slideUp();
				$.cookie("SavillsIMCookieWarning", "SavillsIM-02022016CW", { expires: 28 });
			});

			if (!$.cookie('SavillsIMCookieWarning')) {
				setTimeout(function(){ 
					$('.cookie-warning').slideToggle();
				}, 2000);
			}
		}

		var general = function () { //-------Public Method

			// Calling Private Method
			cookieWarning();

			// Mobile menu
			var mainNav = $('.main-nav'),
				modalOverlay = $('.modal-overlay');

			$('.mobile-nav').on('click', function() {
				$(this).toggleClass('selected');
				mainNav.toggle();
				modalOverlay.toggle();
			});

			// Card slide open
			$('.toggle-btn').on('click', function() {
				var container = $(this).parent();

				$('.toggle-content', container).toggle();
				$('.icon', this).toggleClass('icon-chevron-down icon-chevron-up');
			});

			// Sticky header 
			$(window).scroll(function(){
				if ($(window).scrollTop() > 40) {
					$('.isDesktop .logo-nav-search').addClass('sticky');
					$('.isDesktop .header-container').css('margin-bottom', '65px');
				} else {
					$('.isDesktop .logo-nav-search').removeClass('sticky');
					$('.isDesktop .header-container').css('margin-bottom', '0');
				}
			});

			// Infographic carousel
			var maxSlides,
				slideWidth,
				width = $(window).width();

			if (width < 640) {
				maxSlides = 1;
				slideWidth = 480;
			} else if (width < 1224) {
				maxSlides = 3;
				slideWidth = 312;
			} else {
				maxSlides = 3;
				slideWidth = 356;
			}

			$('.slider1').bxSlider({
				slideWidth: slideWidth,
				minSlides: 1,
				maxSlides: maxSlides
			});

			// Article share
			$('.share-item a').click(function(){
				window.open(this.href, 'Share', "width=600, height=600");
				return false;
			});

			$('.share-item a').each(function() {
				var _href = $(this).attr('href'),
				currentLoc = window.location.href,
				title = encodeURIComponent($('h1').text());

				if ($(this).parent().hasClass('twitter')) {
					$(this).attr('href', _href + currentLoc + '&text=' + title + ':' + '&url=' + currentLoc +  '&via=SavillsIM');
				} else if ($(this).parent().hasClass('linkedin')) {
					$(this).attr('href', _href  + currentLoc +'&title='+ title);
				} else {
					$(this).attr("href", _href + currentLoc);
				}
			});

			//funds selector
			$('#funds-selector').on('change', function() {
				if($(this).val() === 'open') {
					$('.closed-fund').hide();
					$('.open-fund').show();
				} else {
					$('.open-fund').hide();
					$('.closed-fund').show();
				}
			});

			//Search toggle
			$('.search .icon-search').on('click', function() {
				$('.search-form').toggle();
				$('.search-form input').focus();
			});
			$(document).keyup(function(e) {
				if(e.keyCode == 27) {
					$('.search-form').hide();
				}
			});

			//apend / remove search field
			if (!html.hasClass('isDesktop')) {
				$('.main-nav').prepend($('.search-form form'));
			}

			//location selector
			function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
				var R = 6371; // Radius of the earth in km
				var dLat = deg2rad(lat2-lat1);  // deg2rad below
				var dLon = deg2rad(lon2-lon1); 
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
				var d = R * c; // Distance in km
				return d;
			}

			function deg2rad(deg) {
				return deg * (Math.PI/180)
			}

			function sortLocation(position) {
				var lat, long, sortFunction;
				lat = position.coords.latitude;
				long = position.coords.longitude;
				
				sortFunction = function(a, b) {
					var aLat, aLong, bLat, bLong, aDistance, bDistance;
					aLat = a.getAttribute("data-lat");
					aLong = a.getAttribute("data-long");
					bLat = b.getAttribute("data-lat");
					bLong = b.getAttribute("data-long");

					aDistance = getDistanceFromLatLonInKm(lat, long, aLat, aLong)
					bDistance = getDistanceFromLatLonInKm(lat, long, bLat, bLong)
					return parseFloat(aDistance) - parseFloat(bDistance);
				}

				var selectItems = $('.location-select-item').get();
				selectItems.sort(sortFunction);

				for (var i = 0; i < selectItems.length; i++) {
					selectItems[i].parentNode.appendChild(selectItems[i]);
				}

				var items = $('.location-item').get();
				items.sort(sortFunction);
				
				for (var i = 0; i < items.length; i++) {
					items[i].parentNode.appendChild(items[i]);
				}

			}

			function getLocation() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(sortLocation);
				} else { 
					console.log("Geolocation is not supported by this browser.");
				}
			}
			getLocation();

			$('#location-selector').on('change', function() {
				if(isMobile) {
					$('.location-item').hide();
					$('.location-' + $(this).val()).show();
				}
				else {
					$('.location-item').show();
				}
			});
			$('#location-selector').trigger('change');
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
		//apend / remove search field
		if (!html.hasClass('isDesktop')) {
			$('.main-nav').prepend($('.search-form form'));
		} else {
			$('.search-form').append($('.main-nav form'));
		}
	});

});
