// Listeners
cargarEventListeners();

function cargarEventListeners() {
         // Al cargar el documento, mostrar LocalStorage
         document.addEventListener('DOMContentLoaded', leerLocalStorage);
}

const addToShoppingCartButtons = document.querySelectorAll('.addToCart');
//obtenemos todos los botones
addToShoppingCartButtons.forEach(addToCartButton =>{
    addToCartButton.addEventListener('click', addToCartClicked);
});

const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);

const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer');
//area de items agregados al carrito

function addToCartClicked(event) {
    const button = event.target;
    //escuchamos el click de los botones de agregar
    const item = button.closest('.item');
    //obtenemos lo que contiene el card del boton que se le dio click
    const itemCompleto = {
        itemTitle: item.querySelector('.item-title').textContent,
        itemPrice: item.querySelector('.item-price').textContent,
        itemImage: item.querySelector('.item-image').src 
    }
    //obtenemos el titulo precio e imagen

    // addItemToShoppingCart(itemTitle, itemPrice, itemImage);
    //funcion para agregar al carrito cada una de las variables que se obtuvieron anteriormente
    addItemToShoppingCart(itemCompleto);
}

// function addItemToShoppingCart(itemTitle, itemPrice, itemImage){
function addItemToShoppingCart(itemCompleto){

    const elementsTitle = shoppingCartItemsContainer.getElementsByClassName('shoppingCartItemTitle'); //obtiene el nombre de cada item ingresado al carrito
    
    //el for nos ayuda a comprobar si esta en el carrito ya que recorre todo el carrito
    for(let i = 0; i < elementsTitle.length; i++) {
        if(elementsTitle[i].innerText === itemCompleto.itemTitle) {
            let elementQuantity = elementsTitle[i].parentElement.parentElement.parentElement.querySelector('.shoppingCartItemQuantity');
            
            elementQuantity.value++;//sumamos 1 a la cantidad en el 
            $('.toast').toast('show');
            //muestra el mensaje si ya esta en el carrito
            updateShoppingCartTotal();
            //actualizamos el total
            return;
            //return hace que ya no se agregue mas div del mismo asi qeu regresa
        }
    }

    const shoppingCartRow = document.createElement('div');
    //creamos un div para nuestro contenido
    const shoppingCartContent = `
        <!-- MOCKUP EXAMPLE (DELETE) -->
        <div class="row shoppingCartItem">
            <div class="col-6">
                <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <img src=${itemCompleto.itemImage} class="shopping-cart-image">
                    <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemCompleto.itemTitle}
                    </h6>
                </div>
            </div>
            <div class="col-2">
                <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                    <p class="item-price mb-0 shoppingCartItemPrice">${itemCompleto.itemPrice}</p>
                </div>
            </div>
            <div class="col-4">
                <div
                    class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                    <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                        value="1">
                    <button class="btn btn-danger buttonDelete" type="button">X</button>
                </div>
            </div>
        </div>
        <!-- END MOCKUP EXAMPLE -->
    `;
    //todo lo que necesitamos lo ponemos con string literal con html

    shoppingCartRow.innerHTML = shoppingCartContent;
    //concatenamos lo que tiene el content en el row
    shoppingCartItemsContainer.append(shoppingCartRow);
    //y agregamos el row al container de nuestro carrito

    shoppingCartRow.querySelector('.buttonDelete')
    .addEventListener('click', removeShoppingCartItem);
    //elimina el item del carrito

    shoppingCartRow.querySelector('.shoppingCartItemQuantity')
    .addEventListener('change', quantityChanged);
    //asi sabemos si cambia la cantidad y obtiene el elemento

    guardarItemLocalStorage(itemCompleto);
    updateShoppingCartTotal();
}

//actualiza el total de la cuenta
function updateShoppingCartTotal() {
    let total = 0;
    const shoppingCartTotal = document.querySelector('.shoppingCartTotal');
    const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');
    shoppingCartItems.forEach(shoppingCartItem => {
        const shoppingCartItemPriceElement =  shoppingCartItem.querySelector('.shoppingCartItemPrice');
        const shoppingCartItemPrice = Number(shoppingCartItemPriceElement.textContent.replace('€',''));
        const shoppingCartItemQuantityElement = shoppingCartItem.querySelector('.shoppingCartItemQuantity');
        const shoppingCartItemQuantity = Number(shoppingCartItemQuantityElement.value);
        total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
    });

    shoppingCartTotal.innerHTML = `${total.toFixed(2)}$`;
}

function removeShoppingCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.closest('.shoppingCartItem').remove();
    updateShoppingCartTotal();
}

function quantityChanged(event) {
    const input = event.target;
    input.value <= 0 ? (input.value = 1) : null;
    updateShoppingCartTotal();
}

function comprarButtonClicked() {
    shoppingCartItemsContainer.innerHTML = '';
    updateShoppingCartTotal();
}

//================================= LOCAL STORAGE ==============================
function guardarItemLocalStorage(itemCompleto) {
    let itemsCompletos;
     // Toma el valor de un arreglo con datos de LS o vacio
     itemsCompletos = obtenerItemsLocalStorage();

    // el curso seleccionado se agrega al arreglo
    itemsCompletos.push(itemCompleto);

     localStorage.setItem('itemsCompletos', JSON.stringify(itemsCompletos) );
}

// Comprueba que haya elementos en Local Storage
function obtenerItemsLocalStorage() {
    let itemsLS;

    // comprobamos si hay algo en localStorage
    if(localStorage.getItem('itemsCompletos') === null) {
        itemsLS = [];
    } else {
        itemsLS = JSON.parse( localStorage.getItem('itemsCompletos') );
    }
    return itemsLS;
}

//leer ls para pintar lo que teniamos
function leerLocalStorage() {
    let itemsLS;

    itemsLS = obtenerItemsLocalStorage();

    itemsLS.forEach(function(itemCompleto){
        //importamos lo que necesitamos
        const shoppingCartRow = document.createElement('div');
        //creamos un div para nuestro contenido
        const shoppingCartContent = `
            <!-- MOCKUP EXAMPLE (DELETE) -->
            <div class="row shoppingCartItem">
                <div class="col-6">
                    <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                        <img src=${itemCompleto.itemImage} class="shopping-cart-image">
                        <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemCompleto.itemTitle}
                        </h6>
                    </div>
                </div>
                <div class="col-2">
                    <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                        <p class="item-price mb-0 shoppingCartItemPrice">${itemCompleto.itemPrice}</p>
                    </div>
                </div>
                <div class="col-4">
                    <div
                        class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                        <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                            value="1">
                        <button class="btn btn-danger buttonDelete" type="button">X</button>
                    </div>
                </div>
            </div>
            <!-- END MOCKUP EXAMPLE -->
        `;
        shoppingCartRow.innerHTML = shoppingCartContent;
        //concatenamos lo que tiene el content en el row
        shoppingCartItemsContainer.append(shoppingCartRow);
        //y agregamos el row al container de nuestro carrito
    });
}