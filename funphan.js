// Generated by LiveScript 1.5.0
(function(){
  var page, ref$, _, args, funphan, slice$ = [].slice;
  page = require('webpage').create();
  page.viewportSize = {
    width: 1024,
    height: 768
  };
  ref$ = require('system').args, _ = ref$[0], args = slice$.call(ref$, 1);
  funphan = function(fuse_ttl){
    var fuse, exit;
    fuse = function(){
      return setTimeout(function(){
        return exit(1, "FUSE TIMEOUT ERROR");
      }, fuse_ttl ? fuse_ttl : 30000);
    };
    fuse();
    page.onConsoleMessage = curry$(function(msg, lineNum, sourceId){
      return "ok";
    });
    page.onUrlChanged = function(url){
      return "ok";
    };
    page.onError = curry$(function(msg, trace){
      return fuse();
    });
    phantom.onError = curry$(function(msg, trace){
      return fuse();
    });
    exit = curry$(function(code, error){
      fuse();
      if (error) {
        console.log(error);
      }
      setTimeout(function(){
        return phantom.exit(code);
      }, 1000);
      if (page) {
        return page.close();
      }
    });
    return {
      page: page,
      exit: exit,
      args: args,
      parse: function(data){
        console.log(data);
        return exit(0, false);
      },
      open: curry$(function(url, cb){
        return page.open(url, function(status){
          switch (status) {
          case "success":
            return setTimeout(function(){
              return this.parse(page.evaluate(function(curry$, cbstr){
                var e;
                try {
                  return eval(cbstr)();
                } catch (e$) {
                  e = e$;
                  return "runtime eval error " + e.message;
                }
              }, curry$, cb.toString()));
            }, 1000);
          default:
            return exit(1, "page open error " + status);
          }
        });
      })
    };
  };
  module.exports = funphan;
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
