import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';


class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.initActions();
    //thisWidget.value = settings.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.input.value);
    
    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
    console.log('thisWidget.value', thisWidget.value);
  }
  //met. getElements to find elements of the widget
  getElements(){
    const thisWidget = this;     
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  //met. to set up new value of the widget
  setValue(value){
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value);
    
    /* TODO: Add validation */
    if(newValue !=thisWidget.value && thisWidget.isValid(newValue)){
      thisWidget.value = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }
  
  isValid(value){
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin 
      && value <= settings.amountWidget.defaultMax;
  }
  
  renderValue(){
    const thisWidget = this;
    
    thisWidget.dom.input.value = thisWidget.value;
  }
  
  //met. initActions() - to add reaction to events
  initActions(){
    const thisWidget = this;
    
    thisWidget.dom.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.dom.input.value);
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  /* announce(){
    const thisWidget = this;
    //const event = new Event('updated'); CHANGE TO:
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  } */
}

export default AmountWidget;