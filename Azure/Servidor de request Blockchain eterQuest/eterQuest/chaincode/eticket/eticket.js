/* =======================================================================================================================    
# Chaincode ticket electronico: eterTicket
#  Roberto Vicuna. Version 1.0 Octubre 2018
# BlockChain HyperLedger Fabric 1.3
# 
#  =======================================================================================================================    
 */

'use strict';
const shim = require('fabric-shim');


const TD_LINEATICKET = "lin-tk"; // linea del ticket
const TD_HEADERTICKET = "hdr-tk";  // header del ticket (incluye formas de pago)
const TD_CTE="cte-ct";  // cuenta de puntos del cliente
const TD_HDRFAB='hrd-fab';  //header de ticket del fabricante
const TD_LNFAB='lin-fab';  //linea de ticket del fabricante
const TD_REDEN_PTOS ='rd-ptos'  // movimiento de redencion de puntos de retailer
const TC_USUARIO='1';  // tipo de cliente es usuario
const TC_FABRICANTE='2';  // tipo de cliente es fabricante
const TC_RETAILER='3';  // tipo de cliente es adminstrador de Retailer
const TC_ADMIN='4';  // tipo de cliente es adminstrador de eterTicket
const ERR_MONTO_INSUFICIENTE = 50;  // no hay saldo suficiente para pago con puntos
const ERR_CTA_INEXISTENTE = 60; // No existe la clienta de cliente referida en la solicitud

let Chaincode = class {
    async Init(stub) {
      let ret = stub.getFunctionAndParameters();
    //  console.info(ret);
     // console.info('=========== Chaincode eticket instanciado ===========');
      return shim.success();
    }

    async Invoke(stub) {
        //console.info('ID de la Transaccion: ' + stub.getTxID());
    
        let ret = stub.getFunctionAndParameters();
        //console.info(ret);
    
        let method = this[ret.fcn];
        if (!method) {
          //console.log('No se ha provisto una funcion para ejecutar, solo se hallo: ' + ret.fcn );
          throw new Error('Funcion desconocida recibida: ' + ret.fcn);
        }
        try {
          let payload = await method(stub, ret.params, this);
          return shim.success(payload);
        } catch (err) {
          console.log(err);
          return shim.error(err);
        }
      }

  /* =======================================================================================================================    
  #     **********************  Lineas de Ticket    *****************************************************************
  #     **********************   Funciones          *****************************************************************
  ==========================================================================================================================
  */   

 
      // =======================================================================================================================      
      // regHeadTicket
      // Registra header del ticket en el estado del Ledger  
      // {'regHeadTicket',cveHdr, headerStrObj, banderaFab} 
      // headerStrObj - objeto representado como string del header
      // cveHdr - clave del Header, se construye con combinaciones de valores del header, se recibe
      // ya construido para no perder tiempo construyendolo
      // La clave del registro es: Retailer + cveSuc + numcaja + folio + fecha 
      // Registra tambien una llave compuesta para busquedas multiples veloces
      // Llave compuesta: retcteIdxKey que se  forma con valores:
      //     Retailer Suc Fecha Reg Unico Cte (Ruc)
      // =======================================================================================================================      

     async regHeader(stub, args, thisClass) {
      if (args.length != 4) {
        throw new Error('Numero incorrecto de parametros, deben ser 4 y recibi: ',args.length);
      }
      let cveHdrstr=args[0];
      let hdrObjstr= args[1];
      let bFab=(args[2]=='true');
      let ptosFab=Number(args[3].toString());
      //console.log('No de pdctos Fab:', ptosFab.toString())
      if (!cveHdrstr) {
        throw new Error(' Clave de Header no hallada');
      }
      //console.log('Clave: ' + cveHdrstr);
      //console.log('Header: ' + hdrObjstr);
      let hdrObj=JSON.parse(hdrObjstr);
      // Agrega al doctype al header para las consultas posteriores
      hdrObj["docType"]=TD_HEADERTICKET;
      //console.info('Objeto JS Header object: ' + hdrObj);
      //console.info('Objeto JS Header: en bytes ' + Buffer.from(JSON.stringify(hdrObj)));
      // salva ptos obtenidos en venta y num de cliente antes de escribir al ledger
      let noCte= hdrObj['ncj'];
      let ptosVta=Number(hdrObj['pv']);
      await stub.putState(cveHdrstr, Buffer.from(JSON.stringify(hdrObj)));
      if (bFab) {
        // agregar header  al ledger de fabricante porque el ticket trae algun(os) de sus productos
        hdrObj["docType"]=TD_HDRFAB;
        await stub.putState(cveHdrstr+'F', Buffer.from(JSON.stringify(hdrObj)));
      }
      
      // Agrega Saldo en puntos a ete cliente. El 1% del total del ticket redondeado hacia arriba para que sea entero
      //console.log('@@@@ en regHEader @@@@@@ LEI ptosVta, ptosFab y noCte: ', ptosVta, ' . ', ptosFab,' , ', noCte);
      //console.log('Sus tipos son: LEI ptosVta y noCte: ', typeof(ptosVta), ', ',typeof(noCte));
      if ((ptosVta>0 || ptosFab>0) && noCte>0) {
        // En la transaccion hay puntos del Retailer y/o del fabricante y existe numero cliente: salvar al ledger de ctas de cliente
        let cta = await stub.getState(noCte);
        //console.log('lei cte, cta ' + noCte + ', ' + cta);
        //console.log('type de cta ', typeof(cta));
        var saldoanteriorPtos=0;
        var saldoanteriorFab=0;
        if ( !cta.toString()) {
            // no hay datos, cliente no existe en el ledger, sera dado de alta con los datos que hay
            //console.log('Cliente nuevo en el ledger');
          }
          else {
            // Cliente existe, acumular puntos a su cuenta

            let ctaobj=JSON.parse(cta);
            if (ctaobj.hasOwnProperty('tp')) {
              saldoanteriorPtos += Number(ctaobj["tp"].toString());
            }
            if (ctaobj.hasOwnProperty('tpf')) {
              saldoanteriorFab += Number(ctaobj["tpf"].toString());
            }   
          }
        
        //msj='total 1 ptos:' + totalsaldo;
        //console.info(msj);
        //console.log('Tenia saldos (ptos) (fab):', saldoanteriorPtos,saldoanteriorFab);
        
        var totalsaldoPtos=saldoanteriorPtos + ptosVta;
        var totalsaldoFab=saldoanteriorFab + ptosFab;

        let registroPtos={
          "docType":TD_CTE,
          "tp":totalsaldoPtos.toString(),
          "tpf":totalsaldoFab.toString(),
        }
        
        //console.log('Cta cte actualizada: ', registroPtos);
        //console.log('por escribir el total puntos');
        await stub.putState(noCte, Buffer.from(JSON.stringify(registroPtos)));
      }



      //let method = thisClass['regPtsCte'];
      //let saldototal= await method(stub,nocte,saldo);      
      
      // crear indice para busqueda rapida para Retailers y Clientes
      //let idxCptoRetCte = 'hdr~rtlcte';  // Indice de header compuesto para Retailers y Clientes
      //console.info('Idx Comp: Rtl: ' + hdrObj.Rtl.toString() + ' Suc: ' + hdrObj.Suc.toString() + ' Fc: ' + hdrObj.Fc + ' Ruc: ' + hdrObj.Ruc.toString());
      //let retcteIdxKey = await stub.createCompositeKey(idxCptoRetCte, [hdrObj.Rtl.toString(), hdrObj.Suc.toString(),hdrObj.Fc,hdrObj.Ruc.toString()]);
      //console.info('Llave compuesta: ' + retcteIdxKey);
      //  Registrar indice en el estado. Solo el indice, no hay que duplicar el activo
      // Para no borrar la lleve del estado, pasamos un caracter  nulo y no un NIL
      //await stub.putState(retcteIdxKey, Buffer.from('\u0000'));
      return;
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
    //console.info('=======================================');
    //console.log(hdrBytes.toString());
    //console.info('=======================================');
    return hdrBytes;
  }

   // =======================================================================================================================    
   // obtMultHdrs - Recupera multiples headers
   // {"leeHdr",["attr1","attrb2",..]}
   // Buscar y recuperar headers por combinaciones de los atributos de una clave compuesta
   // 4 atributos  posibles:    Retailer y/o Suc y/o  Fecha y/o  Reg Unico Cte (Ruc) (en ese orden)
   // Los atributos no pueden ser vacios intercalados: Si {"2","103","15/02/2018"}  No {"2","","15/02/2018"}
   // =======================================================================================================================    

   async obtMultHdrs(stub, args, thisClass) {
    //******* ******* ******* ******* ******* ******* ******* ******* ******* ******* ******* ******** 
    // ******* PENDIENTE HASTA HABILITAR indice para busqueda rapida para Retailers y Clientes ******* 
    //******* ******* ******* ******* ******* ******* ******* ******* ******* ******* ******* ******** 
    if (args.length < 1) {
      throw new Error('Numero incorrecto de parametros, deben ser 1 (arreglo de atributos) y recibi: ',args.length);
    }
    let atributos=[];
    for ( let i=0;i< args.length;i++){
        atributos.push(args[i]);
    }
    let respHdr;
    let idxCptoRetCte='hdr~rtlcte';
    //console.info('En obtMultHdrs');
    let retcteIdxKeyIter = await stub.getStateByPartialCompositeKey(idxCptoRetCte, atributos);
    respHdr = await retcteIdxKeyIter.next();
    //console.log('respHdr: ', respHdr);
    let colCveHdrs=[];
    let i=0;
    while (respHdr.hasOwnProperty('value'))   {
          let llavesComp= await stub.splitCompositeKey(respHdr.value.key);
      //    console.log('llaves: ', llavesComp.attributes);
       //   console.log('respHdr: ', respHdr);
          colCveHdrs.push(llavesComp.attributes);
          respHdr = await retcteIdxKeyIter.next();
         // console.log('colCveHdrs: ',colCveHdrs)
          //console.log('Leido respHdr por la :',i,'-esima vez'); i++;
    } 
      if (!colCveHdrs.length) {
          let jsonResp = {};
          jsonResp.Error = 'No hay resultados para indices ' + atributos;
          throw new Error(JSON.stringify(jsonResp));
      }       
        //console.log('Coleccion de Keys de Headers ', colCveHdrs);
        //console.log('Coleccion de Keys de Headers (stringifagdo) ', JSON.stringify(colCveHdrs));
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
  #  {"regLinea","cveHeader","linStrObj",banderaFab}
  #  cveHeader: La clave del header al que pertenece la linea
  #  linStrObj - Colección de objetos representado como string de las lineas
  #  banderaFab - No se utiliza
  #  ptosFab - No se utiliza
  #  La clave unica de la linea. Se construye con la  combinacion de los  valores de la linea:
  #       cveHeader + Numero Secuencial de la linea el objeto
  #   La colección de objetos de lineas es de la forma:
  #   {{lin1},{lin2}, ... {linN}} 
  #   donde cada linea es de la forma:
  #   {"nl";1,"cb":7509394481202,"cd":20,"ct":2.5,"um":1,"ip1":0.16,"ip2":0.0,"pc":215.50,"pd":210.00,"pt":210.00,"pr":0;"pds":0,"pf":0}
  # ========================================================================================================================    
  */

  async regLinea(stub, args, thisClass) {
    // Recibe en el primer parametro 
    //console.log('En regLinea');
    if (args.length != 4) {
      throw new Error('Numero incorrecto de parametros, debe ser 4 y recibi: ',args.length);
    }
    // Obtener valores
    let cveHeader= args[0];
    // traslada el array de objetos
    let lineasObj=args[1];
    //console.log('lineasObj',lineasObj);
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
      // para recuperar en una sola consulta todos las lineas con la clave del header del ticket agregamos este a la linea con propiedad 'ch'
      linObjs[nLin]["ch"]=cveHeader;  
      // tambien agreguamos el campo docType Linea de Ticket "lin-t"
      linObjs[nLin]["docType"]=  TD_LINEATICKET
      //console.log('Por escribir al estado: ',cveLinea, JSON.stringify(linObjs[nLin]));      
      await stub.putState(cveLinea, Buffer.from(JSON.stringify(linObjs[nLin])));
      if (linObjs[nLin].hasOwnProperty('pf')) {
        linObjs[nLin]["docType"]=TD_LNFAB;
        await stub.putState(cveLinea+'F', Buffer.from(JSON.stringify(linObjs[nLin])));

      }
    }
    //console.log('regLinea terminado');
  }
 
  /* =======================================================================================================================    
  #  leeLineasTicket - Obten todas las lineas de un ticket
  #  {"leeLineasTicket", "cveHticket","TipoCliente"}
  #  cveHTicket - La clave del header del ticker
  /* =======================================================================================================================    
  */
 async leeLineasTicket(stub, args, thisClass) {
  // Recibice en el primer parametro 
  //console.log('En leeLineasTicket');
  if (args.length != 2) {
    throw new Error('Numero incorrecto de parametros, debe ser 2 y recibi: ',args.length);
  }
  // Obtener valores
  let cveHeader= args[0];
  let tipoCte=args[1];
  let query = {};
  query.selector = {};
  query.selector.docType= tipoCte == TC_USUARIO ? TD_LINEATICKET : TD_LNFAB;
  query.selector.ch = cveHeader;
  let method = thisClass['execQuery'];
  let queryResults = await method(stub, JSON.stringify(query), thisClass);
  return queryResults; //shim.success(queryResults);
  }
   /* =======================================================================================================================    
  #  queryAbierta - Ejecuta el string query en la BD CouchDB
  #  {"leeLineasTicket", "query_string"}
   /* =======================================================================================================================    
  */
 async queryAbierta(stub, args, thisClass) {
  // Recibe en el primer parametro 
  //console.log('En queryAbierta');
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
  #     **********************  Funciones de / para     *****************************************************************
  #     ********************** Cliente  *****************************************************************
  ==========================================================================================================================
  */   

  /* =======================================================================================================================    
  #  regPtsCte - Registra una cuenta de cliente para acumular puntos de lealtad
  #  {"regPtsCte","NoCte","puntos","puntosFab"}
  #  NoCte: Alfanumerico. Id unico del Cliente en el sistema eterTicket
  #  puntos - Numero entero que representa los puntos a asignar al cliente
  #  puntosFab - Entero con los puntos por fabricante
  #  Si el cliente no existe se crea, y se asignan los puntos, si existe, se recupera saldo actual y suman los puntos
  # ========================================================================================================================    
  */

 async regPtsCte(stub,noCte,puntos,puntosFab,) {
  // Recibe Numero de cliente en el primer parametro 
  let saldo = await stub.getState(noCte); //obtener el header como arreglo de bytes del estado
  var total = saldo.toString()="" ? 0 : Number(saldo);
  total+=Number(puntos);
  let registro={
    "docType":TD_CTE,
    "tp":total.toString(),
    "tpf": puntosFab.toString()
  }
  //console.info('por escribir el total en chaincode');
  await stub.putState(noCte, Buffer.from(JSON.stringify(registro)));
  return total;
}  



/* =======================================================================================================================    
  #  obtenSaldoPtsCte - Query para averiguar saldo de puntos del cliente
  #  {"obtenSaldoPtsCte","NoCte"}
  #  NoCte: Alfanumerico. Id unico del Cliente en el sistema eterTicket
  #  Si el cliente no existe retorna 0
  # ========================================================================================================================    
  */

 async obtenSaldoPtsCte(stub, args, thisClass) {
    //console.log('En obtenSaldoPtsCte');
    if (args.length != 1) {
      throw new Error('Numero incorrecto de parametros, debe ser 1 y recibi: ',args.length);
    }
       // Obtener valores
   let noCte= args[0];
   //console.log('Cliente: ',noCte);
   
   let ctacte = await stub.getState(noCte); //obten registro de cuenta
   if (!ctacte.toString()){
          throw new Error([ERR_CTA_INEXISTENTE,' La cuenta de cliente no existe']);
     }
   //console.log('Lei: ',ctacte.toString());
   let cta=JSON.Parse(ctacte)
   return Buffer.from(JSON.stringify(cta));

}

/* =======================================================================================================================    
  #  redimePtos - Procesa pago con puntos eterTicket
  #  {"redimePtos","NoCte","montoPagar"}
  #  
  #  NoCte: Alfanumerico. Id unico del Cliente en el sistema eterTicket
  #  montoPagar - Monto en moneda representa el monto a pagar
  #  idRetailer - el Id del retailer que aplica el monto
  #  idTicket - Id del ticket relacionado con el pago
  #  Si el monto en moneda es <= saldo en puntos /10 (puntos valen 10% de la moneda) se descuenta el monto pagado del saldo, se registra
  #  en la cuenta del cliente, se genera un hash del id de la transaccion y se usa como clave de un nuevo registro del moviento de pago
  #  en el ledger
  #  En caso cotrario devuelve status de fallo Monto insuficiente (ERR_MONTO_INSUFICIENTE o cuenta inexistente ERR_CTA_INEXISTENTE)
  # ========================================================================================================================    
  */

 async redimePtos(stub,args, thisClass) {
    //console.log('En redimePtos');
    if (args.length != 3) {
      throw new Error('Numero incorrecto de parametros, debe ser 3 y recibi: ',args.length.toString());
    }
  // Obtener valores

  // Recibe Numero de cliente en el primer parametro 
  let noCte= args[0];
  let montoPagar=args[1];
  let IdRetailer=args[2];
  
    
  let ctacte = await stub.getState(noCte); //obtener el asset cta de cliente
  //console.log('La ctacte vale: ',ctacte.toString());
  if (!ctacte.toString()) {
          throw new Error([ERR_CTA_INEXISTENTE,' La cuenta de cliente no existe']);
  }
  //console.log('No fue vacia');

  let porPagar=parseFloat(montoPagar);  
  let cta=JSON.parse(ctacte);
  let saldoMoneda=parseFloat(cta.tp)/10;

  if (saldoMoneda < porPagar) {
    throw new Error([ERR_MONTO_INSUFICIENTE,' No hay saldo suficiente para cubrir monto']);
  }
 
  let saldoNvoMnda= saldoMoneda - porPagar;
  let saldoNvoPtos = saldoNvoMnda*10; 
  let idTxRedime=stub.getTxID();
  let method = thisClass['hashear'];
  let idTxNormalzdo = await method(idTxRedime);
  //console.log('Id tx de redimePtos: ', idTxRedime,' idTxNormalzdo ',idTxNormalzdo);
  let actualizacion={
    "docType":TD_CTE,
    "tp":saldoNvoPtos,
    "tpf": cta.tpf,
  }
  //console.info('por actualizar saldo en cta cliente',actualizacion);
  await stub.putState(noCte, Buffer.from(JSON.stringify(actualizacion)));
  method= thisClass['yyyymmdd'];
  let hoy=await method(new Date());
  let registro = {
    "docType":TD_REDEN_PTOS, // tipo de documento: redencion de puntos
    "ct": noCte,	// numero de cliente
    "rt": IdRetailer,  // Id del retailer relacionado al pago
    "mt": porPagar,	// monto que se pago en moneda
    "sa": cta.tp,	// saldo en puntos antes del movimiento
    "sn": saldoNvoPtos,   // saldo en puntos ya descontado el pago (saldo actual)
    "fe": hoy,
}

  //console.info('por registrar movimiento de redencion de puntos',registro);
  await stub.putState(idTxNormalzdo, Buffer.from(JSON.stringify(registro)));

  //return(JSON.stringify({status:'OK',NumAutorizacion: idTxNormalzdo}));
  //var resp={status:'OK', numAut:idTxNormalzdo.toString()};
  var resp=idTxNormalzdo.toString();
  //console.log('Regresando el idTxNormalzdo: ', resp);
  //shim.success(Buffer.from('Initialized Successfully!'))
  //return shim.success(resp);
  //return(JSON.stringify(resp));
  return Buffer.from(resp); // Este es el que finalmente funciono. Se recibe en results[0][0].response.payload en el cliente
                    // para decodificarlo: results[0][0].response.payload.toString('utf-8')
                    //  Hubo problemas con variaciones para enviar un objecto java JSON o stringifado, en payload llegaban los 
                    //bytes, habra que revisar como decodificarlo en el cliente. Lo que llega es un string de hexas representando
                    // el numero decimal
}  



  /* =======================================================================================================================    
  #     **********************  Funciones de / para     *****************************************************************
  #     ********************** Fabricante  *****************************************************************
  ==========================================================================================================================
  */   

  /* =======================================================================================================================    
  #  obtenpdtosFab - Consulta los productos con el codigo de barras solicitado vendidos
  #  en el rango de fechas estipulado. Devuelve las lineas de venta del codigo de barras y su header
    {"obtenpdtosFab","query"}
  #  query: String con el query para recuperar el Codigo de barras del fabricante a buscar
  # ========================================================================================================================    
  */
  async obtenpdtosFab (stub, args, thisClass) {
 // console.log('En obtenpdtosFab');
  if (args.length != 1) {
    throw new Error('Numero incorrecto de parametros, debe ser 1 y recibi: ',args.length);
  }
  // Obtener valores
  let query= args[0];
   //console.log('query: ',query);
   //let query= '{"selector": {"cb": "' + codbar + '","_id": { "$regex": ".F" }}}';
     
   let method = thisClass['execQuery'];
   let queryResults = await method(stub, query, thisClass);

   //console.log('Resultados:',JSON.parse(queryResults));
   var resultados=JSON.parse(queryResults);
   var reghdr={};
   var clavehdr='';
   var clavehdr_ant='';
   for (let i=0; i<resultados.length;i++){
    /*console.log  ("Long de results: ", resultados.length);  
    console.log  ("Todo  [",i,"]['Record']['ch'] ", resultados[i]);
    console.log  ("clave en el registro [",i,"]['Record']['ch'] ", resultados[i]['Record']['ch']);*/
      clavehdr= resultados[i]['Record']['ch'];
      if (clavehdr_ant!=clavehdr) {
        clavehdr_ant=clavehdr;
        reghdr = await stub.getState(clavehdr); //obtener el header como arreglo de bytes del estado
        if (!reghdr.toString()) {
          let jsonResp = {};
          jsonResp.Error = 'Error Interno, no hay header para linea: ' + resultados[i]['Key'];
          throw new Error(JSON.stringify(jsonResp));
        }
      }
      //console.log('Agregando el header: ', JSON.parse(reghdr));
      resultados[i]['header']=JSON.parse(reghdr);
    }
   //console.log('Resultados agregados:', JSON.stringify(resultados));
   //return resultados;    // no con un array de objects 
   return (Buffer.from(JSON.stringify(resultados)));   //Forma correcta de devolver un array de objects
}

/* =======================================================================================================================    
  #     **********************  Rutinas  de     *****************************************************************
  #     **********************    Soporte       *****************************************************************
  ==========================================================================================================================
  */ 
  
 async execQuery(stub, queryString, thisClass) {

  //console.info('- execQuery:\n' + queryString)
  let resultsIterator = await stub.getQueryResult(queryString);
  let method = thisClass['obtResulCompl'];

  let results = await method(resultsIterator, false);

  return Buffer.from(JSON.stringify(results));
}

/*
#     *********************************************************************************************
#	hashear (cadena) 
#      Devuelve un hash (entero 32 is positivo (9 posiciones) convertido a string basado en la cadena
#   	suministrada. La cadena será el tx de la transaccion de Frabric para convertir a una cadena menor el tx y salvar almacenamiento
# 	las tx son 64 caracteres, y el hash queda a 9 maximo
#     *********************************************************************************************
*/
 hashear(cadena) {
 var hash = 0;
 var ln=cadena.length
  if (ln == 0) {
        return hash;
    }
  for (var i = 0; i < ln; i++) {
	var caract = cadena.charCodeAt(i);
	hash = ((hash<<5)-hash)+caract;
	hash = hash & hash; // Convert to 32bit integer
    }
  if (hash<0) {hash=hash*-1}
    return hash.toString();
}

 yyyymmdd(fecha){
    let hoy=new Date(fecha);
    let mm=Number(hoy.getMonth())+1;
    let dd=hoy.getDate();
    let mes= (mm>9 ? '' : '0') + mm;
    let dia = (dd>9 ? '' : '0') + dd;
    return hoy.getFullYear() + '/' + mes + '/'+ dia
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



  /************************************************************************************ */
};


shim.start(new Chaincode());  




