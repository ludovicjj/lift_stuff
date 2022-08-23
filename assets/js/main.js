//const bootstrap = require('bootstrap');
import * as bootstrap from 'bootstrap'
// require('bootstrap/dist/css/bootstrap.css'); // Now load scss into main.scss
import '@fortawesome/fontawesome-free/js/all.js';
import '../css/main.scss';
import './menu';
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));