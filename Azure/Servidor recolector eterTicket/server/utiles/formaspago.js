var L = require('./constantes');

module.exports = function adaptaFrmPago(pagosXml,long) {
    var pagos=[];
    for (let i=0; i < long;i++) {
        var lnpago={}; // es necesario crear nueva instancia de objeto ya que de lo contrario todo el array contendra referencia al ultimo objeto!
        lnpago[L.BCHAIN.cvepgo]=pagosXml[i][L.DF.CVEPAG].toString();
        lnpago[L.BCHAIN.tpomvto]=pagosXml[i][L.DF.TPOMVTO].toString();
        lnpago[L.BCHAIN.tipopgo]=pagosXml[i][L.DF.TPOPGO].toString();
        lnpago[L.BCHAIN.tpgdo]=pagosXml[i][L.DF.TPGDO].toString();
        lnpago[L.BCHAIN.txtpgo]=pagosXml[i][L.DF.DESCPGO].toString();
        lnpago[L.BCHAIN.numtarj]=pagosXml[i][L.DF.NTARJ].toString();
        lnpago[L.BCHAIN.numautoriz]=pagosXml[i][L.DF.NAUTORT].toString();
        lnpago[L.BCHAIN.fexpra]=pagosXml[i][L.DF.EXPTARJ].toString();
        pagos.push(lnpago);
    }

    return pagos;
}
