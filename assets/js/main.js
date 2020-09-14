import { CountUp } from 'http://localhost:4000/assets/js/countup.js';

window.onload = function() {
    var countUp = new CountUp('target', 2000);
    countUp.start();
}