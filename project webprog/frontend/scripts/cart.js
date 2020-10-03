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

function checkCart () {
  if ($('.shopping-cart').children().length == 0) {
    $('.empty-cart').css('opacity', 1)
    $('.btn-beli').attr('disabled', true)
  } else {
    $('.empty-cart').css('opacity', 0)
    $('.btn-beli').attr('disabled', false)
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

let data = {
  ID: '',
  Product: '',
  Qty: '',

  addCartToTransaction: function (namaBarang, hargaBarang, qtyBarang) {
    // Method
    this.Product = namaBarang
    this.Price = hargaBarang
    this.Qty = qtyBarang
  },

  Write: function () {
    // Method
    var str =
      'Nama Barang :' +
      this.Product +'<br>'+
      'Harga Barang :' +
      this.Price + '<br>'+
      'Kuantitas Barang :' +
      this.Qty+ '<br>'
    return str  +'<br>'
  }
}

function submitCart () {
  $('.product').each(function () {
    addCartToTransaction(
      $(this)
        .children()
        .children()
        .children()
        .children('.product-title')
        .text(),
      parseFloat(
        $(this)
          .children()
          .children()
          .children('.product-line-price')
          .text()
      ).toFixed(3),
      $(this)
        .children()
        .children()
        .children('.product-quantity')
        .val()
    )
   

    
    $('#Invoice').append('<div>'+data.Write()+'</div>');
    
  })
  $('#Invoice').append('<div>'+'Total Harga : Rp.'+$('#cart-total').text()+'</div>');
  
}

function addCartToTransaction (namaBarang, hargaBarang, qtyBarang) {
  data.addCartToTransaction(namaBarang, hargaBarang, qtyBarang)
}

//Generate Unique Transaction Code

// Use:
//
(function() {
  function IDGenerator() {
  
    this.length = 8;
    this.timestamp = +new Date;
    
    var _getRandomInt = function( min, max ) {
     return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }
    
    this.generate = function() {
      var ts = this.timestamp.toString();
      var parts = ts.split( "" ).reverse();
      var id = "";
      
      for( var i = 0; i < this.length; ++i ) {
       var index = _getRandomInt( 0, parts.length - 1 );
       id += parts[index];	 
      }
      
      return id;
    }

    
  }
  
  
  document.addEventListener( "DOMContentLoaded", function() {
   var btn = document.querySelector( ".btn-confirm-bayar" ),
     output = document.querySelector( "#output" );
     
   btn.addEventListener( "click", function() {
     var generator = new IDGenerator();
     output.innerHTML = generator.generate();
     
   }, false); 
    
  });
  
  
})();
