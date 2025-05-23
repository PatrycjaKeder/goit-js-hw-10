
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.min.css"

let userSelectedDate;
let timeInterval;


const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');


const button = document.querySelector('button[data-start]');
button.disabled = true;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      if (selectedDate <= new Date()) {
          iziToast.error({
              title: 'Error',
              message: 'Please choose a date in the future',
          });
          button.disabled = true;  
      } else {
          userSelectedDate = selectedDate;
          button.disabled = false;
      }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  
  const days = Math.floor(ms / day);
  
  const hours = Math.floor((ms % day) / hour);
  
  const minutes = Math.floor(((ms % day) % hour) / minute);
  
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTime() {
    const curTime = new Date();
    const timeLeft = userSelectedDate - curTime;

    if (timeLeft <= 0) {
        clearInterval(timeInterval);
        button.disabled = true;
        document.querySelector('#datetime-picker').disabled = false;
        return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
}

button.addEventListener('click', () => {
    if (timeInterval) clearInterval(timeInterval);
    timeInterval = setInterval(updateTime, 1000);
    button.disabled = true;
    document.querySelector('#datetime-picker').disabled = true;
});