'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

var C=require('./utiles/constantes');

 module.exports =async function queryBCRetail(request,channel,res) {
	try {
			var query_responses= await channel.queryByChaincode(request);
	//}).then((query_responses) => {
		
		console.log("Query has completed, checking results");
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				console.error("error from query = ", query_responses[0]);
			} else {
				//console.log("Response is ", query_responses[0].toString());
				if (query_responses[0].toString()!="") {
					res.send(query_responses[0].toString());
				} else {
					//console.log('fallado');
					res.status(C.CHTTP.NOTFOUND).json({ mensaje: 'No hay registros' } /* json object*/);
				}
			}
		} else {
			//console.log("No payloads were returned from query");
			res.status(C.CHTTP.NOTFOUND).json({mensaje:"no hallado"});
		}
	} catch(err) {
	console.error('Failed to query successfully :: ' + err);
	};
}