function getUser() {
  return fetch('./1.json');
}
function m1() {
  const user = getUser();
  return user;
}
function m2() {
  const user = m1();
  return user;
}
function main() {
  console.log('main()');
  const ret = m2();
  console.log(ret);
}

function run(func) {
  let cache = {
    status: 'padding',
    value: null
  };
  const oldFetch = window.fetch;
  window.fetch = function (...args) {
    if (cache.status === 'fulfilled') {
      return cache.value;
    } else if (cache.status === 'rejected') {
      throw cache.value;
    }
    const proms = oldFetch(...args).then((r) => r.json()).then((res) => {
      cache.status = 'fulfilled';
      cache.value = res;
    }, (err) => {
      cache.status = 'rejected';
      cache.value = err;
    });
    throw proms;
  }

  try {
    func();
  } catch (err) {
    if (err && Object.prototype.toString.call(err) === "[object Promise]") {
      err.then(func, func).finally(() => {
        window.fetch = oldFetch;
      });
    }
  }
}
run(main);
