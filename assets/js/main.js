import * as bootstrap from 'bootstrap'
import '@fortawesome/fontawesome-free/js/all.js';
import '../css/main.scss';
import './menu';
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
[...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));