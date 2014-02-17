(function($) {
	function FBPhotoBox(item, opts) {
		this.settings = $.extend({}, $.fn.fbPhotoBox.defaults, opts);
		this.targetObj = item;
		this.tempImage = new Image();
		this.fullScreenMode = false;
		this.rightArrow = null;
		this.leftArrow = null;
		this.mainImage = null;
		this.bodyDimension = {width:0,height:0};
		this.init();
	}
	
	FBPhotoBox.prototype = {
		init: function() {
			var $this = this;
			this.initDOM();
			this.initSettings();
			this.rightArrow = $(".right-arrow");
			this.leftArrow = $(".left-arrow");
			this.mainImage = $(".fbphotobox-main-image");
			this.bodyDimension.width = $('body').width();
			this.bodyDimension.height = $('body').height();
			this.tempImage.onload = function() { $this.refreshBoxSize(this); }
			
			$(window).resize(function() {
				$this.refreshBoxSize();
				$this.refreshFullScreenSize();
				if(navigator.appVersion.indexOf("MSIE 7.") != -1) { $this.repositionBox(); }
			});
			
			this.targetObj.click(function() { $this.show($(this)); });
			
			this.mainImage.bind("onFbBoxImageShow", this.settings.onImageShow);

			$(".fbphotobox-a").hover(function() {
				$(this).fadeTo("fast", 1);
			}, function() {
				$(this).fadeTo("fast", 0.5);
			});
			
			// Start of Normal Mode Binding //
			$(".fbphotobox-close-btn a").click(function() {
				$this.hide();
				return false;
			});
			
			$(".fbphotobox-fc-btn").click(function() {
				$this.fullScreenMode = true;
				$this.showFullScreen($this.mainImage);
				return false;
			});
			
			$(".fbphotobox-overlay").click(function() {
				$this.hide();
				return false;
			});
			
			this.mainImage.click(function() {
				$this.rightArrow.click();
				return false;
			});
			
			$(".fbphotobox-main-image-dummy").load(function() {
				$this.refreshBoxSize(this);
			});
			
			$(".fbphotobox-container-left").hover(function() {
				$(".fbphotobox-image-stage-overlay").fadeIn($this.settings.imageOverlayFadeSpeed);
			}, function() {
				$(".fbphotobox-image-stage-overlay").fadeOut($this.settings.imageOverlayFadeSpeed);
			});
			
			this.leftArrow.click(function() {
				var image = $this.targetObj.get($this.leftArrow.attr("data-prev-index"));
				if (image) $this.show($(image));
			});
			
			this.rightArrow.click(function() {
				var image = $this.targetObj.get($this.rightArrow.attr("data-next-index"));
				if (image) $this.show($(image));
			});
			// End of Normal Mode Binding //
			
			// Start of FullScreen Mode Binding //
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
			// End of FullScreen Mode Binding //
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
		
		show: function(image) {
			if (image.attr("fbphotobox-src")) this.tempImage.src = image.attr("fbphotobox-src");
			else this.tempImage.src = image.attr("src");
			$(".fbphotobox-tag").remove();
			var index = this.targetObj.index(image);
			this.leftArrow.attr("data-prev-index", index-1);
			this.rightArrow.attr("data-next-index", index+1);
			if (index-1 < 0) this.leftArrow.hide();
			else this.leftArrow.show();
			if (index+1 >= this.targetObj.length) this.rightArrow.hide();
			else this.rightArrow.show();
		},
		
		showFullScreen: function(image) {
			$(".fbphotobox-fc-main-container").show();
			if (this.leftArrow.css("display") == "none") $(".fc-left-arrow a").hide();
			else $(".fc-left-arrow a").show();
			if (this.rightArrow.css("display") == "none") $(".fc-right-arrow a").hide();
			else $(".fc-right-arrow a").show();
			this.refreshFullScreenSize();
		},
		
		hideFullScreen: function() {
			$(".fbphotobox-fc-main-container").hide();
		},
		
		hide: function() {
			$(".fbphotobox-overlay").hide();
			$(".fbphotobox-main-container").hide();
			this.displayScroll();
		},
		
		addTags: function(tagsCo) {
			var imgHeight = this.mainImage.height();
			var imgWidth = this.mainImage.width();
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
				if (true || tagsCo[i].text) {
					var tipNode = $('<div style="background-color:white;">hello</div>');
					tempNode.append(tipNode);
					tipNode.html(tagsCo[i].text);
				}
				tempNode.appendTo(this.mainImage.closest("div"));
			}
		},
		
		refreshBoxSize: function(image) {
			var isShow = image == null? false : true;
			image = image == null? this.tempImage : image;
			var leftContainer = $(".fbphotobox-container-left");
			var rightContainer = $(".fbphotobox-container-right");
			var imageWidth = image.width;
			var imageHeight = image.height;
			var maxWidth = Math.max($(window).width() - this.settings.rightWidth - this.settings.normalModeMargin*2, this.settings.minLeftWidth);
			var maxHeight = Math.max($(window).height() - this.settings.normalModeMargin*2, this.settings.minHeight);
			
			this.hideScroll();
			
			if (imageHeight < maxHeight) {
				leftContainer.height(imageHeight);
				this.mainImage.css("max-height",imageHeight);
			}
			else {
				leftContainer.height(maxHeight);
				this.mainImage.css("max-height",maxHeight);
			}
			if (imageWidth < maxWidth) {
				leftContainer.width(imageWidth);
				this.mainImage.css("max-width",imageWidth);
			}
			else {
				leftContainer.width(maxWidth);
				this.mainImage.css("max-width",maxWidth);
			}
						
			rightContainer.css("height", leftContainer.height());
			$(".fbphotobox-image-content").css("height", leftContainer.height() - $(".fbphotobox-close-btn").height());
			
			$(".fbphotobox-main-container").css({
				width: (leftContainer.width() + rightContainer.width()),
				height: leftContainer.height()
			});
			
			if (isShow) {
				if(navigator.appVersion.indexOf("MSIE 7.") != -1) this.repositionBox();
				this.mainImage.hide().attr("src", "").attr("src", image.src);
				$(".fbphotobox-overlay").show();
				$(".fbphotobox-main-container").show();
				this.mainImage.show(10, function() { $(this).trigger("onFbBoxImageShow"); });
				$(".fbphotobox-fc-main-image").attr("src","").attr("src", image.src);
			}

			if (!isShow) this.refreshTagSize();
		}, 
		
		refreshTagSize: function() {
			var $tag = $(".fbphotobox-tag");
			var newHeight = this.mainImage.height();
			var newWidth = this.mainImage.width();
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
		
		hideScroll: function() {
			$('body').css({width:$(window).width(),height:$(window).height(), overflow:"hidden"});
		},
		
		displayScroll: function() {
			$('body').css({width:this.bodyDimension.width, height:this.bodyDimension.height, overflow:"scroll"});
		}
	};
		
	$.fn.fbPhotoBox = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);
		var item = this;
		var instance = item.data('FBPhotoBox');
		
		if(!instance) {
			item.data('FBPhotoBox', new FBPhotoBox(this, options));
		} else {
			if(typeof options === 'string') {
				return instance[options].apply(instance, args);
			}
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
		overlayBgOpacity: 0.96,
		onImageShow: function() {},
		afterInitDOM: function() {},
		imageOverlayFadeSpeed: 150,
		normalModeMargin: 40
	};
}(jQuery));