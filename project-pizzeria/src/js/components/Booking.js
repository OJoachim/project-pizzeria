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
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    
    thisBooking.dom.submit = thisBooking.dom.wrapper.querySelector(select.booking.submit);
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
      date: thisBooking.DatePicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.tableNumber,
      peopleAmount: thisBooking.peopleAmount.value,
      duration: thisBooking.hourAmount.value,
      starters: [],
      address: thisBooking.dom.address.value,
      phone: thisBooking.dom.phone.value,
    };
     
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
  
  /* na potem
    tableRezervation(clickedTable){
    thisBooking.dom.submit.addEventListener('click', function(event){
      event.preventDefault();
      thisBooking.sendMyBooking(clickedTable);
    });
  }
    */
}

export default Booking;

/*
-po wybraniu daty i godz można kliknąć na stolik 
- kliknięcie nadaje klasę tableBooked
-można zaznaczyć opcje ilości ludzi i czasu(duration)
- można wysłać do serwerw zamów. to zwraca odp. i zajęty już stolik przy kliknięciu "powie": zajęty
-przy zmianie godz. klasa zajęty jest usuwana.
*/