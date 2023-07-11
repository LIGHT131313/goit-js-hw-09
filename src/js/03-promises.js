import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('.form');

form.addEventListener('submit', onSubmitForm);

/**
 * Рrocesses the form data and creates a promises
 * @param {Object} evt form elements
 */
function onSubmitForm(evt) {
  evt.preventDefault();

  const delay = Number(form.delay.value);
  const step = Number(form.step.value);
  const amount = Number(form.amount.value);

  for (let i = 0; i < amount; i += 1) {
    createPromise(i + 1, delay + step * i)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`, {
          position: 'center-top',
        });
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`, {
          position: 'center-top',
        });
      });
  }
  evt.currentTarget.reset();
}

/**
 * Create Promise
 * @param {Numner} position
 * @param {Number} delay
 * @returns {Object} new Promise
 */
function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
