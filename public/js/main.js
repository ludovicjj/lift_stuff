const bootstrap = require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('../css/main.css');

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));