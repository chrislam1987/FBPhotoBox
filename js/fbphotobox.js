(function($) {
	function FBPhotoBox(opts) {
		this.settings = $.extend({}, $.fn.fbPhotoBox.defaults, opts);
		this.bodyDimension = {width:0,height:0};
		this.bodyDimension.width = $('body').width();
		this.bodyDimension.height = $('body').height();
		this.container = $("." + this.settings.containerClassName);
		this.IsDisplayed = false;
		this.animateVelocity = 3;
		this.init();
	}
	
	FBPhotoBox.prototype = {
		init: function() {
			var $this = this;
			this.initDOM();
			this.initSettings();
			this.rightArrow = $(".right-arrow");
			this.leftArrow = $(".left-arrow");
			this.fbpMainImage = $(".fbphotobox-main-image");
			this.fbpMainContainer = $(".fbphotobox-main-container");
			this.fbpOverlay = $(".fbphotobox-overlay");
			this.lazyLoadImage = new Image();
			this.lazyLoadImage.onload = function() { $this.refreshBoxSize(this); };
			this.fbpMainImage.bind("onFbBoxImageShow", this.settings.onImageShow);
			
			// Prev & Next btn hover animation
			$(".fbphotobox-a").hover(function() {
				$(this).fadeTo("fast", 1);
			}, function() {
				$(this).fadeTo("fast", 0.5);
			});
			
			// FBPhotobox stage close
			$(".fbphotobox-close-btn a").click(function() {
				$this.hide();
				return false;
			});
			$(".fbphotobox-overlay").click(function() {
				$this.hide();
				return false;
			});
			
			// Left side overlay hover animation
			$(".fbphotobox-container-left").hover(function() {
				$(".fbphotobox-image-stage-overlay").fadeIn($this.settings.imageOverlayFadeSpeed);
			}, function() {
				$(".fbphotobox-image-stage-overlay").fadeOut($this.settings.imageOverlayFadeSpeed);
			});
			
			// Setup click trigger
			$('.' + this.settings.containerClassName).on("click", "." + this.settings.imageClassName, function() {
				$this.show($(this));
			});
			
			// Handle left right click event
			this.leftArrow.click(function() {
				var image = $('.' + $this.settings.containerClassName + ' .' + $this.settings.imageClassName).get($this.leftArrow.attr("data-prev-index"));
				if (image) $this.show($(image));
			});
			this.rightArrow.click(function() {
				var image = $('.' + $this.settings.containerClassName + ' .' + $this.settings.imageClassName).get($this.rightArrow.attr("data-next-index"));
				if (image) $this.show($(image));
			});
			
			// Start of FullScreen Mode Binding //
			$(".fbphotobox-fc-btn").click(function() {
				$this.fullScreenMode = true;
				$this.showFullScreen($this.mainImage);
				return false;
			});
			$(".fc-left-arrow .fbphotobox-a").click(function() {
				$this.leftArrow.click();
				$this.showFullScreen($this.mainImage);
			});
			$(".fc-right-arrow .fbphotobox-a").click(function() {
				$this.rightArrow.click();
				$this.showFullScreen($this.mainImage);
			});
			$(".fbphotobox-fc-close-btn").click(function() {
				$this.fullScreenMode = false;
				$this.hideFullScreen();
				return false;
			});
			
			// Bind the window resize callback
			$(window).resize(function() {
				$this.refreshBoxSize();
			});
		},
		show: function(image) {
			$(".fbphotobox-tag").remove();
			var index = $('.' + this.settings.containerClassName + ' .' + this.settings.imageClassName).index(image);
			this.fbpMainImage.attr('fbp-index', index);
			this.leftArrow.attr("data-prev-index", index - 1);
			this.rightArrow.attr("data-next-index", index + 1);
			this.fbpMainImage.attr('alt', image.attr('alt'));
			this.fbpMainImage.posX = image.offset().left;
			this.fbpMainImage.posY = image.offset().top;
			this.fbpMainImage.widthSrc = image.width();
			this.fbpMainImage.heightSrc = image.height();
			if (image.attr("fbphotobox-src")) {
				this.lazyLoadImage.src = image.attr("fbphotobox-src");
			}
			else {
				this.lazyLoadImage.src = image.attr("src");
			}
		},
		hide: function() {
			this.IsDisplayed = false;
			this.lazyLoadImage.src = '';
			var from = { posX: this.fbpMainImage.offset().left, posY: this.fbpMainImage.offset().top, widthSrc: this.fbpMainImage.width(), heightSrc: this.fbpMainImage.height()};
			var to = { posX: this.fbpMainImage.posX, posY: this.fbpMainImage.posY, widthSrc: this.fbpMainImage.widthSrc, heightSrc:this.fbpMainImage.heightSrc};
			var tmpNode = $('<img src=""/>').attr("src", this.fbpMainImage.attr("src"));
			this.fbpMainContainer.fadeOut({easing:'easeOutQuint', queue:false, duration:200});
			this.fbpOverlay.hide({easing:'easeOutQuint', queue:false, duration:200});
			this.photoTransitionAnimation(tmpNode, from, to, function() { tmpNode.remove(); });
			this.displayScroll();
		},
		initDOM: function() {
			var html = ['<div class="fbphotobox-main-container">',
							'<div class="fbphotobox-container-left">',
								'<table class="fbphotobox-main-image-table"><tr><td>',
									'<div class="tag-container"><img class="fbphotobox-main-image" src=""/></div>',
								'</td></tr></table>',
								'<div class="fbphotobox-image-stage-overlay">',
									'<div class="fbphotobox-container-left-header">',
										'<a title="Full Screen" class="fbphotobox-fc-btn fbphotobox-a"></a>',
									'</div>',
									'<div data-prev-index="" class="left-arrow">',
										'<table style="height:100%"><tr><td style="vertical-align:middle;">',
											'<a class="fbphotobox-a" title="Previous"></a>',
										'</td></tr></table>',
									'</div>',
									'<div data-next-index="" class="right-arrow">',
										'<table style="height:100%;"><tr><td style="vertical-align:middle;">',
											'<a class="fbphotobox-a" title="Next"></a>',
										'</td></tr></table>',
									'</div>',
									'<div class="fbphotobox-container-left-footer">',
										'<div style="margin:20px;">',
											'<span style="font-weight:bold;">Dummy Photo Caption</span>',
											'<span style="color:#B3B3B3;"> in </span>',
											'<span style="font-weight:bold;">Dummy Album Name</span>',
										'</div>',
									'</div>',
									'<div class="fbphotobox-container-left-footer-bg"></div>',
								'</div>',
							'</div>',
							'<div class="fbphotobox-container-right">',
								'<div class="fbphotobox-close-btn">',
									'<a title="Close" href="" style="float:right;margin:8px">',
										'<img src="./images/close.png" style="height:10px;width:10px"/>',
									'</a>',
									'<div style="clear:both"></div>',
								'</div>',
								'<div class="fbphotobox-image-content"></div>',
							'</div>',
							'<div style="clear:both"></div>',
						'</div>',
						'<div class="fbphotobox-fc-main-container">',
							'<div class="fbphotobox-fc-header">',
								'<div style="float:left">Dummy Header</div>',
								'<a class="fbphotobox-fc-close-btn" href="">Exit</a>',
								'<div style="clear:both"></div>',
							'</div>',
							'<div style="position:fixed;top:0px;right:0px;left:0px;bottom:0px;margin:auto;">',
								'<table style="width:100%;height:100%;text-align:center;">',
									'<tr>',
										'<td class="fc-left-arrow" style="width:50px;text-align:center;">',
											'<a class="fbphotobox-a" title="Previous"></a>',
										'</td>',
										'<td>',
											'<img class="fbphotobox-fc-main-image" src=""/>',
										'</td>',
										'<td class="fc-right-arrow" style="width:50px;text-align:center;">',
											'<a class="fbphotobox-a" title="Next"></a>',
										'</td>',
									'</tr>',
								'</table>',
							'</div>',
							'<div class="fbphotobox-fc-footer">Dummy Footer<div style="clear:both"></div></div>',
						'</div>',
						'<div class="fbphotobox-overlay"></div>',
						'<div style="clear:both"></div>'];
			$("body").append(html.join(""));
			this.settings.afterInitDOM();
		},
		initSettings: function() {
			if (this.settings.rightWidth != "") {
				$(".fbphotobox-container-right").css("width", this.settings.rightWidth);
			}
			
			if (this.settings.leftBgColor != "") {
				$(".fbphotobox-container-left").css("backgroundColor", this.settings.leftBgColor);
			}
			
			if (this.settings.rightBgColor != "") {
				$(".fbphotobox-container-right").css("backgroundColor", this.settings.rightBgColor);
			}
			
			if (this.settings.footerBgColor != "") {
				$(".fbphotobox-container-left-footer-bg").css("backgroundColor", this.settings.footerBgColor);
			}
			
			if (this.settings.overlayBgColor != "") {
				$(".fbphotobox-overlay").css("backgroundColor", this.settings.overlayBgColor);
			}
			
			if (this.settings.overlayBgOpacity != "") {
				$(".fbphotobox-overlay").css("opacity", this.settings.overlayBgOpacity);
			}
		},
		hideScroll: function() {
			$('body').css({width:$(window).width(),height:$(window).height(), overflow:"hidden"});
		},
		displayScroll: function() {
			$('body').css({width:this.bodyDimension.width, height:this.bodyDimension.height, overflow:"scroll"});
		},
		refreshBoxSize: function(image) {
			var isShow = image == null? false : true;
			image = image == null? this.lazyLoadImage : image;
			var leftContainer = $(".fbphotobox-container-left");
			var rightContainer = $(".fbphotobox-container-right");
			var imageWidth = image.width;
			var imageHeight = image.height;
			var maxWidth = Math.max($(window).width() - this.settings.rightWidth - this.settings.normalModeMargin*2, this.settings.minLeftWidth);
			var maxHeight = Math.max($(window).height() - this.settings.normalModeMargin*2, this.settings.minHeight);
			
			if (imageHeight < maxHeight) {
				leftContainer.height(imageHeight);
				this.fbpMainImage.css("max-height",imageHeight);
			}
			else {
				leftContainer.height(maxHeight);
				this.fbpMainImage.css("max-height",maxHeight);
			}
			if (imageWidth < maxWidth) {
				leftContainer.width(imageWidth);
				this.fbpMainImage.css("max-width",imageWidth);
			}
			else {
				leftContainer.width(maxWidth);
				this.fbpMainImage.css("max-width",maxWidth);
			}
						
			rightContainer.css("height", leftContainer.height());
			$(".fbphotobox-image-content").css("height", leftContainer.height() - $(".fbphotobox-close-btn").height());
			
			this.fbpMainContainer.css({
				width: (leftContainer.width() + rightContainer.width()),
				height: leftContainer.height()
			});
			if (isShow) {
				this.fbpMainImage.attr("src", "").attr("src", image.src);
				$(".fbphotobox-fc-main-image").attr("src","").attr("src", image.src);
				if (!this.IsDisplayed)
				{
					if (navigator.appVersion.indexOf("MSIE 7.") != -1) this.repositionBox();
					$(".fbphotobox-overlay").css("opacity",0).show();
					$(".fbphotobox-main-container").css("opacity",0).show();
					var from = { posX: this.fbpMainImage.posX, posY: this.fbpMainImage.posY, widthSrc: this.fbpMainImage.widthSrc, heightSrc: this.fbpMainImage.heightSrc};
					var to = { posX: this.fbpMainImage.offset().left, posY: this.fbpMainImage.offset().top, widthSrc: this.fbpMainImage.width(), heightSrc: this.fbpMainImage.height()};
					var tmpNode = $('<img src=""/>').attr("src", image.src);
					this.photoTransitionAnimation(tmpNode, from, to, function() {
						$(".fbphotobox-overlay").animate({opacity: 0.9}, {easing: 'easeOutQuint', queue: false, duration: 500});
						$(".fbphotobox-main-container").animate({opacity: 1}, {easing: 'easeOutQuint', queue: false, duration: 500,
						complete: function() {
							tmpNode.remove();
						}
						});
					});
					this.IsDisplayed = true;
				}
				
				this.fbpMainImage.show(10000, function() { $(this).trigger("onFbBoxImageShow"); });
				
				//handle left right arrow
				var index = parseInt(this.fbpMainImage.attr('fbp-index'));
				if (index - 1 < 0) {
					this.leftArrow.hide();
					$(".fc-left-arrow a").hide();
				}
				else {
					this.leftArrow.show();
					$(".fc-left-arrow a").show();
				}
				if (index + 1 >= $('.' + this.settings.containerClassName + ' .' + this.settings.imageClassName).length) {
					this.rightArrow.hide();
					$(".fc-right-arrow a").hide();
				}
				else {
					this.rightArrow.show();
					$(".fc-right-arrow a").show();
				}
			}
			
			if (!isShow) this.refreshTagSize();
		},
		refreshTagSize: function() {
			var $tag = $(".fbphotobox-tag");
			var newHeight = this.fbpMainImage.height();
			var newWidth = this.fbpMainImage.width();
			$tag.each(function() {
				$(this).css({
					left: $(this).attr("x")*newWidth,
					top: $(this).attr("y")*newHeight,
					width: $(this).attr("w")*newWidth,
					height: $(this).attr("h")*newHeight
				});
			});
		},
		refreshFullScreenSize: function() {
			$(".fbphotobox-fc-main-image").css({
				"max-width": $(window).width() - $(".fc-left-arrow").width() - $(".fc-right-arrow").width() - 20,
				"max-height": $(window).height() - $(".fbphotobox-fc-header").outerHeight(true) - $(".fbphotobox-fc-footer").outerHeight(true)
			});
			$(".fbphotobox-fc-main-image").closest("div").css("height", $(window).height() - $(".fbphotobox-fc-header").outerHeight(true) - $(".fbphotobox-fc-footer").outerHeight(true));
		},
		repositionBox: function() {
			var container = $(".fbphotobox-main-container");
			var left = ($(window).width() - container.width())/2;
			var top = ($(window).height() - container.height())/2;
			$(".fbphotobox-main-container").css({left: left, top: top});
		},
		addTags: function(tagsCo) {
			var imgHeight = this.fbpMainImage.height();
			var imgWidth = this.fbpMainImage.width();
			var tagNode = $(document.createElement('div')).attr("class", "fbphotobox-tag");
			for (var i=0; i < tagsCo.length; i++) {
				var tempNode = tagNode.clone();
				tempNode.css({
					position: "absolute",
					left: (tagsCo[i].x * imgWidth),
					top: (tagsCo[i].y * imgHeight),
					width: (tagsCo[i].w * imgWidth),
					height: (tagsCo[i].h * imgHeight),
					zIndex: 999
				}).attr({
					x: tagsCo[i].x,
					y: tagsCo[i].y,
					w: tagsCo[i].w,
					h: tagsCo[i].h
				});
				/*if (true || tagsCo[i].text) {
					var tipNode = $('<div style="background-color:white;">hello</div>');
					tempNode.append(tipNode);
					tipNode.html(tagsCo[i].text);
				}*/
				tempNode.appendTo(this.fbpMainImage.closest("div"));
			}
		},
		showFullScreen: function(image) {
			$(".fbphotobox-fc-main-container").show();
			this.refreshFullScreenSize();
		},
		hideFullScreen: function() {
			$(".fbphotobox-fc-main-container").hide();
		},
		photoTransitionAnimation: function(image, from, to, callbackFunc) {
			var leftFrom = from.posX - parseInt($("body").css("margin-left"));
			var topFrom = from.posY - parseInt($("body").css("margin-top"));
			var leftTo = to.posX - parseInt($("body").css("margin-left"));
			var topTo = to.posY - parseInt($("body").css("margin-top"));
			image.css({
				top: topFrom,
				left: leftFrom,
				width: from.widthSrc,
				height: from.heightSrc,
				position: 'absolute',
				zIndex:999
			});
			$("body").append(image);
			image.animate({
				top: topTo,
				left: leftTo,
				width: to.widthSrc,
				height: to.heightSrc
			}, {duration:500, easing:'easeInOutCubic', complete: function() {
				callbackFunc();
			}, queue:false});
		}
	};
		
	$.fn.fbPhotoBox = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);
		var item = $("body");
		var instance = item.data('FBPhotoBox');
		
		if (typeof options === 'string') {
			instance[options].apply(instance, args);
		}
		else {
			item.data('FBPhotoBox', new FBPhotoBox(options));
		}
	};
	
	$.fn.fbPhotoBox.defaults = {
		rightWidth: 360,
		minLeftWidth: 520,
		minHeight: 520,
		leftBgColor: "black",
		rightBgColor: "white",
		footerBgColor: "black",
		overlayBgColor: "black",
		overlayBgOpacity: 0.5,
		onImageShow: function() {},
		afterInitDOM: function() {},
		imageOverlayFadeSpeed: 150,
		normalModeMargin: 40,
		containerClassName: 'fbphotobox',
		imageClassName: 'fbphotobox-target-img'
	};
}(jQuery));
