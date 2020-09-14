//var escBC=require('./invokeNetwork');
// encabezado: string con tags del header de ticket
// lineas: array de strings con tags de los items del ticket
// formaspago: array de strings con tags de formas de pago del ticket
// ticket: objeto con atributos del ticket, como clave creada para Blockchain del ticket, bandera de existencia de pdctos
//        del fabricante en el ticket
module.exports = function escJsontickets(encabezado,lineas,formaspago,ticket) {
    const fs1 = require('fs');


    var headerJ= JSON.stringify(encabezado);
    var lineasJ= JSON.stringify(lineas);
    var frmaPgoJ=JSON.stringify(formaspago);

    var d = new Date();

    var nombArc='eTicket'+ d.getMonth().toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString() + '.json'
    fs1.writeFile("./Jsons/" + nombArc, ticket.valordeID + "\n"+  headerJ + "\n" + lineasJ + "\n" + frmaPgoJ, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Se escribio archivo ",nombArc);

    });

   //rv console.log('llamando a invoke local');
   // var invocacion= require('./invoke');
    //rv console.log('llamando a invoke IBM Cloud Chaincode');
   var invocacion= require('./invokeNetwork');

     var cab_pagos=integraCabPag(encabezado,formaspago);
    //console.log('cab_pagos ', cab_pagos);
    //console.log('cab_pagos ', JSON.stringify(cab_pagos));
    //console.log('Enviar header. ticket vale: ',ticket);
    invocacion(ticket.valordeID,'regLinea',lineasJ,ticket.haypdctosFab,ticket.noPtosFab);

    invocacion(ticket.valordeID,'regHeader',JSON.stringify(cab_pagos),ticket.haypdctosFab,ticket.noPtosFab);
    //for (let i=0; i< lineas.length;i++) {
    //  console.log('escribiendo linea: ',i);
    //rv console.log('Enviar Lineas');
  /*  invocacion(ticket.valordeID,'regLinea',lineasJ,ticket.haypdctosFab);
    //}
     return;
     console.log('Esto no debe imprimirse'); */

 /****************************************************************************************************** */

 return;
 /****************************************************************************************************** */

 function integraCabPag(header,frmaPgo) {
  var tckAsset=header;
  tckAsset.Pgos=[];
  for (let i=0; i<frmaPgo.length;i++){
    tckAsset.Pgos[i]=frmaPgo[i];
  }
  return tckAsset;

 }

}


