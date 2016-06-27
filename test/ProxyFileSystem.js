var MemoryFileSystem = require('memory-fs');
var ProxyFileSystem = require('../');

describe("src/ProxyFileSystem.js", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }

  it("ProxyFileSystem():return all", function() {
    examplejs_printLines = [];
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
  examplejs_print(String(pfs.readFileSync('/data/abc.js')));
  assert.equal(examplejs_printLines.join("\n"), "hello"); examplejs_printLines = [];
  });
  it("ProxyFileSystem():return string", function() {
    examplejs_printLines = [];
  var pfs = new ProxyFileSystem(function (path) {
    if (/abc/.test(path)) {
      return require('path').join(__dirname, 'data/city.txt');
    }
  });

  examplejs_print(String(pfs.readFileSync('/data/abc.js')));
  assert.equal(examplejs_printLines.join("\n"), "Beijing"); examplejs_printLines = [];
  });
  it("ProxyFileSystem():route is null", function() {
    examplejs_printLines = [];
  var pfs = new ProxyFileSystem();

  examplejs_print(String(pfs.readFileSync('test/data/city.txt')));
  assert.equal(examplejs_printLines.join("\n"), "Beijing"); examplejs_printLines = [];
  });
  it("ProxyFileSystem():return undefined", function() {
    examplejs_printLines = [];
  var pfs = new ProxyFileSystem(function (path) {});
  examplejs_print(String(pfs.readFileSync('test/data/city.txt')));
  assert.equal(examplejs_printLines.join("\n"), "Beijing"); examplejs_printLines = [];
  });
  it("ProxyFileSystem():return FileSystem", function() {
    examplejs_printLines = [];
  var mfs = new MemoryFileSystem({});
  var pfs = new ProxyFileSystem(function (path) {
    return mfs;
  });

  mfs.mkdirpSync('/data');
  mfs.writeFileSync('/data/hello.js', 'hello');
  examplejs_print(String(pfs.readFileSync('/data/hello.js')));
  assert.equal(examplejs_printLines.join("\n"), "hello"); examplejs_printLines = [];
  });
  it("ProxyFileSystem():return { fileSystem: mfs }", function() {
    examplejs_printLines = [];
  var mfs = new MemoryFileSystem({});
  var pfs = new ProxyFileSystem(function (path) {
    return {
      fileSystem: mfs
    };
  });

  mfs.mkdirpSync('/data');
  mfs.writeFileSync('/data/hello.js', 'hello');
  examplejs_print(String(pfs.readFileSync('/data/hello.js')));
  assert.equal(examplejs_printLines.join("\n"), "hello"); examplejs_printLines = [];
  });
});