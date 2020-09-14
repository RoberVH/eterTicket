'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode query
 */
var  C= require('./utiles/constantes');

module.exports = async function queryBCRetail(request,channel,res) { // invocar(request,channel,res


  // send the query proposal to the peer
  try {
  var  query_responses= await channel.queryByChaincode(request);
  console.log("Query has completed, checking results");
  // query_responses could have more than one  results if there multiple peers were used as targets
  if (query_responses && query_responses.length == 1) {
    if (query_responses[0] instanceof Error) {
      console.error("error from query = ", query_responses[0]);
    } else {
      console.log("Response is ", query_responses[0].toString());
      res.send(query_responses[0].toString());
      //res.status(200).json(query_responses[0].toString());  //!!!!!!!! Checar
    }
  } else {
    console.log("No payloads were returned from query");
    res.status(C.CHTTP.NOTFOUND).json('No hay registros'); //!!!!!!!! Checar
  }
} catch(err) {
  console.error('Failed to query successfully :: ' + err);
  };
}

 

