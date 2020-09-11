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
    const thisMainPage = this;
    const url = settings.db.url + '/' + settings.db.opinion;
    
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        thisMainPage.opinions = parsedResponse;
        thisMainPage.prepareOpinions();
        return parsedResponse;
      });
    
  }
  
  prepareOpinions(){
    const thisMainPage = this;
    console.log('thisMainPage.opinion', thisMainPage.opinions);
    const allOpinions = thisMainPage.opinions;
     
    for (let theCurentOpinion of allOpinions){ // one = curent opinion of the all opinions got from server
      console.log('theCurentOpinion', theCurentOpinion); // show in console the all content of the object: theCurentOpinion
      
      /*
      for (let theCurentOpinionItem in theCurentOpinion){
        console.log('theCurentOpinionItem', theCurentOpinionItem); // show all kinds of items: id, title, text, author...
      }
      */
      
      const id = theCurentOpinion.id;
      console.log('id', id);
      
      const title = theCurentOpinion.title;
      console.log('title', title);
      
      const text = theCurentOpinion.text;
      console.log('text', text);
      
      const author = theCurentOpinion.author;
      console.log('author', author);     
      
    }
  }

  makeCarousel(){
    /* eslint-disable-next-line no-unused-vars */
    const thisMainPage = this;
    
    //make slides show:
    var slideIndex = 0;
    showSlides();

    function showSlides() {
      var i;
      const slides = document.getElementsByClassName("slides");
      const dots = document.getElementsByClassName("dot");
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
      }
      slideIndex++;
      if (slideIndex > slides.length) {slideIndex = 1}    
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[slideIndex-1].style.display = "block";  
      dots[slideIndex-1].className += " active";
      setTimeout(showSlides, 2500);
    }
  }
  
  
}
export default MainPage;
/*
/////////////////////////////////////////////
    // opinion in index.html/wrapper
      const opinionElements = document.querySelectorAll('.opinion-element');
      console.log('opinionElements', opinionElements);
      
    for (let opinionElement of opinionElements){
        const opinionAtributteNr = opinionElement.getAttribute('data');
        const opinionElementNr = opinionAtributteNr.replace('wrapper-', '');
        console.log('opinionElementNr', opinionElementNr);
      }
/////////////////////////////////////////
prepareDots(){
    //const thisMainPage = this;
    const ul = document.createElement('ul');
    ul.classList.add('.opinion-dots');
    
    const li = document.createElement('li');
    li.classList.add('.opinion-dot');
  }
*/

//const opinionNr = opinionWrapper.getAttribute('data');
//const opinionDataNr = opinionNr.replace('wrapper-', '');
//console.log('opinionDataNr', opinionDataNr);
//if(titleDataNr === id){
//const showTitle = title(id);
//console.log('showTitle', showTitle);
//}
/*
//const opinionTitle = opinionWrapper.title;
          //opinionTitle.innerHTML = title;
          //opinionWrapper.title = title;
          
          const opinionText = opinionWrapper.text;
          opinionWrapper.text = text;
          
          const opinionAuthor = opinionWrapper.author;
          opinionWrapper.author = author;
          
          //console.log('opinionWrapper.title', opinionWrapper.title);
          //console.log('opinionWrapper.text', opinionWrapper.text);
          
          
          for (let titleWrapperItem in titleWrapper){
            const opinionTitle = titleWrapper.title;
            console.log('opinionTitle', titleWrapperItem);
          }
          
  //const slide = new Slider('#slider', {
    //generateDots: true,
    //pauseTime: 10000,
    //});
*/    