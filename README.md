[![npm](https://img.shields.io/npm/v/thin-trap.svg)](https://www.npmjs.com/package/thin-trap)
[![Bower](https://img.shields.io/bower/v/thin-trap.svg)](https://customelements.io/t2ym/thin-trap/)

# thin-trap

Thin ES6 Proxy Wrapper for Better Transparency (experimental)

```javascript
window.XMLHttpRequest = trap(window.XMLHttpRequest,
  function loggerForwarder(trapName, args, target, outerProxy, thisArg, proxyForThis) {
    console.log('trap:', trapName, args,
      'for', (typeof target === 'function' ? target.name : target),
      'thisArg', (thisArg && thisArg.name ? thisArg.name : thisArg));
    return Reflect[trapName](...args);
  }
);
```

## Install

### Browsers

```sh
  bower install --save thin-trap
```

### NodeJS

```sh
  npm install --save thin-trap
```

## Import

### Browsers

```html
  <script src="path/to/bower_components/thin-trap/trap.js"></script>
```

### NodeJS

```javascript
const trap = require('thin-trap/trap.js');
```

## API

TBD

## License

[BSD-2-Clause](https://github.com/t2ym/thin-trap/blob/master/LICENSE.md)
