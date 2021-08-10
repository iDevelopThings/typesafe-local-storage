# Typesafe Local Storage

A nice easy api for interacting with localStorage and keeping type safety.

# Install the package:

```shell
yarn add typesafe-local-storage 
npm install typesafe-local-storage
```

**You can also use Memory Storage**
This follows the same api as LocalStorage, but just uses memory.

# WIP:

Events for change, update, delete actions.

Example:

```ts
import {LocalStorageWithEvents} from 'typesafe-local-storage';

LocalStorageWithEvents.onChange('test-item', (oldValue, newValue) => {
	console.log(oldValue, newValue);
	// emits:
	// "hello"
	// "hello world"
});

LocalStorageWithEvents.set('test-item', 'hello');
LocalStorageWithEvents.set('test-item', 'hello world');

```

# Some examples:

**Set an item**

```ts
import {LocalStorage} from 'typesafe-local-storage';

LocalStorage.set('test', {testing : true});
```

**Set an item which expires**

Takes a "Date" object, which I might re-work in the future, it looks messy like this... but not sure how else to do it.

```ts
import {LocalStorage} from 'typesafe-local-storage';

LocalStorage.set('test', {testing : true}, new Date(new Date().getTime() + 5000));

LocalStorage.get('test'); // returns {testing : true}
setTimeout(() => {
	LocalStorage.get('test'); // returns undefined
}, 6000);
```

**Get an item**

```ts
import {LocalStorage} from 'typesafe-local-storage';

type Testing = { testing: true };

LocalStorage.get<Testing>('test');

// Set a default return type if it doesn't exist.

LocalStorage.get<Testing>('dfjhfsdh', null) === null;
```

**Delete an item**

```ts
import {LocalStorage} from 'typesafe-local-storage';

LocalStorage.delete('test');
```

**Set localstorage prefix for all items**

```ts
import {LocalStorage} from 'typesafe-local-storage';

// Default is "ls:"
LocalStorage.setPrefix('typesafe-local-storage:');

LocalStorage.set('testing');

// Will exist in localStorage as "typesafe-local-storage:testing"
```

**Check if item exists**

```ts
import {LocalStorage} from 'typesafe-local-storage';

LocalStorage.exists('testing');
```

**Get item, create if it doesn't exist.**

```ts
import {LocalStorage} from 'typesafe-local-storage';

const test = LocalStorage.getOrCreate('testing', {testing : true});
```

**Update item, then return it.**

```ts
import {LocalStorage} from 'typesafe-local-storage';

const test = LocalStorage.getOrUpdate('testing', {testing : false});
```

**Delete all items of the specified prefix from localStorage**

```ts
import {LocalStorage} from 'typesafe-local-storage';

LocalStorage.clear();
```
