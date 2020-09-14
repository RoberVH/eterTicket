var L = require('./constantes');

module.exports = function adaptaItems(articulos,long,ticket) {
 // console.log("EN RUTINA");
  var items=[];
  let  codbarras='';
  ticket.haypdctosFab=false; // resetea la variable

  let cntPdtosFab=0;
  for (let i=0; i < long;i++) {
    var milin={}; // es necesario crear nueva instancia de objeto ya que de lo contrario todo el array contendra referencia al ultimo objeto!
    milin[L.BCHAIN.cb]=articulos[i][L.DM.CODART].toString();
    codbarras=milin[L.BCHAIN.cb]
    milin[L.BCHAIN.descpon]=articulos[i][L.DM.DESCRIPC].toString();
    milin[L.BCHAIN.cnt]=articulos[i][L.DM.CANT].toString();
    milin[L.BCHAIN.ctxn]=articulos[i][L.DM.CANTXN].toString();
    milin[L.BCHAIN.pciva]=articulos[i][L.DM.PCOIVA].toString();
    milin[L.BCHAIN.pcsiva]=articulos[i][L.DM.PCOSIVA].toString();
    milin[L.BCHAIN.pcsto]=articulos[i][L.DM.PCCST].toString();
    milin[L.BCHAIN.pciodscto]=articulos[i][L.DM.PCDSCTO].toString();
    milin[L.BCHAIN.pcobrto]=articulos[i][L.DM.PCOBRTO].toString();
    milin[L.BCHAIN.tasaiva]=articulos[i][L.DM.TSAIVA].toString();
    milin[L.BCHAIN.impttot]=articulos[i][L.DM.IMPTOT].toString();
    items.push(milin);
    // cambiar logica, la bandera debe agregarse a linea y ademas otra bandera debe existeir que una vez true, ya no cambie
    if (codbarras.substring(0, 8)==L.FABRICANTE.prefCBFab) {
      ticket.haypdctosFab=true;
      milin[L.BCHAIN.pdtoFab]=true;
      cntPdtosFab++;
    }
   }
   ticket.noPtosFab=cntPdtosFab;
   return items;
}



