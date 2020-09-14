export const constantes = {
    urlBase:'http://eterquest.eastus.cloudapp.azure.com:8080/',
    //urlBase:'http://localhost:8080/',

    apiUrl: 'http://eterquest.eastus.cloudapp.azure.com:8080/eterquest/',
    firmarse:'login',
    leeHeaderTk: 'leerhdr',
    leerlineasTicket: 'leeticket',
    leerMulTks: 'leetikcsxrangos',
    leersaldoCte: 'obtenSaldos',
    leerhptscjs: 'histRedencionPtos',


}
/* constantes en chaincode eticket para redencion de puntos
   "docType":TD_REDEN_PTOS, // tipo de documento: redencion de puntos
    "ct": noCte,	// numero de cliente
    "rt": IdRetailer,  // Id del retailer relacionado al pago
    "mt": porPagar,	// monto que se pago en moneda
    "sa": cta.tp,	// saldo en puntos antes del movimiento
    "sn": saldoNvoPtos,   // saldo en puntos ya descontado el pago (saldo actual)
    "fe": hoy,
}
*/