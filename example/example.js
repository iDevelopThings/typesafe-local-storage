/**
 * @type MemoryStorage
 * @type LocalStorage
 */
import {LocalStorage, MemoryStorage} from './../dist/index.js';

LocalStorage.onAny((type, key, value, oldValue) => {
	console.log('onAny: ', type, key, value, oldValue)
})

LocalStorage.onChange('TestingMemory', (value) => {
	console.log('Changed: ', value);
})
LocalStorage.onAdd('TestingMemory', (value) => {
	console.log('Added: ', value);
})
LocalStorage.onDelete('TestingMemory', (value) => {
	console.log('Deleted: ', value);
})

MemoryStorage.set('TestingMemory', 'woop');
console.log('TestingMemory', MemoryStorage.get('TestingMemory'));

const testExpiring = (storage, key) => {
	storage.set(key, 'woop', new Date(new Date().getTime() + (5 * 1000)));

	const memoryCheck = setInterval(() => {
		console.log(key, storage.get(key));
	}, 1000);
	setTimeout(() => {
		clearInterval(memoryCheck);
	}, 6000);
};

testExpiring(MemoryStorage, 'TestingExpiresAtMemoryStorage');
testExpiring(LocalStorage, 'TestingExpiresAtLocalStorage');

LocalStorage.set('Testing', {testing : true});
LocalStorage.set('Testing', {testing : false});

const item    = LocalStorage.get('Testing', null);
const itemTwo = LocalStorage.get('Some-none-existing-item');

console.log('item: ', item);
console.log('itemTwo: ', itemTwo);
