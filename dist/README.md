# Typesafe Local Storage

A nice easy api for interacting with localStorage and keeping type safety.

# Install the package:
```shell
yarn add typesafe-local-storage 
npm install typesafe-local-storage
```

# Some examples:

**Set an item**

```ts
import {LocalStorage} from 'typesafe-local-storage';

LocalStorage.setItem('test', {testing : true});
```

**Get an item**

```ts
import {LocalStorage} from 'typesafe-local-storage';

type Testing = { testing: true };

LocalStorage.getItem<Testing>('test');

// Set a default return type if it doesn't exist.

LocalStorage.getItem<Testing>('dfjhfsdh', null) === null;
```

**Delete an item**

```ts
import {LocalStorage} from 'typesafe-local-storage';

LocalStorage.deleteItem('test');
```

**Set localstorage prefix for all items**

```ts
import {LocalStorage} from 'typesafe-local-storage';

// Default is "ls:"
LocalStorage.setPrefix('typesafe-local-storage:');

LocalStorage.setItem('testing');

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
