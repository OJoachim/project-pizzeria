import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import MainPage from './components/MainPage.js';

const app = {
  initPages: function(){
    const thisApp = this;
    
    thisApp.pages = document.querySelector(select.containerOf.pages).children; //to find all page-containers in pages container, SECOND WAY - LINE 10: document.querySelectorAll('#pages section');
    thisApp.navLinks = document.querySelectorAll(select.nav.links); //to find all links
    
    const idFromHash = window.location.hash.replace('#/', '');
    
    let pageMatchingHash = thisApp.pages[0].id;
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    
    //met. which activate page
    thisApp.activatePage(pageMatchingHash);
    
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        
        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');
        
        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);
        
        /* change URL hash*/
        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage: function(pageId){
    const thisApp = this;
    
    /* add class "active" to matching page & remove class "activ" from non-matching pages */
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
      /* OTHER WAY TO DO LINE 47:
      if(page.id === pageId) page.classList.add(classNames.pages.active);
      else page.classList.remove(classNames.pages.active);
      */
    }
    /* add class "active" to matching link & remove class "activ" from non-matching links */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
      /* OTHER WAY TO DO LINE 55-58:
      if(link.getAttribute('href') === '#' + pageId) link.classList.add(classNames.pages.active);
      else link.classList.remove(classNames.pages.active);
      */
    }
  },
  initBooking: function(){
    const thisApp = this;
  
    thisApp.bookingElement = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(thisApp.bookingElement); 
  },
  initMenu: function(){
    const thisApp = this;
    
    for(let productData in thisApp.data.products){
      new Product(productData, thisApp.data.products[productData]);
    }
  },
  initData: function(){
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
      
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
      
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  initMainPage: function(){
    const thisApp = this;
  
    thisApp.mainPageElement = document.querySelector(select.containerOf.mainPage);
    thisApp.mainPage = new MainPage(thisApp.mainPageElement);
  },
  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initMainPage();
  },
};
app.init();