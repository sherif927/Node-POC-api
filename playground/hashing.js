const { SHA256 } = require('crypto-js');

var message = 'My name is sherif amr';
var hashValue = SHA256(message).toString();

console.log(`this is the original message:${message}`);
console.log(`this is the hashing result: ${hashValue}`);