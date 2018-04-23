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
          $("#cartMenu").html("")
          $("#cartMenu").append("<p style='text-align: center' class='c_item'>No items in cart</p>")
        } else if(data) {
          // Removes all items from the cart
          let pArr = Object.keys(data)
          $("#cartMenu").html("")
          for(var i = 0; i < pArr.length; i++) {
            $("#cartMenu").append(`<div class="c_item"><img style="height:45px;float:left;margin-top:5px;margin-bottom:5px;" class="c_img" src="assets/img/paint/${pArr[i]}.png"><span>Quantity: ${data[pArr[i]]}</span><button style="float:right" onClick="removeItem('${pArr[i]}')">X</button></div>`)
            if(i != (pArr.length - 1)) $("#cartMenu").append(`<br><br>`)
          }
          let refills = $("#")
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

function removeItem(item_id) {
  $.ajax({
    url:"/removeCartItem/"+item_id,
    success: () =>  {
      $.toaster({
        priority : 'success',
        title : "Item removed from the cart!"})
      updateCart()
    },
    error: () =>  {
      $.toaster({
        priority : 'danger',
        title : "Error removing item from cart!",
        message : "Please try again." })
      updateCart()
    }
  })
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
    let num = selList[i].value//, item = selList[i].name
    if(num == "") return
    updateCart($("#products_form").serializeArray())
    $.toaster({ priority : 'success',
      title : `${(num != 1)?"Items":"Item"} added to cart!`,
      message : `You selected ${num} ${(num != 1)?"buckets":"bucket"}`})
  }
}
