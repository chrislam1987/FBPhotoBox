(function($) {
	function FBPhotoBox(item, opts) {
		this.settings = $.extend({}, $.fn.fbPhotoBox.defaults, opts);
		this.targetObj = item;
		this.fullScreenMode = false;
		this.rightArrow = null;
		this.leftArrow = null;
		this.tempImage = new Image();
		this.init();
	}
	
	FBPhotoBox.prototype = {
		init: function() {
			var $this = this;
			this.initDOM();
			this.initSettings();
			this.rightArrow = $(".right-arrow");
			this.leftArrow = $(".left-arrow");
			this.tempImage.onload = function() { $this.refreshBoxSize(this); }
			$(window).resize(function() { $this.refreshBoxSize(); $this.refreshFullScreenSize(); });
			
			this.targetObj.click(function() {
				var image = $(this);
				$this.show(image);
			});
			
			$(".fbphotobox-main-image").bind("onFbBoxImageShow", this.settings.onImageShow);

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
				$this.showFullScreen($(".fbphotobox-main-image"));
				return false;
			});
			
			$(".fbphotobox-overlay").click(function() {
				$this.hide();
				return false;
			});
			
			$(".fbphotobox-main-image").click(function() {
				$this.rightArrow.click();
				return false;
			});
			
			$(".fbphotobox-main-image-dummy").load(function() {
				$this.refreshBoxSize(this);
			});
			
			$(".fbphotobox-container-left").hover(function() {
				$(".fbphotobox-image-stage-overlay").fadeIn($this.settings.imageOverlayFadeSpeed);
				$(".fbphotobox-tag").show();
			}, function() {
				$(".fbphotobox-image-stage-overlay").fadeOut($this.settings.imageOverlayFadeSpeed);
				$(".fbphotobox-tag").hide();
			});
			
			this.leftArrow.click(function() {
				var image = $this.targetObj.get($this.leftArrow.attr("data-prev-index"));
				if (image) {
					$this.show($(image));
				}
			});
			
			this.rightArrow.click(function() {
				var image = $this.targetObj.get($this.rightArrow.attr("data-next-index"));
				if (image) {
					$this.show($(image));
				}
			});
			// End of Normal Mode Binding //
			
			// Start of FullScreen Mode Binding //
			$(".fc-left-arrow .fbphotobox-a").click(function() {
				$this.leftArrow.click();
				$this.showFullScreen($(".fbphotobox-main-image"));
			});
			
			$(".fc-right-arrow .fbphotobox-a").click(function() {
				$this.rightArrow.click();
				$this.showFullScreen($(".fbphotobox-main-image"));
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
			var html = '<div class="fbphotobox-main-container">';
			html += '<div class="fbphotobox-container-left">';
			html += '<table style="height:100%;width:100%;text-align:center;">';
			html += '<tr><td><div style="position:relative;"><img class="fbphotobox-main-image" src=""/></div></td></tr></table>';
			html += '<div class="fbphotobox-image-stage-overlay">';
			html += '<div class="fbphotobox-container-left-header">';
			html += '<a title="Full Screen" class="fbphotobox-fc-btn fbphotobox-a" style="background-image: url(./images/fullscreen.png);';
			html +=	'background-repeat: no-repeat;background-size:auto;background-position: 0 0;display: block;width:18px;height:18px;"></a>';
			html += '</div>';
			html += '<div data-prev-index="" class="left-arrow">';
			html += '<table style="height:100%">';
			html += '<tr>';
			html += '<td style="vertical-align:middle;">';
			html += '<a class="fbphotobox-a" title="Previous" style="background-image: url(./images/Arrows-LWhite-icon.png);';
			html += 'background-repeat: no-repeat;background-size:auto;background-position: 0px 0px;display: block;height: 48px;width: 48px;"></a>';
			html += '</td>';
			html += '</tr>';
			html += '</table>';
			html += '</div>';
			html += '<div data-next-index="" class="right-arrow">';
			html += '<table style="height:100%;">';
			html += '<tr>';
			html += '<td style="vertical-align:middle;">';
			html += '<a class="fbphotobox-a" title="Next" style="background-image: url(./images/Arrows-RWhite-icon.png);background-repeat: no-repeat;background-size:auto;';
			html += 'background-position: 0px 0px;display: block;height: 48px;width: 48px;"></a>';
			html += '</td>';
			html += '</tr>';
			html += '</table>';
			html += '</div>';
			html += '<div class="fbphotobox-container-left-footer">';
			html += '<div style="margin:20px;">';
			html += '<span style="font-weight:bold;">Dummy Photo Caption</span>';
			html += '<span style="color:#B3B3B3;"> in </span>';
			html += '<span style="font-weight:bold;">Dummy Album Name</span>';
			html += '</div>';
			html += '</div>';
			html += '<div class="fbphotobox-container-left-footer-bg"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="fbphotobox-container-right">';
			html += '<div class="fbphotobox-close-btn">';
			html += '<a title="Close" href="" style="float:right;margin:8px">';
			html += '<img src="./images/close.png" style="height:10px;width:10px"/>';
			html += '</a>';
			html += '<div style="clear:both"></div>';
			html += '</div>';
			html += '<div class="fbphotobox-image-content" style="color:black;"></div>';
			html += '</div>';
			html += '<div style="clear:both"></div>';
			html += '</div>';
			html += '<div class="fbphotobox-fc-main-container">';
			html += '<div class="fbphotobox-fc-header" style="position:fixed;left:0px;right:0px;top:0px;color:white;">';
			html += '<div style="float:left">Dummy Header</div>';
			html += '<a class="fbphotobox-fc-close-btn" href="" style="color: #FFFFFF;float: right;padding: 2px 10px;text-decoration: none;">Exit</a>';
			html += '<div style="clear:both"></div>';
			html += '</div>';
			html += '<div style="position:fixed;top:0px;right:0px;left:0px;bottom:0px;margin:auto;">';
			html += '<table style="width:100%;height:100%;text-align:center;">';
			html += '<tr>';
			html += '<td class="fc-left-arrow" style="width:50px;text-align:center;">';
			html += '<a class="fbphotobox-a" title="Previous" style="background-image: url(./images/Arrows-LWhite-icon.png);';
			html += 'float:left;background-repeat: no-repeat;background-size:auto;background-position: 0px 0px;height: 48px;width: 48px;"></a>';
			html += '</td>';
			html += '<td>';
			html += '<img class="fbphotobox-fc-main-image" src=""/>';
			html += '</td>';
			html += '<td class="fc-right-arrow" style="width:50px;text-align:center;">';
			html += '<a class="fbphotobox-a" title="Next" style="background-image: url(./images/Arrows-RWhite-icon.png);background-repeat: no-repeat;';
			html += 'float:right;background-size:auto;background-position: 0px 0px;height: 48px;width: 48px;"></a>';
			html += '</td>';
			html += '</tr>';
			html += '</table>';
			html += '</div>';
			html += '<div class="fbphotobox-fc-footer" style="position:fixed;left:0px;right:0px;bottom:0px;color:white;">';
			html += 'Dummy Footer';
			html += '<div style="clear:both"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="fbphotobox-overlay" style="display:none;"></div>';
			html += '<div style="clear:both"></div>';
			$("body").append(html);
			this.settings.afterInitDOM();
		},
		
		show: function(image) {
			if (image.attr("fbphotobox-src")) {
				this.tempImage.src = image.attr("fbphotobox-src");
	        }
			else {
				this.tempImage.src = image.attr("src");
			}
			var container = $(".fbphotobox-main-image").closest("div");
			container.find(".fbphotobox-tag").remove();
			var index = this.targetObj.index(image);
			this.leftArrow.attr("data-prev-index", index-1);
			this.rightArrow.attr("data-next-index", index+1);
			if (index-1 < 0) this.leftArrow.hide();
			else this.leftArrow.show();
			if (index+1 >= this.targetObj.length) this.rightArrow.hide();
			else this.rightArrow.show();
			this.refreshTagSize();
		},
		
		showFullScreen: function(image) {
			$(".fbphotobox-fc-main-container").show();
			if (this.leftArrow.css("display") == "none") {
				$(".fc-left-arrow a").hide();
			}
			else {
				$(".fc-left-arrow a").show();
			}
			if (this.rightArrow.css("display") == "none") {
				$(".fc-right-arrow a").hide();
			}
			else {
				$(".fc-right-arrow a").show();
			}
			this.refreshFullScreenSize();
		},
		
		hide: function() {
			$(".fbphotobox-overlay").hide();
			$(".fbphotobox-main-container").hide();
		},
		
		hideFullScreen: function() {
			$(".fbphotobox-fc-main-container").hide();
		},
		
		addTags: function(tagsCo) {
			var imgHeight = $(".fbphotobox-main-image").height();
			var imgWidth = $(".fbphotobox-main-image").width();
			var tagNode = $(document.createElement('div')).attr("class", "fbphotobox-tag");
			for (var i=0; i < tagsCo.length; i++) {
				var tempNode = tagNode.clone();
				tempNode.css({
					position: "absolute",
					left: (tagsCo[i].x * imgWidth),
					top: (tagsCo[i].y * imgHeight),
					width: (tagsCo[i].w * imgWidth),
					height: (tagsCo[i].h * imgHeight)
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
				tempNode.appendTo($(".fbphotobox-main-image").closest("div"));
			}
		},
		
		refreshBoxSize: function(image) {
			var isShow = true;
			if (image == null) {
				image = this.tempImage;
				isShow = false;
			}
			
			var imageWidth = image.width;
			var imageHeight = image.height;
			var maxWidth = Math.max($(window).width() - this.settings.rightWidth - this.settings.normalModeMargin*2, this.settings.minLeftWidth);
			var maxHeight = Math.max($(window).height() - this.settings.normalModeMargin*2, this.settings.minHeight);
			
			if (imageHeight < maxHeight) {
				$(".fbphotobox-container-left").height(imageHeight);
				$(".fbphotobox-main-image").css("max-height",imageHeight);
			}
			else {
				$(".fbphotobox-container-left").height(maxHeight);
				$(".fbphotobox-main-image").css("max-height",maxHeight);
			}
			if (imageWidth < maxWidth) {
				$(".fbphotobox-container-left").width(imageWidth);
				$(".fbphotobox-main-image").css("max-width",imageWidth);
			}
			else {
				$(".fbphotobox-container-left").width(maxWidth);
				$(".fbphotobox-main-image").css("max-width",maxWidth);
			}
			
			if (isShow) {
				$(".fbphotobox-main-image").attr("src", "").attr("src", image.src);
				$(".fbphotobox-overlay").show();
				$(".fbphotobox-main-container").show();
				$(".fbphotobox-fc-main-image").attr("src","").attr("src", image.src);
			}
			
			$(".fbphotobox-container-right").css("height", $(".fbphotobox-container-left").height());
			$(".fbphotobox-image-content").css("height", $(".fbphotobox-container-left").height() - $(".fbphotobox-close-btn").height());
			
			$(".fbphotobox-main-container").css({
				width: ($(".fbphotobox-container-left").width() + $(".fbphotobox-container-right").width()),
				height: $(".fbphotobox-container-left").height()
			});
			
			if (isShow) {
				$(".fbphotobox-main-image").trigger("onFbBoxImageShow");
			}
			this.refreshTagSize();
		}, 
		
		refreshTagSize: function() {
			var $tag = $(".fbphotobox-main-image").closest("div").find(".fbphotobox-tag");
			var newHeight = $(".fbphotobox-main-image").height();
			var newWidth = $(".fbphotobox-main-image").width();
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
				"max-width": window.innerWidth - $(".fc-left-arrow").width() - $(".fc-right-arrow").width() - 20,
				"max-height": window.innerHeight - $(".fbphotobox-fc-header").outerHeight(true) - $(".fbphotobox-fc-footer").outerHeight(true)
			});
			$(".fbphotobox-fc-main-image").closest("div").css("height", window.innerHeight - $(".fbphotobox-fc-header").outerHeight(true) - $(".fbphotobox-fc-footer").outerHeight(true));
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