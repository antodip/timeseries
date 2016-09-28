const test = require('tape');
var pq = require('proxyquire')
const mymodule = require('./time_series_service.js');
const memdb = require('memdb');
const ndjson = require('ndjson') 


test('should add point', function (t) {

    var expected = {
        timestamp: new Date(),
        value: 1.0
    };
    var db = memdb();
    var service = mymodule(db);

    service.add(expected, function (err) {
        t.error(err, 'no error')

        db.get(expected.timestamp.toISOString(), function (err, data) {
            t.error(err, 'no error')
            t.equal(Number(data), expected.value);
            t.end();
        })
    });


});


test('get points', function (t) {
    var start = new Date();
    var end = new Date();
    end.setSeconds(end.getSeconds() + 1)
    var exp = [{ timestamp: start, value: 1.0 },
        { timestamp: end, value: 2.0 }]

    // var getStub = function(input){ return {err:null, res:exp} }
    // var dbStub = pq('./levelup', {'./createReadStream' : getStub() } )

    var db = memdb();
    var service = mymodule(db);

    db.batch()
    .put(exp[0].timestamp.toISOString(), exp[0].value)
    .put(exp[1].timestamp.toISOString(), exp[1].value)
    .write(function (err) {
       t.error(err)

        service.points(start, end, function cb(err, res) {
            t.error(err)
            t.deepEqual(res, exp)
            t.end()
        })
    });


})


test('get stream points', function (t) {
    var start = new Date();
    var end = new Date();
    end.setSeconds(end.getSeconds() + 1)
    var exp = [{ timestamp: start, value: 1.0 },
        { timestamp: end, value: 2.0 }]

    var db = memdb();
    var service = mymodule(db);

    db.batch()
    .put(exp[0].timestamp.toISOString(), exp[0].value)
    .put(exp[1].timestamp.toISOString(), exp[1].value)
    .write(function (err) {
       t.error(err)

       var ret = [];
        var stream = service.pointsStream(start, end)
        stream.on('data', function (data) {
                ret.push(data);
        })
        .on('err', function (err) {
            t.error(err);
        })
        .on('end', function () {
            t.deepEqual(ret, exp)
            t.end()
        })
        
    });


})



