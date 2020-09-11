window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    document.getElementById("navbarBot").style.bottom = "0";
  } else {
    document.getElementById("navbarBot").style.bottom = "-100px";
  }
}