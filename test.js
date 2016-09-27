const test = require('tape');
const mymodule = require('./time_series_service.js');
const levelup = require('levelup');
var db = levelup('./mydb')

test('should add point', function (t) {

    t.equal(mymodule(db).add({
        timestamp : new Date(), value : 1.0}
        , function(){  })
        ,undefined)
    t.end()
});

test('should get range', function (t) {
    var startdt = new Date();
    var enddt = startdt;
    
    //var exp = {timestamp: startdt, value:2.0}
    t.equal(mymodule(db).points(startdt, enddt, function(err,res){

    }), undefined)
    t.end()
});