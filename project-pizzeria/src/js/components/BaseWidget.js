class BaseWidget{
  constructor(wrapperElement, initialValue){ //1.arg: el.dom where is widget element, 2.arg.: Widget value at start
    const thisWidget = this;
    
    thisWidget.dom = {}; //all el dom which we use in aplic.
    thisWidget.dom.wrapper = wrapperElement;thisWidget;  //wrapper given to construct.at the moment of new-inst creation
    thisWidget.value = initialValue;
  }
}

export default BaseWidget;