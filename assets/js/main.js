const bootstrap = require('bootstrap');
// require('bootstrap/dist/css/bootstrap.css');
require('@fortawesome/fontawesome-free/js/all.js');
require('../css/main.scss');

// Enable tooltip everywhere
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));