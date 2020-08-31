import {templates, select, settings, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(bookingElement){   //bookingElement - wrapper in video
    const thisBooking = this;
    
    thisBooking.render(bookingElement);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.choiseOfTable();
    thisBooking.changeRangeSliderColor();
    
    //console.log('thisBooking', thisBooking);
    //console.log('bookingElement', bookingElement);
  }
  
  getData(){
    const thisBooking = this;
    
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    
    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };
    //console.log('getData params', params);
    
    const urls = {
      booking:      settings.db.url + '/' + settings.db.booking
                                    + '?' + params.booking.join('&'),
      eventCurrent: settings.db.url + '/' + settings.db.event  
                                    + '?' + params.eventCurrent.join('&'),
      eventRepeat:  settings.db.url + '/' + settings.db.event  
                                    + '?' + params.eventRepeat.join('&'),
    };
    //console.log('getData url', urls);
    
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventCurrent),
      fetch(urls.eventRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
        
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseDate(bookings, eventsCurrent, eventsRepeat);
      });
  }
  
  parseDate(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    
    thisBooking.booked = {};
    
    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    
    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }    
    //console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.updateDOM();
  }
  
  makeBooked(date, hour, duration, table){
    const thisBooking = this;
    
    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    
    const startHour = utils.hourToNumber(hour);
    
    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      //console.log('loop', hourBlock);
      
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  
  updateDOM(){
    const thisBooking = this;
    
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    
    let allAvailable = false;
    
    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined' 
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
     
      if(
        !allAvailable 
        && 
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
      
    }
  } //END method: updateDOM()
  
  render(bookingElement){
    const thisBooking = this;
     
    const generatedHTML = templates.bookingWidget();
     
    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingElement;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    
    thisBooking.dom.peopleAmount =  thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    //console.log('thisBooking.dom.starters', thisBooking.dom.starters);
    
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
  }
  
  initWidgets(){
    const thisBooking = this;
     
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker (thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
    
    thisBooking.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisBooking.sendMyBooking();
    });
  }
  
  choiseOfTable(){
    const thisBooking = this;
    
    for(let table of thisBooking.dom.tables){
      table.addEventListener('click', function(event){
        event.preventDefault();
        
        if(table.classList.contains(classNames.booking.tableBooked)){
          return alert('This table is not accessible!'); //already booked imposible to book second times
        } else {
          table.classList.add(classNames.booking.tableBooked);  // add class and book
          
          //number of booked table:
          const tableNumber = table.getAttribute(settings.booking.tableIdAttribute);
          thisBooking.bookedTable = tableNumber;
        }
      });
    }
  }
  
  sendMyBooking(){
    const thisBooking = this;
    
    const url = settings.db.url + '/' + settings.db.booking;
      
    const myBookingDates = { // playload
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: parseInt(thisBooking.bookedTable),
      ppl: thisBooking.peopleAmount.value,
      duration: thisBooking.hoursAmount.value,
      starters: [],              //starters: ['water', 'bread'],
      address: thisBooking.dom.address.value,
      phone: thisBooking.dom.phone.value,
    };
    
    for (let starter of thisBooking.dom.starters){
      if (starter.checked){
        myBookingDates.starters.push(starter.value);
      }
    } 
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myBookingDates),
    };
     
    fetch(url, options)
      .then(function(response){
        return response.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
  
  changeRangeSliderColor(){
    const thisBooking = this;
    
    thisBooking.date = thisBooking.datePicker.value;
    const bookedHours = thisBooking.booked[thisBooking.date];
    thisBooking.dom.rangeSlider = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.slider); //.rangeSlider
    
    // table= a booked table;    booked 1/3=33%; 2/3=66%; 3/3 100%;
    const tableAmount = []; //all booked tables
    const hour = thisBooking.hourPicker.value; //the booked hours
    
    //bookedHours = thisBooking.booked[thisBooking.date];
    for(let hour of bookedHours){
      if (!thisBooking.booked[thisBooking.date][hour]) {
        tableAmount.push(0);
      } else {
        tableAmount.push(thisBooking.booked[thisBooking.date][hour].length);
      }
    }
    
    const colors = [];
    
    //open at 12 and closed at 24pm, min duration 0.5
    for (let hour = 12; hour < 24; hour += 0.5){
       
      const concentration1 = (hour - 12)*100/12; //(12-12=0; 22-12=10 10*100/12=83%; 24-12=12*100/12=100%)
      const concentration2 = ((hour - 12) + 0.5)*100/12; //(12.5-12=0.5*100/12=4%; 11,5*100/12=96%)
      
      for (let table of tableAmount){
        if(table === 3){
          colors.push(hour + 'red' + concentration1 + '%', 'red' + concentration2 + '%');
        } else if (table === 2){
          colors.push(hour + 'red' + concentration1 + '%', 'yellow' + concentration2 + '%');
        } else {
          colors.push(hour + 'red' + concentration1 + '%', 'green' + concentration2 + '%');
        }
      }
    }
    //colors = [red, yellow, green]
    //colors.sort();
    //const col = colors.join(); ---  red,yellow,green
    colors.sort();  //
    const fillPickerByColors = colors.join();
    const slider = thisBooking.dom.rangeSlider;
    slider.style.background = 'linear-gradient(to right' + fillPickerByColors + ')';
  }//END
  
}

export default Booking;

/*
    for (let table of tableAmount){
      if(table === 3){
        theColors.push('red');
      } else if (table === 2){
        theColors.push('yellow');
      } else {
        theColors.push('green');
      }
    }
*/