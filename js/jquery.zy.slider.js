;(function($){
	$.fn.extend({
		zySlider : function(options){
			var defaults = {
				'fx' : 'linear',
				'speed' : 300,
				'timeout' : 5,
				'show_nav' : true,
				'auto_play' : true,
				'carousel' : true
			}

			var options =  $.extend(defaults, options);

			return this.each(function(){
				var o = options;


				var _self = $(this);
				var _slides = _self.find('.slide');

				var _slide = _slides.slice(0, 1);

				var zy = {
					timingID : 0,
					o : o,
					_sliding : false,
					_slide : _slide,
			       		_slides : _slides,
			       		count : _slides.length,
			       		curr : 0,
			       		next : 1
				};
				_slides.hide(); _slide.show();

				if(o.show_nav)	buildNav(zy, _self, _slides);

				var _layout = function(_self, _slides){
					var W = $(window).width(), H = $(window).height();

					_self.css( { width : W, height : H } );

					_slides.each(function(){
						var w = $(this).width(), h = $(this).height();

						$(this).css({
							top : ( (H-h)/2 ) + 'px', left : ( (W-w)/2 ) + 'px'
						});
					});
				}

				_self.find('img').bind('load', function(){
					_layout(_self, _slides);
				});
				$(window).resize(function(){
					_layout(_self, _slides);
				});

				if(o.timeout > 0 && o.auto_play){
					zy.timingID = setInterval(function(){
						go(zy);
					}, o.timeout * 1000);
				}
			});
		}
	});

	$.fn.zySlider.test = function(){};

	function go(zy, to)
	{
		var slide = zy._slides.slice(zy.next, zy.next+1);

		if(typeof(to) != 'undefined'){
			slide = zy._slides.slice(to, to+1);

			if(zy.timingID)	clearInterval(zy.timingID);

			if(zy.o.auto_play)
				zy.timingID = setInterval(function(){ go(zy); }, zy.o.timeout * 1000);
		}else{
			to = zy.next;
		}

		if(slide.is(zy._slide)) return false;

		var W = $(window).width(), H = $(window).height();
		var w = slide.width(), h = slide.height();

		var _w = w > W ? w : W, _h = h > H ? h : H;

		slide.css( { top : ( (H-h)/2 ) + 'px' , left : ( (W-w)/2 - _w ) + 'px' } );

		zy._sliding = true;

		zy._slide.animate({ left : ( (W-w)/2 + _w ) + 'px' }, zy.o.speed, zy.o.fx, function(){
			$(this).hide();
		});

		slide.show().animate({ left : ( (W-w)/2 ) + 'px'}, zy.o.speed, zy.o.fx, function(){
			zy._sliding = false;
			zy._slide = slide;


			zy.curr = to;

			if(zy.o.carousel == false && to + 1 >= zy._slides.length ){
				zy.next = -1;
				if(zy.timingID)	clearInterval(zy.timingID);
			}else{
				zy.next = to + 1 >= zy._slides.length ? 0 : to + 1;
			}

			if(zy.o.show_nav){
				zy._navs.removeClass('active');
				zy._navs.slice(to, to+1).addClass('active');
			}
		});
	}

	function buildNav(zy, cont, _slides)
	{
		var ul = $('<div class="zy-nav"><ul></ul></div>');
		for(var i = 0; i < _slides.length; i++){
			ul.append('<li><a href="javascript:void(0)" rel="'+i+'">'+(i+1)+'</a></li>');
		}
		$(cont).append(ul);

		_navs = $('.zy-nav a', cont);
		_navs.slice(0, 1).addClass('active');

		zy._navs = _navs;

		_navs.click(function(){
			var i = parseInt($(this).attr('rel'));

			if(zy._sliding)	return false;

			go(zy, i);
		});
	}
	
})(jQuery);
