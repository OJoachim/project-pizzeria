import {templates, select} from '../settings.js';
import utils from '../utils.js';

class MainPage {
  constructor(){
    const thisMainPage = this;
    
    thisMainPage.getElements();
    thisMainPage.getData();
  }
  
  
  getElements(){
    const thisMainPage = this;

    thisMainPage.imagesList = document.querySelector(select.containerOf.image);
    thisMainPage.opinionList = document.querySelector(select.containerOf.opinions);
    thisMainPage.carouselCircle = document.querySelector(select.containerOf.carouselCircle);
  }
  getData(){
    const thisMainPage = this;

    const urlFirst = select.db.url + '/' + select.db.gallery;
    const urlSecond = select.db.url + '/' + select.db.opinions;

    fetch(urlFirst)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        thisMainPage.dataImages = parsedResponse;
        //console.log('data from API: ', thisMainPage.dataImages);
        thisMainPage.renderImagesList();
      });
    fetch(urlSecond)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisMainPage.dataOpinions = parsedResponse;
        thisMainPage.renderOpinionsList();
      });

  }
  renderImagesList(){
    const thisMainPage = this;
    
  }
  renderOpinionsList() {
    const thisMainPage = this;

  }
  
  toSlide(){
    const thisMainPage = this;
    
    thisMainPage.circleList = thisMainPage.options.querySelectorAll('li');
    
    for(let circle of thisMainPage.circleList) {
      
      circle.addEventListener('click', function(event){
        event.preventDefault();
        thisMainPage.changeCircle(event);
      });
    }
    thisMainPage.opinions = document.querySelectorAll('.opinion');

    opinionStatus function(){
      const opinionId = 0;
      let selectOpinion = thisMainPage.opinions[opinionId];
      let selectCircle = thisMainPage.circleList[opinionId];
      
      selectCircle.classList.remove('active');
      selectCircle = thisMainPage.circleList[opinionNumber];
      selectCircle.classList.add('active');
  }
  
  changeTheOpinion() {
    const clickedElement = event.target;
    const opinionClass = clickedElement.getAttribute('data-option');
    const selectOpinion = document.querySelector('.' + opinionClass);
    const activeOpinion = document.querySelector('.option.active');
    activeOpinion.classList.remove('active');
    selectOpinion.classList.add('active');
  }
 
}
export default MainPage;