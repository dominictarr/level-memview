# level-memview

in-memory view on a levelup that is always consistent.

## example

create a simple counter:

``` js
var db = level(pathToDbDir, {encoding: 'json'})
var memview = require('level-memview')

var counts = {}
var get =
  memview(db, function update (op) {
    //create some freeform datastructure that is the view.
    //sum the values by type.
    counts[op.value.type] = (counts[op.value.type] || 0) + op.value.value
  }, function get (arg, cb) {
    //query a value out of the view.
    //This function should take the arg
    //and then callback with data.
    //this function must be read-only and should not alter the view.

    return counts[arg]
  })

db.batch([
  { key: 'apple', value: { type: 'fruit', value: 6 }, type: 'put'},
  { key: 'carrot', value: { type: 'vegetable', value: 7 }, type: 'put'}
], function (err) {
  if(err) throw err
  //retrive values from the view
  get('fruit', function (err, v) {
    console.log('fruits:', v) // 6
  })
})
```

## consistency.

When initializing the view, the contents of the database will be
streamed through the update function. So that the view is always
consistent with the data, the `get` calls to retrive the value
must be a pure function, and not alter the view.

## License

MIT
