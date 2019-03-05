$(function() {

  const item = $('.slider__item');
  let started = false;
  let detecting = false;
  let touch, x, y, newX, newY, delta, swipeTo, $el;

  // touchstart
  item.on('touchstart', function(e) {
    // e.touches - все касания в данный момент
    // e.changedTouches - касания по которым есть изменения
    // e.targetTouches - касания связаные с целевым элементом

    // console.log(e);

    // проверка на 1 палец и начало тача
    if (e.touches.length !== 1 || started) {
      return;
    }

    $el = $(e.currentTarget);

    detecting = true;

    // запоминаем измененный тач
    touch = e.originalEvent.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;

    console.log('touchstart');
  });


  // touchmove
  item.on('touchmove', function(e) {
    if (!started && !detecting) {
      return;
    }

    // В зависимости от установленного состояния запускаем определение перелистывания или его отрисовку
    if (detecting) {
      detect();
    }

    if (started) {
      draw();
    }

    // просто проверка что палец движется в нужном направлении
    function detect() {
      console.log(e.originalEvent);

      // если это другой палец то отменяем
      if (e.originalEvent.changedTouches[0] === touch) {
        return;
      }

      console.log('detecting');

      touch = e.originalEvent.changedTouches[0];
      newX = touch.pageX;
      newY = touch.pageY;

      if (Math.abs(x - newX) >= Math.abs(y - newY)) {
        // отмена скролла
        e.preventDefault();
        console.log('detecting true');
        started = true;
      }

      // отменяем определение
      detecting = false;
    }

    function draw() {
      // отменяем скролл
      e.preventDefault();
      console.log('draw');

      // если это другой палец то отменяем
      if (e.originalEvent.changedTouches[0] === touch) {
        return;
      }

      touch = e.originalEvent.changedTouches[0];
      newX = touch.pageX;
      newY = touch.pageY;

      // смещение пальца относительно касания
      delta = x - newX;

      // console.log(delta);

      // сопротивление на последних слайдах
      // if (delta > 0 && !leftPage || delta < 0 && !rightPage) {
      //   delta = delta / 5;
      // }

      // отрисовка смещения
      moveTo(delta);
    }
  });


  // touchend
  item.on('touchend', function(e) {
    // если это другой палец то отменяем
    if (e.originalEvent.changedTouches[0] === touch) {
      return;
    }

    console.log('touchend');

    e.preventDefault();

    // Определяем, в какую сторону нужно произвести перелистывание
    if (delta > 100 || delta < -100) {
      swipeTo = delta < 0 ? 'left' : 'right';
    }

    // Отрисовываем перелистывание
    swipe(swipeTo);

    started = false;
    touch = false;
    swipeTo = false;
  });

  // touchcancel
  item.on('touchcancel', function(e) {
    // если это другой палец то отменяем
    if (e.originalEvent.changedTouches[0] === touch) {
      return;
    }

    console.log('touchcancel');

    e.preventDefault();

    // Определяем, в какую сторону нужно произвести перелистывание
    swipeTo = delta < 0 ? 'left' : 'right';

    // Отрисовываем перелистывание
    //swipe(swipeTo);
  });

  function moveTo(delta) {
    $el.css('transform', `translate3d(${-delta}px, 0, 0)`);
  }

  function swipe(swipeTo) {
    console.log(swipeTo);

    $el.on('transitionend webkitTransitionEnd oTransitionEnd', function() {
      console.log('transitionend');
      $(this).removeClass('slider__item--animating');
    });

    $el.addClass('slider__item--animating');

    if (swipeTo === 'left') {
      $el.css('transform', 'translate3d(100%, 0, 0)');
    } else if (swipeTo === 'right') {
      $el.css('transform', 'translate3d(-100%, 0, 0)');
    } else {
      $el.css('transform', 'translate3d(0, 0, 0)');
    }
  }

});
