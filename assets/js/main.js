const bootstrap = require('bootstrap');
// require('bootstrap/dist/css/bootstrap.css'); // Now load scss into main.scss
require('@fortawesome/fontawesome-free/js/all.js');
require('../css/main.scss');
require('./menu.js')

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));