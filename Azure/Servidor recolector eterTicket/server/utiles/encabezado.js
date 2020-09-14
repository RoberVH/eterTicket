var L = require('./constantes');

module.exports = function adaptaEnc(encabezado,tckt) {

  var cabeza={};
  let mvto=encabezado[L.EM.MVTO].toString();
  if (mvto != "1") {
      return ( {"estado":false,"cabeza":cabeza.mvto=mvto});
  }
  cabeza[L.BCHAIN.fechaVta]=encabezado[L.EM.FECVTA].toString();
  tckt.fecvta=cabeza[L.BCHAIN.fechaVta];
  cabeza[L.BCHAIN.horaIVta]=encabezado[L.EM.HORAINI].toString();
  cabeza[L.BCHAIN.horaFVta]=encabezado[L.EM.HORAREG].toString();
  cabeza[L.BCHAIN.tiendaId]=encabezado[L.EM.NOTIENDA].toString();
  tckt.idTienda=cabeza[L.BCHAIN.tiendaId];
  cabeza[L.BCHAIN.folio]=parseInt(encabezado[L.EM.FOLVTA]).toString();
  tckt.folVta=cabeza[L.BCHAIN.folio];
  cabeza[L.BCHAIN.ptosVta]=parseInt(encabezado[L.EM.PUNTOS]).toString();
  cabeza[L.BCHAIN.vedor]=encabezado[L.EM.IDVDOR].toString();
  cabeza[L.BCHAIN.noCaja]=parseInt(encabezado[L.EM.NUMCAJA]).toString();
  tckt.noCaja=cabeza[L.BCHAIN.noCaja];
  cabeza[L.BCHAIN.impteTot]=encabezado[L.EM.IMPTOT].toString();
  cabeza[L.BCHAIN.noCte]=encabezado[L.EM.NUMCLI].toString();
  tckt.idCte=cabeza[L.BCHAIN.noCte];
  // EL encabezado no trae el numero de items, pero no creo que se necesite registrar,  pendiente: cabeza[L.BCHAIN.totItems]=

 return ( {"estado":true,"cabeza":cabeza} );
}
