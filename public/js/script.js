function reloadImg(item,img,timeout) {
  setTimeout(() => {
    item.src = img
  }, timeout);
}

function reloadCart(timeout) {
  setTimeout(() => {
    updateCart()
  }, timeout);
}

function updateCart(form_data){
    let options,
      update = function(data) {
        console.log("updated cart:",data)
        if(data.error || Object.keys(data).length == 0) {
          console.log("ERR",data.error)
          $(".c_item").remove()
          $("#cartMenu").append("<p style='text-align: center' class='c_item'>No items in cart</p>")
        } else if(data) {
          // Removes all items from the cart
          $(".c_item").remove()
          let pArr = Object.keys(data)
          for(var i = 0; i < pArr.length; i++) {
            $("#cartMenu").append(`<div class="c_item"><img style="height:45px;float:left;" class="c_img" src="assets/img/paint/${pArr[i]}.png"><p>Quantity: ${data[pArr[i]]}</p><br><div>`);
          }
        } else {
          console.log("UPDATE CART ERROR",data)
        }
      },
      error = function() {
      console.log("Error loading cart")
      $.toaster({ priority : 'danger',
      title : "Error loading cart!",
      message : "Please wait!" })
      reloadCart(1000)
    }
    
    if(form_data) {
      options = {
        url:"/updateCartItems",
        method:"post",
        data:form_data,
        success: update,
        error: error
      }
    } else {
      options = {
        url:"/viewCart",
        success: update,
        error: error
      }
    }
    $.ajax(options)
}

updateCart()

let selList = $('.qty'), imgs = $('.p_img')
for(let i = 0; i < selList.length; i++) {
  imgs[i].onerror = function(e) {
    let originalImage = imgs[i].src
    imgs[i].src = "/assets/img/loading.gif"
    imgs[i].style.height = "175px"
    imgs[i].style.display = "block"
    imgs[i].style.margin = "auto auto"
    reloadImg(imgs[i],originalImage,1000)
  }
  
  selList[i].onchange = function(e) {
    var form_data = $("#products_form").serializeArray()
    console.log("FORM DATA",form_data)
    updateCart(form_data)
    $.toaster({ priority : 'success',
      title : "Item added to cart<br>",
      message : selList[i].value + " "+selList[i].name+"s were selected" })
  }
}
