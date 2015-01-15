
var tape  = require('tape')
var level = require('level-test')()
var view  = require('../')

function counter (db) {
  var c = 0
  return view(db, function update (op) {
    var n = +op.value
    n = isNaN(n) ? 1 : n
    c += n
  }, function (_, cb) {
    return c
  })
}

tape('test initialize', function (t) {
  var db = level('test-level-view', {encoding: 'json'})

  var query = counter(db)
  db.batch([
    {key: 'foo', value: 6, type: 'put'},
    {key: 'bar', value: 5, type: 'put'},
    {key: 'baz', value: 7, type: 'put'}
  ], function (err) {
    query(null, function (err, v) {
      t.equal(v, 18)
      db.close(function () {
        t.end()
      })
    })
  })
})

tape('test initialize', function (t) {
  var db = level('test-level-view', {encoding: 'json', clean: false})

  var query = counter(db)

  query(function (err, v) {
    t.equal(v, 18)
    db.close(function () {
      t.end()
    })
  })
})


