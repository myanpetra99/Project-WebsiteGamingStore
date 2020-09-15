window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 350 || document.documentElement.scrollTop > 350) {
    document.getElementById("navbarBot").style.bottom = "0";
  } else {
    document.getElementById("navbarBot").style.bottom = "-100px";
  }
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


    $(".btn-minus").prop('disabled', false);
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


function check(){
    var x = $( "input.adults" ).val();

    x.chil

    if(x==1){
      $(".btn-minus").prop('disabled', true);
    }
}


