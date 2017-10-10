/**
 * @author Sen-dream
 */

var app = {
	util: {}
};

app.util = {
	$: function (selector) {
		var rquickExpr = /^(?:\.([\w-]+)|#([\w-]+)|(\w+))$/;
		var match = rquickExpr.exec(selector);

		// 若选择器足够简单，选择DOM的get方法
		if (match){
			if ( (m = match[1]) ){
				return document.getElementsByClassName(m)[0];
			}else if ( (m = match[2]) ){
				return document.getElementById(m);
			}else if ( (m = match[3]) ){
				return document.getElementsByTagName(m)[0];
			}
		}

		return document.querySelector(selector);
	},

	/* 检查类名是否存在 */
	hasClass: function (element, cls) {
		var elementClassNamePlusBlank = ' ' + element.className + ' ';
		var clsPlusBlank = ' ' + cls + ' ';
		return new RegExp(clsPlusBlank).test(elementClassNamePlusBlank);
	},

	/* 添加类名 */
	addClass: function (element, cls) {
		if (!app.util.hasClass(element, cls)){
			element.className += ' ' + cls;
		}
	},

	/* 移除类名 */
	removeClass: function (element, cls) {
		if (app.util.hasClass(element, cls)){
			var elementClassNamePlusBlank = ' ' + element.className + ' ';
			var clsPlusBlank = ' ' + cls + ' ';
			elementClassNamePlusBlank = elementClassNamePlusBlank.replace(clsPlusBlank, ' ');
			element.className = elementClassNamePlusBlank.substring(1, elementClassNamePlusBlank.length - 1);
		}
	},

	/* 切换类名 */
	toggleClass: function (element, cls) {
		if (app.util.hasClass(element, cls)){
			app.util.removeClass(element, cls);
		}else{
			app.util.addClass(element, cls);
		}
	}
}

!function (util) {
	var $ = util.$,
		hasClass = util.hasClass,
		addClass = util.addClass,
		removeClass = util.removeClass,
		toggleClass = util.toggleClass;
	

	// 关闭顶部广告（上滑效果）
	$('.close').addEventListener('click', function () {
		var ad = $('.header_ad');
		addClass(ad, 'slideUp');
		setTimeout(function () {
			$('header').removeChild(ad);
		}, 2000);	// 动画执行完毕后删除元素
	});

	// 侧导航展开（小分辨率下）
	var navAsideWrap = $('.nav_aside_wrap');
	$('.open').addEventListener('click', function () {
		toggleClass(navAsideWrap, 'active');
	});


	// 轮播图
	!function () {
		var order = 0,
			currentImgLi = $('.slider_img>li:nth-child(' + (order + 1) + ')'),
			currentNavLi = $('.slider_nav>li:nth-child(' + (order + 1) + ')'),
			slider = $('.slider');

		function change(newOrder) {
			order = (newOrder == undefined) ? ((order + 1) % 6) : newOrder;

			// 图片切换
			var newImgLi = $('.slider_img>li:nth-child(' + (order + 1) + ')');
			toggleClass(currentImgLi, 'active');
			toggleClass(newImgLi, 'active');
			currentImgLi = newImgLi;

			// 按钮切换
			var newNavLi = $('.slider_nav>li:nth-child(' + (order + 1) + ')');
			toggleClass(currentNavLi, 'active');
			toggleClass(newNavLi, 'active');
			currentNavLi = newNavLi;
		}

		// 轮播间隔
		const sliderChangeTime = 3000;

		// 自动播放
		var sliderTimer = setInterval(change, sliderChangeTime);

		// 鼠标置于轮播图上时暂停自动播放
		slider.addEventListener('mouseover', function () {
			clearInterval(sliderTimer);
		});
		slider.addEventListener('mouseout', function () {
			sliderTimer = setInterval(change, sliderChangeTime);
		})

		// 向左
		$('.prev').addEventListener('click', function () {
			change((order - 1 + 6) % 6);
		});
		// 向右
		$('.next').addEventListener('click', function () {
			change();
		});
		// 跳转
		var arrNavLi = document.querySelectorAll('.slider_nav>li');
		for (let i = 0; i < arrNavLi.length; i++){
			arrNavLi[i].addEventListener('mouseover', function () {
				change(i);
			})
		}

		// 触摸屏左右滑动（滑动后重新开始定时器）
		var startX,
			changedX;
		slider.addEventListener('touchstart', function (ev) {
			clearInterval(sliderTimer);
			startX = ev.touches[0].pageX;
		});
		slider.addEventListener('touchmove', function (ev) {
			changedX = ev.touches[0].pageX;
		});
		slider.addEventListener('touchend', function (ev) {
			if (changedX - startX < 0){
				// 上一张
				change((order - 1 + 6) % 6);
			}else{
				// 下一张
				change();
			}
			
			sliderTimer = setInterval(change, sliderChangeTime);
		});

	}();

	const
		// 每次加载商品的数量
		numOfNewLi = 20,
		// “猜您喜欢”列表最大高度
		maxHeightOfUl = (window.innerWidth >= 1200) ? 3000 : 8000,	// 最多懒加载3次
		// 预留高度
		heightToTop = 200;

	var
		// 新加载商品的信息
		messageOfNewLi = [],
		// 正在加载标记
		isLoading = false,
		// 页脚高度
		heightOfFooter = $('footer').offsetHeight,

		ul = $('.more'),
		followNav = $('#nav_follow'),
		searchBarWrap = $('.search_bar_wrap'),
		searchBar = $('.search_bar');

	/* 模拟获得新商品数据 */
	function getNewData(numOfNewLi) {
		var newMessage = [],
			randomLi;
		for (var i = 0; i < numOfNewLi; i++){

			if (Math.floor(Math.random() * 2) === 0){
				randomLi = {
					'img': 'images/bag.jpg',
					'title': '【五件套特惠】【工厂直供】梵蒂斯 时尚五件套女包 手提单肩斜挎手挽钱包多功能大容量女包 V16940米白',
					'price': '￥109.00',
					'href': ''
				};
			}else{
				randomLi = {
					'img': 'images/milk.jpg',
					'title': '德国 进口牛奶 Arla爱氏晨曦 全脂牛奶 200ml*24 整箱装',
					'price': '￥69.00',
					'href': ''
				};
			}

			newMessage.push(randomLi);
		}

		return newMessage;
	}

	/* 添加新加载商品 */
	function addNewLi(numOfNewLi) {
		messageOfNewLi = getNewData(numOfNewLi);

		var
			// 减少全局查找
			doc = document,
			// 最小化现场更新
			fragment = doc.createDocumentFragment();

		for (var i = 0; i < numOfNewLi; i++){
			var li = doc.createElement('li'),
				a = doc.createElement('a'),
				img = doc.createElement('img'),
				titleP = doc.createElement('p'),
				priceP = doc.createElement('p');

			img.src = messageOfNewLi[i].img;
			titleP.textContent = messageOfNewLi[i].title;
			priceP.textContent = messageOfNewLi[i].price;

			a.href = messageOfNewLi[i].href;
			a.title = messageOfNewLi[i].title;
			a.appendChild(img);
			a.appendChild(titleP);
			a.appendChild(priceP);

			li.appendChild(a);

			li.innerHTML += `<span class="border_top"></span>
			<span class="border_left"></span>
			<span class="border_right"></span>
			<span class="border_bottom"></span>
			`;

			fragment.appendChild(li);
		}

		ul.appendChild(fragment);
	}

	var followNavArr = document.querySelectorAll('#nav_follow li'),
		clothes = $('.clothes'),
		life = $('.life'),
		digit = $('.digit'),
		moreWrap = $('.more_wrap');

	/* 获取栏目位置 */
	function getPosition(index) {
		var position;
		switch (index){
			case 0: position = clothes.offsetTop - heightToTop; break;
			case 1: position = life.offsetTop - heightToTop; break;
			case 2: position = digit.offsetTop - heightToTop; break;
			case 3: position = moreWrap.offsetTop - heightToTop; break;
			case 4: position = 100000;	// 极大量
		}
		return position;
	}

	// 屏幕滚动触发事件
	window.addEventListener('scroll', function () {

		// 懒加载
		if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - heightOfFooter) && ul.offsetHeight < maxHeightOfUl && !isLoading) {
			// 屏幕滚动至页脚上方

			isLoading = true;

			setTimeout(function () {
				addNewLi(numOfNewLi);
				isLoading = false;
			}, 800);
		}else if(ul.offsetHeight >= maxHeightOfUl){
			$('.loading').style.display = 'none';
		}

		// 跟随导航显示/隐藏
		if (window.pageYOffset >= getPosition(0)){
			followNav.style.display = 'block';
			addClass(searchBarWrap, 'fixed');
			addClass(searchBar, 'fixed');
		}else{
			followNav.style.display = 'none';
			removeClass(searchBarWrap, 'fixed');
			removeClass(searchBar, 'fixed');
		}

		// 跟随导航显示当前位置
		for (var i = 0; i < 5; i++){	// 4个栏目 + 底部标记
			if (window.pageYOffset >= getPosition(i) && window.pageYOffset < getPosition(i + 1)){
				addClass(followNavArr[i], 'active');
			}else{
				removeClass(followNavArr[i], 'active');
			}
		}

	});

	var
		// 滚动动画执行中标记
		isAnimationRunning = false,
		// 强制停止当前滚动
		stopCurrentScroll = false;

	// 跟随导航点击事件
	for (let i = 0; i < followNavArr.length - 1; i++){
		followNavArr[i].addEventListener('click', function () {
			if (isAnimationRunning){
				stopCurrentScroll = true;
				var wait = setInterval(function () {
					if (!isAnimationRunning){
						stopCurrentScroll = false;
						clearInterval(wait);
						runScrollAnimation(getPosition(i));
					}
				}, 50);	// 每50ms判断一次动画是否已停止
			}else{
				runScrollAnimation(getPosition(i));
			}
		});
	}
	followNavArr[followNavArr.length - 1].addEventListener('click', function () {
		if (isAnimationRunning){
			stopCurrentScroll = true;
			var wait = setInterval(function () {
				if (!isAnimationRunning){
					stopCurrentScroll = false;
					clearInterval(wait);
					runScrollAnimation(0);
				}
			}, 50);
		}else{
			runScrollAnimation(0);
		}	
	});

	/* 滚动动画 */
	function runScrollAnimation(position) {
		var totalScrollDistance = position - window.pageYOffset;
		isAnimationRunning = true;
		if (window.pageYOffset < position){
			var scrollTimer = setInterval(function () {
				for (var i = 0; i < 50; i++){	// 每个时间间隔滚动50px，每滚动1px执行一次判断
					if (window.pageYOffset < position && !stopCurrentScroll){
						window.scroll(0, window.pageYOffset + 1);
					}else{
						clearInterval(scrollTimer);
						isAnimationRunning = false;
						break;
					}
				}
			}, 1000 / totalScrollDistance);	// 相同距离滚动时间相同
		}else if (window.pageYOffset > position){
			var scrollTimer = setInterval(function () {
				for (var i = 0; i < 50; i++){
					if (window.pageYOffset - 10  > position && !stopCurrentScroll){	// 提前结束，避免滚动到上一栏目
						window.scroll(0, window.pageYOffset - 1);
					}else{
						clearInterval(scrollTimer);
						isAnimationRunning = false;
						break;
					}
				}
			}, 1000 / totalScrollDistance);
		}	
	}

}(app.util);