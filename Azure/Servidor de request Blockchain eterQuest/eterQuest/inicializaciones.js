
var path = require('path');
var util = require('util');
var os = require('os');

module.exports = async function inicializa(fabric_client,channel,Fabric_Client,peer) {
    // setup the fabric network


    channel.addPeer(peer);
    var member_user = null;
    var store_path = path.join(__dirname, 'hfc-key-store');
    console.log('Store path:'+store_path);
    var tx_id = null;
    var state_store= await Fabric_Client.newDefaultKeyValueStore({ path: store_path});
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);

	// get the enrolled user from persistence, this user will sign all requests
//	return fabric_client.getUserContext('user1', true);

//}).then((user_from_store) => {
	var user_from_store = await fabric_client.getUserContext('user1', true);
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user1 from persistence');
		member_user = user_from_store;
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
	}




}