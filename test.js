const test = require('tape');
var pq = require('proxyquire')
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


test('get points', function(t){
	var dt = new Date()
	var exp = [{timestamp : dt, value: 1.0},
		{timestamp : new Date(), value: 2.0}]

	var getStub = function(input){ return {err:null, res:exp} }
	var dbStub = pq('./levelup', {'./createReadStream' : getStub() } )

	my(dbStub).points( dt, dt, function cb(err, res){
		t.equal(err , null)
		t.equal(res, exp)
		t.end()
	})
})



test('should getRange onEmptyDb', function (t) {
    var startdt = new Date();
    var enddt = startdt;
    db = null
    var exp = {timestamp: startdt, value:2.0}
    var result = ""
    mymodule(db).points(startdt, enddt, function(err,res){
        //console.log(err) //, "TypeError: Cannot read property 'createReadStream' of null")
        t.ok(err);
        
    })
    t.end()
});