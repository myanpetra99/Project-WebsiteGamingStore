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

function showToast () {
  $('.toast').toast('show')
}

$('#btnConfirm').one('click', function () {
  $(this).attr('disabled', 'disabled')
})


