const port = process.env.PORT || 8080;
var adaptarItems = require('./utiles/items.js');
var adaptarCabeza = require('./utiles/encabezado.js');
var adaptaFrmPago = require('./utiles/formaspago.js');
var escTicket = require('./escribeArcJson.js');
let  eticket={
    valordeID:'',
    idTienda:'',
    noCaja:'',
    idCte:'',
    folVta:'',
    fecvta:'',
    haypdctosFab:false,
    noPtosFab:0
  };

//

var express = require('express'),
    app = express(),
    http = require('http'),
    xmlparser = require('express-xml-bodyparser');

app.use(express.json());

app.get('/eterTicket/acerca', function (req, res, next) {
  res.send('eterTicket está escuchando');
});

app.post('/eterTicket/eticket',  xmlparser({ignoreAttrs : true, trim:true,normalizeTags: false,explicitArray: true,emptyTag:' ' }), function(req, res, next) {
    //var json=req.body["xmlversion1.0"];
    var json=req.body["XMLversion1.0"];

    // Crear nuevo objeto con tags selectos del encabezado del XML (no todo se va al Blockchain)  del ticket

    const cabeza=json.TRANSACCION[0]["EM"][0]; //[0]["dm"][0]["MOVTO_R"].toString();
   // console.log("header: ",cabeza )
    var resp_cabeza= adaptarCabeza(cabeza,eticket);

    if (!resp_cabeza.estado)  {
      // fallo, mvoto no es Venta
      res.status(500).send('Movimiento no es Venta');
    }
    else {
      // exito
      crearCveUnicTicket(eticket);
      var respuesta='Recibido. Se genero ticket: ' + eticket.valordeID.toString();
      // items comprados
      // Crear nuevo objeto con tags selectos de los items del  XML (no todo se va al Blockchain)  del ticket
      var lineas=json.TRANSACCION[0]["DDM"][0]["DM"];
      let noArt=lineas.length
      var itemsTicket= adaptarItems(lineas,noArt,eticket);


      // Formas de Pago
      // Crear nuevo objeto con tags selectos de las formas de pago del  XML (no todo se va al Blockchain)  del ticket
      var frmasPago=json.TRANSACCION[0]["DDF"][0]["DF"];
      let nofmas=frmasPago.length
      var pagosTicket=adaptaFrmPago(frmasPago,nofmas);
      escTicket(resp_cabeza.cabeza,itemsTicket,pagosTicket,eticket);
      res.status(200).end(respuesta);
    }
});

app.post('/eterTicket/redimePnts',  xmlparser({ignoreAttrs : true, trim:true,normalizeTags: false,explicitArray: true,emptyTag:' ' }), function(req, res, next) {
  //var json=req.body["xmlversion1.0"];
  var json=req.body["XMLversion1.0"];

  // Crear nuevo objeto con tags selectos del encabezado del XML (no todo se va al Blockchain)  del ticket
  console.log('En redimePntos');
  const dtosPago=json.PAGOPTOS[0];
  console.log("Recibido PagoPtos: ",dtosPago);
  var claveReg=[];
  console.log('por asignar: ',dtosPago.NUMCLI_E[0],dtosPago.NUUNIOPE_E[0],dtosPago.TOTPAGO_T[0]);
  claveReg.push(dtosPago.NUMCLI_E[0]);
  claveReg.push(dtosPago.TOTPAGO_T[0]);
  claveReg.push(dtosPago.NUUNIOPE_E[0]);
  console.log('Asignado: ',claveReg);
  var invocacion= require('./invokeNetwork');
  invocacion(claveReg,'redimePtos','',false,false,res);
  
  /*  var lineas=json.TRANSACCION[0]["DDM"][0]["DM"];
    let noArt=lineas.length
    var itemsTicket= adaptarItems(lineas,noArt,eticket);


    // Formas de Pago
    // Crear nuevo objeto con tags selectos de las formas de pago del  XML (no todo se va al Blockchain)  del ticket
    var frmasPago=json.TRANSACCION[0]["DDF"][0]["DF"];
    let nofmas=frmasPago.length
    var pagosTicket=adaptaFrmPago(frmasPago,nofmas);
    escTicket(resp_cabeza.cabeza,itemsTicket,pagosTicket,eticket);
    res.status(200).end(respuesta);*/
});

app.listen(port,()=>console.log("Recolector de etickets esta escuchando\n"));

function crearCveUnicTicket(etck){
  let ahora=  new Date();
  etck.valordeID=etck.idTienda + "-" + etck.noCaja + '-' + etck.folVta + "-" + etck.idCte + "-" + etck.fecvta;
}

