import { el } from 'redom';
import pay from './images/pay.png';
import './header.scss';

export default el('header', { class: 'page-header' }, [
  el('div', { class: 'page-header-text'}, 'Форма оплаты'),
  el('img', { class: 'page-header-pay', src: pay}),
]);