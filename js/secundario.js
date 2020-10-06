//Variables
const addToShoppingCartButtons = document.querySelectorAll('.addToCart');
const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer');

//Listeners
cargarEventListeners();

function cargarEventListeners() {

    document.addEventListener('DOMContentLoaded', readLocalStorage);

    //dispara cuando se presiona agregar al carrito
    addToShoppingCartButtons.forEach(addToCartButton => {
        addToCartButton.addEventListener('click', addToCartClicked);
    });

    const comprar = document.querySelector('.comprarButton');
    comprar.addEventListener('click', comprarButtonClicked);

}



//Functions

//escucha si se da click a agregar y obtiene los valores para mostrarlos en el carrito
function addToCartClicked(e) {
    const button = e.target;
    // escucha del click boton de agregar.
    const item = button.closest('.item');
    // obtenemos el card a partir del boton, el elemento mas cercano al button.

    const card = {
        title : item.querySelector('.item-title').textContent,
        image: item.querySelector('.item-image').src,
        price: item.querySelector('.item-price').textContent,
        quantity: item.querySelector('.item-quanti').value,
        id: item.querySelector('button').getAttribute('data-id')
    }

    // añadimos lo valores a nuestra funcion de añadir al carrito
    addItemToShoppingCart(card);
    updateShoppingCartTotal();
}


//funcion para agregar al carrito el item seleccionado
function addItemToShoppingCart(card) {
    const elementsTitle = shoppingCartItemsContainer.getElementsByClassName('shoppingCartItemTitle');

    for(let i = 0; i < elementsTitle.length; i++) {
        if(elementsTitle[i].innerText === card.title) {
            let elementQuantity = elementsTitle[i].parentElement.parentElement.parentElement.querySelector('.shoppingCartItemQuantity');
            let elementQuantityNumber = Number(elementQuantity.value);
            let elementsQuantiInput = Number(card.quantity);
            elementQuantityNumber = elementQuantityNumber + elementsQuantiInput;
            elementQuantity.value = elementQuantityNumber;
            return;
        }
    }

    const shoppingCartRow = document.createElement('div');
    shoppingCartRow.innerHTML = `
        <!-- MOCKUP EXAMPLE (DELETE) -->
        <div class="row shoppingCartItem">
            <div class="col-6">
                <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <img src=${card.image} class="shopping-cart-image">
                    <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${card.title}
                    </h6>
                </div>
            </div>
            <div class="col-2">
                <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <p class="item-price mb-0 shoppingCartItemPrice">${card.price}</p>
                </div>
            </div>
            <div class="col-4">
                <div
                    class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                    <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number" value=${card.quantity}>
                    <button class="btn btn-danger buttonDelete" type="button" data-id="${card.id}">X</button>
                </div>
            </div>
        </div>
        <!-- END MOCKUP EXAMPLE -->
    `;
    //todo lo que necesitamos lo ponemos con string literal con html
    
    shoppingCartItemsContainer.append(shoppingCartRow);
    //hacemos visible el item en el carrito
    shoppingCartRow.querySelector('.buttonDelete').addEventListener('click', removeShoppingCartItem);
    //boton remover dentro del item del carrito

    shoppingCartRow.querySelector('.shoppingCartItemQuantity').addEventListener('change', quantityChanged);
    //escuchamos si se mueve la cantidad de elements

    saveItemLocalStorage(card);
    updateShoppingCartTotal();
}


//funcion para actualizar el total dentro del carrito
function updateShoppingCartTotal() {
    let total = 0;
    let cantidadT=0;
    const shoppingCartTotal = document.querySelector('.shoppingCartTotal');
    const shoppingCartCantTotal = document.querySelector('.shoppingCartCantTotal');
    const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');
    shoppingCartItems.forEach(shoppingCartItem => {
        const shoppingCartItemPriceElement = shoppingCartItem.querySelector('.shoppingCartItemPrice');
        const shoppingCartItemPrice = Number(shoppingCartItemPriceElement.textContent.replace('€',''));
        const shoppingCartItemQuantityElement = shoppingCartItem.querySelector('.shoppingCartItemQuantity');
        const shoppingCartItemQuantity = Number(shoppingCartItemQuantityElement.value);
        cantidadT = cantidadT + shoppingCartItemQuantity;
        total = total + (shoppingCartItemPrice * shoppingCartItemQuantity);
    });

    shoppingCartTotal.innerHTML = `$${total.toFixed(2)}`;
    shoppingCartCantTotal.innerHTML = `${cantidadT}pz`;
    
}


//funcion para remover el item del carrito por el boton de x
function removeShoppingCartItem(e) {
    const buttonRemove = e.target;
    const itemRemoved = buttonRemove.closest('.shoppingCartItem');
    const itemId = itemRemoved.querySelector('button').getAttribute('data-id');
    itemRemoved.remove();
    
    removeItemLocalStorage(itemId);
    updateShoppingCartTotal();
}


//funcion para escuchar si esta en movimiento la cantidad
function quantityChanged(e) {
    const inputQuanti = e.target;
    if(inputQuanti.value <= 0) {
        document.querySelector('.shoppingCartItem').remove();
    }
    updateShoppingCartTotal();
}

//funcion para enviar el pedido o comprar dando click con el boton
function comprarButtonClicked() {
    shoppingCartItemsContainer.innerHTML = '';
    updateShoppingCartTotal();
    emptyCart();
}

//****************** LOCAL STORAGE  ***************/
function saveItemLocalStorage(card) {
    let cards;
    cards = getItemLocalStorage();
    cards.push(card);
    localStorage.setItem('cards', JSON.stringify(cards));
    updateShoppingCartTotal();
}

function getItemLocalStorage() {
    let itemsLS;
    if(localStorage.getItem('cards') === null) {
        itemsLS = [];
    } else {
        itemsLS = JSON.parse(localStorage.getItem('cards'));
    }
    return itemsLS;
}

function readLocalStorage() {
    let itemsLS;
    itemsLS = getItemLocalStorage();

    itemsLS.forEach(function(card){
        const shoppingCartRow = document.createElement('div');
        shoppingCartRow.innerHTML = `
        <!-- MOCKUP EXAMPLE (DELETE) -->
        <div class="row shoppingCartItem">
            <div class="col-6">
                <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <img src=${card.image} class="shopping-cart-image">
                    <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${card.title}
                    </h6>
                </div>
            </div>
            <div class="col-2">
                <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <p class="item-price mb-0 shoppingCartItemPrice">${card.price}</p>
                </div>
            </div>
            <div class="col-4">
                <div
                    class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                    <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number" value=${card.quantity}>
                    <button class="btn btn-danger buttonDelete" type="button" data-id="${card.id}">X</button>
                </div>
            </div>
        </div>
        <!-- END MOCKUP EXAMPLE -->
    `;
    //todo lo que necesitamos lo ponemos con string literal con html
    
    shoppingCartItemsContainer.append(shoppingCartRow);
    });
    updateShoppingCartTotal();
}

function removeItemLocalStorage(itemId) {
    let cardsLS;
    cardsLS = getItemLocalStorage();
    cardsLS.forEach(function(cardLS, index) {
        if(cardLS.id === itemId) {
            cardsLS.splice(index, 1);
        }
    });
    localStorage.setItem('cards', JSON.stringify(cardsLS));
}

function emptyCart(){
    localStorage.clear();
}