let allProducts = [
  {id:1,name:"sets",price:200,category:"sets",images:["sets/set1.jpg"]},
  {id:2,name:"sets",price:200,category:"sets",images:["sets/set2.jpg"]},
  {id:3,name:"sets",price:200,category:"sets",images:["sets/metalset.jpg"]},
  {id:4,name:"sets",price:200,category:"sets",images:["sets/lacost.jpg"]},
  {id:5,name:"Necklace",price:300,category:"necklace",images:["Neckless/spider.jpg"]},
  {id:6,name:"Necklace",price:300,category:"necklace",images:["Neckless/circle.jpg"]},
  {id:7,name:"Necklace",price:300,category:"necklace",images:["Neckless/palastine.jpg"]},
  {id:8,name:"Bracelet",price:150,category:"bracelet",images:["breaclate/breaclate.jpg"]},
  {id:9,name:"Bracelet",price:150,category:"bracelet",images:["breaclate/lacostbraclate.jpg"]},
  {id:10,name:"Couples",price:400,category:"couples",images:["couple/pandora.jpg"]},
  {id:11,name:"Couples",price:400,category:"couples",images:["couple/12.jpg"]},
  {id:12,name:"Couples",price:400,category:"couples",images:["couple/13.jpg"]},
  {id:13,name:"rings",price:400,category:"rings",images:["rings/pandora.jpg"]}
];

let currentCategory = "all";
let currentProduct = null;

/* ================= NAVIGATION ================= */

function showPage(page){

  document.querySelectorAll("#productsPage, #productPage, #cartPage, #checkoutPage")
    .forEach(p => p.style.display = "none");

  if(page==="products") document.getElementById("productsPage").style.display="block";

  if(page==="cart") {
    document.getElementById("cartPage").style.display="block";
    loadCart();
  }

  if(page==="checkout") document.getElementById("checkoutPage").style.display="block";

  if(page==="product") document.getElementById("productPage").style.display="block";
}

/* ================= PRODUCTS ================= */

function loadProducts(){
  let container = document.getElementById("products");

  let filtered = currentCategory === "all"
    ? [...allProducts]
    : allProducts.filter(p => p.category === currentCategory);

  let sortValue = document.getElementById("sort").value;

  if(sortValue === "low") filtered.sort((a,b)=>a.price-b.price);
  if(sortValue === "high") filtered.sort((a,b)=>b.price-a.price);

  document.getElementById("count").innerText = filtered.length + " products";

  container.innerHTML = "";

  filtered.forEach(p=>{
    container.innerHTML += `
      <div class="product" onclick="openProduct(${p.id})">
        <img src="${p.images[0]}">
        <h3>${p.name}</h3>
        <p>${p.price} EGP</p>
      </div>
    `;
  });
}

function filter(cat){ currentCategory = cat; loadProducts(); }
function reset(){ currentCategory = "all"; loadProducts(); }

/* ================= PRODUCT ================= */

function openProduct(id){
  let p = allProducts.find(x=>x.id===id);
  currentProduct = p;

  document.getElementById("productPage").style.display="block";
  document.getElementById("productsPage").style.display="none";

  document.getElementById("name").innerText = p.name;
  document.getElementById("price").innerText = p.price + " EGP";
  document.getElementById("mainImg").src = p.images[0];

  let thumbs = document.getElementById("thumbs");
  thumbs.innerHTML = "";

  p.images.forEach(img=>{
    thumbs.innerHTML += `<img src="${img}" onclick="changeImg('${img}')">`;
  });
}

function changeImg(src){
  document.getElementById("mainImg").src = src;
}

/* ================= CART ================= */

function addToCart(){

  let qty = Number(document.getElementById("qty").value);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existing = cart.find(i=>i.id===currentProduct.id);

  if(existing){
    existing.qty += qty;
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images[0],
      qty: qty
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();
  loadCartUI();
}

/* ================= CART UI ================= */

function loadCart(){
  loadCartUI();
}

function loadCartUI(){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let container = document.getElementById("cartItems");

  container.innerHTML = "";

  if(cart.length === 0){
    container.innerHTML = "<h3>Cart is empty 🛒</h3>";
    document.getElementById("total").innerText = "0";
    return;
  }

  let total = 0;

  cart.forEach((item,index)=>{
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" style="width:70px;border-radius:10px">

        <div>
          <h4>${item.name}</h4>
          <p>${item.price} EGP</p>
        </div>

        <div>
          <button onclick="decreaseQty(${index})">-</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>

        <button onclick="removeItem(${index})">X</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

function decreaseQty(index){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if(cart[index].qty > 1) cart[index].qty--;
  else cart.splice(index,1);

  localStorage.setItem("cart", JSON.stringify(cart));

  loadCartUI();
  updateCart();
}

function increaseQty(index){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart[index].qty++;

  localStorage.setItem("cart", JSON.stringify(cart));

  loadCartUI();
  updateCart();
}

function removeItem(index){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.splice(index,1);

  localStorage.setItem("cart", JSON.stringify(cart));

  loadCartUI();
  updateCart();
}

function updateCart(){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  document.getElementById("cartCount").innerText =
    cart.reduce((sum,i)=>sum+i.qty,0);
}

/* ================= SEARCH ================= */

document.getElementById("search").addEventListener("input", function(){

  let value = this.value.toLowerCase().trim();

  if(value === ""){
    loadProducts();
    return;
  }

  let filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(value) ||
    p.category.toLowerCase().includes(value)
  );

  let container = document.getElementById("products");
  container.innerHTML = "";

  filtered.forEach(p=>{
    container.innerHTML += `
      <div class="product" onclick="openProduct(${p.id})">
        <img src="${p.images[0]}">
        <h3>${p.name}</h3>
        <p>${p.price} EGP</p>
      </div>
    `;
  });

  document.getElementById("count").innerText =
    filtered.length + " products";
});

/* ================= BUY NOW ================= */

function buyNow(){
  alert("Buy Now feature coming soon 🚀");
}

/* ================= INIT ================= */

loadProducts();
updateCart();

/* ================= REVIEWS ================= */

let reviews = [];
let index = 0;

function showReview(i){
  reviews.forEach(r=>r.classList.remove("active"));
  reviews[i].classList.add("active");
}

function autoReviews(){
  showReview(index);
  index++;

  if(index >= reviews.length){
    index = 0;
  }
}

window.addEventListener("load", ()=>{
  reviews = document.querySelectorAll(".review");

  if(reviews.length > 0){
    reviews[0].classList.add("active");
    setInterval(autoReviews, 3500);
  }
});

/* ================= EFFECTS ================= */

document.addEventListener("mousemove", (e)=>{
  let logo = document.querySelector(".logo");
  if(!logo) return;

  let x = (e.clientX / window.innerWidth - 0.5) * 10;
  let y = (e.clientY / window.innerHeight - 0.5) * 10;

  logo.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
});

document.addEventListener("click", ()=>{
  document.body.style.transition = "0.1s";
  document.body.style.filter = "brightness(1.2)";

  setTimeout(()=>{
    document.body.style.filter = "brightness(1)";
  },150);
});