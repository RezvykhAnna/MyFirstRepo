import 'babel-polyfill';
import { el, setChildren } from 'redom';
import header from './header.js';
import './style.scss';
import Inputmask from 'inputmask';
import cardValidator, { number } from 'card-validator';
// import CardInfo from 'card-info';
import visaImage from './images/visa-colored.svg';
import mastercardImage from './images/master-card-colored.svg';
import mirImage from './images/mir-colored.svg';
import americanExpress from './images/american-express-colored.svg';
import dinnerClub from './images/diners-club-colored.svg';
import discover from './images/discover-colored.svg';
import jcb from './images/jcb-colored.svg';
import maestro from './images/maestro-colored.svg';
import unionpay from './images/unionpay-colored.svg';

const main = el('main', { class: 'main'});
setChildren(window.document.body, [
  header,
  main,
]);

const visaImgElement = el('img', {
    src: visaImage,
    alt: 'Visa',
    class: 'image-card'
  });
const mastercardImgElement = el('img', {
    src: mastercardImage,
    alt: 'Mastercard',
    class: 'image-card'
  });
const mirImgElement = el('img', {
    src: mirImage,
    alt: 'МИР',
    class: 'image-card'
  });
const americanExpressImgElement = el('img', {
    src: americanExpress,
    alt: 'AmericanExpress',
    class: 'image-card'
});
const dinnerClubImgElement = el('img', {
    src: dinnerClub,
    alt: 'dinnerClub',
    class: 'image-card'
});
const discoverImgElement = el('img', {
    src: discover,
    alt: 'discover',
    class: 'image-card'
});
const jcbImgElement = el('img', {
    src: jcb,
    alt: 'jcb',
    class: 'image-card'
});
const maestroImgElement = el('img', {
    src: maestro,
    alt: 'maestro',
    class: 'image-card'
});
const unionpayImgElement = el('img', {
    src: unionpay,
    alt: 'unionpay',
    class: 'image-card'
});

const cardImageContainer = el('.card-container');

//функция создание элементов формыs
function createFormElements() {
    const cardNumberInput = el('input#card-number.card-input',
      {
        placeholder: 'Введите номер карты',
        required: true,
      },
    );

    const expiryInput = el('input#expiry.card-input', {
      placeholder: 'ММ/ГГ',
      required: true,
    });

    const cvcInput = el('input#cvc.card-input', {
      placeholder: 'Введите CVC/CVV',
      required: true,
    });

    const emailInput = el('input#email.card-input', {
      placeholder: 'Введите email',
      required: true,
      type: 'email',
    });

    const button = el(
        'button.button',
        {
          disabled: true,
        },
        'Оплатить',
      );

    return {
      cardNumberInput,
      expiryInput,
      cvcInput,
      emailInput,
      button
    };
}
//ее вызов
const {
    cardNumberInput, expiryInput, cvcInput, emailInput, button
} = createFormElements();
//проверка на ввод цифр
function getInputValue(input) {
    return input.value.replace(/\D/g, '');
}
//проверка типа карты
function updateCardLogo(cardType) {
    setChildren(cardImageContainer, []);

    switch (cardType) {
        case 'visa':
            setChildren(cardImageContainer, [visaImgElement]);
            break;
        case 'mastercard':
            setChildren(cardImageContainer, [mastercardImgElement]);
            break;
        case 'mir':
            setChildren(cardImageContainer, [mirImgElement]);
            break;
        case 'AmericanExpress':
            setChildren(cardImageContainer, [americanExpressImgElement]);
            break;
        case 'dinnerClub':
            setChildren(cardImageContainer, [dinnerClubImgElement]);
            break;
        case 'discover':
            setChildren(cardImageContainer, [discoverImgElement]);
            break;
        case 'maestro':
            setChildren(cardImageContainer, [maestroImgElement]);
            break;
        case 'unionpay':
            setChildren(cardImageContainer, [unionpayImgElement]);
            break;
        case 'jcb':
            setChildren(cardImageContainer, [jcbImgElement]);
        default:
            break;
    }
}
//проверка номера карты
function validateCardNumber(cardNumber) {
    const cardInfo = cardValidator.number(cardNumber);
    return cardInfo.isPotentiallyValid
    // return cardInfo.isValid;
}
//проверка СВС
function validateCvc(cvc) {
    const cvcInfo = cardValidator.cvv(cvc);
    return cvcInfo.isValid;
}
//проверка почты
function validateEmail(email) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailRegex.test(email);
    return { isValid };
}
//изменение статуса кнопки
function updateButtonState() {
    const cardNumber = getInputValue(cardNumberInput);
    const isCardNumberValid = validateCardNumber(cardNumber);

    const expiryDate = getInputValue(expiryInput);
    const expiryInfo = cardValidator.expirationDate(expiryDate);

    const cvc = getInputValue(cvcInput);
    const isCvcValid = validateCvc(cvc);

    const email = emailInput.value;
    const emailInfo = validateEmail(email);

    button.disabled = !(
        isCardNumberValid
        && expiryInfo.isValid
        && isCvcValid
        && emailInfo.isValid
    );
}

const cardNumberError = el('div.text-red.display', 'Неверный номер карты');
const expiryError = el('div.text-red.display', 'Неверная дата окончания');
const cvcError = el('div.text-red.display', 'Неверный CVC/CVV');
const emailError = el('div.text-red.display', 'Неверный email');

//добавляется логотип платежной системы
cardNumberInput.addEventListener('input', () => {
    cardNumberError.classList.add('display');
    updateButtonState();
    const cardNumber = getInputValue(cardNumberInput);
    const cardInfo = cardValidator.number(cardNumber);
    if (cardInfo.card && cardInfo.card.type) {
      updateCardLogo(cardInfo.card.type.toLowerCase());
    } else {
      updateCardLogo('');
    }
});

cardNumberInput.addEventListener('blur', () => {
    const cardNumber = getInputValue(cardNumberInput);
    const cardInfo = cardValidator.number(cardNumber);
    console.log(cardInfo);
    if (!cardInfo.isPotentiallyValid) {
        cardNumberError.classList.remove('display');
    }
    updateButtonState();
});

expiryInput.addEventListener('input', () => {
    expiryError.classList.add('display');
    updateButtonState();
});

expiryInput.addEventListener('blur', () => {
    const expiryDate = getInputValue(expiryInput);
    const expiryInfo = cardValidator.expirationDate(expiryDate);
    console.log(expiryInfo);
    if (!expiryInfo.isValid) {
      expiryError.classList.remove('display');
    }
    updateButtonState();
});

cvcInput.addEventListener('input', () => {
    cvcError.classList.add('hidden');
    updateButtonState();
});

cvcInput.addEventListener('blur', () => {
    const cvc = getInputValue(cvcInput);
    const cvcInfo = cardValidator.cvv(cvc);
    if (!cvcInfo.isValid) {
      cvcError.classList.remove('hidden');
    }
    updateButtonState();
});

emailInput.addEventListener('input', () => {
    emailError.classList.add('hidden');
    updateButtonState();
});

emailInput.addEventListener('blur', () => {
    const email = emailInput.value;
    const emailInfo = validateEmail(email);
    if (!emailInfo.isValid) {
      emailError.classList.remove('hidden');
    }
    updateButtonState();
});

const cardNumberInputContainer = el('div.input-container', [
    cardNumberInput,
    cardImageContainer,
]);
//добавляем элементы в контейнер
const form = el('form#payment-form.form', [
    el('div.form-input', [
        el('label.text-gray-600', 'Номер карты'),
        [cardNumberInputContainer],
        cardNumberError,
    ]),
    el('div.form-input', [
        el('label.text-gray-600', 'Дата окончания'),
        [expiryInput],
        expiryError,
    ]),
    el('div.form-input', [
        el('label.text-gray-600', 'CVC/CVV'),
        [cvcInput],
        cvcError,
    ]),
    el('div.form-input', [
        el('label.text-gray-600', 'Email'),
        [emailInput],
        emailError,
    ]),
    button,
]);

setChildren(main, form);

Inputmask('9999 9999 9999 9999 [99]').mask(cardNumberInput);
Inputmask('99/99').mask(expiryInput);
Inputmask('999').mask(cvcInput);
