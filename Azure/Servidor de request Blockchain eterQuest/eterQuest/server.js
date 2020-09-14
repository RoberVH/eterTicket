const port = process.env.PORT || 8080
const express = require('express');
bodyParser = require('body-parser');
jwt    = require('jsonwebtoken');

var validaUsuario=require('./utiles/validausuarios');
var config = require('./utiles/configuracion');
//var invocar=require('./query');
var invocar=require('./queryNetwork');
//var registrarAsset= require('./invoke');
var registrarAsset= require('./invokeNetwork');
var C = require('./utiles/constantes');
//var inicializar=require('./inicializaciones');
//var inicializar=require('./inicializaNetwork');

/* ********************** Bloque para definir artefactos para queries e invocaciones ********************************/
var Fabric_Client = require('fabric-client');
var channel={};

//var esperainicializa=async ()=> await inicializar.inicializa(channel,Fabric_Client);
//inicializar.inicializa(channel,Fabric_Client);
//esperainicializa();

/**************************   BLOQUE INICIALIZACION DE QUERY ************************************************************************ */
var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs');

//make sure we have the profiles we need
var networkConfig = path.join(__dirname, './config/network-profile.json');
var clientConfig = path.join(__dirname, './config/client-profile.json');
//checkProfilesExist(networkConfig, clientConfig); //terminates early if they are not found

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
// load the base network profile
var fabric_client = Fabric_Client.loadFromConfig(networkConfig);

// overlay the client profile over the network profile
fabric_client.loadFromConfig(clientConfig);

// setup the fabric network - get the peers and channel that were loaded from the network profile
var channel = fabric_client.getChannel('defaultchannel');

//load the user who is going to interact with the network
fabric_client.initCredentialStores().then(() =>  {
  // get the enrolled user from persistence, this user will sign all requests
  return fabric_client.getUserContext('user1', true);

}).then((user_from_store) => {
  if (user_from_store && user_from_store.isEnrolled()) {
    console.log('Successfully loaded user1 from persistence');

  } else {
    throw new Error('Failed to get user1.... run registerUserNetwork.js');
  }});

/****************************  FIN BLOQUE   INICIALIZACION   ************************************************************************* */


// para queries no se require el txI
var request = {
  chaincodeId: 'eticket',
  txId: null,
  fcn: '',
  args: [''],
};  

/*******************************************************************************************************/
// cors 
//cors = require('cors'),
//app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
// use morgan to log requests to the console
//app.use(morgan('dev'));

app = express(); 

//set secret
app.set('Secret', config.secret);
//app.set('usuarios',config.usuarios);
//const usuarios=app.get('usuarios');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

const  ProtectedRoutes = express.Router(); 
app.use('/eterquest', ProtectedRoutes);
ProtectedRoutes.use((req, res, next) =>{
    // checar el token en params del header, url o post  
    var token = req.headers['access-token'];
      // decodifica el token
    if (token) {
        // verificar secret y expiracion
      jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
        if (err) {
          return res.json({ success: false, mensaje: 'Fallo autenticación del token.' });    
        } else {
          // Todo Ok, salvar el usuario en objeto req para proceso 
          req.decoded = decoded;    
          next();
        }
      });
     } else {
       // Si no hay token regresa  error
      return res.status(403).send({mensaje: 'No se incluyó token de seguridad.'});
    }
  });

//Todo listo, empieza a recibir requests Rest
app.listen(port,()=>{ console.log('Servicio eterQuest BlockChain de Retailers está escuchando')});


// Webservices  ************************************************************************
// Ruta no protegia para checar salud del server
app.get('/acerca', function(req, res) {
    res.send('¡Hola! Servicio eterQuest de consultas BlockChain para Retailers está escuchando');
});
// Ruta no protegia para login de usuario
app.post('/login',(req,res)=>{
    let resp=(validaUsuario(req.body));
    //console.log('respuesta: ',resp)
    if (resp.status) { 
        const payload = {
            check:  true,
            username:req.body.username,
            nivel_seguridad:resp.nivel,
            nocliente: resp.nocte.toString(),
          };
          var token = jwt.sign(payload, app.get('Secret'), {
            expiresIn: '1d' // 1440 // expira en 24 horas
          });
          //console.log('Login:',payload.username,' nivel: ',payload.nivel_seguridad,' nocLiente: ', payload.nocliente);
          // devuelve informacion al cliente
          res.json({
            message: 'Ok',
            token: token
          });
    }else {
        res.json({message:"credenciales no son válidas"})
    }

})

// Rutas que requieren que usuario este registrado
ProtectedRoutes.get('/listaUsuarios',(req,res)=>{
  //console.log('Solicitante de Usuarios y nivel: ',req.decoded.username,', ',req.decoded.nivel_seguridad);
 //console.log('decoded: ',decoded );
 // 
 res.json(config.usuarios)
}) 

// Obtener las lineas de un ticket, por su ID
ProtectedRoutes.get('/leeticket',(req,res)=>{
    //console.log('Solicitante de Usuarios y nivel: ',req.decoded.username,', ',req.decoded.nivel_seguridad);
   //console.log('decoded: ',decoded );
   // 
  console.log('Usuario: ',req.decoded.username,'con nivel: ',req.decoded.nivel_seguridad,' quiere tickets');
  var nivelusuario= C.SEG.NVL_USUARIO;  //switch para que el chaincode busque lineas de ticket general o de fabricante 
  if (req.decoded.nivel_seguridad==C.SEG.NVL_FABRICANTE) {
    nivelusuario= C.SEG.NVL_FABRICANTE;
  } 
  request.fcn= 'leeLineasTicket';
  request.args= [req.headers['ticketid'], nivelusuario];
  var x=async function () { await invocar(request,channel,res)};
  x();
}) 

// leer un ticket por su ID
 ProtectedRoutes.get('/leerhdr',(req,res)=>{
  var iduser=req.decoded.nocliente;
  if (req.decoded.nivel_seguridad==C.SEG.NVL_USUARIO) {
    res.status(C.CHTTP.PROHIB).json({message:"No tiene derechos a esta consulta"}); // Status Forbidden
    return;
  }
  request.fcn= 'leeHdr';
  request.args= [req.headers['ticketid']];
  var x=async function () { await invocar(request,channel,res)};
  x();
}) 

// Obtener headers de tickets por rangos
ProtectedRoutes.get('/leetikcsxrangos',(req,res)=>{
  //Metodo para que un usuario obtenga Obtener headers de Tickets por rangos:
  // Si el nivel de seguridad es de  USUARIO, el idusuario será sobreescrito con el ID de usuario del login (nocliente)
  // si el nivel es de Retailer, administrador de eterTicket o fabricante, el ID usuario debe suministrarse en parametro
  // de header HTTP numcliente. Para tickets sin cliente, debe suministrarse 0 como num cliente
  // Si fecha exacta presente, se descartan las finicial y final y se prefiere la fecha exacta
  // tiendaId es opcional
  // num cliente es opcional solo para fabricante, supermercado y administrador eterTicket 
  // Un cliente solo sus propios tickets headers normales (no ve los headers de fabricante)
  // Parametros: tiendaid, fecini, fecfinal,fecexacta, numcliente
 // 
console.log('Usuario: ',req.decoded.username,'con nivel: ',req.decoded.nivel_seguridad,' y numcliente', req.decoded.nocliente,' quiere tickets');
var noCliente= '';
var tipoDoc=''

console.log('Antes del switch seguridad: ',req.decoded.nivel_seguridad.toString());
switch(req.decoded.nivel_seguridad.toString()) {
  case C.SEG.NVL_USUARIO:
      noCliente= req.decoded.nocliente;
      tipoDoc=C.BCTIPOS.TD_HEADERTICKET;
      break;
  case C.SEG.NVL_FABRICANTE:
      //console.log('fabricante, nocliente: ',req.headers['numcliente']);
      noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
      tipoDoc=C.BCTIPOS.TD_HDRFAB;
      
      break;
  case C.SEG.NVL_RETAILER:
      noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
      tipoDoc=C.BCTIPOS.TD_HEADERTICKET;
      break;
  case C.SEG.NVL_ADMIN:
      //console.log('Admin nocliente: ',req.headers['numcliente']);
      noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
      tipoDoc="";
      break;
}
//console.log('sali del switch nocte: ',noCliente);

// contruye cadena de busqueda como objeto

let queryObj={};
queryObj.selector={};
var seleccion=queryObj.selector;
//console.log('fecha exacta ', req.headers['fecexacta']);

if (req.headers['fecexacta']!=null) {
    //console.log('Fecha exacta no es null');
    seleccion[C.BCHAIN.fechaVta]={};
    seleccion[C.BCHAIN.fechaVta]['$eq']=req.headers['fecexacta'];
  } else {
  //  console.log('Fecha exacta es null');
    if (req.headers['fecini']!=null || req.headers['fecfinal']!=null) {
        seleccion[C.BCHAIN.fechaVta]={};
        if (req.headers['fecini']!=null) seleccion[C.BCHAIN.fechaVta]['$gte']=req.headers['fecini'];
        if (req.headers['fecfinal']!=null) seleccion[C.BCHAIN.fechaVta]['$lte']=req.headers['fecfinal'];
  }
}
if (req.headers['tiendaid']!=null) {
    seleccion[C.BCHAIN.tiendaId]={};
    seleccion[C.BCHAIN.tiendaId]['$eq']=req.headers['tiendaid'];
}

if (noCliente!="") {
  seleccion[C.BCHAIN.noCte]={};
  seleccion[C.BCHAIN.noCte]['$eq']=noCliente.toString();
}
//console.log("tipodoc: ",tipoDoc);
if (tipoDoc!="") {
  seleccion[C.BCTIPOS.TD_DOCTYPE]={};
  seleccion[C.BCTIPOS.TD_DOCTYPE]['$eq']=tipoDoc;
}
request.fcn= 'queryAbierta';
request.args= [JSON.stringify(queryObj)];
console.log('String query: ', JSON.stringify(queryObj));
var x=async function () { await invocar(request,channel,res)};
x();
}) 

//ObtenSaldos - Usuarios obtienen sus saldos de puntos retailer y fabricante
ProtectedRoutes.get('/obtenSaldos',(req,res)=> {
 // Metodo para que un usuario obtenga su saldo de puntos de retailer y fabricante
 // Un usuario solo puede obtener su propio saldo
 // Administrador de eterTicker puede obtener saldo de cualquier usuario
 // Fabricante solo puede obtener saldo de puntos de fabricante que ha otorgado a cualquier usuario
 // Retailer solo puede obtener puntos de retailer que ha otorgado a cualquier usuario
 // numcliente es opcional solo para fabricante, supermercado y administrador eterTicket
 
 console.log('Usuario: ',req.decoded.username,'con nivel: ',req.decoded.nivel_seguridad,' y numcliente', req.decoded.nocliente,' quiere tickets');
 var noCliente= '';
 var queryObj= {};
 queryObj.selector={};
 var seleccion=queryObj.selector; 
 var Fields=[];

 
  switch(req.decoded.nivel_seguridad.toString()) {
   case C.SEG.NVL_USUARIO:
       noCliente= req.decoded.nocliente;
       break;
   case C.SEG.NVL_FABRICANTE:
       //console.log('fabricante, nocliente: ',req.headers['numcliente']);
       noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
       tipoDoc=C.BCTIPOS.TD_HDRFAB;
       Fields.push('tpf');
       break;
   case C.SEG.NVL_RETAILER:
       noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
       Fields.push('tp');
       break;
   case C.SEG.NVL_ADMIN:
       //console.log('Admin nocliente: ',req.headers['numcliente']);
       noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
       break;
 }
if (Fields.length>0) {
  queryObj["fields"]=Fields;
}
seleccion["docType"]= C.BCTIPOS.TD_CTE;
seleccion["_id"]=noCliente;

request.fcn= 'queryAbierta';
request.args= [JSON.stringify(queryObj)];

console.log('String query: ', JSON.stringify(queryObj));
var x=async function () { await invocar(request,channel,res)};
x();
})



// histSaldosRetailr -
 //Obener el historico de movimiento de puntos de retailer
ProtectedRoutes.get('/histRedencionPtos',(req,res)=>{
  // Metodo para que un cliente obtenga el historico de movimientos de redencio de  puntos de retailer
  // Solo puede ser solicitada por  propio cliente y administrador de eterTicket
  // numcliente-  es la cuenta de la que se obtienen mvtos  si solicitado por admin
  // fecini fecha inicial de los movimientos  
  // fecfinal fecha final de los movimientos 
 //  No se provee opcion para Retailer ya que todos los tickets son de Retailer colibri en esta demo, pero 
 // cuando se incorpore un campo de Retailer, esta consulta debera retornar los puntos ganados en el Retailer especifico
 // tanto para el usuario, como para el Retailer, que solo podra ver los puntos que otorgo al usuario

console.log('Usuario: ',req.decoded.username,'con nivel: ',req.decoded.nivel_seguridad,' y numcliente', req.decoded.nocliente,' quiere tickets');
var noCliente= '';
var queryObj= {};
queryObj.selector={};
var seleccion=queryObj.selector;

console.log('Antes del switch seguridad: ',req.decoded.nivel_seguridad.toString());
  switch(req.decoded.nivel_seguridad.toString()) {
    case C.SEG.NVL_USUARIO:
        noCliente= req.decoded.nocliente;
        break;
    case C.SEG.NVL_ADMIN:
        noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
        break;
    default:
       res.status(C.CHTTP.PROHIB).json('Operación no permitida para este tipo de usuario');
       return;
}      

  if (req.headers['fecini']!=null || req.headers['fecfinal']!=null) {
      seleccion[C.BCHAIN.fechaMvto]={};
      if (req.headers['fecini']!=null) seleccion[C.BCHAIN.fechaMvto]['$gte']=req.headers['fecini'];
      if (req.headers['fecfinal']!=null) seleccion[C.BCHAIN.fechaMvto]['$lte']=req.headers['fecfinal'];
}

seleccion["docType"]= C.BCTIPOS.TD_REDEN_PTOS;
seleccion["ct"]=noCliente;

request.fcn= 'queryAbierta';
request.args= [JSON.stringify(queryObj)];
console.log('String query: ', JSON.stringify(queryObj));
var x=async function () { await invocar(request,channel,res)};
x();
})


// Obtener saldos 
ProtectedRoutes.get('/obtenSaldos',(req,res)=> {
  // Metodo para que un usuario obtenga su saldo de puntos de retailer y fabricante
  // Un usuario solo puede obtener su propio saldo
  // Administrador de eterTicker puede obtener saldo de cualquier usuario
  // Fabricante solo puede obtener saldo de puntos de fabricante que ha otorgado a cualquier usuario
  // Retailer solo puede obtener puntos de retailer que ha otorgado a cualquier usuario
  // numcliente es opcional solo para fabricante, supermercado y administrador eterTicket
  
  console.log('Usuario: ',req.decoded.username,'con nivel: ',req.decoded.nivel_seguridad,' y numcliente', req.decoded.nocliente,' quiere tickets');
  var noCliente= '';
  var queryObj= {};
  queryObj.selector={};
  var seleccion=queryObj.selector; 
  var Fields=[];
 
  
   switch(req.decoded.nivel_seguridad.toString()) {
    case C.SEG.NVL_USUARIO:
        noCliente= req.decoded.nocliente;
        break;
    case C.SEG.NVL_FABRICANTE:
        //console.log('fabricante, nocliente: ',req.headers['numcliente']);
        noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
        tipoDoc=C.BCTIPOS.TD_HDRFAB;
        Fields.push('tpf');
        break;
    case C.SEG.NVL_RETAILER:
        noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
        Fields.push('tp');
        break;
    case C.SEG.NVL_ADMIN:
        //console.log('Admin nocliente: ',req.headers['numcliente']);
        noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
        break;
  }
 if (Fields.length>0) {
   queryObj["fields"]=Fields;
 }
 seleccion["docType"]= C.BCTIPOS.TD_CTE;
 seleccion["_id"]=noCliente;
 
 request.fcn= 'queryAbierta';
 request.args= [JSON.stringify(queryObj)];
 
 console.log('String query: ', JSON.stringify(queryObj));
 var x=async function () { await invocar(request,channel,res)};
 x();
 })


 // histPtosGanados -
 //Obener el historico de puntos de retailer  otorgados al cliente
ProtectedRoutes.get('/histPtosGanados',(req,res)=>{
  // Metodo para que un cliente obtenga el historico de  puntos de retailer ganados
  // Solo puede ser solicitada por  propio cliente y administrador de eterTicket
  // numcliente-  es la cuenta de la que se obtienen mvtos  si solicitado por admin
  // fecini fecha inicial de los movimientos  
  // fecfinal fecha final de los movimientos 
 //  
console.log('Usuario: ',req.decoded.username,'con nivel: ',req.decoded.nivel_seguridad,' y numcliente', req.decoded.nocliente,' quiere tickets');
var noCliente= '';
var queryObj= {};
queryObj.selector={};
var seleccion=queryObj.selector;

console.log('Antes del switch seguridad: ',req.decoded.nivel_seguridad.toString());
  switch(req.decoded.nivel_seguridad.toString()) {
    case C.SEG.NVL_USUARIO:
        noCliente= req.decoded.nocliente;
        break;
    case C.SEG.NVL_ADMIN:
        noCliente= req.headers['numcliente']!= null ? req.headers['numcliente'] : "";
        break;
    default:
       res.status(C.CHTTP.PROHIB).json('Operación no permitida para este tipo de usuario');
       return;
}      

  if (req.headers['fecini']!=null || req.headers['fecfinal']!=null) {
      seleccion[C.BCHAIN.fechaVta]={};
      if (req.headers['fecini']!=null) seleccion[C.BCHAIN.fechaVta]['$gte']=req.headers['fecini'];
      if (req.headers['fecfinal']!=null) seleccion[C.BCHAIN.fechaVta]['$lte']=req.headers['fecfinal'];
}

seleccion["docType"]= C.BCTIPOS.TD_HEADERTICKET;
seleccion[C.BCHAIN.noCte]=noCliente;
seleccion[C.BCHAIN.ptosVta]={};
seleccion[C.BCHAIN.ptosVta]['$gt']='0';

request.fcn= 'queryAbierta';
request.args= [JSON.stringify(queryObj)];
console.log('String query: ', JSON.stringify(queryObj));
var x=async function () { await invocar(request,channel,res)};
x();
})


 // Pdctos de Fabricante Adquiridos -
 //Obener el historico de headers/lineas tickets de un producto de fabricante adquiridos
 ProtectedRoutes.get('/pdtosFab',(req,res)=>{
  // Metodo para que un fabricante obtenga el historico de un producto especifico adquridos
  // Solo puede ser solicitada por  el fabricante
  // cbprodcto: Obligatorio. Codigo de barras del producto que el fabricante desea consultar.
    // fecini fecha inicial de los movimientos  PENDIENTE VERSION FUTURA 
  // fecfinal fecha final de los movimientos   PENDIENTE VERSION FUTURA
 //  
console.log('Usuario: ',req.decoded.username,'con nivel: ',req.decoded.nivel_seguridad,' y numcliente', req.decoded.nocliente,' quiere tickets');
var prodcto= '';
var queryObj= {};
queryObj.selector={};
var seleccion=queryObj.selector;

console.log('Antes del switch seguridad: ',req.decoded.nivel_seguridad.toString());
  switch(req.decoded.nivel_seguridad.toString()) {
    case C.SEG.NVL_FABRICANTE:
        if (req.headers['cbprodcto']=== null ) {
          res.status(C.CHTTP.BADREQUEST).json('Codigo de barras del prodcuto no recibido y es obligatorio');
          return
        }
        break;
    default:
       res.status(C.CHTTP.PROHIB).json('Operación no permitida para este tipo de usuario');
       return;
}      
/*
  if (req.headers['fecini']!=null || req.headers['fecfinal']!=null) {
      seleccion[C.BCHAIN.fechaVta]={};
      if (req.headers['fecini']!=null) seleccion[C.BCHAIN.fechaVta]['$gte']=req.headers['fecini'];
      if (req.headers['fecfinal']!=null) seleccion[C.BCHAIN.fechaVta]['$lte']=req.headers['fecfinal'];
}
*/
console.log('req.headers[cbprodcto] ',req.headers['cbprodcto']);
console.log('C.BCTIPOS.TD_CODBAR ',C.BCTIPOS.TD_CODBAR);

seleccion[C.BCTIPOS.TD_CODBAR]= req.headers['cbprodcto'];
seleccion[C.BCTIPOS.TD_DOCTYPE]= C.BCTIPOS.TD_LNFAB;
seleccion[C.BCHAIN.indice]={};
seleccion[C.BCHAIN.indice][C.BCHAIN.operexpreg]=".F";

//request.args=[];  // resetea arreglo args de previas ejecuciones porque es Global a este modulo y conserva valores
request.fcn= 'obtenpdtosFab';
request.args=[JSON.stringify(queryObj)];
console.log('String query: ', JSON.stringify(queryObj));
console.log('Request: ', JSON.stringify(request));
var x=async function () { await invocar(request,channel,res)};
x();
})

// todos los Pdctos del Fabricante Adquiridos -
 //Obener el historico de headers/lineas tickets de productos de fabricante adquiridos
 ProtectedRoutes.get('/todospdtosFab',(req,res)=>{
  // Metodo para que un fabricante obtenga el historico de  prodcutos especificos adquridos
  // Solo puede ser solicitada por  el fabricante
  // cbprefijo: Prefijo de codigo de barras de productos del fabricante que se desea consultar.
    // fecini fecha inicial de los movimientos  PENDIENTE VERSION FUTURA 
  // fecfinal fecha final de los movimientos   PENDIENTE VERSION FUTURA
 //  
console.log('Usuario: ',req.decoded.username,'con nivel: ',req.decoded.nivel_seguridad,' y numcliente', req.decoded.nocliente,' quiere tickets');
var prodcto= '';
var queryObj= {};
queryObj.selector={};
var seleccion=queryObj.selector;

console.log('Antes del switch seguridad: ',req.decoded.nivel_seguridad.toString());
  switch(req.decoded.nivel_seguridad.toString()) {
    case C.SEG.NVL_FABRICANTE:
        if (req.headers['cbprefijo']=== null ) {
          res.status(C.CHTTP.BADREQUEST).json('Codigo de barras del prodcuto no recibido y es obligatorio');
          return
        }
        break;
    default:
       res.status(C.CHTTP.PROHIB).json('Operación no permitida para este tipo de usuario');
       return;
}      
/*
  if (req.headers['fecini']!=null || req.headers['fecfinal']!=null) {
      seleccion[C.BCHAIN.fechaVta]={};
      if (req.headers['fecini']!=null) seleccion[C.BCHAIN.fechaVta]['$gte']=req.headers['fecini'];
      if (req.headers['fecfinal']!=null) seleccion[C.BCHAIN.fechaVta]['$lte']=req.headers['fecfinal'];
}
*/
console.log('req.headers[cbprefijo] ',req.headers['cbprefijo']);
console.log('C.BCTIPOS.TD_CODBAR ',C.BCTIPOS.TD_CODBAR);

seleccion[C.BCTIPOS.TD_CODBAR]={};
seleccion[C.BCTIPOS.TD_CODBAR][C.BCHAIN.operexpreg]=req.headers['cbprefijo'];
seleccion[C.BCTIPOS.TD_DOCTYPE]= C.BCTIPOS.TD_LNFAB;
seleccion[C.BCHAIN.indice]={};
seleccion[C.BCHAIN.indice][C.BCHAIN.operexpreg]=".F";

//request.args=[];  // resetea arreglo args de previas ejecuciones porque es Global a este modulo y conserva valores
request.fcn= 'obtenpdtosFab';
request.args=[JSON.stringify(queryObj)];
console.log('String query: ', JSON.stringify(queryObj));
console.log('Request: ', JSON.stringify(request));
var x=async function () { await invocar(request,channel,res)};
x();
})


