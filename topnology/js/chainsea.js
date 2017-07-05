var staticModel = {
	menu: {
			build: function(data, options){
				if(!data){return false;}
				if(location.search.indexOf('menu=none') != -1){return false;} // handle iframe link
				var defaults = {
					menu_style: 'nav-pills',
					menu_at: false,
					menu_at_data: static_data.breadcrumbs,
					menu_at_idx: 1,
					menu_has_item: true,
					menu_has_toggle: true, 
					menu_width_type: 'equal',
					menu_item_pull: 'pull-right'
				};
				var settings = $.extend({}, defaults, options);
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone();
					
				elem1.addClass('menu');			
				
				elem1.append('<ul class="content nav ' + settings.menu_style + '"></ul>');
				elem1.children().append(this._menu(
					data, 
					settings.menu_has_item,
					settings.menu_has_toggle,
					settings.menu_width_type,
					settings.menu_item_pull
				));
				wrap.append(elem1);
				
				if(settings.menu_at){
					this._menuAt(
						settings.menu_at_data, 
						settings.menu_at_idx, 
						elem1.children()
					);
				}
				
				return wrap.children();
			},
			
			_menu: function(data, hasItem, hasToggle, widthType, itemPull){
				if(!data){return false;}
				var wrap, elemTemplate;
				
				wrap = $('<div>');
				elemTemplate = $(
					'<li role="presentation">' +
						'<a></a>' +
					'</li>'
				);
				
				for(var i = 0; i < data.length; i++ ){
					var elem = elemTemplate.clone(),
						elemItem;
					
					elem
						.children('a')
							.attr({
								'href' : data[i].parentHref,
								'target' : data[i].parentTarget
							})
							.text(data[i].parentName);
					
					if(data[i].childHref == ''){
						elem.addClass('no_child');
						wrap.append(elem);
						continue;
					}
					
					//hasItem
					if(hasItem){
						//menuItem
						elemItem = this._menuItem(data[i]);
						
						if(i + 3 >= data.length){
							elemItem.addClass(itemPull);
						}
						
						elem.append(elemItem);
					
						//hasToggle		
						if(hasToggle){
							elem.addClass('menu_dropdown_toggle');
							elem.prepend(
								'<div>' +
									'<span class="glyphicon glyphicon-menu-down"></span>' +
									'<span class="glyphicon glyphicon-menu-right"></span>' +
								'</div>'
							);
							this._menuItemToggle(elem);
						}
					}
					
					wrap.append(elem);
				}
				
				//widthType
				this._menuItemWidth(elem, widthType);
				
				return wrap.children();
			},
			
			_menuItem : function(data){
				if(!data){return false;}
				var wrap, elemTemplatePr, elemTemplate;
				
				wrap = $('<div>');
				elemTemplatePr = $('<ul class="dropdown-menu" role="menu"></ul>');
				elemTemplate = $('<li role="presentation"><a role="menuitem" tabindex="-1"></a></li>');
				
				var elemPr = elemTemplatePr.clone(),
					childHrefSplit = data.childHref.split(','),
					childTargetSplit = data.childTarget.split(','),
					childNameSplit = data.childName.split(',');
					
				elemPr
					.attr({
						'aria-labelledby': data.parentName
					});
				for(var i = 0; i < childHrefSplit.length; i++){
					var elem = elemTemplate.clone();
					elem
						.children('a')
							.attr({
								'href': childHrefSplit[i],
								'target' : childTargetSplit[i]
							})
							.text(childNameSplit[i]);
					elemPr.append(elem);
					wrap.append(elemPr);
				}
				
				return wrap.children();
			},
			
			_menuItemWidth : function(lastItem, type){
				switch(type){
					case 'ratio' : 
						menuRatio(lastItem);
						break;
					case 'equal': 
						menuEqual(lastItem);
						break;
				}
				
				function menuRatio(lastItem){
					$('document').ready(function(){
						if(!lastItem){return false;}
						var childs = lastItem.parent().children('li'),
							totalWidth;
						totalWidth = 0;
						for(var i = 0; i < childs.length; i++ ){
							totalWidth += childs.eq(i).width();
						}
						for(var i = 0; i < childs.length; i++ ){
							var width = childs.eq(i).width();
							childs.eq(i).css({
								'width': width/totalWidth * 100 + '%'
							});
						}
						console.log(menuCont);
					});
				}
				
				function menuEqual(lastItem){
					if(!lastItem){return false;}
					var childs = lastItem.parent().children('li');
					childs.css({
						'width': 1 / childs.length * 100 + '%'
					});
				}
			},
			
			_menuItemToggle: function(toggle){
				if(!toggle){return false;}
				if($(window).width() > 768){return false;}
				toggle.on({
					'vclick' : function(e){
						if(!$(e.target).is("a")){
							var tgt = $(this);
							if(tgt.hasClass('active')){
								tgt.removeClass('active');
							}else{
								tgt.addClass('active');
							}
						}
					}
				});
			},
			
			_menuAt : function(data, dataIdx, tgtCont){
				//data : breadcrumbs
				//tgtCont : .menu .content
				if(!data||!dataIdx||!tgtCont){
					console.log('arguments error');
					return false;
				}
				var contList = tgtCont.children('li'),
					tgtNode = data[dataIdx].href.split('/')[dataIdx];
				for(var i = 0; i < contList.length; i++){
					var list = contList.eq(i),
						node = list.children('a').attr('href').split('/')[dataIdx];
					if(node == tgtNode){
						list.addClass('active');
						break;
					}
				}
			}
		},
	submenu: {
			build: function(data, options){
				if(!data){return false;}//data: sitemap
				if(location.search.indexOf('menu=none') != -1){return false;} // handle iframe link
				var defaults = {
					submenu_style: 'nav-pills',
					submenu_at: false,
					submenu_at_data: static_data.breadcrumbs,
					submenu_at_idx: 2,
					submenu_has_item: true
				};
				var settings = $.extend({}, defaults, options);
				
				var currentHref = settings.submenu_at_data[2].href,
					tgtData = [];
				for(var i = 0; i < data.length; i++){
					var branch = data[i];
					if(branch.childHref.match(currentHref) !== null){
						tgtData.push(branch);
						break;
					}
				}
				
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone();
					
				elem1.addClass('submenu');	
				
				elem1.append('<ul class="content nav"></ul>');
				elem1.children().append(
					staticModel.menu._menu(
						tgtData, 
						settings.submenu_has_item
					)	
				);
				elem1.find('ul ul')
					.addClass('nav '+ settings.submenu_style);
				wrap.append(elem1);
				
				if(settings.submenu_at){
					staticModel.menu._menuAt(
						settings.submenu_at_data, 
						settings.submenu_at_idx, 
						elem1.children().find('ul')
					);
				}
				
				return wrap.children();
			}
		},
	banner: {
			build: function(data, options){
				if(!data){return false;}
				var defaults = {
					banner_control : true,
					banner_Carousel: true,
					banner_CarouselTime: 5000
				};
				var settings = $.extend({}, defaults, options);
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone(),
					elem2 = elemTemplate.clone();
					
				elem1.addClass('banner');			
				elem2.addClass('banner_control');
				
				elem1.append('<div class="content"></div>');
				elem2.append('<ul class="content pagination"></ul>');
				
				elem1.children().append(this._banner(data));
				wrap.append(elem1);
				
				if(settings.banner_control){
					elem2.children().append(staticComponent.pageControl(elem1.children(), data.length));
					wrap.append(elem2);
				}
				if(settings.banner_Carousel){
					this._bannerCarousel.set(elem1.children(), settings.banner_CarouselTime);
					this._bannerCarousel.set(elem2.children(), settings.banner_CarouselTime);
					this._bannerCarousel.listen(elem1.children(), elem2.children());
				}
				
				return wrap.children();
			},
			
			_banner: function(data){
				if(!data){return false;}
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<a><img/></a>');
				for(var i = 0; i < data.length; i++ ){
					var elem = elemTemplate.clone();
					elem
						.attr({
							'title': data[i].title,
							'href': data[i].href,
							'target': data[i].target
						})
						.children()
							.attr('src', data[i].pic);
					wrap.append(elem);
				}
				wrap.children().first().addClass('active');
				return wrap.children();
			},
			
			_bannerCarousel: {
				set: function(tgt, sec){
					if(!tgt){return false;}
					//for ie9 and earlier
					if (document.all && !window.setInterval.isPolyfill) {
						var __nativeST__ = window.setInterval;
						window.setInterval = function (vCallback, nDelay ) {
							var aArgs = Array.prototype.slice.call(arguments, 2);
							return __nativeST__(vCallback instanceof Function ? function () {
								vCallback.apply(null, aArgs);
							} : vCallback, nDelay);
						};
						window.setInterval.isPolyfill = true;
					}
					var sec = sec || 5000,
						that = this;
					$(document).ready(function(){
						tgt.data()._sec = sec;
						tgt.data()._interval = setInterval(that._start, sec, tgt);
					});
				},
				listen: function(cont, ctrl){
					if(!cont || !ctrl){return false;}
					var that = this;
					ctrl.children().on({
						'vclick' : function(){
							clearInterval(cont.data()._interval);
							clearInterval(ctrl.data()._interval);
							cont.data()._interval = setInterval(that._start, cont.data()._sec, cont);
							ctrl.data()._interval = setInterval(that._start, ctrl.data()._sec, ctrl);
						}
					});
				},
				_start: function(tgt){
					//bannerContent
					var elems = tgt.children(),
						idx = tgt.children('.active').index(),
						length = elems.length,
						idxReset = 0;
						
					if(tgt.parent().hasClass('banner_control')){
						length -= 1;
						idxReset = 1;
					}
					
					idx += 1;
					if(idx == length){
						idx = idxReset;
					}
					elems.removeClass('active');
					elems.eq(idx).addClass('active');
				}
			}
		},
	advertisement: {
			build: function(data){
				if(!data){return false;}
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone();
					
				elem1.addClass('advertisement');	
				elem1.append('<div class="content"></div>');
				
				elem1.children().append(this._advertisement(data));
				wrap.append(elem1);
				
				return wrap.children();
			},
			
			_advertisement: function(data){
				if(!data){return false;}
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<a><img/></a>');
				for(var i = 0; i < data.length; i++ ){
					var elem = elemTemplate.clone();
					elem
						.attr({
							'title': data[i].title,
							'href': data[i].href,
							'target': data[i].target
						})
						.children()
							.attr('src', data[i].pic);
					wrap.append(elem);
				}
				return wrap.children();
			}
		},
	breadcrumbs: {
			build: function(data){
				if(!data){return false;}
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone();
					
				elem1.addClass('breadcrumbs');	
				elem1.append('<ol class="content breadcrumb"></ol>');
				
				elem1.children().append(this._breadcrumbs(data));
				wrap.append(elem1);
				
				return wrap.children();
			},
			
			_breadcrumbs: function(data){
				if(!data){return false;}
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<li>');
				elemChildTemplate = $('<a>');
				for(var i = 0; i < data.length; i++ ){
					var elem = elemTemplate.clone();
					if( i < data.length - 1){
						var elemChild = elemChildTemplate.clone();
						elemChild
							.attr({
								'href': data[i].href
							})
							.text(data[i].name);
						elem.append(elemChild);
					}else{
						elem.text(data[i].name);
					}
					wrap.append(elem);
				}
				wrap.children().last().addClass('active');
				return wrap.children();
			}
		},
	list: {
			build: function(data, options){
				if(!data){return false;}
				var defaults = {
					list_control: false,
					titlePosition: '',
					datePosition: '',
					pageItemLimit: 10
				};
				var settings = $.extend({}, defaults, options);
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone(),
					elem2 = elemTemplate.clone();
					
				elem1.addClass('list');	
				elem2.addClass('list_control');
				
				elem1.append('<div class="content"></div>');
				elem2.append('<ul class="content pagination"></ul>');
				
				elem1.children().append(this._list(
					data,
					settings.titlePosition,
					settings.datePosition,
					settings.pageItemLimit
				));
				wrap.append(elem1);
				
				if(settings.list_control){
					var pageCount = Math.ceil(data.length / settings.pageItemLimit);
					elem2.children().append(staticComponent.pageControl(elem1.children(), pageCount));
					wrap.append(elem2);
				}
				
				return wrap.children();
			},
			
			_list: function(data, position1, position2, limit){
				if(!data){return false;}
				var wrap, elemTemplate, elemChildTemplate;
				var pageCount = Math.ceil(data.length / limit),
					idx = 0;
				wrap = $('<div>');
				elemTemplate = $('<ul class="list-group">');
				elemChildTemplate = $(
					'<li class="list-group-item">' + 
						'<div class="date ' + position2 + '">' + 
							'<span></span>' +
						'</div>' +
						'<div class="title ' + position1 + '">' +
							'<a></a>' +
						'</div>' +
					'</li>'
				);
				for(var p = 0; p < pageCount ; p++){
					var elem = elemTemplate.clone();
					for(var i = 0; i < limit; i++ ){
						if(idx == data.length){
							break;
						}
						var elemChild = elemChildTemplate.clone();
						elemChild
							.find('a')
								.attr({
									'title': data[idx].title,
									'href': data[idx].href,
									'target': data[idx].target
								})
								.text(data[idx].title);
						elemChild
							.find('span')
								.text(data[idx].date);
						elem.append(elemChild);
						idx += 1;
					}
					wrap.append(elem);
				}
				wrap.children().eq(0).addClass('active');
				
				if(data.length == 0){
					wrap.append('<div class="message">撠𡁶�⊥鰵鞈��𨳍��</div>');
				}
				return wrap.children();
			}
		},
	sitemap:{
			build: function(data){
				if(!data){return false;}
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone();
					
				elem1.addClass('sitemap');	
				elem1.append('<div class="content"></div>');
				
				elem1.children().append(this._sitemap(data));
				wrap.append(elem1);
				
				return wrap.children();
			},
			
			_sitemap: function(data){
				if(!data){return false;}
				var wrap, elemTemplatePr, elemTemplate, ratio;
				wrap = $('<div>');
				elemTemplatePr = $('<ul><a></a></ul>');
				elemTemplate = $('<li><a></a></li>');
				ratio = 1 / data.length * 100;
				for(var i = 0; i < data.length; i++ ){
					var elemPr = elemTemplatePr.clone(),
						childHrefSplit = data[i].childHref.split(','),
						childTargetSplit = data[i].childTarget.split(','),
						childNameSplit = data[i].childName.split(',');
					elemPr
						.css({
							'float':'left',
							'width': ratio + '%'
						})
						.children('a')
							.attr({
								'href' : data[i].parentHref,
								'target' : data[i].parentTarget
							})
							.text(data[i].parentName);
					if(childHrefSplit == ''){
						wrap.append(elemPr);
						continue;
					}
					for(var j = 0; j < childHrefSplit.length; j++){
						elem = elemTemplate.clone();
						elem
							.children('a')
								.attr({
									'href': childHrefSplit[j],
									'target': childTargetSplit[j]
								})
								.text(childNameSplit[j]);
						elemPr.append(elem);
					}
					wrap.append(elemPr);
				}
				return wrap.children();
			}
		},
	share: {
			build: function(data){
				if(!data){return false;}
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone();
					
				elem1.addClass('share');	
				elem1.append('<div class="content"></div>');
				
				elem1.children().append(this._share(data));
				wrap.append(elem1);
				
				return wrap.children();
			},
			
			_share: function(data){
				if(!data){return false;}
				var protocol = window.location.protocol,
					refPath = (protocol == 'file:') ? './' : '/';
				var wrap, elemTemplate;
				var width,
					height,
					url = window.location.href,
					shareHref = {
						'facebook': 'https://www.facebook.com/sharer/sharer.php?u=',
						'twitter': 'https://twitter.com/intent/tweet?url='
					};
					
				if($(window).width() < 768){
					width = $(window).width();
					height = $(window).height()
				}else{
					width = 600,
					height = 300
				}
				wrap = $('<div>');
				elemTemplate = $('<a><img/></a>');
				for(var i = 0; i < data.length; i++ ){
					var elem = elemTemplate.clone();
					elem
						.attr({
							'href': shareHref[data[i].name] + url,
							'class': 'share_' + data[i].name, 
							'onclick': 'javascript:window.open(this.href, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + '");return false;',
							'target': '_blank'
						})
						.children('img')
							.attr({
								'src': refPath + 'images/logo_' + data[i].name + '.png'
							});
					wrap.append(elem);
				}
				return wrap.children();
			}
		}
};

var	staticComponent = {
	pageControl: function(tgtCont, pageCount){
			if(!tgtCont || !pageCount){return false;}
			var wrap, elemTemplatePrev, elemTemplateNext, elemTemplatePage;
			wrap = $('<div>');
			elemTemplatePrev = $('<li><a><span><</span></a></li>');
			elemTemplateNext = $('<li><a><span>></span></a></li>');
			elemTemplatePage = $('<li class="idx"><a><span></span></a></li>');
			//prev
			elemTemplatePrev.on('vclick', function(){
				var $this = $(this),
					$idxBtn = $this.siblings('.idx'),
					activeIdx = $idxBtn.closest('.active').index() - 1,
					cont = tgtCont;
				if(activeIdx == 0 ){
					activeIdx = $idxBtn.length - 1;
				}else{
					activeIdx -= 1;
				}
				cont.children().removeClass('active');
				cont.children().eq(activeIdx).addClass('active');
				$idxBtn.removeClass('active');
				$idxBtn.eq(activeIdx).addClass('active');
			});
			//next
			elemTemplateNext.on('vclick', function(){
				var $this = $(this),
					$idxBtn = $this.siblings('.idx'),
					activeIdx = $idxBtn.closest('.active').index() - 1,
					cont = tgtCont;
				if(activeIdx == $idxBtn.length - 1 ){
					activeIdx = 0;
				}else{
					activeIdx += 1;
				}
				cont.children().removeClass('active');
				cont.children().eq(activeIdx).addClass('active');
				$idxBtn.removeClass('active');
				$idxBtn.eq(activeIdx).addClass('active');
			});
			//page
			elemTemplatePage.on('vclick', function(){
				var $this = $(this),
					activeIdx = $this.index() - 1,
					cont = tgtCont;
				cont.children().removeClass('active');
				cont.children().eq(activeIdx).addClass('active');
				$this.siblings().removeClass('active');
				$this.addClass('active');
			});
			for(var i = 0; i < pageCount; i++ ){
				var elem = elemTemplatePage.clone(true);
				elem
					.children('a').find('span')
						.text((i + 1));
				wrap.append(elem);
			}
			wrap.prepend(elemTemplatePrev);
			wrap.append(elemTemplateNext);
			wrap.children().eq(1).addClass('active');
			return wrap.children();
		}
};

var	functionModel = {
	toggle: {
			listen: function(toggle, tgt){
				if(!toggle||!tgt){return false;}
				// handle iframe link
				if(location.search.indexOf('menu=none') != -1){
					toggle.hide();
					return false;
				}
				this._Toggle(toggle, tgt);
			},
			
			_Toggle: function(toggle, tgt){
				if(!toggle || !tgt){return false;}
				toggle.on({
					'vclick' : function(){
						if(tgt.hasClass('active')){
							tgt.removeClass('active');
						}else{
							tgt.addClass('active');
						}
					}
				});
			}
		},
	top: {
			listen: function(botton){
				this._top(botton);
			},
			
			_top: function(botton){
				if(!botton){return false;}
				botton.on({
					'vclick' : function(){
						window.scrollTo(0,0)
					}
				});
			}
		}
};

var	dynamicModel = {
	request: {
			build: function(data, options){
				if(!data){return false;}
				
				//handle iframe link
				if(location.search.indexOf('dynamic=none') != -1){
					return false;
				}
				
				//global data
				window.dynamic_history_system = '';
				window.dynamic_history_data = {};
				window.dynamic_history_index = [];
				window.dynamic_uid = {};
				//cookie
				var cookieDynamicUid = JSON.parse(this._cookie.read('dynamic_uid'));
				if(cookieDynamicUid){
					window.logging = false;
					window.loggingWork = true;
					window.dynamic_uid.value = cookieDynamicUid.value;
					window.dynamic_uid.mail = cookieDynamicUid.mail;
					window.dynamic_uid.name = cookieDynamicUid.name;
					window.dynamic_uid.fieldName = 'FContactId';
					window.dynamic_uid.operator = 'Equal';
					
					$('.ChatWho')
						.addClass('active')
						.text('�典末嚗�' + window.dynamic_uid.name);
				}
				//loadScript
				this._loadScript();
				
				var defaults = {
					dynamic_pop : false,
					dynamic_resizer: true,
					dynamic_toggle: true
				};
				var settings = $.extend({}, defaults, options);
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone(),
					elem2 = elemTemplate.clone(),
					elem3 = elemTemplate.clone(),
					elem4 = elemTemplate.clone();
					
				elem1.addClass('dynamic');
				elem2.addClass('dynamic_pop');
				elem3.addClass('dynamic_resizer');
				elem4.addClass('dynamic_toggle');
				
				elem1.append('<div class="content"></div>');
				elem2.append('<div class="content"></div>');
				elem4.append('<span class="glyphicon glyphicon-comment"></span>');
				
				elem1.children().append(this._dynamic(data));
				wrap.append(elem1);
				
				if(settings.dynamic_pop){
					elem2.children().append(this._dynamicPop());
					wrap.append(elem2);
				}
				if(settings.dynamic_resizer && !window.dynamic_chat_data){
					//no chat
					this._dynamicResizer(elem3);
					wrap.append(elem3);
				}
				if(settings.dynamic_toggle && !window.dynamic_chat_data){
					//no chat
					this._dynamicToggle(elem4);
					wrap.append(elem4);
				}
				
				return wrap.children();
			},
			
			nav: function(node){
				var dynamic = $('.dynamic');
				dynamic.addClass('active');
				dynamic.parent().addClass('active withchat');
				dynamic.find('.dynamic_menu .' + node).trigger('vclick');
			},
			
			surf: function(node, title){
				var that = this,
					dynamic = $('.dynamic'),
					tab = dynamic.find('.dynamic_tab'),
					cont = dynamic.find('.dynamic_cont'),
					tabDiv = $('<div class="webpage">'),
					contDiv = $('<div class="webpage">'),
					pageCount = tab.children('.webpage').length + 1,
					pageTitle = title,
					detachIdx = 4;
					
				dynamic.addClass('active');
				dynamic.parent().addClass('active withchat');
				
				//title
				if(!title){
					if(!window.webpageCount){
						window.webpageCount = 0;
					}
					window.webpageCount += 1;
					pageTitle = '蝬脤�����' + window.webpageCount;
				}
				
				//tab
				tabDiv
					.text(pageTitle)
					.prepend($('<span class="dynamic_tab_remove glyphicon glyphicon-remove">'));
				tab.prepend(tabDiv);
				tab.children().removeClass('active');
				tabDiv.addClass('active');
				that._dynamicTab(tabDiv);
				that._dynamicTabRemove(tabDiv.children('.dynamic_tab_remove'));
				
				//cont
				contDiv.append('<iframe src="' + node + '"></iframe>');
				cont.prepend(contDiv);
				cont.children().removeClass('active');
				contDiv.addClass('active');
				
				//tab limit
				tab.children().eq(detachIdx).detach();
				cont.children().eq(detachIdx).remove();
			},
			
			_dynamic : function(data){
				if(!data){return false;}
				var wrap, elemTemplate, elemChildTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				elemChildTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone(),
					elem2 = elemTemplate.clone(),
					elem3 = elemTemplate.clone(),
					elem4 = elemTemplate.clone();
					
				elem1.addClass('dynamic_tab');			
				elem2.addClass('dynamic_cont');
				elem3.addClass('dynamic_menu');
				elem4.addClass('dynamic_close');
				elem3.append(
					'<ul class="unfold">' +
						'<li><span class="glyphicon glyphicon-option-horizontal"></span></li>' +
					'</ul>'
				);
				elem4.append('<span class="glyphicon glyphicon-remove"></span>');
				
				//var systemCount = Object.keys(data).length,
				//percent = 1 / systemCount * 100;
				var percent = 1 / 3 * 100;
				var first = false;
				for(var key in data){
					//history
					window.dynamic_history_data[key] = [];
					window.dynamic_history_index[key] = -1;
					
					var elemChild1 = elemChildTemplate.clone(),
						elemChild2 = elemChildTemplate.clone(),
						elemChild3 = elemChildTemplate.clone();
						
					if(window.loggingWork && !first){
						if(key != "chat" && key != "login" && key != "register"){
							first = true;
							//tab
							elemChild1
								.addClass(key)
								.text(data[key].title)
								.prepend($('<span class="dynamic_tab_remove glyphicon glyphicon-remove">'));
							elem1.append(elemChild1);
					
							//cont
							window.dynamic_history_system = key;
							dynamicModel.request._historySet(data[key]);
							
							elemChild2.addClass(key);
							elemChild2.append(this._ask(data[key]));
							elem2.append(elemChild2);
						}
					}
					
					if(!window.loggingWork){
						if(key == "chat" || key =="login" || key =="register"){
							//tab
							elemChild1
								.addClass(key)
								.text(data[key].title)
								.prepend($('<span class="dynamic_tab_remove glyphicon glyphicon-remove">'));
							elem1.append(elemChild1);
						
							//cont
							window.dynamic_history_system = key;
							dynamicModel.request._historySet(data[key]);
							
							elemChild2.addClass(key);
							elemChild2.append(this._ask(data[key]));
							elem2.append(elemChild2);
						}
					}
					
					//menu
					if(key != "chat"){
						elemChild3
							.addClass(key)
							.text(data[key].title)
							.css('width', percent + '%');
						elem3.append(elemChild3);
					}
				}
				
				elem1.children().eq(0).addClass('active');
				elem2.children().eq(0).addClass('active');
				elem3.children('ul').children().eq(0).addClass('active');
				
				wrap.append(elem1, elem2, elem3, elem4);
				
				//after appending
				this._dynamicTab(elem1.children());
				this._dynamicTabRemove(elem1.find('.dynamic_tab_remove'));
				this._dynamicMenu(elem3.children('div'));
				this._dynamicMenufold(elem3);
				this._dynamicClose(elem4);
		
				if(window.loggingWork){
					elem1.find('.login').detach();
					elem2.find('.login').remove();
					elem3
						.find('.login')
							.text('�蒈�枂')
							.off('vclick')
							.on({
								'vclick' : function(){
									dynamicModel.request._cookie.erase('dynamic_uid');
									location.reload();
									//chat
									
								}
							});
				}
				
				//chat
				if(window.dynamic_chat_data){
					elem3.hide();
				}
				
				return wrap.children();
			},
			
			_dynamicPop : function(){
				var wrap, elemTemplate, elemChildTemplate_1, elemChildTemplate_2;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				elemChildTemplate_1 = $('<div class="pop_close"><span class="glyphicon glyphicon-remove"></span></div>');
				elemChildTemplate_2 = $('<div>');
				
				var elem1 = elemTemplate.clone(),
					elem2 = elemTemplate.clone();				
				elem1.addClass('dynamic_menu');
				elem2.addClass('dynamic_cont');
				
				var elemChild1 = elemChildTemplate_1.clone(),
					elemChild2 = elemChildTemplate_2.clone();
				elem1.append(elemChild1);
				elem2.append(elemChild2);
				
				elem2.children().eq(0).addClass('active');
				wrap.append(elem1, elem2);
				return wrap.children();
			},
			
			_dynamicToggle: function(toggle){
				if(!toggle){return false;}
				var that = this;
				toggle.on({
					'vclick' : function(){
						if(window.requestLoaded == 'loading'){
							return false;
						}
						if(!window.requestLoaded){
							window.requestLoaded = 'loading';
							var tempDiv = $('<div class="temp_div">');
							tempDiv.text('Loading...');
							tempDiv.appendTo($('body'));
							loading();
							function loading(){							
								setTimeout(function(){
									if(window.requestLoaded == true){
										tempDiv.remove();
										toggle.trigger('vclick');
									}else{
										loading();
										console.log('request loading');
									}
								}, 500);	
							}
							return false;
						}
						var $this = $(this),
							dynamic = $this.siblings('.dynamic'),
							dynamicZone = $this.parent(),
							mainZone = dynamicZone.next();
						if(dynamic.hasClass('active')){
							$this.removeClass('active');
							dynamicZone.removeClass('active');
							dynamic.removeClass('active');
							//for resized width
							dynamicZone.addClass('resized');
							mainZone.addClass('resized');
						}else{
							$this.addClass('active');
							dynamicZone.addClass('active');
							dynamic.addClass('active');
							//for resized width
							dynamicZone.removeClass('resized');
							mainZone.removeClass('resized');
						}
					}
				});
			},
			
			_dynamicClose: function(btn){
				if(!btn){return false;}
				btn.on({
					'vclick' : function(){
						var $this = $(this),
							dynamic =  $this.parents('.dynamic'),
							dynamicZone = dynamic.parent(),
							mainZone = dynamicZone.next(),
							toggle = dynamicZone.find('.dynamic_toggle');
							
						dynamic.removeClass('active');
						dynamicZone.removeClass('active withchat');
						dynamicZone.addClass('resized');
						toggle.removeClass('active');
						mainZone.addClass('resized');
						return false;
					}
				});
			},
			
			_dynamicResizer: function(resizer){
				if(!resizer){return false;}
				resizer.on({
					'vmousedown': function(){
						var $this = $(this),
							dynamicZone = $this.parents('.dynamic_zone'),
							mainZone = dynamicZone.siblings('.main_zone');
						dynamicZone.addClass('onresizer');
						mainZone.addClass('onresizer');
						$(document).off('vmousemove vmouseup').on({
							'vmousemove':function(e){
								var mainZoneWidth = mainZone.width(),
									maxX= $(window).width() - 768;
								//mainZoneWidth >= 768
								if(mainZoneWidth < 768 || e.clientX >= maxX){
									dynamicZone.css('width', maxX);
									mainZone.css('marginLeft', maxX);
									return false;		
								}
								// dynamicZoneWidth >= 320
								else if(e.clientX < 310){
									dynamicZone.css('width', 320);
									mainZone.css('marginLeft', 320);
									return false;
								}
								else{
									dynamicZone.css('width', e.clientX);
									mainZone.css('marginLeft', e.clientX);
								}
							},
							'vmouseup': function(e){
								$(document).off('vmousemove vmouseup');
								dynamicZone.removeClass('onresizer');
								mainZone.removeClass('onresizer');
							}
						});
					}
				});
			},
			
			_dynamicTab: function(tgt){
				if(!tgt){return false;}
				tgt.on({
					'vclick' : function(){
						var $this = $(this),
							thisIdx = $this.index(),
							thisClass = $this.attr('class').replace('active','').trim(),
							dynamic = $this.parents('.dynamic'),
							cont = dynamic.find('.dynamic_cont'),
							tab = dynamic.find('.dynamic_tab');
						
						tab.children().removeClass('active');
						tab.children().eq(thisIdx).addClass('active');
						cont.children().removeClass('active');
						cont.children().eq(thisIdx).addClass('active');
						
						window.dynamic_history_system = thisClass;
					}
				});
			},
			
			_dynamicTabRemove: function(tgt){
				if(!tgt){return false;}
				tgt.on({
					'vclick' : function(){
						var $this = $(this),
							pr = $this.parent(),
							prIdx = pr.index(),
							prClass = pr.attr('class').replace('active','').trim(),
							dynamic = pr.parents('.dynamic'),
							cont = dynamic.find('.dynamic_cont'),
							tab = dynamic.find('.dynamic_tab');
						
						if(tab.children().length > 1){
							tab.children().eq(prIdx).detach();
							cont.children().eq(prIdx).remove();
							
							prIdx -= 1;
							tab.children().removeClass('active');
							tab.children().eq(prIdx).addClass('active');
							cont.children().removeClass('active');
							cont.children().eq(prIdx).addClass('active');
							
							delete window.dynamic_history_data[prClass];
							prClass = tab.children().eq(prIdx).attr('class').replace('active','').trim();
							if(prClass){
								window.dynamic_history_system = prClass;
							}
						}else{
							alert("you can't close the last tab");
						}
					}
				});
			},
			
			_dynamicMenu: function(tgt){
				if(!tgt){return false;}
				var that = this;
				tgt.on({
					'vclick' : function(){
						var $this = $(this),
							thisText = $this.text(),
							thisClass = $this.attr('class'),
							dynamic = $this.parents('.dynamic'),
							cont = dynamic.find('.dynamic_cont'),
							tab = dynamic.find('.dynamic_tab'),
							detachIdx = 4;
						
						tab.children().removeClass('active');
						cont.children().removeClass('active');
						
						//new tab
						if(tab.children('.' + thisClass).length == 0){
							var div = $('<div>');
							div
								.text(thisText)
								.addClass(thisClass)
								.prepend($('<span class="dynamic_tab_remove glyphicon glyphicon-remove">'));
							tab.append(div);
							that._dynamicTab(div);
							that._dynamicTabRemove(div.children('.dynamic_tab_remove'));
						}
						
						//new cont
						if(cont.children('.' + thisClass).length == 0){
							var div = $('<div>');
							div
								.html('')
								.addClass(thisClass);
							cont.append(div);
						}
						
						//move the new one to the first position
						tab.children('.' + thisClass)
							.addClass('active')
							//.insertAfter(tab.children().eq(0));
							.prependTo(tab);
						cont.children('.' + thisClass)
							.addClass('active')
							//.insertAfter(cont.children().eq(0));
							.prependTo(cont);
						tab.children().eq(detachIdx).detach();
						cont.children().eq(detachIdx).remove();
						
						if(thisClass == 'chat'){
							cont.children('.' + thisClass).html(chatModel.build());
						}else{
							var data = typeof dynamic_gate_data[thisClass] !== 'undefined'? dynamic_gate_data[thisClass] : dynamic_route_data[thisClass];
							
							//history
							window.dynamic_history_system = thisClass;
							window.dynamic_history_data[thisClass] = [];
							window.dynamic_history_index[thisClass] = -1;
							dynamicModel.request._historySet(data);
							
							var pageCont = that._ask(data);
							cont.children('.' + thisClass).html(pageCont);
						}
					}
				});
			},
			
			_dynamicPopMenu: function(pop){
				if(!pop){return false;}
				var _close = pop.find(".pop_close");
					
				_close.on({
					'vclick' : function(){
						var $this = $(this);
						$this.parents('.dynamic_pop').removeClass('active');
					}
				});
			},
			
			_dynamicMenufold: function(menu){
				if(!menu){return false;}
					
				menu.find('ul').on({
					'vclick' : function(){
						var $this = $(this);
						if($this.hasClass('active')){
							menu.css('marginTop', -1 * ($this.outerHeight(true) + menu.children('div').outerHeight()));
							$this.removeClass('active');
						}else{
							menu.css('marginTop',  -1 * menu.height())
							$this.addClass('active');
						}
					}
				});
			},
			
			_ask: function(data){
				if(!data){return false;}
				var wrap, elemTemplate, elemChildTemplate_1, 
					elemChildTemplate_2;//prev
				wrap = $('<div>');
				elemTemplate = $('<div class="wrap">');
				elemChildTemplate_1 = $('<div class="title"></div>');
				//prev
				elemChildTemplate_2 = $(
					'<div class="prev">' +
						'<span class="glyphicon glyphicon-chevron-left"></span>' +
					'</div>'
				);
				
				var elem = elemTemplate.clone(),
					elemChild1 = elemChildTemplate_1.clone()
					elemChild2 = elemChildTemplate_2.clone();
					
				elemChild1.text(data.subtitle);
				elem.append(elemChild1);
				
				//prev
				var systemName = window.dynamic_history_system
					currentIdx = window.dynamic_history_index[systemName];
					
				if(currentIdx != 0){
					elemChild2
						.addClass('active')
						.on({
							'vclick': function(){
								var $this = $(this);
								
								dynamicModel.request._historyGet($this, 'prev');
							}
						});
				}
				elem.append(elemChild2);
				
				var dynamicTemplete;
				switch(data.template){
					case 'menu':
						dynamicTemplete = this._menu;
						break;
					case 'list':
						dynamicTemplete = this._list;
						elem.addClass('wrap_list');
						break;
					case 'cont':
						dynamicTemplete = this._cont;
						break;
					case 'form':
						dynamicTemplete = this._form;
						break;
					case 'info':
						dynamicTemplete = this._info;
						break;
				}
				for(var i = 0; i < data.content.length; i++ ){
					var elemChild3 = dynamicTemplete(this, data.content[i], i);
					elem.append(elemChild3);
				}
				
				elem.data('member', data.member);
				wrap.append(elem);
				return wrap.children();
			},
			
			_check: function(item, value, mustCheck){
				//$this: button or link
				//check
				if(!item){console.log('argument error');return false;}
				var checkSplit,
					checkIsOK = true,
					itemAlert = item.children('.item_alert'),
					alertText = '#' + itemAlert.text();
				//must
				if(mustCheck){
					checkSplit = ['must'];
				}else{
					checkSplit = item.data('check').split(',');
				}
				for(var i = 0; i < checkSplit.length; i++){
					var checkData = checkSplit[i].split('-'),
						checkName = checkData[0],
						checkLimit = 0;
						
					switch(checkName){
						case 'must':
							if(value == '' || value == null){
								checkIsOK = false;
								//alertText += ', must';
								alertText += ', 敹�憛�';
							}
							break;
						case 'password':
							if(item.siblings('.pw_check').length == 0){
								break;
							}
							var pwValue = item.siblings('.pw_check').find('.value').val();
							if(value != pwValue){
								checkIsOK = false;
								//alertText += ', passwords are not equal';
								alertText += ',撖�蝣潔�滢��稲';
							}
							break;
						case 'length':
							checkLimit = parseInt(checkData[1]);
							if(value.length > checkLimit){
								checkIsOK = false;
								//alertText += ', length > ' + checkLimit;
								alertText += ',�𩑈摨西���> ' + checkLimit;
							}
							break;
						case 'intLength':
							if(!(!isNaN(parseFloat(value)) && isFinite(value))){
								checkIsOK = false;
								//alertText += ', integer only';
								alertText += ',憿𧼮�衤�齿迤蝣�';
							}else{
								if(parseFloat(value) != parseInt(value)){
									checkIsOK = false;
									//alertText += ', integer only';
									alertText += ',憿𧼮�衤�齿迤蝣�';
								}else{
									checkLimit = parseInt(checkData[1]);
									if(value.length > checkLimit){
										checkIsOK = false;
										//alertText += ', length > ' + checkLimit;
										alertText += ',�𩑈摨西���> ' + checkLimit;
									}
								}
							}
							break;
						case 'floatLength':
							if(!(!isNaN(parseFloat(value)) && isFinite(value))){
								checkIsOK = false;
								//alertText += ', float only';
								alertText += ',憿𧼮�衤�齿迤蝣�';
							}else{
								checkLimit = parseInt(checkData[1]);
								if(value.indexOf('.') == -1){
									//integer is ok
								}else if(value.split('.')[1].length > checkLimit){
									checkIsOK = false;
									//alertText += ', float length > ' + checkLimit;
									alertText += ',�𩑈摨西���' + checkLimit;
								}
							}
							break;
						case '@':
							if(value.match('@') == null){
								checkIsOK = false;
								//alertText += ', email only';
								alertText += ',�萎辣�聢撘譍�齿迤蝣�';
							}
							break;
					}
				}
				itemAlert.text(alertText.replace('#,', '').replace('#', ''));
				return checkIsOK;
			},
			
			_send: function(item, itemData, params, values){
				//item :button item or link item
				if(!item||!itemData){console.log('argument error');return false;}
				if(params && values){
					if(params.length != values.length){console.log('argument error');return false;}
				}
				var url = itemData.url;
				var data;
				
				//login
				if(url.toLowerCase().match('contact.login.data') != null){
					data = {};
					for(var i = 0; i < params.length; i++){
						data[params[i]] = values[i];
					}
				}
				//contact.getListData
				else if(url.toLowerCase().match('contact.getlistdata.data') != null){
					data = {};
					data['conditions'] = [{}];
					data['conditions'][0]['value'] = window.dynamic_uid.value;
					data['conditions'][0]['fieldName'] = window.dynamic_uid.fieldName;
					data['conditions'][0]['operator'] = window.dynamic_uid.operator;
					data['fieldNames'] = ['FLastName', 'FFirstName'];
				}
				//getListData
				else if(url.toLowerCase().match('getlistdata.data') != null){
					data = {};
					data['conditions'] = [{}];
					if(item.parent().data('member') == 'true' && !window.loggingWork){
						alert('隢见��蒈��/please login');
						return false;
					}
					//from list
					if(itemData.type == 'head'){
						data['conditions'][0]['value'] = item.data('FId');
						data['conditions'][0]['fieldName'] = 'FId';
						data['conditions'][0]['operator'] = window.dynamic_uid.operator;
					}
					//from others
					else{
						data['conditions'][0]['value'] = window.dynamic_uid.value; //user id
						data['conditions'][0]['fieldName'] = window.dynamic_uid.fieldName;
						data['conditions'][0]['operator'] = window.dynamic_uid.operator;
					}
					//sc
					if(itemData.sc){
						window.dynamic_uid.sc = itemData.sc;
						var scVals = itemData.sc.split(',');
						if(window.dynamic_uid.value == scVals[0]){
							data['conditions'][0]['value'] = scVals[1];
							data['conditions'][0]['fieldName'] = 'FCustomerId';
							data['conditions'][0]['operator'] = 'Equal';
						}
					}
					if(params){
						console.log(params);
						for(var i = 0; i < params.length; i++){
							if(params[i] == 'keyword'){
								data['keyword'] = values[i];
							}else{
								if(!data['fieldNames']){
									data['fieldNames'] = [];
								}
								data['fieldNames'][i] = params[i];
							}
						}
					}
				}
				//save
				else if(url.toLowerCase().match('save.data') != null){
					data = {};
					data['data'] = [{}];
					if(itemData.jump == 'login' && window.loggingWork){
						alert('隢见��蒈�枂/please log out');
						return false;
					}
					if(item.parent().data('member') == 'true' && !window.loggingWork){
						alert('隢见��蒈��/please login');
						return false;
					}
					for(var i = 0; i < params.length; i++){
						data['data'][0][params[i]] = values[i];
					}
					if(window.dynamic_uid.value){
						data['data'][0]['FContactId'] = window.dynamic_uid.value;
					}
					//for register
					if(url.toLowerCase().match('contact') != null){
						data['data'][0]['FLoginAble'] = 'y';
					}
				}
				//console.log(data);
				
				var dataString = '', 
					dataRelay = {};
					
				dataRelay["url"] = url;
				dataRelay["params"] = data;
				dataString = JSON.stringify(dataRelay);
				
				var wrap = item.parent(),
					itemPrompt = wrap.children('.item_prompt'); 

				if(itemPrompt.length == 0){
					itemPrompt = $('<div class="item item_prompt">');
					wrap.append(itemPrompt);
				}
				itemPrompt.text('...');
				setTimeout(function(){itemPrompt.addClass('sending')}, 100);
				
				$.ajax({
					url: dynamic_temp_data.url_relay,
					method: 'POST',
					dataType: 'json',
					contentType: "application/json; charset=utf-8",
					data: dataString, 
					headers: dynamic_temp_data
				})
				.done(function(res){
					if(res._failed){
						itemPrompt.text(itemData.failure);
						return false;
					}
					//console.log('success');
					//console.log(res);
					itemPrompt.text(itemData.success);
					
					if(url.toLowerCase().match('contact.login.data') != null){
						if(res.resultCode == 0){
							itemData.url = itemData.url.replace('Contact.login.data', 'Contact.GetListData.data');
							window.logging = true;

							window.dynamic_uid = {};
							window.dynamic_uid.fieldName = 'FLoginMail';
							window.dynamic_uid.operator = 'Equal';
							for(var i = 0; i < params.length; i++){
								if(params[i] == 'contact_loginMail'){
									window.dynamic_uid.value = values[i];
									window.dynamic_uid.mail = values[i];
								}
							}
							dynamicModel.request._send(item, itemData);
							itemPrompt.text(itemData.success);
						}else if(res.resultCode == 2){
							//special case
							itemPrompt.text('�函�鞈祈���埝�匧�毺鍂�舐窗鈭箇蒈��');
						}else{
							itemPrompt.text(itemData.failure);
						}
					}else{
						//login
						if(window.logging){
							console.log(res);
							window.dynamic_uid.value = res.data.records[0]['FId'];
							window.dynamic_uid.name = res.data.records[0]['FLastName'] + res.data.records[0]['FFirstName'];
							window.dynamic_uid.fieldName = 'FContactId';
							window.dynamic_uid.operator = 'Equal';
							window.logging = false;
							window.loggingWork = true;
							
							dynamicModel.request._cookie.create('dynamic_uid', JSON.stringify({ 
								'value': window.dynamic_uid.value, 
								'mail': window.dynamic_uid.mail,
								'name': window.dynamic_uid.name
							}), 90);
							
							$('.ChatWho')
								.addClass('active')
								.text('�典末嚗�' + window.dynamic_uid.name);
								
							//change login into logout
							var dynamic = item.parents('.dynamic'),
								menu = dynamic.find('.dynamic_menu');
							$('.dynamic_menu .login')
									.text('�蒈�枂')
									.off('vclick')
									.on({
										'vclick' : function(){
											dynamicModel.request._cookie.erase('dynamic_uid');
											location.reload();
										}
									});
							//for chat		
							if(window.loggingWork){
								var allChatLink = $('.ChatMessageTextContent a');
								for(var i = 0; i < allChatLink.length; i ++){
									var attrClick =  allChatLink.eq(i).attr('onclick');
									if(attrClick){
										if(attrClick.match('\'login\'') != null){
											allChatLink.eq(i).text(function(){
												var theText = $(this).text(),
													replaceText = theText.substr(2);
												return theText.replace(replaceText, '�蒈�枂');
											});
										}
									}
								}
							}
						}
						//
						if(itemData.jump){
							var dynamic = item.parents('.dynamic'),
								cont = dynamic.find('.dynamic_cont'),
								tab = dynamic.find('.dynamic_tab'),
								menu = dynamic.find('.dynamic_menu'),
								systemName = window.dynamic_history_system;
							
							menu.find('.' + itemData.jump).trigger('vclick');
							tab.find('.' + systemName).detach();
							cont.find('.' + systemName).remove();
							
						}
						if(itemData.next){
							var	pageCont;
							
							//new page content
							window.serverData = res;
							if(dynamic_route_data[itemData.next]){
								//history
								dynamicModel.request._historySet(dynamic_route_data[itemData.next], res);
								
								pageCont = dynamicModel.request._ask(dynamic_route_data[itemData.next]);
							}else if(dynamic_gate_data[itemData.next]){
								//history
								dynamicModel.request._historySet(dynamic_gate_data[itemData.next]);
								
								pageCont = dynamicModel.request._ask(dynamic_gate_data[itemData.next]);
							}
							//fileupload
							if(itemData.fileupload){
								var itemFileupload = item.siblings('.item_fileupload');
								for(var i = 0; i < itemFileupload.length; i++){
									itemFileupload.eq(i).find('input.upload').trigger('click');
								}
							}
							//renew
							item.closest('.active').html(pageCont);
						}
					}
				})
				.fail(function(jqXHR, textStatus){
					console.log('failure');
					itemPrompt.text(itemData.failure);
					//alert( "Dynamic failed: " + textStatus);
				});
			},
			
			_historySet: function(data, serverData){
				if(!data){console.log('argument error');return false;}
				var systemName = window.dynamic_history_system,
					historyData = window.dynamic_history_data[systemName],
					historyIdx = window.dynamic_history_index[systemName];
				if(historyIdx < historyData.length - 1){
					window.dynamic_history_data[systemName] = historyData.slice(0, historyIdx + 1);
				}
				window.dynamic_history_data[systemName].push({
					'data': data,
					'serverData': serverData
				});
				window.dynamic_history_index[systemName] = window.dynamic_history_data[systemName].length - 1;
				
			},
			
			_historyGet: function(btn, way){
				if(!btn||!way){console.log('argument error');return false;}
				var systemName = window.dynamic_history_system,
					currentIdx = window.dynamic_history_index[systemName],
					pageCont;
				if(way == 'prev'){
					window.dynamic_history_index[systemName] -= 1;
					if(window.dynamic_history_index[systemName] < 0){
						window.dynamic_history_index[systemName] = 0;
					}
					if(currentIdx != 0){
						currentIdx -= 1;
					}
					var data = window.dynamic_history_data[systemName][currentIdx].data,
						serverData = window.dynamic_history_data[systemName][currentIdx].serverData;
						
					if(serverData){
						window.serverData = serverData;
					}
					//console.log(data);
					pageCont = dynamicModel.request._ask(data);
					btn.parent().parent().html(pageCont);
				}
			},
			
			_loadScript: function(){
				var protocol = window.location.protocol,
					refPath = (protocol == 'file:') ? './' : '/';
				if(protocol == 'file:'){return false;}
				var srcs = [
						refPath + 'js/jquery.ui.widget.js',
						refPath + 'js/load-image.min.js',
						refPath + 'js/canvas-to-blob.min.js',
						refPath + 'js/jquery.iframe-transport.js',
						refPath + 'js/jquery.fileupload.js',
						refPath + 'js/jquery.fileupload-process.js',
						refPath + 'js/jquery.fileupload-image.js',
						refPath + 'js/jquery.fileupload-validate.js'
					],
					loadedCount = 0;
					
				loadScript(srcs, loadedCount);
				
				function loadScript(srcs, loadedCount){
					if(loadedCount == srcs.length){
						window.requestLoaded = true;
						return false;
					}
					$.getScript(srcs[loadedCount])
					.done(function( script, textStatus ) {
						loadedCount += 1;
						loadScript(srcs, loadedCount);
					})
					.fail(function( jqxhr, settings, exception ) {
						console.log('get error');
						loadScript(srcs, loadedCount);
					});
				}
			},
			
			_menu: function(that, itemData, index){
				var itemElem,
					template = that._menuTemplate;
				switch(itemData.type){
					case 'link':
						itemElem = $(template.link);
						itemElem.children('div').text(itemData.name);
						itemElem.on({
							'vclick' : function(){
								var $this = $(this);

								if(itemData.url != ''){
									var paramsSplit = itemData.params.split(',');
									that._send($this, itemData, paramsSplit);
								}else{
									//history
									dynamicModel.request._historySet(dynamic_route_data[itemData.next]);
									
									var systemName = window.dynamic_history_system,
										pageCont = that._ask(dynamic_route_data[itemData.next]);
									$this.closest('.active').html(pageCont);
								}
								return false;
							}
						});
						break;
				}
				return itemElem;
			},
			
			_list: function(that, itemData, index){
				var itemElem,
					template = that._listTemplate,
					itemWrap = $('<div>');
				
				var namesSplit = itemData.names.split(','),
					paramsSplit = itemData.params.split(','),
					params_linkSplit = itemData.params_link.split(','),
					records;
				
				if(itemData.records){
					//for test
					records = itemData.records;
				}else{
					records = window.serverData.data.records;
				}
				switch(itemData.type){
					case 'head':
						itemElem = $(template.head);
						for(var i = 0; i < namesSplit.length; i++){
							itemElem.append('<div class="' + paramsSplit[i] + '">' + namesSplit[i] + '</div>');
						}
						itemWrap.append(itemElem);
						
						for(var i =0; i < records.length; i++){
							itemElem = $(template.link);
							for(var j = 0; j < namesSplit.length; j++){
								//sc 
								if(records[i][paramsSplit[j]] === undefined){
									records[i][paramsSplit[j]] = '敺�蝣箄��';
								}
								itemElem.append('<div class="' + paramsSplit[j] + '">' + records[i][paramsSplit[j]] + '</div>');
							}
							itemElem.data('FId', records[i].FId);
							itemWrap.append(itemElem);
						}
						break;
					case 'link':
						break;
				}
				itemWrap.children('.item_link').on({
					'vclick': function(){
						var $this = $(this);
					
						if(itemData.url != ''){
							that._send($this, itemData, params_linkSplit);
						}
					}
				});
				return itemWrap.children();
			},
			
			_cont: function(that, itemData, index){
				var itemElem,
					template = that._contTemplate;
				var	records = window.serverData.data.records;
				
				switch(itemData.type){
					case 'input':
						itemElem = $(template.input);
						itemElem.find('span').text(itemData.name);
						itemElem.find('input').val(records[0][itemData.param]);
						if(itemData.check.match('password') != null){
							itemElem.find('input').attr('type', 'password');
						}
						break;
					case 'textarea':
						itemElem = $(template.textarea);
						itemElem.find('span').text(itemData.name);
						itemElem.find('textarea').val(itemData.value).text(itemData.value);
						break;
					case 'button':
						itemElem = $(template.button);
						itemElem.children('input').val(itemData.name);
						itemElem.children('input').on({
							'vclick' : function(){
								//history
								dynamicModel.request._historySet(dynamic_route_data[itemData.next]);
								
								var $this = $(this),
									systemName = window.dynamic_history_system,
									pageCont = that._ask(dynamic_route_data[itemData.next]);
								$this.closest('.active').html(pageCont);
							}
						});
						break;
				}
				return itemElem;
			},
			
			_form: function(that, itemData, index){
				var itemElem,
					template = that._formTemplate;
				switch(itemData.type){
					case 'input':
						itemElem = $(template.input);
						itemElem.find('span').text(itemData.name);
						itemElem.find('input').val(itemData.value);
						if(itemData.check.match('password') != null){
							itemElem
								.addClass('pw_check')
								.find('input')
									.attr('type', 'password');
						}
						break;
					case 'textarea':
						itemElem = $(template.textarea);
						itemElem.find('span').text(itemData.name);
						itemElem.find('textarea').val(itemData.value).text(itemData.value);
						break;
					case 'radio':
						itemElem = $(template.radio);
						itemElem.find('span').text(itemData.name);
						var options = itemData.value.split(','),
							keys = itemData.key.split(',');
						for(var i = 0; i < options.length; i++){
							var radio = '<input type="radio" name="item' + index + '" value="' + keys[i] + '"/>' + options[i];
							itemElem.children('.right').append(radio);
						}
						break;
					case 'checkbox':
						itemElem = $(template.checkbox);
						itemElem.find('span').text(itemData.name);
						var options = itemData.value.split(','),
							keys = itemData.key.split(',');
						for(var i = 0; i < options.length; i++){
							var checkbox = '<input type="checkbox" name="item' + index + '" value="' + keys[i] + '"/>' + options[i];
							itemElem.children('.right').append(checkbox);
						}
						break;
					case 'select':
						itemElem = $(template.select);
						itemElem.find('span').text(itemData.name);
						var options = itemData.value.split(','),
							keys = itemData.key.split(',');
						for(var i = 0; i < options.length; i++){
							var option = '<option value="' + keys[i] + '">' + options[i] + '</option>';
							itemElem.find('select').append(option);
						}
						break;
					case 'datebox':
						itemElem = $(template.datebox);
						itemElem.find('span').text(itemData.name);
						itemElem.find('input').datepicker({
							dateFormat: "yy-mm-dd"
						});
						break;
					case 'fileupload':
						itemElem = $(template.fileupload);
						itemElem.children('.left').children('span').text(itemData.name);
						itemElem.children('.right').children('input.value').text(itemData.value);
						
						var btn = itemElem.children('.right').children('span');
							
						fileupload(btn);
						
						function fileupload(btn){
							btn.on({
								'vclick': function(){
									var $this = $(this),
										inputValue = $this.siblings('input.value'),
										inputUpload = $this.siblings('input.upload');
										
									inputValue.val('');
									inputUpload.off('click');
								}
							});
							btn.children().fileupload({
								url: itemData.url,
								autoUpload: false,
								maxFileSize: false,
								singleFileUploads: true,
								headers: dynamic_temp_data,
								add: function(e, data){
									var $this = $(this),
										inputValue = $this.parent().siblings('input.value'),
										inputUpload = $this.parent().siblings('input.upload');
									//console.log(data);
									
									var value = inputValue.val();
									$.each(data.files, function (index, file) {
										if (!index) {
											if(value == ''){
												value += file.name;
											}else{
												value += ', ' + file.name;
											}
										}
									});
									inputValue.val(value).text(value);
									
									inputUpload.on({
										'click': function(){
											var args = {};
											args['unitId'] = itemData.unit;
											args['entityId'] = window.serverData.entityIds[0];
											data.formData = {args: JSON.stringify(args)};
											//console.log(data);
											data.submit();
										}
									});
								}
							});
						}
						break;
					case 'button':
						// !! items must have value attributes in the form, 
						// or it will get undefined data when data is sending 
						itemElem = $(template.button);
						itemElem.children('input').val(itemData.name);
						itemElem.on({
							'vclick' : function(){
								var $this = $(this),
									siblings = $this.siblings('.item'),
									params = [], 
									values = [],
									isOK = true;
								if(itemData.url != ''){
									for(var i = 0; i < siblings.length; i++){
										var sibling = siblings.eq(i);
										sibling.find('.item_alert').text('');
										params[i] = sibling.data('param');
										
										if(sibling.find('.value').length != 0){
											values[i] = sibling.find('.value').val();
										}else{
											var checked = sibling.find('input:checked'),
												checkValue = '#';
											for(var j = 0; j < checked.length; j++){
												checkValue += ',' + checked.eq(j).val();
											}
											checkValue = checkValue.replace('#,', '').replace('#', '');
											values[i] = checkValue;
										}
										
										//console.log(values[i]);
										if(sibling.data('must')){
											if(!that._check(sibling, values[i], 'must')){
												isOK = false;
											}
										}
										
										//if must = '', value can be empty.
										if(sibling.data('check') && values[i] != ''){
											if(!that._check(sibling, values[i])){
												isOK = false;
											}
										}
									}
									if(isOK){
										console.log(isOK);
										that._send($this, itemData, params, values);
									}
								}
							}
						});
						break;
				}
				//param
				if(itemData.param){
					itemElem.data('param', itemData.param);
				}
				//must, check
				if(itemData.must || itemData.check){
					itemElem.append('<div class="item_alert"></div>');
				}
				//must
				if(itemData.must){
					itemElem.data('must', itemData.must);
					itemElem.addClass('item_must');
				}
				//check
				if(itemData.check){
					itemElem.data('check', itemData.check);
				}
				return itemElem;
			},
			
			_info: function(that, itemData, index){
				var itemElem,
					template = that._infoTemplate;
				switch(itemData.type){
					case 'input':
						itemElem = $(template.input);
						itemElem.children('input').val(itemData.value);
						break;
					case 'button':
						itemElem = $(template.button);
						itemElem.children('input').val(itemData.name);
						itemElem.children('input').on({
							'vclick' : function(){
								//history
								dynamicModel.request._historySet(dynamic_route_data[itemData.next]);
								
								var $this = $(this),
									systemName = window.dynamic_history_system,
									pageCont = that._ask(dynamic_route_data[itemData.next]);
								$this.closest('.active').html(pageCont);
							}
						});
						break;
				}
				return itemElem;
			},
			
			_menuTemplate: {
				link : 
					'<div class="item item_menu">' +
						'<div></div>' +
						'<span class="glyphicon glyphicon-chevron-right"></span>' +
					'</div>'
			},
			
			_listTemplate: {
				head : 
					'<div class="item item_list item_head">' +
					'</div>',
				link : 
					'<div class="item item_list item_link">' +
					'</div>'
			},
			
			_contTemplate: {
				input : 
					'<div class="item">' +
						'<div class="left"><span></span></div>' +
						'<div class="right"><input readonly/></div>' +  
					'</div>',
				textarea :
					'<div class="item">' +
						'<div class="left"><span></span></div>' +
						'<div class="right"><textarea readonly></textarea></div>' + 
					'</div>',
				button :
					'<div class="item">' +
						'<input type="button"/>' + 
					'</div>'
			},
			
			_formTemplate: {
				input : 
					'<div class="item">' +
						'<div class="left"><span></span></div>' +
						'<div class="right"><input class="value"/></div>' + 
					'</div>',
				textarea :
					'<div class="item">' +
						'<div class="left"><span></span></div>' +
						'<div class="right"><textarea class="value"></textarea></div>' + 
					'</div>',
				radio :		
					'<div class="item">' +
						'<div class="left"><span></span></div>' +
						'<div class="right"></div>' +
					'</div>',
				checkbox :		
					'<div class="item">' +
						'<div class="left"><span></span></div>' +
						'<div class="right"></div>' +
					'</div>',
				select : 		
					'<div class="item">' +
						'<div class="left"><span></span></div>' +
						'<div class="right">' +
							'<select class="value">' +
								'<option disabled="true"> -- </option>' +
							'</select>' +
						'</div>' +
					'</div>',
				datebox : 		
					'<div class="item">' +
						'<div class="left"><span></span></div>' +
						'<div class="right">' +
							'<input class="value"/>' +
						'</div>' +
					'</div>',
				fileupload :
					'<div class="item item_fileupload">' +
						'<div class="left"><span></span></div>' +
						'<div class="right">' +
							'<span class="glyphicon glyphicon-paperclip">' +
								'<input type="file" name="files[]" multiple/>' +
							'</span>' +
							'<input class="value" readonly/>' +
							'<input class="upload" type="button" value="upload" hidden/>' +
						'</div>' +
					'</div>',
				button :
					'<div class="item">' +
						'<input type="button"/>' + 
					'</div>'
			},
			
			_infoTemplate: {
				input : 
					'<div class="item">' +
						'<input readonly/>' + 
					'</div>',
				button :
					'<div class="item">' +
						'<input type="button"/>' + 
					'</div>'
			},
			
			_cookie: {
				create : function(name, value, days) {
					var expires;

					if(days){
						var date = new Date();
						date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
						expires = "; expires=" + date.toGMTString();
					}else{
						expires = "";
					}
					document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
				},
				read : function(name) {
					var nameEQ = encodeURIComponent(name) + "=";
					var ca = document.cookie.split(';');
					for (var i = 0; i < ca.length; i++) {
						var c = ca[i];
						while (c.charAt(0) === ' ') c = c.substring(1, c.length);
						if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
					}
					return null;
				},
				erase : function(name) {
					dynamicModel.request._cookie.create(name, "", -1);
				}
			}
		},
	chat: {
			build: function(data, options){
				if(!data){return false;}
				
				//handle iframe link
				if(location.search.indexOf('dynamic=none') != -1){
					return false;
				}
				
				var defaults = {
				};
				var settings = $.extend({}, defaults, options);
				
				var wrap, elemTemplate;
				wrap = $('<div>');
				elemTemplate = $('<div>');
				
				var elem1 = elemTemplate.clone(),
					elem2 = elemTemplate.clone(),
					elem3 = elemTemplate.clone();
					
				elem1.addClass('dynamic_chat');
				elem2.addClass('dynamic_chat_toggle qbi');
				elem3.addClass('dynamic_chat_toggle ivr');
				//elem3.append('<span class="glyphicon glyphicon-comment"></span>');
				
				elem1.append(this._chat());
				this._dynamicChatToggle(elem2);
				this._dynamicChatToggle(elem3);
				wrap.append(elem1, elem2, elem3);
				
				//chat's close button
				elem1.find('#CloseButton').on({
					'vclick': function(){
						var toggle = $('.dynamic_chat_toggle'),
							dynamicChat = toggle.siblings('.dynamic_chat'),
							dynamicChatZone = dynamicChat.parent(),
							dynamicZone = dynamicChatZone.next(),
							mainZone = dynamicChatZone.next().next();
							
						if(toggle.hasClass('active')){
							toggle.removeClass('active switch');
							dynamicChat.removeClass('active');
							dynamicChatZone.removeClass('active');
							dynamicZone.removeClass('active withchat');
							mainZone.removeClass('active withchat');
							//for resized width
							dynamicChatZone.addClass('resized');
							mainZone.addClass('resized');
						}
						return false;
					}
				});
				
				var that = this;
				setTimeout(function(){
					that._loadScript();
					that._loadCss();
				}, 500);
				return wrap.children();
			},
			link: function(node, title){
				if(!node){return false;}
				if(node.indexOf('/') == -1){
					//for qs
					dynamicModel.request.nav(node);
				}else{
					//for webpage
					dynamicModel.request.surf(node, title);
				}
			},
			_chat: function(){
				//if(!data){return false;}
				var wrap;
				wrap = $('<div>');
				
				wrap.append(
					'<div id="TopZone" unselectable="on">' +
						'<div id="Title"></div>' +
						'<div class="TopButtonZone">' +
							'<div id="TopButtonMenuToggle">' +
								'<span class="glyphicon glyphicon-menu-hamburger"></span>' +
							'</div>' +
							'<div id="TopButtonMenu">' +
								'<div id="HelpButton" class="TopButton"></div>' +
								'<div id="AttentionButton" class="TopButton"></div>' +
								'<div id="SurveyButton" class="TopButton"></div>' +
							'</div>' +
							'<div id="ApplyAgentButton" class="TopButton"></div>' +
						'</div>' +
					'</div>' +
					'<div class="ChatWho"></div>' +
					'<div id="LeftZone">' +
						'<div id="HintZone">' +
							'<div id="HintText"></div>' +
							'<div id="HintClose">&times;</div>' +
						'</div>' +
						'<div id="ChatZone">' +
							'<div id="MessageList">' +
							'</div>' +
							'<div id="Editor" contentEditable="true"></div>' +
							'<div class="ButtonZone" unselectable="on">' +
								'<div class="LeftButtonZone">' +
									//'<div class="Button IconButton ButtonDisabled" id="ApplyAgentButton"><div></div></div>' +
									'<div class="Button IconButton ButtonDisabled" id="AttachmentButton"><div></div></div>' +
									'<div class="Button IconButton ButtonDisabled" id="ImageButton"><div></div></div>' +
									'<div class="Button IconButton" id="EmojiButton"><div></div></div>' +
								'</div>' +
								'<div class="RightButtonZone">' +
									'<div class="Button ButtonDisabled" id="SendButton"></div>' +
									'<div class="Button" id="CloseButton"></div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="RightZone"></div>' +
					'<input id="fileupload" type="file" name="file">' +
					'<input id="imageupload" type="file" name="file" accept="image/*">'	
				);
				wrap.find('#ChatZone').append(function(){
					var html = 
							'<div class="chat_refresh">' +
								'<span class="glyphicon glyphicon-refresh"></span>' +
							'</div>';
					return $(html).on({
								'vclick': function(){
									$(this).siblings('#MessageList').children().remove();
										WebChat.messageIndex = 0;
										WebChat.chatId = null;
										WebChat.socket = null;
										WebChat.serverType = null;
										WebChat.stopChat();
										WebChat.startChat();
										// if(WebChat.chatId){
											// $(this).siblings('#MessageList').children().not('#ChatMessage_1, #ChatMessage_2').remove();
										// }else{
											// $(this).siblings('#MessageList').children().remove();
											// WebChat.messageIndex = 0;
											// WebChat.stopChat();
											// WebChat.startChat();
										// }
								}
							}).hide();
				});
				return wrap.children();
			},
			_dynamicChatToggle: function(toggle){
				if(!toggle){return false;}
				toggle.on({
					'vclick' : function(){
						if(window.chatLoaded == 'loading'){
							return false;
						}
						if(!window.chatLoaded){
							window.chatLoaded = 'loading';
							var tempDiv = $('<div class="temp_div">');
							tempDiv.text('Loading...');
							tempDiv.appendTo($('body'));
							loading();
							function loading(){							
								setTimeout(function(){
									if(window.chatLoaded == true){
										tempDiv.remove();
										toggle.trigger('vclick');
									}else{
										loading();
										console.log('chat loading');
									}
								}, 500);	
							}
							return false;
						}
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition(
								function (position) {
									WebChat.location = position.coords;
									WebChat.updateLocation();
								},
								function (error) {
									console.error("get location failed. errorcode=" + error.code);
									console.log(error);
								}
							);
						}
						
						var $this = $(this)
						chatSwitch($this);
					}
				});
				function chatSwitch($this){
					var dynamicChat = $this.siblings('.dynamic_chat'),
						dynamicChatZone = $this.parents('.dynamic_chat_zone'),
						mainZone = dynamicChatZone.siblings('.main_zone'),
						toggleOthers = $this.siblings('.dynamic_chat_toggle');
						
					//waiting for webchat
					if(typeof WebChat == 'undefined'){
						setTimeout(chatSwitch, 100, $this);
						return false;
					}
					
					if(toggle.hasClass('ivr') && WebChat.serverSystemTypeOfWebPage != 'TextIVR'){
						WebChat.serverSystemTypeOfWebPage = 'TextIVR';
					}else if(toggle.hasClass('qbi') && WebChat.serverSystemTypeOfWebPage != 'Robot'){
						WebChat.serverSystemTypeOfWebPage = 'Robot';
					}
					
					//chat
					dynamicChat.find('#MessageList').html('');
					WebChat.messageIndex = 0;
					WebChat.stopChat();
					WebChat.startChat();
					
					if(dynamicChat.find('#HintZone').css('display') == 'none'){
						setTimeout(function(){
							dynamicChat.find('#ChatZone').css('top', 0);
						}, 1);
					}
					
					if($this.hasClass('active')){
						$this.removeClass('active');
						dynamicChat.removeClass('active');
						dynamicChatZone.removeClass('active');
						mainZone.removeClass('active');
						//for switch
						$this.removeClass('switch');
						toggleOthers.removeClass('switch');
						//for resized width
						dynamicChatZone.addClass('resized');
						mainZone.addClass('resized');
					}else{
						$this.addClass('active');
						dynamicChat.addClass('active');
						dynamicChatZone.addClass('active');
						mainZone.addClass('active');
						//for switch
						toggleOthers.removeClass('active');
						toggleOthers.addClass('switch');
						//for resized width
						dynamicChatZone.removeClass('resized');
						mainZone.removeClass('resized');
						//for ie, reset the chatzone's top
						$("#ChatZone").css("top", $("#HintZone").outerHeight() + "px");
					}
				}
			},
			_loadScript: function(){
				var protocol = window.location.protocol,
					refPath = (protocol == 'file:') ? './' : '/';
				if(protocol == 'file:'){return false;}
				var srcs = [
						refPath + 'js/webchat/jquery-migrate-1.2.1.js',
						refPath + 'js/webchat/WebChat.js',
						refPath + 'js/webchat/Constant.js',
						refPath + 'js/webchat/Util.js',
						refPath + 'js/webchat/File.js',
						refPath + 'js/webchat/LeaveWord.js',
						refPath + 'js/webchat/ServiceGroupSelect.js',
						refPath + 'js/webchat/Survey.js',
						refPath + 'js/webchat/LinkAction.js',
						refPath + 'js/webchat/EmojiUtil.js',
						refPath + 'js/webchat/Emojitable.js',
						refPath + 'js/webchat/Stickertable.js',
						refPath + 'js/webchat/Gw.WebChat.GetTextResourceScript.js',
						refPath + 'js/webchat/jocket.js'
					],
					loadedCount = 0;
					
				//prevent from loading the same js twice
				if(!window.dynamic_gate_data){
					srcs.unshift(refPath + 'js/jquery.fileupload.js');
					srcs.unshift(refPath + 'js/jquery.ui.widget.js');
				}
				loadScript(srcs);
				
				function loadScript(srcs){
					if(!window.requestLoaded){
						setTimeout(function(){
							loadScript(srcs);
						}, 100);
						return false;
					}
					for(var i = 0; i < srcs.length; i++){
						load(srcs[i]);
					}
				}
				function load(src){
					$.getScript(src)
					.done(function( script, textStatus ) {
						loadedCount += 1;
						if(loadedCount == srcs.length){
							WebChat.doLoad();
							File.initialize();
							window.chatLoaded = true;
						}
					})
					.fail(function( jqxhr, settings, exception ) {
						console.log(src);
						console.log('get error');
						setTimeout(function(){load(src)}, 500);
					});
				}
			},
			_loadCss: function(){
				var protocol = window.location.protocol,
					refPath = (protocol == 'file:') ? './' : '/';
				var srcs = [
						refPath + 'css/webchat/LeaveWord.css',
						refPath + 'css/webchat/ServiceGroupSelect.css',
						refPath + 'css/webchat/Survey.css',
						refPath + 'css/webchat/Stickertable.css',
						refPath + 'css/webchat/WebChat.css'
					],
					loadedCount = 0;
				loadCss(srcs, loadedCount);
				
				function loadCss(srcs, loadedCount){
					if(loadedCount == srcs.length){
						return false;
					}
					loadedCount += 1;
					$("<link/>", {
					   rel: "stylesheet",
					   type: "text/css",
					   href: srcs[loadedCount]
					}).appendTo("head");
					loadCss(srcs, loadedCount);
				}
			}
		}
};