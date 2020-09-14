/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

const TD_LINEATICKET = "lin-tk";
const TD_HEADERTICKET = "hdr-tk";
const TD_FMASPAGO = "frm-tk";

let Chaincode = class {

  // The Init method is called when the Smart Contract 'fabcar' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated fabcar chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'fabcar'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async queryCar(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting CarNumber ex: CAR01');
    }
    let carNumber = args[0];

    let carAsBytes = await stub.getState(carNumber); //get the car from chaincode state
    if (!carAsBytes || carAsBytes.toString().length <= 0) {
      throw new Error(carNumber + ' does not exist: ');
    }
    console.log(carAsBytes.toString());
    return carAsBytes;
  }

  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    let cars = [];
    cars.push({
      make: 'Toyota',
      model: 'Prius',
      color: 'blue',
      owner: 'Tomoko'
    });
    cars.push({
      make: 'Ford',
      model: 'Mustang',
      color: 'red',
      owner: 'Brad'
    });
    cars.push({
      make: 'Hyundai',
      model: 'Tucson',
      color: 'green',
      owner: 'Jin Soo'
    });
    cars.push({
      make: 'Volkswagen',
      model: 'Passat',
      color: 'yellow',
      owner: 'Max'
    });
    cars.push({
      make: 'Tesla',
      model: 'S',
      color: 'black',
      owner: 'Adriana'
    });
    cars.push({
      make: 'Peugeot',
      model: '205',
      color: 'purple',
      owner: 'Michel'
    });
    cars.push({
      make: 'Chery',
      model: 'S22L',
      color: 'white',
      owner: 'Aarav'
    });
    cars.push({
      make: 'Fiat',
      model: 'Punto',
      color: 'violet',
      owner: 'Pari'
    });
    cars.push({
      make: 'Tata',
      model: 'Nano',
      color: 'indigo',
      owner: 'Valeria'
    });
    cars.push({
      make: 'Holden',
      model: 'Barina',
      color: 'brown',
      owner: 'Shotaro'
    });

    for (let i = 0; i < cars.length; i++) {
      cars[i].docType = 'car';
      await stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
      console.info('Added <--> ', cars[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  async createCar(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 5) {
      throw new Error('Incorrect number of arguments. Expecting 5');
    }

    var car = {
      docType: 'car',
      make: args[1],
      model: args[2],
      color: args[3],
      owner: args[4]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : Create Car ===========');
  }

  async queryAllCars(stub, args) {

    let startKey = 'CAR0';
    let endKey = 'CAR999';

    let iterator = await stub.getStateByRange(startKey, endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async changeCarOwner(stub, args) {
    console.info('============= START : changeCarOwner ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.owner = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : changeCarOwner ===========');
  }
/****************************************************************************************************************************/
     async regHeader(stub, args, thisClass) {
      if (args.length != 2) {
        throw new Error('Numero incorrecto de parametros, deben ser 2 y recibi: ',args.length);
      }
      let cveHdrstr=args[0];
      let hdrObjstr= args[1];
      if (!cveHdrstr) {
        throw new Error(' Clave de Header no hallada');
      }
      console.log('Clave: ' + cveHdrstr);
      //console.log('Header: ' + hdrObjstr);
      let hdrObj=JSON.parse(hdrObjstr);
      // Agrega al doctype al header para las consultas posteriores
      hdrObj["docType"]=TD_HEADERTICKET;
      //console.info('Objeto JS Header object: ' + hdrObj);
      //console.info('Objeto JS Header: en bytes ' + Buffer.from(JSON.stringify(hdrObj)));
      await stub.putState(cveHdrstr, Buffer.from(JSON.stringify(hdrObj)));
      
      // crear indice para busqueda rapida para Retailers y Clientes
      let idxCptoRetCte = 'hdr~rtlcte';  // Indice de header compuesto para Retailers y Clientes
      console.info('Idx Comp: Rtl: ' + hdrObj.Rtl.toString() + ' Suc: ' + hdrObj.Suc.toString() + ' Fc: ' + hdrObj.Fc + ' Ruc: ' + hdrObj.Ruc.toString());
      let retcteIdxKey = await stub.createCompositeKey(idxCptoRetCte, [hdrObj.Rtl.toString(), hdrObj.Suc.toString(),hdrObj.Fc,hdrObj.Ruc.toString()]);
      console.info('Llave compuesta: ' + retcteIdxKey);
      //  Registrar indice en el estado. Solo el indice, no hay que duplicar el activo
      // Para no borrar la lleve del estado, pasamos un caracter  nulo y no un NIL
      await stub.putState(retcteIdxKey, Buffer.from('\u0000'));
      
      console.info('- Fin de registro de Header');
    }
	

   // =======================================================================================================================    
   // leeHdr - Recuperar un header por su clave
   // {"leeHdr","cveHdr"}
   // La clave es: cveRetailer + cveSuc + numcaja + folio + fecha
   // =======================================================================================================================    
   async leeHdr(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Numero incorrecto de parametros, debe ser 1 y recibi: ',args.length);
    }

    let cveHdrstr = args[0];
    if (!cveHdrstr) {
      throw new Error(' Clave de Ticket (Header) no hallada');
    }
    
    let hdrBytes = await stub.getState(cveHdrstr); //obtener el header como arreglo de bytes del estado
    if (!hdrBytes.toString()) {
      let jsonResp = {};
      jsonResp.Error = 'Ticket (Header) no existe: ' + cveHdrstr;
      throw new Error(JSON.stringify(jsonResp));
    }
    console.info('=======================================');
    console.log(hdrBytes.toString());
    console.info('=======================================');
    return hdrBytes;
  }

   async obtMultHdrs(stub, args, thisClass) {
    
    if (args.length < 1) {
      throw new Error('Numero incorrecto de parametros, deben ser 1 (arreglo de atributos) y recibi: ',args.length);
    }
    let atributos=[];
    for ( let i=0;i< args.length;i++){
        atributos.push(args[i]);
    }
    let respHdr;
    let idxCptoRetCte='hdr~rtlcte';
    console.info('En obtMultHdrs');
    let retcteIdxKeyIter = await stub.getStateByPartialCompositeKey(idxCptoRetCte, atributos);
    respHdr = await retcteIdxKeyIter.next();
    console.log('respHdr: ', respHdr);
    let colCveHdrs=[];
    let i=0;
    while (respHdr.hasOwnProperty('value'))   {
          let llavesComp= await stub.splitCompositeKey(respHdr.value.key);
          console.log('llaves: ', llavesComp.attributes);
          console.log('respHdr: ', respHdr);
          colCveHdrs.push(llavesComp.attributes);
          respHdr = await retcteIdxKeyIter.next();
          console.log('colCveHdrs: ',colCveHdrs)
          console.log('Leido respHdr por la :',i,'-esima vez'); i++;
    } 
      if (!colCveHdrs.length) {
          let jsonResp = {};
          jsonResp.Error = 'No hay resultados para indices ' + atributos;
          throw new Error(JSON.stringify(jsonResp));
      }       
        console.log('Coleccion de Keys de Headers ', colCveHdrs);
        console.log('Coleccion de Keys de Headers (stringifagdo) ', JSON.stringify(colCveHdrs));
        await retcteIdxKeyIter.close();
        return Buffer.from(JSON.stringify(colCveHdrs));
  }   

 /* =======================================================================================================================    
  #     **********************  Funciones de     *****************************************************************
  #     ********************** Lineas de Ticket  *****************************************************************
  ==========================================================================================================================
  */   

  /* =======================================================================================================================    
  #  regLinea - Registra una colección de lineas de un Ticket
  #  {"regLinea","cveHeader","linStrObj"}
  #  cveHeader: La clave del header al que pertenece la linea
  #  linStrObj - Colección de objetos representado como string de las lineas
  #  La clave unica de la linea. Se construye con la  combinacion de los  valores de la linea:
  #       cveHeader + Numero Secuencial de la linea el objeto
  #   La colección de objetos de lineas es de la forma:
  #   {{lin1},{lin2}, ... {linN}} 
  #   donde cada linea es de la forma:
  #   {"nl";1,"cb":7509394481202,"cd":20,"ct":2.5,"um":1,"ip1":0.16,"ip2":0.0,"pc":215.50,"pd":210.00,"pt":210.00,"pr":0;"pds":0,"pf":0}
  # ========================================================================================================================    
  */

  async regLinea(stub, args, thisClass) {
    // Recibice en el primer parametro 
    console.log('En regLinea');
    if (args.length != 2) {
      throw new Error('Numero incorrecto de parametros, debe ser 2 y recibi: ',args.length);
    }
    // Obtener valores
    let cveHeader= args[0];
    // traslada el array de objetos
    let lineasObj=args[1];
    console.log('lineasObj',lineasObj);
    let linObjs=JSON.parse(lineasObj);
    //console.log('linObjs ',linObjs)
    //console.log('linObjs[0], linObjs[1].cd ',linObjs[0],linObjs[1].cd);
    //let numLinea=0;
   /* linObjs.forEach( async linea => {
      let cveLinea=cveHeader+numLinea;
      console.log('Por escribir al estado: ',cveLinea, Buffer.from(JSON.stringify(linea)));
      await stub.putState(cveLinea, Buffer.from(JSON.stringify(linea)));
    });*/
    for (let nLin=0;  nLin < linObjs.length; nLin++ ) {
      let cveLinea=cveHeader+nLin.toString();
      // para recuperar en uina sola consulta todos las lineas con la clave del header del ticket agregamos este a la linea con propiedad 'ch'
      linObjs[nLin]["ch"]=cveHeader;  
      // tambien agreguamos el campo docType Linea de Ticket "lin-t"
      linObjs[nLin]["docType"]=  TD_LINEATICKET
      console.log('Por escribir al estado: ',cveLinea, JSON.stringify(linObjs[nLin]));      
      await stub.putState(cveLinea, Buffer.from(JSON.stringify(linObjs[nLin])));
    }
    console.log('regLinea terminado');
  }
 
  /* =======================================================================================================================    
  #  leeLineasTicket - Obten todas las lineas de un ticket
  #  {"leeLineasTicket", "cveHticket","NumLin"}
  #  cveHTicket - La clave del header del ticker
  /* =======================================================================================================================    
  */
 async leeLineasTicket(stub, args, thisClass) {
  // Recibice en el primer parametro 
  console.log('En leeLineasTicket');
  if (args.length != 1) {
    throw new Error('Numero incorrecto de parametros, debe ser 1 y recibi: ',args.length);
  }
  // Obtener valores
  let cveHeader= args[0];
  let query = {};
  query.selector = {};
  query.selector.docType = TD_LINEATICKET;
  query.selector.ch = cveHeader;
  let method = thisClass['execQuery'];
  let queryResults = await method(stub, JSON.stringify(query), thisClass);
  return queryResults; //shim.success(queryResults);
  }  

   /* =======================================================================================================================    
  #  queryAbierta - Recibe un todas las lineas de un ticket
  #  {"leeLineasTicket", "cveHticket","NumLin"}
  #  cveHTicket - La clave del header del ticker
  /* =======================================================================================================================    
  */
 async queryAbierta(stub, args, thisClass) {
  // Recibice en el primer parametro 
  console.log('En queryAbierta');
  if (args.length < 1) {
    throw new Error('Numero incorrecto de parametros, debe ser 1 (la  query en modo string) y recibi',args.length);
  }
  let query = args[0];
  if (!query) {
    throw new Error('Cadena query no puede ser vacia');
  }
  let method = thisClass['execQuery'];
  let queryResults = await method(stub, query, thisClass);
  return queryResults;
  }
    
/* =======================================================================================================================    
  #     **********************  Rutinas  de     *****************************************************************
  #     **********************    Soporte       *****************************************************************
  ==========================================================================================================================
  */ 
  
 async execQuery(stub, queryString, thisClass) {

  console.info('- execQuery:\n' + queryString)
  let resultsIterator = await stub.getQueryResult(queryString);
  let method = thisClass['obtResulCompl'];

  let results = await method(resultsIterator, false);

  return Buffer.from(JSON.stringify(results));
}


/*************************************************************************** */

  async obtResulCompl(iterator, bPasado) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (bPasado && bPasado === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }  
/****************************************************************************************************************************/  
};

shim.start(new Chaincode());

