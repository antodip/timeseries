const test = require('tape');
const mymodule = require('./module');

test('should return the answer', function (t) {
    t.equal(mymodule.theanswer,42)
    t.end()
});