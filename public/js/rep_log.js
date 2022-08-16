const RepLogApp = require('./Components/RepLogApp');
const Modal = require('./Components/Modal');
const Accordion = require('./Components/Accordion');
require('../css/home.css');

let wrapper = document.querySelector('.js-rep-log-table');
new RepLogApp(wrapper);


const infoLink = document.getElementById('item-info');
const modalInfo = document.getElementById('itemInfoModal');
new Modal(infoLink, modalInfo);

const acc = document.querySelector(".accordion-container");
new Accordion(acc);
