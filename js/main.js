

const doc = document;

// Получение основных элементов
let products = doc.querySelector(".products");
let modalCard = doc.querySelector(".modal-card");
let cross = doc.querySelector(".cross");
let basketArr = [];


document.addEventListener("DOMContentLoaded", function () {
  const headerHeight = document.querySelector("header").offsetHeight;
  const links = document.querySelectorAll("a[href^='#']");

  links.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      } else {
        console.error(`Элемент с id="${targetId}" не найден.`);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const fx = document.querySelector('.fx');
  const header = document.querySelector('header');
  const headerHeight = header.offsetHeight;

  function checkScroll() {
    if (window.scrollY > headerHeight) {
      fx.classList.add('fixed');
      fx.style.marginTop = 0 + 'px';
    } else {
      fx.classList.remove('fixed');
      fx.style.marginTop = 57 + 'px';
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
});

const fetchData = (url, category) => {
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      let section = doc.createElement("section");
      section.classList.add("product-section");
      section.id = category;

      let wrapper = doc.createElement("div");
      wrapper.classList.add("wrapper");

      let h3 = doc.createElement("h3");
      h3.innerText = category === "pizza" ? "Пиццы" : category === "drinks" ? "Напитки" : "Десерты";
      let cardWrapper = doc.createElement("div");
      cardWrapper.classList.add("card-wrapper");

      let modal_basket = doc.querySelector(".modal-basket");
      let basket_cross = doc.querySelector(".basket-cross");

      function basket(item) {
        const basket_block = document.querySelector(".basket-block");
        basket_block.innerHTML = "";
    
        let price_basket_text = price_btn.firstChild.nodeValue;
        let basketnum = +price_basket_text.replace("в корзину за", "").replace(" UZS", "");
    
        // Создание нового HTML-кода для блока корзиныs
        basket_block.innerHTML = `
            <div class="basket-item">
                <div class="basket-top">
                    <img src="${item.img}" alt="${item.name}"> 
                    <p>${item.name}</p>
                </div>
                <div class="basket-bottom">
                    <hr>
                    <div class="basket-select">
                        <span><span class="price-basket2">${basketnum}</span> UZS</span>
                        <div class="basket-btns"> 
                            <button class="minus">-</button>
                            <p>1</p>
                            <button class="plus">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        // Получение элементов после обновления HTML
        let minus = basket_block.querySelector(".minus");
        let plus = basket_block.querySelector(".plus");
        let count = basket_block.querySelector(".basket-btns p");
        let priceBasketSpan = basket_block.querySelector(".price-basket2");
    
        // Функция для обновления цены
        function updatePrice() {
            let quantity = +count.innerText;
            let newPrice = basketnum * quantity;
            priceBasketSpan.innerText = newPrice;
        }
    
        // Обработчики событий для кнопок
        minus.addEventListener("click", () => {
            if (count.innerText > 1) { // Предотвращаем отрицательные значения
                count.innerText--;
                updatePrice();
            }
        });
    
        plus.addEventListener("click", () => {
            count.innerText++;
            updatePrice();
        });
    
        // Открытие и закрытие модальных окон
        modalCard.classList.remove("active");
        modal_basket.classList.add("active");
    
        basket_cross.addEventListener("click", () => {
            modal_basket.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    }
    
      let price_btn = doc.createElement("button");
      for (let item of data) {
        for (let item2 of item.products) {
          let card = doc.createElement("div");
          card.classList.add("card");

          let img = doc.createElement("img");
          img.src = item2.img;

          let names = doc.createElement("p");
          names.innerText = item2.name;

          let card_bottom = doc.createElement("div");
          card_bottom.classList.add("card-bottom");

          let price = doc.createElement("p");
          price.innerText = "от " + (item2.size ? item2.size.small.price : item2.price) + " UZS";

          let button = doc.createElement("button");
          button.classList.add("button-card");
          button.innerText = "Выбрать";

          card.addEventListener("click", () => {
            doc.body.style.overflow = "hidden";
            modalCard.classList.add("active");

            let modalBlock = doc.querySelector(".modal-block");
            modalBlock.innerHTML = "";

            let modalLeft = doc.createElement("div");
            modalLeft.classList.add("modal-left");

            let modalImg = doc.createElement("img");
            modalImg.src = item2.img;

            let modalRight = doc.createElement("div");
            modalRight.classList.add("modal-right");

            let modalRightTop = doc.createElement("div");
            modalRightTop.classList.add("modal-right-top");

            let modalName = doc.createElement("p");
            modalName.classList.add("modal-name");
            modalName.innerText = item2.name;

            let modal_right_bottom = doc.createElement("div");
            modal_right_bottom.classList.add("modal-right-bottom");

            
            price_btn.classList.add("price-btn");

            if (item2.size) {
              let sizeBtns = document.createElement("div");
              sizeBtns.classList.add("size-btns");

              sizeBtns.innerHTML = `
                <button class="size-btn click-size-btn" data-size="small">Small</button>
                <button class="size-btn" data-size="big">Medium</button>
                <button class="size-btn" data-size="extra">Large</button>
              `;

              price_btn.innerText = " в корзину за " + item2.size.small.price + " UZS";
              
              sizeBtns.addEventListener("click", (e) => {
                if (e.target.classList.contains("size-btn")) {
                  sizeBtns.querySelector(".click-size-btn").classList.remove("click-size-btn");
                  e.target.classList.add("click-size-btn");
                  const size = e.target.getAttribute("data-size");
                  price_btn.innerText = " в корзину за " + item2.size[size].price + " UZS";
                }
              });

              modalRightTop.append(modalName, sizeBtns);
              modal_right_bottom.append(price_btn);
            } else {
              price_btn.innerText = " в корзину за " + item2.price + " UZS";
              modalRightTop.append(modalName);
              modal_right_bottom.append(price_btn);
            }

            price_btn.addEventListener("click", () => basket(item2));

            modalBlock.append(modalLeft, modalRight);
            modalLeft.append(modalImg);
            modalRight.append(modalRightTop, modal_right_bottom);
          });

          cross.addEventListener("click", () => {
            modalCard.classList.remove("active");
            doc.body.style.overflow = "auto";
          });

          card.append(img, names, card_bottom);
          card_bottom.append(price, button);
          cardWrapper.append(card);
        }
      }

      wrapper.append(h3, cardWrapper);
      section.append(wrapper);
      products.append(section);
    });
};

fetchData("http://localhost:20001/pizza","pizza");
fetchData("http://localhost:20001/drinks","drinks");
fetchData("http://localhost:20001/deserts","desserts");



