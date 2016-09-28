const db = require('levelup');

module.exports = function(db) {

    return {
        add: function(point, cb) {
            // var timestamp = new Date();
            db.put(point.timestamp.toISOString(), point.value, function(err) {
                   if (err)  return cb(err);
                   cb();
                   
            });
        },

        points: function(start, end, cb) {
            try{
                var ret = [];
                db.createReadStream({
                    'gte': start.toISOString(),
                    'lte': end.toISOString()
                }) 
                .on('data' , function(data){
                    ret.push({ timestamp: new Date(data.key), value: Number(data.value)});
                })
                .on('err',function(err) {
                    cb(err);
                })
                .on('end', function(){
                    cb(null,ret)
                })
        }
        catch(ex){
             cb(ex);
        }
        }

    }


}