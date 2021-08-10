/**
 * @type MemoryStorage
 * @type LocalStorage
 */
import {LocalStorageWithEvents, MemoryStorageWithEvents} from './../dist/index.js';

LocalStorageWithEvents.onChange('Testing', (value) => {
	console.log('Changed: ', value);
})

MemoryStorageWithEvents.set('TestingMemory', 'woop');
console.log('TestingMemory', MemoryStorageWithEvents.get('TestingMemory'));

const testExpiring = (storage, key) => {
	storage.set(key, 'woop', new Date(new Date().getTime() + (5 * 1000)));

	const memoryCheck = setInterval(() => {
		console.log(key, storage.get(key));
	}, 1000);
	setTimeout(() => {
		clearInterval(memoryCheck);
	}, 6000);
};

testExpiring(MemoryStorageWithEvents, 'TestingExpiresAtMemoryStorageWithEvents');
testExpiring(LocalStorageWithEvents, 'TestingExpiresAtLocalStorageWithEvents');

LocalStorageWithEvents.set('Testing', {testing : true});
LocalStorageWithEvents.set('Testing', {testing : false});

const item    = LocalStorageWithEvents.get('Testing', null);
const itemTwo = LocalStorageWithEvents.get('Some-none-existing-item');

console.log(item);
console.log(itemTwo);
