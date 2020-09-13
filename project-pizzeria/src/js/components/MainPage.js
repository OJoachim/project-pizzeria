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
    /* eslint-disable-next-line no-unused-vars */
    const thisMainPage = this;
        
    const linkOrder = document.querySelector('.nav-link-order');
    const linkBooking = document.querySelector('.nav-link-booking');
    const pages = document.querySelector(select.containerOf.pages).children; // all my pages
    const links = [linkOrder, linkBooking];
    
    for(let link of links){
      link.addEventListener('click', function(){
        const linkId = link.getAttribute('href').replace('#', '');
        for(let page of pages){
          if(page.id === linkId){
            page.classList.add(classNames.pages.active);
          } else {
            page.classList.remove(classNames.pages.active);
          }
        }
      });
    }
  }
  
  getElements(){
    const thisMainPage = this; 
    thisMainPage.opinion = document.querySelector(select.containerOf.opinion);
    thisMainPage.inMainPageLinks = document.querySelectorAll(select.inMainPageLinks); //to find all links
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
      });
  }
  
  prepareOpinions(){
    const thisMainPage = this;
    console.log('thisMainPage.opinion', thisMainPage.opinions);
    const allOpinions = thisMainPage.opinions;
    
    //find all containers of the current opinion
    const opinionElements = document.querySelectorAll('.opinion-element');
    
    let index = 0;
    for(let currentOpinion of allOpinions){
      
      //prepare access to one of the opinion divs
      const elem = opinionElements[index];
      
      //prepare shortcuts to theCurrentOpnion params
      const { title, text, author } = currentOpinion;
      
      //find: 1.title element, 2.text element, 3.author element, in elem and set innerHTML to const: title, text, author.
      const titleElem = elem.querySelector('.opinion-title');
      titleElem.innerHTML = title;

      const textOpinionElem = elem.querySelector('.opinion-text');
      textOpinionElem.innerHTML = text;

      const authorOpinionElem = elem.querySelector('.opinion-author');
      authorOpinionElem.innerHTML = author;

      index++;
    }
  }

  makeCarousel(){
    /* eslint-disable-next-line no-unused-vars */
    const thisMainPage = this;
    
    //make slides show:
    let slideIndex = 0;
    showSlides();

    function showSlides(){
      const slides = document.querySelectorAll('.slides');
      const dots = document.querySelectorAll('.dot');
      
      for(let slide of slides){
        slide.style.display = 'none';  
      }
      
      for(let dot of dots){
        dot.classList.remove('active');
      }
      
      if (slideIndex === slides.length) slideIndex = 0; 
      slides[slideIndex].style.display = 'block';  
      dots[slideIndex].classList.add('active');
      
      slideIndex++;
      setTimeout(showSlides, 2500);
    }
  }
  
  
}
export default MainPage;
/*
/////////////////////////////////////////////
    for (let opinionElement of opinionElements){
        
        //TITLE
        const titleOpinionElements = document.querySelectorAll('.opinion-title');
        console.log('titleOpinionElements', titleOpinionElements);
        for(let titleOpinionElement of titleOpinionElements){
          let html = '';
          const titleOpinionHTML = title;
          console.log('theOpinionHTML', titleOpinionHTML);
          html = html + titleOpinionHTML;
          titleOpinionElement.innerHTML = html;
        }
        
        //TEXT
        const textOpinionElements = document.querySelectorAll('.opinion-text');
        for(let textOpinionElement of textOpinionElements){
          let html = '';
          const textOpinionHTML = text;
          html = html + textOpinionHTML;
          textOpinionElement.innerHTML = html;
        }
        
        //AUTHOR
        const authorOpinionElements = document.querySelectorAll('.opinion-author');
        console.log('authorOpinionElements', authorOpinionElements);
        for(let authorOpinionElement of authorOpinionElements){
          let html = '';
          const authorOpinionHTML = author;
          console.log('authorOpinionHTML', authorOpinionHTML);
          html = html + authorOpinionHTML;
          authorOpinionElement.innerHTML = html;
          
        }
      }
 */