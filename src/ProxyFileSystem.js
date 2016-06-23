var fs = require('fs');

/**
 * 文件系统代理
 *
 * @param{Function (path): FileSystem} route 路由规则
 * @constructor
 * @exapmle
  ```js
    var MemoryFileSystem = require('memory-fs');
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
 */
function ProxyFileSystem(route) {
  this.route = route;
}

Object.keys(fs).forEach(function (key) {
  var fn = fs[key];
  if (typeof fn === 'function') {
    ProxyFileSystem.prototype[key] = function (path) {
      var fileSystem;
      if (typeof path === 'string') {
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
        fileSystem = fs;
      }
      return fileSystem[key].apply(fileSystem, arguments);
    };
  } else {
    ProxyFileSystem.prototype[key] = fn;
  }
});