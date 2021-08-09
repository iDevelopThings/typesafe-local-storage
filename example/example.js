import LocalStorage from './TypedLocalStorage/LocalStorage.js';

LocalStorage.setItem('Testing', {testing : true});

const item = LocalStorage.getItem('Testing', null);
const itemTwo = LocalStorage.getItem('Some-none-existing-item');

console.log(item);
console.log(itemTwo);
