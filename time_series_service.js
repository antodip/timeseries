'use strict'
const db = require('levelup')
const stream = require('stream')
const pump = require('pump')

class ToPoints extends stream.Transform {

    constructor() {
        super({
            objectMode: true
        })
    }

    _transform(chunk, enc, cb) {
        this.push({ timestamp: new Date(chunk.key), value: Number(chunk.value) });
        cb();
    }
}

module.exports = function (db) {

    return {
        add: function (point, cb) {
            // var timestamp = new Date();
            db.put(point.timestamp.toISOString(), point.value, function (err) {
                if (err) return cb(err);
                cb();

            });
        },

        pointsStream: function (start, end) {
             var input = db.createReadStream({
                'gte': start.toISOString(),
                'lte': end.toISOString()
            });


            //return input.pipe(new ToPoints());

            return pump(input,new ToPoints())
        },

        points: function (start, end, cb) {

            var ret = [];
            this.pointsStream(start,end)
           
            .on('data', function (data) {
                ret.push(data);
            })
            .on('err', function (err) {
                cb(err);
            })
            .on('end', function () {
                cb(null, ret)
            })
            

        }

    }


}