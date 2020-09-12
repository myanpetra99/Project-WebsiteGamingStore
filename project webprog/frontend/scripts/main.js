window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 350 || document.documentElement.scrollTop > 350) {
    document.getElementById("navbarBot").style.bottom = "0";
  } else {
    document.getElementById("navbarBot").style.bottom = "-100px";
  }
}