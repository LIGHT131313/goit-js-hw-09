import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_green.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

const currentTime = Date.now();
let isActive = false;
refs.startBtn.disabled = true;

// Options for Flatpickr
const options = {
  enableTime: true,
  enableSeconds: true, // for a quick test
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (isActive) {
      return;
    }

    if (selectedDates[0] - currentTime < 0) {
      Notify.failure('Please choose a date in the future', {
        position: 'center-top',
        timeout: 2000,
      });
    } else {
      refs.startBtn.disabled = false;
    }
  },
};

const fp = flatpickr(refs.input, options);

/**
 * Creates a timer and changes its values in the interface
 */
function startTimer() {
  let deltaTime = fp.selectedDates[0] - currentTime;
  const id = setInterval(() => {
    updateTimer(deltaTime);

    setTimeout(() => {
      clearInterval(id);
    }, deltaTime);

    deltaTime -= 1000;
  }, 1000);
  isActive = true;
}

/**
 * Update timer values in interface
 * @param {Number} deltaTime
 */
function updateTimer(deltaTime) {
  const { days, hours, minutes, seconds } = convertMs(deltaTime);
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

refs.startBtn.addEventListener('click', onStartBtn);

/**
 * Starts the timer
 */
function onStartBtn() {
  startTimer();
  refs.startBtn.disabled = true;
}

/**
 *  Convert ms to seconds, minutes, hours, days
 * @param {Number} ms
 * @returns {Object}  days, hours, minutes, seconds
 */
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

/**
 * Convert to string and add zero
 * @param {Number} value
 * @returns {String} value with zero
 */
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
