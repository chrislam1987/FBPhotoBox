(function($) {
	function FbPhotoBox(item, opts) {
		this.targetObj = item;
		this.settings = $.extend({}, $.fn.fbPhotoBox.defaults, opts);
		this.fullScreenMode = false;
		this.rightArrow = null;
		this.leftArrow = null;
		this.init();
	}
	
	FbPhotoBox.prototype = {
		init: function() {
			this.initDOM();
			
			var $this = this;
			var $thistTargetObj = $this.targetObj;
			this.rightArrow = $(".right-arrow");
			this.leftArrow = $(".left-arrow");
			
			this.initSettings();
			
			this.targetObj.click(function() {
				var image = $(this);
				$this.show($(image));
			});
			
			this.targetObj.bind("onFbBoxImageShow", this.settings.onImageShow);

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
			
			$(".fbphotobox-container-left").hover(function() {
				$(".fbphotobox-image-stage-overlay").fadeIn(150);
			}, function() {
				$(".fbphotobox-image-stage-overlay").fadeOut(150);
			});
			
			this.leftArrow.click(function() {
				var image = $thistTargetObj.get($this.leftArrow.attr("data-prev-index"));
				if (image) {
					$this.show($(image));
				}
			});
			
			this.rightArrow.click(function() {
				var image = $thistTargetObj.get($this.rightArrow.attr("data-next-index"));
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
			if (this.settings.leftWidth != "") {
				$(".fbphotobox-container-left").css("width", this.settings.leftWidth);
			}
			
			if (this.settings.rightWidth != "") {
				$(".fbphotobox-container-right").css("width", this.settings.rightWidth);
			}
			
			if (this.settings.height != "") {
				$(".fbphotobox-container-left").css("height", this.settings.height);
				$(".fbphotobox-container-right, .fbphotobox-image-content").css("height", this.settings.height);
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
				$(".fbphotobox-overlay").css("backgroundColor", overlayBgColor);
			}
			
			if (this.settings.overlayBgOpacity != "") {
				$(".fbphotobox-overlay").css("opacity", overlayBgOpacity);
			}
			
			$(".fbphotobox-main-image").css({"max-height": $(".fbphotobox-main-image").closest(".fbphotobox-container-left").height()+"px"});
			$(".fbphotobox-main-image").css({"max-width": $(".fbphotobox-main-image").closest(".fbphotobox-container-left").width()+"px"});
			$(".fbphotobox-main-container").css({
				width: Math.max($(".fbphotobox-container-left").width() + $(".fbphotobox-container-right").width(), 880),
				height: $(".fbphotobox-container-left").height()
			});
		},
		
		initDOM: function() {
			var html = '<div class="fbphotobox-main-container">';
			html += '<div><div class="fbphotobox-container"><div class="fbphotobox-container-left">';
			html += '<table style="height:100%;width:100%;text-align:center;"><tr><td><div style="position:relative;display:inline-block;">';
			html += '<img class="fbphotobox-main-image" src=""/></div></td></tr></table><div class="fbphotobox-image-stage-overlay">';
			html += '<div class="fbphotobox-container-left-header"><a title="Full Screen" class="fbphotobox-fc-btn fbphotobox-a" style="background-image: url(./images/Full-Screen-Expand-48.png);';
			html += 'background-repeat: no-repeat;background-size: 20px 20px;background-position: 0 0;display: block;width:20px;height:20px;"></a>';
			html += '</div><div data-prev-index="" class="left-arrow"><table style="height:100%"><tr><td style="vertical-align:middle;"><a class="fbphotobox-a" title="Previous" style="background-image: url(./images/Arrowhead-Left-01-48.png);';
			html += 'background-repeat: no-repeat;background-size: 35px 45px;background-position: 0px 0px;display: block;height: 45px;width: 35px;"></a>';
			html += '</td></tr></table></div><div data-next-index="" class="right-arrow"><table style="height:100%;"><tr><td style="vertical-align:middle;">';
			html += '<a class="fbphotobox-a" title="Next" style="background-image: url(./images/Arrowhead-Right-01-48.png);background-repeat: no-repeat;background-size: 35px 45px;';
			html += 'background-position: 0px 0px;display: block;height: 45px;width: 35px;"></a></td></tr></table></div>';
			html += '<div class="fbphotobox-container-left-footer"><div style="margin:20px;"><span style="font-weight:bold;">Dummy Photo Caption</span>';
			html += '<span style="color:#B3B3B3;"> in </span><span style="font-weight:bold;">Dummy Album Name</span></div></div><div class="fbphotobox-container-left-footer-bg"></div>';
			html += '</div></div><div class="fbphotobox-container-right" style="color:black;overflow-y:scroll;overflow-x:hidden;"><div class="fbphotobox-close-btn">';
			html += '<a title="Close" href="" style="float:right;margin:8px"><img src="./images/close.png" style="height:10px;width:10px"/></a><div style="clear:both"></div></div>';
			html += '<div class="fbphotobox-image-content"></div></div><div style="clear:both"></div></div></div></div>';
			html += '<div class="fbphotobox-fc-main-container"><div class="fbphotobox-fc-header" style="position:fixed;left:0px;right:0px;top:0px;"><div style="float:left">Dummy Header</div>';
			html += '<a class="fbphotobox-fc-close-btn" href="" style="float:right">Exit Full Screen Mode</a></div><div style="position:fixed;top:0px;right:0px;left:0px;bottom:0px;width:100%;margin:auto;height:700px;">';
			html += '<table style="width:100%;text-align:center;height:700px;"><tr><td class="fc-left-arrow" style="width:50px;text-align:center;"><a class="fbphotobox-a" title="Previous" style="background-image: url(./images/Arrowhead-Left-01-48.png);';
			html += 'background-repeat: no-repeat;background-size: 35px 45px;background-position: 0px 0px;display: block;height: 45px;width: 35px;"></a></td><td><img class="fbphotobox-fc-main-image" src="" style="max-width:900px;max-height:650px" />';
			html += '</td><td class="fc-right-arrow" style="width:50px;text-align:center;"><a class="fbphotobox-a" title="Next" style="background-image: url(./images/Arrowhead-Right-01-48.png);background-repeat: no-repeat;';
			html += 'background-size: 35px 45px;background-position: 0px 0px;display: block;height: 45px;width: 35px;"></a></td></tr></table></div><div class="fbphotobox-fc-footer" style="position:fixed;left:0px;right:0px;bottom:0px;">';
			html += 'Dummy Footer</div></div><div class="fbphotobox-overlay" style="display:none;"></div><div style="clear:both"></div>';
			$("body").append(html);
		},
		
		show: function(image) {
			this.removeTags();
			var index = this.targetObj.index(image);
			this.leftArrow.attr("data-prev-index", index-1);
			this.rightArrow.attr("data-next-index", index+1);
			if (index-1 < 0) this.leftArrow.hide();
			else this.leftArrow.show();
			if (index+1 >= this.targetObj.length) this.rightArrow.hide();
			else this.rightArrow.show();
			$(".fbphotobox-main-image").attr("src", "").attr("src", image.attr("fbphotobox-src"));
			$(".fbphotobox-overlay").show();
			$(".fbphotobox-main-container").show();
			image.trigger("onFbBoxImageShow");
		},
		
		showFullScreen: function(image) {
			$(".fbphotobox-fc-main-image").attr("src","").attr("src", image.attr("src"));
			$(".fbphotobox-fc-main-container").show();
			$(".fc-left-arrow a").css("display", this.leftArrow.css("display"));
			$(".fc-right-arrow a").css("display", this.rightArrow.css("display"));
		},
		
		hide: function() {
			$(".fbphotobox-overlay").hide();
			$(".fbphotobox-main-container").hide();
		},
		
		hideFullScreen: function() {
			$(".fbphotobox-fc-main-container").hide();
		},
		
		addTags: function(tagsCo, image) {
			var tagNode = $( "<div></div>", {"class": "fbphotobox-tag"});
			for (var i=0; i < tagsCo.length; i++) {
				var tempNode = tagNode.clone();
				tempNode.css({
					position: "absolute",
					left: (tagsCo[i].x * image.width()) + "px",
					top: (tagsCo[i].y * image.height()) + "px",
					width: (tagsCo[i].w * image.width()) + "px",
					height: (tagsCo[i].h * image.height()) + "px"
				});
				if (true || tagsCo[i].text) {
					var tipNode = $('<div style="width:150px;background-color:white;">hello</div>');
					tipNode.css("marginTop", parseInt(tempNode.css("top"))+10);
					tempNode.append(tipNode);
					tipNode.html(tagsCo[i].text);
					tipNode.css("marginLeft", (tempNode.outerWidth(true)-tipNode.outerWidth(true)-8)/2);
				}
				tempNode.insertAfter($(".fbphotobox-main-image"));
			}
		},
		
		addContent: function(content, image) {
			$(".fbphotobox-image-content").html(content);
		},
		
		removeTags: function() {
			var container = $(".fbphotobox-main-image").closest("div");
			container.find(".fbphotobox-tag").remove();
		}
	};
		
	$.fn.fbPhotoBox = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);
		var item = this;
		var instance = item.data('FbPhotoBox');
		
		if(!instance) {
			item.data('FbPhotoBox', new FbPhotoBox(this, options));
		} else {
			if(typeof options === 'string') {
				instance[options].apply(instance, args);
			}
		}
	};
	
	$.fn.fbPhotoBox.defaults = {
		leftWidth: "",
		rightWidth: "",
		height: "",
		leftBgColor: "",
		rightBgColor: "",
		footerBgColor: "",
		overlayBgColor: "",
		overlayBgOpacity: "",
		onImageShow: function() {}
	};
}(jQuery));