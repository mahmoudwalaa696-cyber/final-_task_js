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
// Swiper
    var swiper = new Swiper(".mySwiper", {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
// Fetch Products
let products = [];
//    div لعرض المنتجات بداخله 
let products_container = document.getElementById("products_container");
let loader =document.getElementById("loader")

const make_products = async () => {
  try {
    loader.style.display = "block";
    const respons = await fetch("https://dummyjson.com/products?limit=2000");
    const data = await respons.json();
    products = data.products; 
    setTimeout(()=>{
 loader.style.display = "none";
displayProducts(products)
filterationPro()
    },200)

  } catch (error) {
    loader.style.display = "none";
    products_container.innerHTML = "❌ error fetching products";
  }
};
make_products();

// Rate Stars
function rate_stars(rate) {
  let stars = "";
  let fullStars = Math.floor(rate);
  let halfStar = rate % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  return stars;
}

//  عرض المنتجات 
let displayProducts = (list) => {
  products_container.innerHTML = "";
  if (list.length === 0) {
    products_container.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach((product) => {
    let card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="products-images">
        <img src="${product.thumbnail}" alt="${product.title}">
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <div class="product-rating">
          <div class="stars">${rate_stars(product.rating)}</div>
          <div class="rating-count">(${product.rating})</div>
        </div>
        <div class="product-price">$${product.price}</div>
  <div class="total_add">
  <button onclick="addToCard(${product.id})"><i  class="fa-solid fa-cart-shopping"></i> add to cart</button>
  <div class="iHeart"><i class="fa-solid fa-heart"></i></div>
  </div>
        
      </div>
    `;

    products_container.appendChild(card);
  });
};

// Filters
let CategoryFilter = document.getElementById("categories");
let selectPrice = document.getElementById("select_Price");
let nameInpt = document.getElementById("nameInpt");

// حفظ ال search
let saveName = localStorage.getItem("sa_Name")
if(saveName){
  nameInpt.value =saveName;
}

// حفظ الCategory 
let saveCategory = localStorage.getItem("sa_Category");
if(saveCategory){
  CategoryFilter.value =saveCategory;
}
// حفظ الPrice 
let savePrice = localStorage.getItem("sa_Price")
if(savePrice){
 selectPrice.value =savePrice;
}


// filter_products
function filterationPro() {
  let filter_product = [...products];

  // Search name filter
  let nameValue = nameInpt.value.toLowerCase().trim();
  localStorage.setItem("sa_Name",nameValue)
  filter_product = filter_product.filter((product) =>
    product.title.toLowerCase().includes(nameValue)
  );

  // Category filter
  let selectCategory = CategoryFilter.value;
   localStorage.setItem("sa_Category", selectCategory);
  if (selectCategory !== "all") {
    filter_product = filter_product.filter(
      (product) => product.category === selectCategory
    );
  }

  // Price filter
  let PriceValue = selectPrice.value;
   localStorage.setItem("sa_Price",PriceValue)
  if (PriceValue === "price-asc") {
    filter_product.sort((a, b) => a.price - b.price);
  } else if (PriceValue === "price-desc") {
    filter_product.sort((a, b) => b.price - a.price);
  }

  displayProducts(filter_product);
}
//  Events
nameInpt.addEventListener("input", filterationPro);
selectPrice.addEventListener("change", filterationPro);
CategoryFilter.addEventListener("change", filterationPro);

//  جلب بيانات   
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const addToCard = (id) => {
  const product = products.find((f) => f.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    Swal.fire({
      title: "The product already exists!",
      text: `${product.title} already in cart`,
      icon: "info"
    });
    return;
  }

  cart.push({
    ...product,
    quantity: 1
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCount(); 

  Swal.fire({
    title: "Added to cart!",
    text: `${product.title} has been added`,
    icon: "success"
  });
};

// عدد المنتجات 
let updateCount = () => {
  let countElement = document.getElementById("count");
  countElement.textContent = cart.length;
}
updateCount();