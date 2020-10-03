
var biayaKirim = 15.0
var fadeTime = 300


$('.product-quantity').change(function () {
  updateQuantity(this)
})

$('.product-removal').click(function () {
  removeItem(this)
})


function recalculateCart () {
  var subtotal = 0


  $('.product').each(function () {
    subtotal += parseFloat(
      $(this)
        .children()
        .children()
        .children('.product-line-price')
        .text()
    )
  })



  var shipping = subtotal > 0 ? biayaKirim : 0
  var total = subtotal + shipping


  $('.totals-value').fadeOut(fadeTime, function () {
    $('#cart-subtotal').html(subtotal.toFixed(3))
    $('#cart-shipping').html(shipping.toFixed(3))
    $('#cart-total').html(total.toFixed(3))
    if (total == 0) {
      $('.checkout').fadeOut(fadeTime)
    } else {
      $('.checkout').fadeIn(fadeTime)
    }
    $('.totals-value').fadeIn(fadeTime)
  })

    checkCart()
  
}

function checkCart(){
  if($('.shopping-cart').children().length == 0){
    $('.empty-cart').css('opacity',1)
    $('.btn-beli').attr("disabled", true);
  }
  else{
    $('.empty-cart').css('opacity',0)
    $('.btn-beli').attr("disabled", false);
  }
}




function updateQuantity (quantityInput) {

  var productRow = $(quantityInput)
    .parent()
    .parent()
    .parent()

  var price = parseFloat(
    productRow
      .children()
      .children()
      .children()
      .children('.product-price')
      .text()
  )
  var quantity = $(quantityInput).val()
  var linePrice = price * quantity

  
  productRow
    .children()
    .children()
    .children('.product-line-price')
    .each(function () {
      $(this).fadeOut(fadeTime, function () {
        $(this).text(linePrice.toFixed(2))
        recalculateCart()
        $(this).fadeIn(fadeTime)
      })
    })
}

function removeItem (removeButton) {
 
  var productRow = $(removeButton)
    .parent()
    .parent()
    .parent()
  productRow.slideUp(fadeTime, function () {
    productRow.remove()
    recalculateCart()
  })
}
