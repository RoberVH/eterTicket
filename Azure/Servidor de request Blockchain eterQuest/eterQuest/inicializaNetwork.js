
'use strict';
var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs');

module.exports =  { // peer sale de la rutina
inicializa:  async function (channel,Fabric_Client)  {
//var fabric_client = new Fabric_Client();
// load the base network profile
//make sure we have the profiles we need

var networkConfig = path.join(__dirname, './config/network-profile.json')
var clientConfig = path.join(__dirname, './config/client-profile.json');
 module.exports.checkProfilesExist(networkConfig, clientConfig); //terminates early if they are not found
// load the base network profile
var fabric_client = Fabric_Client.loadFromConfig(networkConfig);
// overlay the client profile over the network profile
fabric_client.loadFromConfig(clientConfig);
// setup the fabric network - get the peers and channel that were loaded from the network profile
channel = fabric_client.getChannel('defaultchannel');

//load the user who is going to interact with the network
await fabric_client.initCredentialStores();
// get the enrolled user from persistence, this user will sign all requests
var user_from_store= await fabric_client.getUserContext('user1', true);
if (user_from_store && user_from_store.isEnrolled()) {
    console.log('Successfully loaded user1 from persistence');
    } else {
        throw new Error('Failed to get user1.... run registerUserNetwork.js');
    }
// setup the fabric network - get the peers and channel that were loaded from the network profile
},
/* ************************ Rutinas de apoyo **************************************/


checkProfilesExist: async function (networkConfig, clientConfig)    {
    if (!fs.existsSync(networkConfig)) {
      console.log("Error: config file 'network-profile.json' not found.");
      console.log("Make sure 'network-profile.json' is copied into the './config' folder.");
      process.exit()
    }
    //make sure we have the client profile we need
    if (!fs.existsSync(clientConfig)) {
      console.log("Error: config file 'client-profile.json' not found.");
      console.log("Make sure 'client-profile.json' is copied into the './config' folder.");
      process.exit()
    }
   }
}
