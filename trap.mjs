/*
@license https://github.com/t2ym/scenarist/blob/master/LICENSE.md
Copyright (c) 2017, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
const proxyToTarget = new WeakMap();
const targetToProxy = new WeakMap();
function register(target, proxyGenerator) {
  let proxy = targetToProxy.get(target);
  if (!proxy) {
    let tmpTarget = proxyToTarget.get(target);
    if (tmpTarget) {
      proxy = target;
      target = tmpTarget;
    }
    if (!proxy) {
      proxy = proxyGenerator();
      proxyToTarget.set(proxy, target);
      targetToProxy.set(target, proxy);
    }
  }
  return proxy;
}

function trap(target, forwarder, thisArg, proxyForThis) {
  let outerProxy;
  forwarder = forwarder || trap.defaultForwarder;
  return register(target, () => outerProxy = new Proxy(target, new Proxy({}, {
    get(innerTarget, trapName, receiver) {
      return function (...args) {
        let value;
        switch (trapName) {
        case 'apply':
          if (thisArg && args[1] === proxyForThis) {
            args[1] = thisArg;
          }
          if (Array.isArray(args[2])) {
            args[2] = args[2].map(arg => {
              switch (typeof arg) {
              case 'function':
                return trap(arg, forwarder);
              default:
                return arg;
              }
            });
          }
          break;
        case 'get':
          if (args[2] === outerProxy) {
            args[2] = target;
          }
          break;
        case 'set':
          if (args[3] === outerProxy) {
            args[3] = target;
          }
          break;
        default:
          break;
        }
        value = typeof forwarder === 'function'
          ? forwarder(trapName, args, target, outerProxy, thisArg, proxyForThis)
          : Reflect[trapName](...args);
        if (typeof value === 'function' || trapName === 'construct') {
          value = trap(value, forwarder, target, outerProxy);
        }
        return value;
      }
    }
  })));
}

trap.targetToProxy = targetToProxy;
trap.proxyToTarget = proxyToTarget;

trap.defaultForwarder = function(trapName, args, target, outerProxy, thisArg, proxyForThis) {
  return Reflect[trapName](...args);
};

trap.loggerForwarder = function(trapName, args, target, outerProxy, thisArg, proxyForThis) {
  console.log('trap:', trapName, args,
    'for', (typeof target === 'function' ? target.name : target),
    'thisArg', (thisArg && thisArg.name ? thisArg.name : thisArg));
  return Reflect[trapName](...args);
};

export default trap;
