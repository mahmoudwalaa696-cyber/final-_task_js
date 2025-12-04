
// light mode and dark mode
let btn = document.getElementById("btn");
let body = document.body;

// حفظ الوضع  (light,dark) فى الlocalstorae 
let saveTheme = localStorage.getItem("theme")

if(saveTheme){
  body.classList.add(saveTheme);
  if(saveTheme === "dark"){
    icon.classList.replace("fa-sun","fa-moon");
  }else if (saveTheme === "light") {
      icon.classList.replace("fa-moon","fa-sun");
  } 
}else {
    body.classList.add("light");
  }
// انشاء زر لعمل light mode - dark mode
btn.addEventListener("click", () => {
  if (body.classList.contains("light")) {
    body.classList.replace("light", "dark");
  icon.classList.replace("fa-moon","fa-sun");
  localStorage.setItem("theme","dark")
  } else {
    body.classList.replace("dark", "light");
icon.classList.replace("fa-sun","fa-moon");
  localStorage.setItem("theme","light")
  }
});


//  جلب بيانات السلة لو مفيش سلة محفوظة يُرجع مصفوفة فاضية 
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// عدد المنتجات 
let updateCount = () => {
  let countElement = document.getElementById("count");
  countElement.textContent = cart.length;
}
updateCount();

//    div لعرض المنتجات بداخله 
let elementCart = document.getElementById("elementCart");

//  عرض المنتجات 
let list_Add = (list) => {
  elementCart.innerHTML = "";
  if (list.length === 0) {
    elementCart.innerHTML = "<p>cart is empty.</p>";
    return;
  }

list.forEach((product, index) => {
    let card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="products-images">
        <img src="${product.thumbnail}" alt="${product.title}">
      </div>

      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3>${product.title}</h3>

        <div class="product-rating">
          <div class="rating-count">(${product.rating})</div>
        </div>

<div class="quantity-controlss">
  <div class="quantity-buttons-container">
    <button class="quantity_Minus" onclick="quantity_Minus(${index})">
      <i class="fas fa-minus"></i>
    </button>

    <input type="text" class="quantity-inputs" value="${product.quantity || 1}" disabled />

    <button class="quantity_Plus" onclick="quantity_Plus(${index})">
      <i class="fas fa-plus"></i>
    </button>
  </div>

  <button class="remove_Product" onclick="remove_Product(${index})">
    <i class="fas fa-trash"></i>
  </button>
</div>

<div class="product-price">$${product.price}</div>

      </div>
    `;

    elementCart.appendChild(card);
});

};
//   لزياده عدد المنتج   
let quantity_Plus = (index) => {
    cart[index].quantity = cart[index].quantity + 1 ; 
  save_Product()
}
// لنقص عدد المنتج 
let quantity_Minus = (index) => {
    if (cart[index].quantity > 1){
        cart[index].quantity -- ;
    }else{
        cart[index].quantity = 1 ;
    }
     save_Product()
}

// حذف المنتج من السلة
function remove_Product(index) {
  const product = cart[index];
  Swal.fire({
    title: "هل تريد حذف المنتج؟",
    text: `${product.title} سيتم حذفه من السلة!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم",
    cancelButtonText: "لا",
  }).then((result) => {
    if (result.isConfirmed) {
      cart.splice(index, 1);
      save_Product();
      Swal.fire({
        title: "تم الحذف!",
        text: `${product.title} تم حذفه من السلة`,
        icon: "success",
        confirmButtonText: "تمام",
      });
    }
  });
}

// حفظ  (plus _ minus) 
let save_Product = () => {
     localStorage.setItem("cart", JSON.stringify(cart));
 list_Add(cart);    
}

list_Add(cart);
