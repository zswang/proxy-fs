var fs = require('fs');
/**
 * @file proxy-fs
 *
 * A simple proxy filesystem.
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.0.7
 * @date 2016-06-27
 */
/**
 * 文件系统代理
 *
 * @param{Function (path): FileSystem} route 路由规则
 * @param{FileSystem} defaultFileSystem 默认文件系统对象
 * @constructor
 * @example ProxyFileSystem():return { path, fileSystem }
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
 * @example ProxyFileSystem():return string
  ```js
  var pfs = new ProxyFileSystem(function (path) {
    if (/abc/.test(path)) {
      return require('path').join(__dirname, 'data/city.txt');
    }
  });
  console.log(String(pfs.readFileSync('/data/abc.js')));
  // > Beijing
  ```
 * @example ProxyFileSystem():route is null
  ```js
  var pfs = new ProxyFileSystem();
  console.log(String(pfs.readFileSync('test/data/city.txt')));
  // > Beijing
  ```
 * @example ProxyFileSystem():return undefined
  ```js
  var pfs = new ProxyFileSystem(function (path) {});
  console.log(String(pfs.readFileSync('test/data/city.txt')));
  // > Beijing
  ```
 * @example ProxyFileSystem():return FileSystem
  ```js
  var mfs = new MemoryFileSystem({});
  var pfs = new ProxyFileSystem(function (path) {
    return mfs;
  });
  mfs.mkdirpSync('/data');
  mfs.writeFileSync('/data/hello.js', 'hello');
  console.log(String(pfs.readFileSync('/data/hello.js')));
  // > hello
  ```
 * @example ProxyFileSystem():return { fileSystem: mfs }
  ```js
  var mfs = new MemoryFileSystem({});
  var pfs = new ProxyFileSystem(function (path) {
    return {
      fileSystem: mfs
    };
  });
  mfs.mkdirpSync('/data');
  mfs.writeFileSync('/data/hello.js', 'hello');
  console.log(String(pfs.readFileSync('/data/hello.js')));
  // > hello
  ```
 */
function ProxyFileSystem(route, defaultFileSystem) {
  this.route = route;
  this.defaultFileSystem = defaultFileSystem;
}
Object.keys(fs).concat(['mkdirp', 'mkdirpSync', 'join']).forEach(function (key) {
  var fn = fs[key];
  if (typeof fn === 'function' || /^(mkdirp|join)/.test(key)) {
    ProxyFileSystem.prototype[key] = function (path) {
      var fileSystem;
      if (typeof path === 'string' && this.route) {
        var result = this.route(path);
        if (typeof result === 'object') {
          if (typeof result.readFileSync === 'function') {
            fileSystem = result;
          } else {
            fileSystem = result.fileSystem;
            if (typeof result.path === 'string') {
              arguments[0] = result.path;
            }
          }
        } else if (typeof result === 'string') {
          arguments[0] = result;
        }
      }
      if (!fileSystem) {
        fileSystem = this.defaultFileSystem || fs;
      }
      return fileSystem[key].apply(fileSystem, arguments);
    };
  } else {
    ProxyFileSystem.prototype[key] = fn;
  }
});
module.exports = ProxyFileSystem;