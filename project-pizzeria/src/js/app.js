import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function(){
    const thisApp = this;
    
    thisApp.pages = document.querySelector(select.containerOf.pages).children; //to find all page-containers in pages container
    thisApp.navLinks = document.querySelectorAll(select.nav.links); //to find all links
    
    const idFromHash = window.location.hash.replace('#/', '');
    //console.log('idFromHash', idFromHash);
    
    let pageMatchingHash = thisApp.pages[0].id;
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    
    //met. which activate page
    //CHANGE: thisApp.activatePage(thisApp.pages[0].id);
    thisApp.activatePage(idFromHash);
    
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
    }
    /* add class "active" to matching link & remove class "activ" from non-matching links */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
  initBooking: function(){
    const thisApp = this;
    //znajduje kontener widgeta
    thisApp.bookingElement = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(thisApp.bookingElement); //tworz. nową instancję kl. Booking, przekazując jej konstruktorowi znaleziony kontener widgetu, 
  },
  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);
    
    for(let productData in thisApp.data.products){
      new Product(productData, thisApp.data.products[productData]);
    }
  },
  initData: function(){
    const thisApp = this;
    thisApp.data = {}; //dataSource; CHANGE TO: {};
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
  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    
    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu(); DELATE initMenu() in app.init method
    thisApp.initCart();
    thisApp.initBooking();
  },
};
app.init();