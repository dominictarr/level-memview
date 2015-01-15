var pl   = require('pull-level')
var pull = require('pull-stream')

module.exports = function (db, update, get) {
  var waiting = [], ready = false
  pull(
    pl.read(db, {
      onSync: function () {
        ready = true
        while(waiting.length) {
          waiting.shift()()
        }
      },
      live: true
    }),
    pull.drain(update)
  )

  function call (opts, cb) {
    var value
    try { value = get(opts) }
    catch (err) { return cb(err) }
    cb(null, value)
  }

  return function (opts, cb) {
    if(!cb) cb = opts, opts = null
    if(ready) call(opts, cb)
    else waiting.push(function () { call(opts, cb) })
  }

}
