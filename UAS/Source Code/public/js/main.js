window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload(); //reload page if it has been loaded from cache
  }
};


document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementsByTagName('body').style.opacity="0";;
      alert(state)
  } else if (state == 'complete') {
         document.getElementById('interactive');
         document.getElementById('load').style.opacity="0";
         document.getElementById('load').style.visibility="hidden";
         document.getElementsByTagName('body').style.opacity="100";
  }
}

window.onscroll = function () {
  scrollFunction()
}

function scrollFunction () {
  if (
    document.body.scrollTop > 350 ||
    document.documentElement.scrollTop > 350
  ) {
    document.getElementById('navbarBot').style.bottom = '0'
  } else {
    document.getElementById('navbarBot').style.bottom = '-100px'
  }
}

document.getElementById('transferInfo').style.display = 'none'

function showTransfer () {
  var x = document.getElementById('transferInfo')
  x.style.display = 'block'
}

//All about cart
function increment (obj) {
  var count = parseInt(
    $(obj)
      .parent()
      .parent()
      .find('input')
      .val()
  )
  $(obj)
    .parent()
    .parent()
    .find('input')
    .val(count + 1)

  $('.btn-minus').prop('disabled', false)
}

function decrement (obj) {
  var count = parseInt(
    $(obj)
      .parent()
      .find('input')
      .val()
  )
  if (count != 1) {
    $(obj)
      .parent()
      .parent()
      .find('input')
      .val(count - 1)
  }
}






      $(document).ready(function () {
        $('.owl-carousel').owlCarousel({
          center: true,
          loop: true,
          margin: 10,
          responsiveClass: true,
          autoplay: true,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
          responsive: {
            0: {
              items: 2,
              nav: true
            },
            600: {
              items: 3,
              nav: true
            },
            1000: {
              items: 4,
              nav: false,
            }
          }
        })
      });


    

