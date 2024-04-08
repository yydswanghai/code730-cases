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
  let _catch = {
    status: 'padding',
    value: null
  };
  const oldFetch = window.fetch;
  window.fetch = function (...args) {
    if (_catch.status === 'fulfilled') {
      return _catch.value;
    } else if (_catch.status === 'rejected') {
      throw _catch.value;
    }
    const proms = oldFetch(...args).then((r) => r.json()).then((res) => {
      _catch.status = 'fulfilled';
      _catch.value = res;
    }, (err) => {
      _catch.status = 'rejected';
      _catch.value = err;
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
