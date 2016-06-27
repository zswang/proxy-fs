proxy-fs
-----

A simple proxy filesystem.

# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

## example

```js
var mfs = new MemoryFileSystem({});
var pfs = new ProxyFileSystem(function (path) {
  if (/abc/.test(path)) {
    return {
      path: '/data/hello.js',
      fileSystem: mfs
    };
  }
});

mfs.mkdirpSync('/data');
mfs.writeFileSync('/data/hello.js', 'hello');
console.log(String(pfs.readFileSync('/data/abc.js')));
// > hello
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/proxy-fs
[npm-image]: https://badge.fury.io/js/proxy-fs.svg
[travis-url]: https://travis-ci.org/zswang/proxy-fs
[travis-image]: https://travis-ci.org/zswang/proxy-fs.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/proxy-fs?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/proxy-fs/badge.svg?branch=master&service=github
