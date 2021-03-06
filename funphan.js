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
    var fuse, exit, outobj;
    fuse = function(){
      return setTimeout(function(){
        return exit(1, "FUSE TIMEOUT ERROR");
      }, fuse_ttl ? fuse_ttl : 30000);
    };
    fuse();
    page.onConsoleMessage = curry$(function(msg, lineNum, sourceId){
      if (outobj.debug) {
        return console.log("debug : console : msg = " + msg + " , lineNum = " + lineNum + " , sourceId = " + sourceId);
      }
    });
    page.onUrlChanged = function(url){
      if (outobj.debug) {
        return console.log("debug : new url = " + url);
      }
    };
    page.onError = curry$(function(msg, trace){
      fuse();
      if (outobj.debug) {
        return console.log("debug : page error : msg = " + msg + " , trace = " + trace);
      }
    });
    phantom.onError = curry$(function(msg, trace){
      fuse();
      if (outobj.debug) {
        return console.log("debug : phantom error : msg = " + msg + " , trace = " + trace);
      }
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
    return outobj = {
      debug: false,
      page: page,
      exit: exit,
      args: args,
      parse: function(data){
        console.log(data);
        return exit(0, false);
      },
      open: function(url, cb){
        var additional, res$, i$, to$;
        res$ = [];
        for (i$ = 2, to$ = arguments.length; i$ < to$; ++i$) {
          res$.push(arguments[i$]);
        }
        additional = res$;
        return page.open(url, function(status){
          switch (status) {
          case "success":
            return setTimeout(function(){
              var evalfun;
              evalfun = function(curry$, cbstr){
                var ref$, res$, i$, to$, additional, this_function, e;
                res$ = [];
                for (i$ = 2, to$ = arguments.length; i$ < to$; ++i$) {
                  res$.push(arguments[i$]);
                }
                ref$ = res$; additional = ref$[0];
                try {
                  this_function = eval(cbstr);
                  return this_function.apply(this_function, additional);
                } catch (e$) {
                  e = e$;
                  return "runtime eval error " + e.message;
                }
              };
              return outobj.parse(page.evaluate(evalfun, curry$, "(" + cb.toString() + ")", additional));
            }, 1000);
          default:
            return exit(1, "page open error " + status);
          }
        });
      }
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
