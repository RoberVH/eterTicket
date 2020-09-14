module.exports.EM = {
    SECCEM: 'EM',
    MVTO: 'NUTIPTRA_E',
    FECVTA: 'FECHA_E',
    NOTIENDA: 'NUUNIOPE_E',
    FOLVTA: 'FOLIO_E',
    IDVDOR: 'NUMVEND_E',
    PUNTOS: 'PUNTOS_E',
    NUMCAJA: 'NUMCAJA_E',
    IMPTOT: 'IMPTOT_E',
    NUMCLI: 'NUMCLI_E',
    HORAINI: 'HORAINI_E',
    HORAREG: 'HORAREG_E',
    SECCLIN:'DDM',
    };
module.exports.DM ={
    CODART:'CODART_R',
    DESCRIPC:'ESTILO_R',
    CANT:'CANTID_R',
    CANTXN:'CANTXUM_R',
    PCOIVA:'PRECIVA_R',
    PCOSIVA:'PRESIVA_R',
    PCCST:'PRECOST_R',
    PCDSCTO:'PDESCTO_R',
    PCOBRTO:'IMPBRTO_R',
    TSAIVA:'TAZIVA_R',
    IMPTOT:"IMPTOT_R"
}
module.exports.DF ={
    CVEPAG:'CVEPAGO_T',
    TPOMVTO:'TIPOMOV_T',
    TPOPGO:'TIPOPAGO_T',
    TPGDO: 'TOTPAGO_T',
    DESCPGO:'TEXTPAGO_T',
    NTARJ:'NTARJETA_T',
    NAUTORT:'NAUTORIZ_T',
    EXPTARJ:'EXPIRA_T',
}

module.exports.BCHAIN ={
    // Encabezados

    fechaVta:'fv',  //fecha venta
    horaIVta: 'hiv',   //Hora inicio de la Venta
    horaFVta: 'hfv',    //hora final Venta
    tiendaId:'td',  // numero de tienda
    folio:'fl',  // folio ticket
    vedor:'vr',  // ID vendedor
    noCaja: 'nc',  //No. de Caja
    impteTot: 'im',  // Importe de Venta
    noCte: 'ncj',    // Numero del Cliente
    totItems: 'ti',    // Numero total de Items NO AGREGADO!!!!
    ptosVta:'pv',   // puntos que reporta el punto de venta

    // items
    cb:'cb',    // codigo barras
    descpon:'ds',  // descripcion
    cnt:'cn',   // cantidad del articulo
    ctxn:'cnx',  // cantidad x numero (?)
    pciva:'pi',  // precio con iva
    pcsiva:'psi',  // precio sin iva
    pcsto:'pcm',  // precio con dscto
    pciodscto:'pd',  // precio sin dscto
    pcobrto:'pb',  // precio bruto
    tasaiva:'ti',  // tasas IVA
    impttot:'pt', // importe total
    pdtoFab:'pf', // importe total

    // formas de pago
    cvepgo: 'cp',
    tpomvto:'tm',
    tipopgo:'tp',
    txtpgo:'xp',
    tpgdo:'tpo',
    numtarj:'nt',
    numautoriz:'na',
    fexpra:'fx',
}
module.exports.FABRICANTE ={
    // Encabezados
    prefCBFab:'75010553',  //fecha venta
}

