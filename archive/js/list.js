(function ($) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

document.addEventListener('DOMContentLoaded', function () {
  var navItem = document.querySelectorAll('.recipe_nav_list_item'); // 筛选菜单
  var navItemArray = Array.prototype.slice.call(navItem);
  var productItem = document.querySelectorAll('.recipe_item'); // 商品列表
  var productItemArray = Array.prototype.slice.call(productItem);
  var productItemLen = productItem.length;
  var pagination = document.querySelector('.pagination');
  var paginationList = pagination.querySelector('.pagination_list'); // 分页器外层
  var prevButton = document.querySelector('.o-prev');
  var nextButton = document.querySelector('.o-next');
  var max = 20; // 一页最多显示几个
  var count = 0; // 当前第几个导航高亮
  var productCount = 0; // 给商品加计数器 翻页时使用
  var pageCount = 1; // 记录当前在第几页
  var paginationNum = 0; // 分页器显示的页数
  var paginationItem = null; // 获取分页器每个元素
  var isEllipsis = false;

  // 绑定页数
  var paginationFn = function () {
    paginationNum = Math.ceil(productItemLen / max);
    if (paginationNum > 5) {
      // 当分页多于5的时候 出现省略符
      isEllipsis = true;
      pagination.classList.remove('o-hide');
      var str = '';
      for (var i = 1; i <= 4; i++) {
        if (i === 1) {
          str += "<li class=\"pagination_list_item o-current\">" + i + "</li>";
          continue
        }
        str += "<li class=\"pagination_list_item\">" + i + "</li>";
      }
      str += "<li class=\"pagination_list_ellipsis o-ellipsis\">…</li>";
      str += "<li class=\"pagination_list_item\">" + paginationNum + "</li>";
      paginationList.innerHTML = str;
      str = null;
      paginationItem = paginationList.querySelectorAll('.pagination_list_item');
    } else if (paginationNum <= 5 && paginationNum !== 1) {
      // 当分页小于5并且不等于
      isEllipsis = false;
      pagination.classList.remove('o-hide');
      var str$1 = '';
      for (var i$1 = 1; i$1 <= paginationNum; i$1++) {
        if (i$1 === 1) {
          str$1 += "<li class=\"pagination_list_item o-current\">" + i$1 + "</li>";
          continue
        }
        str$1 += "<li class=\"pagination_list_item\">" + i$1 + "</li>";
      }
      paginationList.innerHTML = str$1;
      str$1 = null;
      paginationItem = paginationList.querySelectorAll('.pagination_list_item');
    } else {
      // 当分页只有一个的时候 隐藏分页
      pagination.classList.add('o-hide');
    }
  };
  paginationFn();

  // 点击菜单
  navItemArray.forEach(function (item, index) {
    item.index = index;
    item.addEventListener('click', function () {
      if (!this.classList.contains('o-current')) {
        productCount = 0;
        pageCount = 1;
        navItem[count].classList.remove('o-current');
        this.classList.add('o-current');
        count = this.index;
        nextButton.classList.remove('o-hide');
        prevButton.classList.add('o-hide');
        sortFn(this.dataset.category);
        paginationFn();
        smoothScrollTop();
      }
    });
  });

  // 筛选功能
  var sortFn = function (ele) {
    if ( ele === void 0 ) ele = 'all';

    productItemArray.forEach(function (item, index) {
      item.classList.add('o-hide');
      if (ele === 'all') {
        item.setAttribute('data-index', productCount++);
        if (index < max) {
          item.classList.remove('o-hide');
        }
      } else {
        item.removeAttribute('data-index');
        if (item.dataset.category.split(' ').indexOf(ele) !== -1) {
          item.setAttribute('data-index', productCount++);
          if (item.dataset.index < max) {
            item.classList.remove('o-hide');
          }
        }
      }
      productItemLen = productCount;
    });
  };
  sortFn();

  // 翻页功能
  var pageChangeFn = function (num) {
    productItemArray.forEach(function (item) {
      if (item.dataset.index >= (num - 1) * max && item.dataset.index < num * max) {
        item.classList.remove('o-hide');
      } else {
        item.classList.add('o-hide');
      }
    });
  };

  // 分页器有省略符时的变换效果
  var paginationChangeFn = function (num) {
    var str = '';
    if (num < 4) {
      for (var i = 0; i < 4; i++) {
        if (i === num - 1) {
          str += "<li class=\"pagination_list_item o-current\">" + (i + 1) + "</li>";
          continue
        }
        str += "<li class=\"pagination_list_item\">" + (i + 1) + "</li>";
      }
      str += "<li class=\"pagination_list_ellipsis o-ellipsis\">…</li>\n      <li class=\"pagination_list_item\">" + paginationNum + "</li>";
    } else if (num >= 4 && num < paginationNum - 2) {
      str += "<li class=\"pagination_list_item\">1</li>\n      <li class=\"pagination_list_ellipsis o-ellipsis\">…</li>\n      <li class=\"pagination_list_item\">" + (num - 1) + "</li>\n      <li class=\"pagination_list_item o-current\">" + num + "</li>\n      <li class=\"pagination_list_item\">" + (num + 1) + "</li>\n      <li class=\"pagination_list_ellipsis o-ellipsis\">…</li>\n      <li class=\"pagination_list_item\">" + paginationNum + "</li>";
    } else {
      str += "<li class=\"pagination_list_item\">1</li>\n      <li class=\"pagination_list_ellipsis o-ellipsis\">…</li>";
      for (var i$1 = paginationNum - 3; i$1 <= paginationNum; i$1++) {
        if (i$1 === num) {
          str += "<li class=\"pagination_list_item o-current\">" + i$1 + "</li>";
          continue
        }
        str += "<li class=\"pagination_list_item\">" + i$1 + "</li>";
      }
    }
    paginationList.innerHTML = str;
    str = null;
    paginationItem = paginationList.querySelectorAll('.pagination_list_item');
  };

  // 点击数字 翻页 (动态绑定需要用事件委托做)
  paginationList.addEventListener('click', function (e) {
    var eTarget = e.target;
    if (!isNaN(eTarget.innerHTML) && !eTarget.classList.contains('o-current')) {
      var tempPageCount = pageCount;
      pageCount = Number(eTarget.innerHTML);
      if (pageCount === paginationNum) {
        nextButton.classList.add('o-hide');
      } else {
        nextButton.classList.remove('o-hide');
      }
      if (pageCount !== 1) {
        prevButton.classList.remove('o-hide');
      } else {
        prevButton.classList.add('o-hide');
      }
      if (isEllipsis) {
        paginationChangeFn(pageCount);
      } else {
        eTarget.classList.add('o-current');
        paginationItem[tempPageCount - 1].classList.remove('o-current');
      }
      pageChangeFn(pageCount);
      smoothScrollTop();
    }
  });

  // 点击左按钮 翻页
  prevButton.addEventListener('click', function () {
    pageCount--;
    if (isEllipsis) {
      paginationChangeFn(pageCount);
    } else {
      paginationItem[pageCount].classList.remove('o-current');
      paginationItem[pageCount - 1].classList.add('o-current');
    }

    if (pageCount === 1) {
      this.classList.add('o-hide');
    } else {
      this.classList.remove('o-hide');
    }
    if (pageCount !== paginationNum) {
      nextButton.classList.remove('o-hide');
    } else {
      nextButton.classList.add('o-hide');
    }
    pageChangeFn(pageCount);
    smoothScrollTop();
  });

  // 点击右按钮 翻页
  nextButton.addEventListener('click', function () {
    pageCount++;
    if (isEllipsis) {
      paginationChangeFn(pageCount);
    } else {
      paginationItem[pageCount - 2].classList.remove('o-current');
      paginationItem[pageCount - 1].classList.add('o-current');
    }

    if (pageCount === paginationNum) {
      this.classList.add('o-hide');
    } else {
      this.classList.remove('o-hide');
    }
    if (pageCount !== 1) {
      prevButton.classList.remove('o-hide');
    } else {
      prevButton.classList.add('o-hide');
    }
    pageChangeFn(pageCount);
    smoothScrollTop();
  });

  // 平滑滚动
  var smoothScrollTop = function () {
    var $offsetTop = $('.recipe_nav').offset().top;
    $('html, body').animate({
      scrollTop: $offsetTop
    }, 1000, 'swing');
  };
});

}(jQuery));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl2ZS9qcy9saXN0LmpzIiwic291cmNlcyI6WyJzcmMvYXJjaGl2ZS9qcy9saXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAkIGZyb20gJ2pxdWVyeSdcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgY29uc3QgbmF2SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWNpcGVfbmF2X2xpc3RfaXRlbScpIC8vIOetm+mAieiPnOWNlVxuICBjb25zdCBuYXZJdGVtQXJyYXkgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChuYXZJdGVtKVxuICBjb25zdCBwcm9kdWN0SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWNpcGVfaXRlbScpIC8vIOWVhuWTgeWIl+ihqFxuICBjb25zdCBwcm9kdWN0SXRlbUFycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocHJvZHVjdEl0ZW0pXG4gIGxldCBwcm9kdWN0SXRlbUxlbiA9IHByb2R1Y3RJdGVtLmxlbmd0aFxuICBjb25zdCBwYWdpbmF0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2luYXRpb24nKVxuICBjb25zdCBwYWdpbmF0aW9uTGlzdCA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignLnBhZ2luYXRpb25fbGlzdCcpIC8vIOWIhumhteWZqOWkluWxglxuICBjb25zdCBwcmV2QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm8tcHJldicpXG4gIGNvbnN0IG5leHRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuby1uZXh0JylcbiAgY29uc3QgbWF4ID0gMjAgLy8g5LiA6aG15pyA5aSa5pi+56S65Yeg5LiqXG4gIGxldCBjb3VudCA9IDAgLy8g5b2T5YmN56ys5Yeg5Liq5a+86Iiq6auY5LquXG4gIGxldCBwcm9kdWN0Q291bnQgPSAwIC8vIOe7meWVhuWTgeWKoOiuoeaVsOWZqCDnv7vpobXml7bkvb/nlKhcbiAgbGV0IHBhZ2VDb3VudCA9IDEgLy8g6K6w5b2V5b2T5YmN5Zyo56ys5Yeg6aG1XG4gIGxldCBwYWdpbmF0aW9uTnVtID0gMCAvLyDliIbpobXlmajmmL7npLrnmoTpobXmlbBcbiAgbGV0IHBhZ2luYXRpb25JdGVtID0gbnVsbCAvLyDojrflj5bliIbpobXlmajmr4/kuKrlhYPntKBcbiAgbGV0IGlzRWxsaXBzaXMgPSBmYWxzZVxuXG4gIC8vIOe7keWumumhteaVsFxuICBjb25zdCBwYWdpbmF0aW9uRm4gPSAoKSA9PiB7XG4gICAgcGFnaW5hdGlvbk51bSA9IE1hdGguY2VpbChwcm9kdWN0SXRlbUxlbiAvIG1heClcbiAgICBpZiAocGFnaW5hdGlvbk51bSA+IDUpIHtcbiAgICAgIC8vIOW9k+WIhumhteWkmuS6jjXnmoTml7blgJkg5Ye6546w55yB55Wl56ymXG4gICAgICBpc0VsbGlwc2lzID0gdHJ1ZVxuICAgICAgcGFnaW5hdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdvLWhpZGUnKVxuICAgICAgbGV0IHN0ciA9ICcnXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSA0OyBpKyspIHtcbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICBzdHIgKz0gYDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9pdGVtIG8tY3VycmVudFwiPiR7aX08L2xpPmBcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG4gICAgICAgIHN0ciArPSBgPGxpIGNsYXNzPVwicGFnaW5hdGlvbl9saXN0X2l0ZW1cIj4ke2l9PC9saT5gXG4gICAgICB9XG4gICAgICBzdHIgKz0gYDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9lbGxpcHNpcyBvLWVsbGlwc2lzXCI+4oCmPC9saT5gXG4gICAgICBzdHIgKz0gYDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9pdGVtXCI+JHtwYWdpbmF0aW9uTnVtfTwvbGk+YFxuICAgICAgcGFnaW5hdGlvbkxpc3QuaW5uZXJIVE1MID0gc3RyXG4gICAgICBzdHIgPSBudWxsXG4gICAgICBwYWdpbmF0aW9uSXRlbSA9IHBhZ2luYXRpb25MaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdpbmF0aW9uX2xpc3RfaXRlbScpXG4gICAgfSBlbHNlIGlmIChwYWdpbmF0aW9uTnVtIDw9IDUgJiYgcGFnaW5hdGlvbk51bSAhPT0gMSkge1xuICAgICAgLy8g5b2T5YiG6aG15bCP5LqONeW5tuS4lOS4jeetieS6jlxuICAgICAgaXNFbGxpcHNpcyA9IGZhbHNlXG4gICAgICBwYWdpbmF0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ28taGlkZScpXG4gICAgICBsZXQgc3RyID0gJydcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHBhZ2luYXRpb25OdW07IGkrKykge1xuICAgICAgICBpZiAoaSA9PT0gMSkge1xuICAgICAgICAgIHN0ciArPSBgPGxpIGNsYXNzPVwicGFnaW5hdGlvbl9saXN0X2l0ZW0gby1jdXJyZW50XCI+JHtpfTwvbGk+YFxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgc3RyICs9IGA8bGkgY2xhc3M9XCJwYWdpbmF0aW9uX2xpc3RfaXRlbVwiPiR7aX08L2xpPmBcbiAgICAgIH1cbiAgICAgIHBhZ2luYXRpb25MaXN0LmlubmVySFRNTCA9IHN0clxuICAgICAgc3RyID0gbnVsbFxuICAgICAgcGFnaW5hdGlvbkl0ZW0gPSBwYWdpbmF0aW9uTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5hdGlvbl9saXN0X2l0ZW0nKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDlvZPliIbpobXlj6rmnInkuIDkuKrnmoTml7blgJkg6ZqQ6JeP5YiG6aG1XG4gICAgICBwYWdpbmF0aW9uLmNsYXNzTGlzdC5hZGQoJ28taGlkZScpXG4gICAgfVxuICB9XG4gIHBhZ2luYXRpb25GbigpXG5cbiAgLy8g54K55Ye76I+c5Y2VXG4gIG5hdkl0ZW1BcnJheS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgIGl0ZW0uaW5kZXggPSBpbmRleFxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdvLWN1cnJlbnQnKSkge1xuICAgICAgICBwcm9kdWN0Q291bnQgPSAwXG4gICAgICAgIHBhZ2VDb3VudCA9IDFcbiAgICAgICAgbmF2SXRlbVtjb3VudF0uY2xhc3NMaXN0LnJlbW92ZSgnby1jdXJyZW50JylcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdvLWN1cnJlbnQnKVxuICAgICAgICBjb3VudCA9IHRoaXMuaW5kZXhcbiAgICAgICAgbmV4dEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvLWhpZGUnKVxuICAgICAgICBwcmV2QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ28taGlkZScpXG4gICAgICAgIHNvcnRGbih0aGlzLmRhdGFzZXQuY2F0ZWdvcnkpXG4gICAgICAgIHBhZ2luYXRpb25GbigpXG4gICAgICAgIHNtb290aFNjcm9sbFRvcCgpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICAvLyDnrZvpgInlip/og71cbiAgY29uc3Qgc29ydEZuID0gKGVsZSA9ICdhbGwnKSA9PiB7XG4gICAgcHJvZHVjdEl0ZW1BcnJheS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdvLWhpZGUnKVxuICAgICAgaWYgKGVsZSA9PT0gJ2FsbCcpIHtcbiAgICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBwcm9kdWN0Q291bnQrKylcbiAgICAgICAgaWYgKGluZGV4IDwgbWF4KSB7XG4gICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdvLWhpZGUnKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpXG4gICAgICAgIGlmIChpdGVtLmRhdGFzZXQuY2F0ZWdvcnkuc3BsaXQoJyAnKS5pbmRleE9mKGVsZSkgIT09IC0xKSB7XG4gICAgICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBwcm9kdWN0Q291bnQrKylcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhc2V0LmluZGV4IDwgbWF4KSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ28taGlkZScpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwcm9kdWN0SXRlbUxlbiA9IHByb2R1Y3RDb3VudFxuICAgIH0pXG4gIH1cbiAgc29ydEZuKClcblxuICAvLyDnv7vpobXlip/og71cbiAgY29uc3QgcGFnZUNoYW5nZUZuID0gKG51bSkgPT4ge1xuICAgIHByb2R1Y3RJdGVtQXJyYXkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLmRhdGFzZXQuaW5kZXggPj0gKG51bSAtIDEpICogbWF4ICYmIGl0ZW0uZGF0YXNldC5pbmRleCA8IG51bSAqIG1heCkge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ28taGlkZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ28taGlkZScpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIOWIhumhteWZqOacieecgeeVpeespuaXtueahOWPmOaNouaViOaenFxuICBjb25zdCBwYWdpbmF0aW9uQ2hhbmdlRm4gPSAobnVtKSA9PiB7XG4gICAgbGV0IHN0ciA9ICcnXG4gICAgaWYgKG51bSA8IDQpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIGlmIChpID09PSBudW0gLSAxKSB7XG4gICAgICAgICAgc3RyICs9IGA8bGkgY2xhc3M9XCJwYWdpbmF0aW9uX2xpc3RfaXRlbSBvLWN1cnJlbnRcIj4ke2kgKyAxfTwvbGk+YFxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgc3RyICs9IGA8bGkgY2xhc3M9XCJwYWdpbmF0aW9uX2xpc3RfaXRlbVwiPiR7aSArIDF9PC9saT5gXG4gICAgICB9XG4gICAgICBzdHIgKz0gYDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9lbGxpcHNpcyBvLWVsbGlwc2lzXCI+4oCmPC9saT5cbiAgICAgIDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9pdGVtXCI+JHtwYWdpbmF0aW9uTnVtfTwvbGk+YFxuICAgIH0gZWxzZSBpZiAobnVtID49IDQgJiYgbnVtIDwgcGFnaW5hdGlvbk51bSAtIDIpIHtcbiAgICAgIHN0ciArPSBgPGxpIGNsYXNzPVwicGFnaW5hdGlvbl9saXN0X2l0ZW1cIj4xPC9saT5cbiAgICAgIDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9lbGxpcHNpcyBvLWVsbGlwc2lzXCI+4oCmPC9saT5cbiAgICAgIDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9pdGVtXCI+JHtudW0gLSAxfTwvbGk+XG4gICAgICA8bGkgY2xhc3M9XCJwYWdpbmF0aW9uX2xpc3RfaXRlbSBvLWN1cnJlbnRcIj4ke251bX08L2xpPlxuICAgICAgPGxpIGNsYXNzPVwicGFnaW5hdGlvbl9saXN0X2l0ZW1cIj4ke251bSArIDF9PC9saT5cbiAgICAgIDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9lbGxpcHNpcyBvLWVsbGlwc2lzXCI+4oCmPC9saT5cbiAgICAgIDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9pdGVtXCI+JHtwYWdpbmF0aW9uTnVtfTwvbGk+YFxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gYDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9pdGVtXCI+MTwvbGk+XG4gICAgICA8bGkgY2xhc3M9XCJwYWdpbmF0aW9uX2xpc3RfZWxsaXBzaXMgby1lbGxpcHNpc1wiPuKApjwvbGk+YFxuICAgICAgZm9yIChsZXQgaSA9IHBhZ2luYXRpb25OdW0gLSAzOyBpIDw9IHBhZ2luYXRpb25OdW07IGkrKykge1xuICAgICAgICBpZiAoaSA9PT0gbnVtKSB7XG4gICAgICAgICAgc3RyICs9IGA8bGkgY2xhc3M9XCJwYWdpbmF0aW9uX2xpc3RfaXRlbSBvLWN1cnJlbnRcIj4ke2l9PC9saT5gXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICBzdHIgKz0gYDxsaSBjbGFzcz1cInBhZ2luYXRpb25fbGlzdF9pdGVtXCI+JHtpfTwvbGk+YFxuICAgICAgfVxuICAgIH1cbiAgICBwYWdpbmF0aW9uTGlzdC5pbm5lckhUTUwgPSBzdHJcbiAgICBzdHIgPSBudWxsXG4gICAgcGFnaW5hdGlvbkl0ZW0gPSBwYWdpbmF0aW9uTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnaW5hdGlvbl9saXN0X2l0ZW0nKVxuICB9XG5cbiAgLy8g54K55Ye75pWw5a2XIOe/u+mhtSAo5Yqo5oCB57uR5a6a6ZyA6KaB55So5LqL5Lu25aeU5omY5YGaKVxuICBwYWdpbmF0aW9uTGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgZVRhcmdldCA9IGUudGFyZ2V0XG4gICAgaWYgKCFpc05hTihlVGFyZ2V0LmlubmVySFRNTCkgJiYgIWVUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvLWN1cnJlbnQnKSkge1xuICAgICAgY29uc3QgdGVtcFBhZ2VDb3VudCA9IHBhZ2VDb3VudFxuICAgICAgcGFnZUNvdW50ID0gTnVtYmVyKGVUYXJnZXQuaW5uZXJIVE1MKVxuICAgICAgaWYgKHBhZ2VDb3VudCA9PT0gcGFnaW5hdGlvbk51bSkge1xuICAgICAgICBuZXh0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ28taGlkZScpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ28taGlkZScpXG4gICAgICB9XG4gICAgICBpZiAocGFnZUNvdW50ICE9PSAxKSB7XG4gICAgICAgIHByZXZCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnby1oaWRlJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXZCdXR0b24uY2xhc3NMaXN0LmFkZCgnby1oaWRlJylcbiAgICAgIH1cbiAgICAgIGlmIChpc0VsbGlwc2lzKSB7XG4gICAgICAgIHBhZ2luYXRpb25DaGFuZ2VGbihwYWdlQ291bnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlVGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ28tY3VycmVudCcpXG4gICAgICAgIHBhZ2luYXRpb25JdGVtW3RlbXBQYWdlQ291bnQgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKCdvLWN1cnJlbnQnKVxuICAgICAgfVxuICAgICAgcGFnZUNoYW5nZUZuKHBhZ2VDb3VudClcbiAgICAgIHNtb290aFNjcm9sbFRvcCgpXG4gICAgfVxuICB9KVxuXG4gIC8vIOeCueWHu+W3puaMiemSriDnv7vpobVcbiAgcHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBwYWdlQ291bnQtLVxuICAgIGlmIChpc0VsbGlwc2lzKSB7XG4gICAgICBwYWdpbmF0aW9uQ2hhbmdlRm4ocGFnZUNvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWdpbmF0aW9uSXRlbVtwYWdlQ291bnRdLmNsYXNzTGlzdC5yZW1vdmUoJ28tY3VycmVudCcpXG4gICAgICBwYWdpbmF0aW9uSXRlbVtwYWdlQ291bnQgLSAxXS5jbGFzc0xpc3QuYWRkKCdvLWN1cnJlbnQnKVxuICAgIH1cblxuICAgIGlmIChwYWdlQ291bnQgPT09IDEpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnby1oaWRlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdvLWhpZGUnKVxuICAgIH1cbiAgICBpZiAocGFnZUNvdW50ICE9PSBwYWdpbmF0aW9uTnVtKSB7XG4gICAgICBuZXh0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ28taGlkZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHRCdXR0b24uY2xhc3NMaXN0LmFkZCgnby1oaWRlJylcbiAgICB9XG4gICAgcGFnZUNoYW5nZUZuKHBhZ2VDb3VudClcbiAgICBzbW9vdGhTY3JvbGxUb3AoKVxuICB9KVxuXG4gIC8vIOeCueWHu+WPs+aMiemSriDnv7vpobVcbiAgbmV4dEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBwYWdlQ291bnQrK1xuICAgIGlmIChpc0VsbGlwc2lzKSB7XG4gICAgICBwYWdpbmF0aW9uQ2hhbmdlRm4ocGFnZUNvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWdpbmF0aW9uSXRlbVtwYWdlQ291bnQgLSAyXS5jbGFzc0xpc3QucmVtb3ZlKCdvLWN1cnJlbnQnKVxuICAgICAgcGFnaW5hdGlvbkl0ZW1bcGFnZUNvdW50IC0gMV0uY2xhc3NMaXN0LmFkZCgnby1jdXJyZW50JylcbiAgICB9XG5cbiAgICBpZiAocGFnZUNvdW50ID09PSBwYWdpbmF0aW9uTnVtKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ28taGlkZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnby1oaWRlJylcbiAgICB9XG4gICAgaWYgKHBhZ2VDb3VudCAhPT0gMSkge1xuICAgICAgcHJldkJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdvLWhpZGUnKVxuICAgIH0gZWxzZSB7XG4gICAgICBwcmV2QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ28taGlkZScpXG4gICAgfVxuICAgIHBhZ2VDaGFuZ2VGbihwYWdlQ291bnQpXG4gICAgc21vb3RoU2Nyb2xsVG9wKClcbiAgfSlcblxuICAvLyDlubPmu5Hmu5rliqhcbiAgY29uc3Qgc21vb3RoU2Nyb2xsVG9wID0gKCkgPT4ge1xuICAgIGNvbnN0ICRvZmZzZXRUb3AgPSAkKCcucmVjaXBlX25hdicpLm9mZnNldCgpLnRvcFxuICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogJG9mZnNldFRvcFxuICAgIH0sIDEwMDAsICdzd2luZycpXG4gIH1cbn0pXG4iXSwibmFtZXMiOlsiY29uc3QiLCJsZXQiLCJzdHIiLCJpIl0sIm1hcHBpbmdzIjoiOzs7OztBQUVBLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsY0FBSztFQUMvQ0EsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixFQUFDO0VBQ2xFQSxJQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFDO0VBQ3hEQSxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFDO0VBQzdEQSxJQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUM7RUFDaEVDLElBQUksY0FBYyxHQUFHLFdBQVcsQ0FBQyxPQUFNO0VBQ3ZDRCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBQztFQUN4REEsSUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBQztFQUNuRUEsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUM7RUFDcERBLElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFDO0VBQ3BEQSxJQUFNLEdBQUcsR0FBRyxHQUFFO0VBQ2RDLElBQUksS0FBSyxHQUFHLEVBQUM7RUFDYkEsSUFBSSxZQUFZLEdBQUcsRUFBQztFQUNwQkEsSUFBSSxTQUFTLEdBQUcsRUFBQztFQUNqQkEsSUFBSSxhQUFhLEdBQUcsRUFBQztFQUNyQkEsSUFBSSxjQUFjLEdBQUcsS0FBSTtFQUN6QkEsSUFBSSxVQUFVLEdBQUcsTUFBSzs7O0VBR3RCRCxJQUFNLFlBQVksZUFBTTtJQUN0QixhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxF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
