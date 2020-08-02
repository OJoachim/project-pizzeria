import {settings, select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from '../components/CartProduct.js';

class Cart {
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.getElements(element);
    thisCart.initActions();
    //console.log('new Cart', thisCart);
  }
  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    
    //quality: thisCart.dom.toggleTrigger, wrapper: thisCart.dom.wrapper, selector: select.cart.toggleTrigger
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = document.querySelector(select.cart.productList);
    
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }
  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function(){
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit', function(){
        event.preventDefault();
        thisCart.sendOrder();
      });
    });
  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    const payload = {
      //address: 'test',
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      totalPrice: thisCart.totalPrice,
      products: [],
    };
    for(let product of thisCart.products)
      payload.products.push(product.getData());
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
  add(menuProduct){
    const thisCart = this; //Zakomentowane by ESLint nie zgłaszał błędu
    console.log('adding product', menuProduct);
    
    /*generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct); //(cartProduct)?
    //console.log('generatedHTML', generatedHTML);
    
    /* create DOMelement as generatedDOM using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //console.log('generatedDOM', generatedDOM);
    
    /* add DOM elements to DOM do thisCart.dom.productList */
    thisCart.dom.productList.appendChild(generatedDOM);
    
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products', thisCart.products);
    
    thisCart.update();
  }
  update(){
    const thisCart = this;
    
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    
    for(let product of thisCart.products){
      thisCart.totalNumber = thisCart.totalNumber + product.amount; // or: thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice = thisCart.subtotalPrice + product.price; // or: thisCart.subtotalPrice += product.price;
      //console.log('thisCart.totalNumber', thisCart.totalNumber);
      //console.log('thisCart.subtotalPrice', thisCart.subtotalPrice);
      //console.log('thisCart.deliveryFee', thisCart.deliveryFee);
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    //console.log('thisCart.totalPrice', thisCart.totalPrice);
    
    for (let key of thisCart.renderTotalsKeys){
      for (let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }// END met. update()
  remove(cartProduct){
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove(cartProduct);
    thisCart.update();
  } //END met. remove(cartProduct)
}

export default Cart;