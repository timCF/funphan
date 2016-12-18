page = require('webpage').create()
page.viewportSize = { width:1024, height:768 }
[_, ...args] = require('system').args

funphan = (fuse_ttl) ->
  fuse = -> setTimeout((-> exit(1, "FUSE TIMEOUT ERROR")), (if fuse_ttl then fuse_ttl else 30000))
  fuse()
  # disable logging
  page.onConsoleMessage = (msg, lineNum, sourceId) -->
    if outobj.debug then console.log("debug : console : msg = #{msg} , lineNum = #{lineNum} , sourceId = #{sourceId}")
  page.onUrlChanged = (url) -->
    if outobj.debug then console.log("debug : new url = #{url}")
  page.onError = (msg, trace) -->
    fuse()
    if outobj.debug then console.log("debug : page error : msg = #{msg} , trace = #{trace}")
  phantom.onError = (msg, trace) -->
    fuse()
    if outobj.debug then console.log("debug : phantom error : msg = #{msg} , trace = #{trace}")
  exit = (code, error) -->
    fuse()
    if error then console.log(error)
    setTimeout((-> phantom.exit(code)), 1000)
    if page then page.close()
  outobj = {
    debug: false,
    page: page,
    exit: exit,
    args: args,
    # default parse &callback/1 just outputs data to console
    parse: (data) -->
      console.log(data)
      exit(0, false)
    # cb is simple &callback/0 should return required data from page url
    open: (url, cb, ...additional) ->
      status <-- page.open(url)
      switch status
        when "success"
          <-- setTimeout(_, 1000)
          evalfun = (curry$, cbstr, ...[additional]) ->
            try
              this_function = eval(cbstr)
              this_function.apply(this_function, additional)
            catch
              "runtime eval error #{e.message}"
          page.evaluate(evalfun, curry$, "(#{cb.toString()})", additional)
          |> outobj.parse(_)
        default
          exit(1, "page open error #{status}")
  }

module.exports = funphan
