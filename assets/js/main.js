import * as bootstrap from 'bootstrap'
import '@fortawesome/fontawesome-free/js/all.js';
import '../css/main.scss';
import './Components/Menu';
import Loader from './Components/Loader';

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

const container = document.querySelector('body > .container')
const loader = document.querySelector('.loader');
new Loader(container, loader);