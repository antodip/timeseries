const db = require('levelup');

module.exports = function(db) {

    return {
        add: function(point, cb) {
            // var timestamp = new Date();
            db.put(point.timestamp, point.value, function(err) {
                   if (err)  return cb(err);
                   cb(true);
                   
            });
        },

        points: function(start, end, cb) {
            var ret = [];
            db.createReadStream({
                'gte': start,
                'lte': end
            }) 
            .on('data' , function(data){
                ret.push(data);
            })
            .on('err',function(err) {
                cb(err);
            })
            .on('end', function(){
                cb(null,ret)
            })
        
        }

    }


}