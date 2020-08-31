/* eslint-disable-next-line no-unused-vars */
/* global Flickity */
import {/*templates,*/ settings, classNames, select} from '../settings.js';
//import utils from '../utils.js';

class MainPage {
  constructor(){
    const thisMainPage = this;
    
    thisMainPage.getElements();
    thisMainPage.getData();
    thisMainPage.makeLinksActive();
    thisMainPage.makeCarousel();
  } 
  
  makeLinksActive(){  //make nav-link: nav-link-order & nav-link-booking active at the 'click' moment
    const thisMainPage = this;
    thisMainPage.inMainPageLinks = document.querySelectorAll(select.inMainPageLinks); //to find all links
    
    const linkOrder = document.querySelector('.nav-link-order');
    const linkBooking = document.querySelector('.nav-link-booking');
    
    const linkOrderId = linkOrder.getAttribute('href').replace('#', ''); //href="#order"
    const linkBookingId = linkBooking.getAttribute('href').replace('#', ''); //href="#booking"
    
    const pages = document.querySelector(select.containerOf.pages).children; // all my pages
    
    //first case - click on linkOrder: .nav-link-order
    linkOrder.addEventListener('click', function(){
      for(let page of pages){
        if(page.id === linkOrderId){
          page.classList.add(classNames.pages.active);
        } else {
          page.classList.remove(classNames.pages.active);
        }
      }
    });
    //second case - click on linkBooking: .nav-link-booking
    linkBooking.addEventListener('click', function(){
      for(let page of pages){
        if(page.id === linkBookingId){
          page.classList.add(classNames.pages.active);
        } else {
          page.classList.remove(classNames.pages.active);
        }
      }
    });
  }
  
  getElements(){
    const thisMainPage = this; 
    thisMainPage.opinion = document.querySelector(select.containerOf.opinion);
  }
  
  getData(){
    //const thisMainPage = this;
    const url = settings.db.url + '/' + settings.db.opinion;
    
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        return parsedResponse;
      });
      
  }
  
  //const opinion = {
  //title: thisMainPage.title,
  //text: thisMainPage.text,
  //author: thisMainPage.author,
  //}
  
  makeCarousel(){
    /* eslint-disable-next-line no-unused-vars */
    const thisMainPage = this;    
    const element = document.querySelector('.carousel-cell');
    /* eslint-disable-next-line no-unused-vars */
    const flkty = new Flickity(element, 
      {
      // options:
        autoPlay: true, // advance cells every 3 seconds
        wrapAround: true,
        contain: true,
        draggable: true,
        //prevNextButtons: false,
      });
  }
  
}
export default MainPage;