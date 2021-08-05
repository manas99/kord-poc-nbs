var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

// ed25519
var user1 = {
	"account_id": "manas.testnet",
	"public_key": nacl.util.decodeUTF8("BEGept1brLdfmQPWN2vo6YW5kZQcDfhV19y5Z8rHugKg"),
	"private_key": nacl.util.decodeUTF8("5T3QNqEtWdJeP6UdKLZWqPtMrjgCQdb4KKvxcGVNftstL7ga9dLQ4jYixKky74J4BNajd33n6jVKJUBiPmGQetZt")
};
var user2 = {
	"account_id": "80ec1b39334448cca09b33ddadaaf2e6ce6150b6bac26fe9b9f20738051ccb6d",
	"public_key": nacl.util.decodeUTF8("9gFzwVrYvBx5YUiswqiqoYun2QHJfrrcqrZUiKqgSvtL"),
	"private_key": nacl.util.decodeUTF8("48AdjoXYLPF3WGyvEzEEqzP9gwkttZtpkBmh7fonFzxGSxkDtNc2MsvWZnyUEuBJY7azFv4hRRcVci5WZxvjYfSL")
}


const plaintext = "Hello!";
const plainbuff = Buffer.from(plaintext, 'utf8');

const nonce = "MfJbZAHFvz3vnmZ6pu5oipCIyhot23/Q"

var box = nacl.box(plaintext, nonce, user2.public_key, user1.private_key)
console.log(box)