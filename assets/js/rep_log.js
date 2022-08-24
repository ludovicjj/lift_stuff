import RepLogApp from './Components/RepLogApp';
import Modal from './Components/Modal';
import Accordion from './Components/Accordion';
import '../css/home.css';

let wrapper = document.querySelector('.js-rep-log-table');
new RepLogApp(wrapper, wrapper.getAttribute('data-rep-logs'));

const infoLink = document.getElementById('item-info');
const modalInfo = document.getElementById('itemInfoModal');
new Modal(infoLink, modalInfo);

const acc = document.querySelector(".accordion-container");
new Accordion(acc);
