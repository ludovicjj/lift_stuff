const bootstrap = require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('../css/main.css');
require('@fortawesome/fontawesome-free/css/all.css');
require('@fortawesome/fontawesome-free/js/all.js');

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));