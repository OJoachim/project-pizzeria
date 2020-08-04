class BaseWidget{
  constructor(wrapperElement, initialValue){ //1.arg: el.dom where is widget element, 2.arg.: Widget value at start
    const thisWidget = this;
    
    thisWidget.dom = {}; //all el dom which we use in aplic.
    thisWidget.dom.wrapper = wrapperElement;thisWidget;  //wrapper given to construct.at the moment of new-inst creation
    thisWidget.correctValue = initialValue;
  }
  
  get value(){
    const thisWidget = this;
    
    return thisWidget.correctValue;
  }
  
  set value(value){
    const thisWidget = this;
    const newValue = thisWidget.parseInt(value);
    
    /* TODO: Add validation */
    if(newValue !=thisWidget.correctValue && thisWidget.isValid(newValue)){
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }
  
  setValue(value){
    const thisWidget = this;
    
    thisWidget.value = value;
  }
  
  parseValue(value){
    return parseInt(value);
  }
  
  isValid(value){
    return !isNaN(value);
  }
  
  renderValue(){
    const thisWidget = this;
    
    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }
  
  announce(){
    const thisWidget = this;
    //const event = new Event('updated'); CHANGE TO:
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}

export default BaseWidget;