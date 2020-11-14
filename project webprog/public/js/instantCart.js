var biayaKirim = 9000
var fadeTime = 300
$('.product-quantity').change(function () {
    updateQuantity(this)
  })


function recalculateCart () {
  howmanyproduct();
  var subtotal = 0
if($('.product-quantity').val()==1){
    $('.btn-dec').css("display","none");   
}
else{
    $('.btn-dec').css("display","block");  
}

  $('.product').each(function () {
    var qty =  $(this)
    .children()
    .children()
    .children('.product-quantity')
    .val()

    if(qty==1){
      $(this).children().children().children('#formDecrease').css('display', 'none')
    }
    if(qty<1){
      $(this).children().children().children('#formDecrease').css('display', 'block')
    }

   var price = parseFloat(
      $(this)
        .children()
        .children()
        .children('.product-line-price')
        .text()
    )

    

    subtotal =    price
  })

  var shipping = subtotal > 0 ? biayaKirim : 0
  var total = subtotal + shipping

  $('.totals-value').fadeOut(fadeTime, function () {
    $('#cart-subtotal').html(subtotal)
    $('#cart-shipping').html(shipping)
    $('#cart-total').html(total)
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
    $('.empty-cart').css('display', 'block')
    $('.btn-beli').attr('disabled', true)

    var x = document.getElementsByName('radios')
    var i
    for (i = 0; i < x.length; i++) {
      x[i].disabled = true
    }
  } else {
    $('.empty-cart').css('display', 'none')
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
          $(this).text(linePrice)
          recalculateCart()
          $(this).fadeIn(fadeTime)
        })
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
      this.Product +
      '<br>' +
      'Harga Barang :' +
      this.Price +
      '<br>' +
      'Kuantitas Barang :' +
      this.Qty +
      '<br>'
    return str + '<br>'
  }
}

function clearCart () {
  $('.shopping-cart')
    .children()
    .remove()

  checkCart()
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
      ),
      $(this)
        .children()
        .children()
        .children('.product-quantity')
        .val()
    )

    $('#Invoice').append('<div>' + data.Write() + '</div>')
  })

  var date = new Date()
  var tahun = date.getFullYear()
  var bulan = date.getMonth()
  var tanggal = date.getDate()
  var hari = date.getDay()
  var jam = date.getHours()
  var menit = date.getMinutes()
  var detik = date.getSeconds()
  switch (hari) {
    case 0:
      hari = 'Minggu'
      break
    case 1:
      hari = 'Senin'
      break
    case 2:
      hari = 'Selasa'
      break
    case 3:
      hari = 'Rabu'
      break
    case 4:
      hari = 'Kamis'
      break
    case 5:
      hari = "Jum'at"
      break
    case 6:
      hari = 'Sabtu'
      break
  }
  switch (bulan) {
    case 0:
      bulan = 'Januari'
      break
    case 1:
      bulan = 'Februari'
      break
    case 2:
      bulan = 'Maret'
      break
    case 3:
      bulan = 'April'
      break
    case 4:
      bulan = 'Mei'
      break
    case 5:
      bulan = 'Juni'
      break
    case 6:
      bulan = 'Juli'
      break
    case 7:
      bulan = 'Agustus'
      break
    case 8:
      bulan = 'September'
      break
    case 9:
      bulan = 'Oktober'
      break
    case 10:
      bulan = 'November'
      break
    case 11:
      bulan = 'Desember'
      break
  }

  var tampilTanggal = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun
  var tampilWaktu = jam + ':' + menit + ':' + detik

  $('.date-invoice').append(
    '<div>' + tampilTanggal + '    ' + tampilWaktu + '</div>'
  )
  $('#Invoice').append('<hr>')
  $('.data-penerima').append('<div>' + 'Nama Penerima :' + nama + '</div>')
  $('.data-penerima').append('<div>' + 'Alamat Penerima :' + alamat + '</div>')

  $('#Invoice').append(
    '<div>' + 'Biaya Pengiriman : Rp.' + $('#cart-shipping').text() + '</div>'
  )
  $('#Invoice').append('<hr>')
  $('#Invoice').append(
    '<div>' + 'Total Harga : Rp.' + $('#cart-total').text() + '</div>'
  )
}

function addCartToTransaction (namaBarang, hargaBarang, qtyBarang) {
  data.addCartToTransaction(namaBarang, hargaBarang, qtyBarang)
}

//Generate Unique Transaction Code

// Use:
//
;(function () {
  function IDGenerator () {
    this.length = 8
    this.timestamp = +new Date()

    var _getRandomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    this.generate = function () {
      var ts = this.timestamp.toString()
      var parts = ts.split('').reverse()
      var id = ''

      for (var i = 0; i < this.length; ++i) {
        var index = _getRandomInt(0, parts.length - 1)
        id += parts[index]
      }

      return id
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.btn-confirm-bayar'),
      output = document.querySelector('#output')
    var idOrder = ''
    btn.addEventListener(
      'click',
      function () {
        var generator = new IDGenerator()
        output.innerHTML = generator.generate()
        idOrder = output.innerHTML
        generateWa(idOrder)
      },
      false
    )
  })
})()
var nama = 'Michael Yan'
var alamat = 'Jl Grogol raya no 2'

function generateWa (idOrder) {
  var total = $('#cart-total').text()

  var linkWa =
    'https://api.whatsapp.com/send?phone=6281936516716&text=Saya%20Telah%20Melakukan%20Pembayaran%20Di%20website%20AGStore%20Dengan%20Bukti%20Sebagai%20Berikut%20:%0ANama:%20+' +
    nama +
    '%0AAlamat%20:%20' +
    alamat +
    '%0AID%20Order%20:%20AGS-' +
    idOrder +
    '%0ATotal%20Harga%20:%20' +
    total
  $('.link-wa-confirm').attr('href', linkWa)

  var uri = linkWa.split(' ').join('%20')

  var qr = (window.qr = new QRious({
    element: document.getElementById('qrious'),
    size: 250,
    value: uri
  }))
}

let radio1 = document.querySelector('.radio1')
let radio2 = document.querySelector('.radio2')
let radio3 = document.querySelector('.radio3')
let output = document.querySelector('#cart-shipping')

function update () {
  if (radio1.checked) {
    biayaKirim = 9000
  } else if (radio2.checked) {
    biayaKirim = 15000
  } else {
    biayaKirim = 25000
  }
  recalculateCart()
}

function howmanyproduct(){
  var counter = 0

  $('.product').each(function () {
    counter += parseInt($(this)
    .children()
    .children()
    .children('.product-quantity')
    .val())
  })
$('.keranjangku').html(counter)
}

function formatNumber(num, precision, separator) {
  var parts;
  // Judging whether it is a number
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
      // Convert data like. 5, 5. into 0. 5, 5, which is accurate for data processing, and why
      // Do not write if (! IsNaN (num = parseFloat (num)) & isFinite (num) directly in judgment
      // Because parseFloat has a strange accuracy problem, such as parseFloat (12312312.1234567119)
      // The value becomes 12312312312.123456713
      num = Number(num);
      // Processing decimal digits
      num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
      // Separating decimal and integer parts of numbers
      parts = num.split('.');
      // The integer part is separated by [separator], borrowing a famous regular expression
      parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

      return parts.join('.');
  }
  return NaN;
}

$(".btn-inc").on("click", function() {

    var oldValue = $(".product-quantity").val()
    
      var newVal = parseFloat(oldValue) + 1;
    
      $(".product-quantity").val(newVal)
      $(".product-quantity").trigger("change");
    });
    
    $(".btn-dec").on("click", function() {
    
    var oldValue = $(".product-quantity").val()
    
      var newVal = parseFloat(oldValue) - 1;
    
      $(".product-quantity").val(newVal)
      $(".product-quantity").trigger("change");
    });