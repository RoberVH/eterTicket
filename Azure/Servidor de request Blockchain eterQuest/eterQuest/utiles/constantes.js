module.exports.SEG={
NVL_ADMIN: '4',
NVL_RETAILER:'3',
NVL_FABRICANTE:'2',
NVL_USUARIO:'1',
}

module.exports.CHTTP={
    PROHIB: 403,
    NOTFOUND:404,
    BADREQUEST:400,
}

module.exports.BCHAIN ={
    // Encabezados

    fechaVta:'fv',  //fecha venta
    horaIVta: 'hiv',   //Hora inicio de la Venta
    horaFVta: 'hfv',    //hora final Venta
    tiendaId:'td',  // numero de tienda
    noCte: 'ncj',    // Numero del Cliente
    fechaMvto: 'fe',  // fecha de movimiento de redencion de puntos
    ptosVta:'pv',   // puntos que reporta el punto de venta
    indice: '_id',   // Id de Key de assets
    operexpreg: '$regex',   // Operador de expresion regular
    
}    
module.exports.BCTIPOS ={
     TD_CODBAR:'cb',    //codigo de barrras
     TD_DOCTYPE: "docType",
     TD_LINEATICKET: "lin-tk", // linea del ticket
     TD_HEADERTICKET: "hdr-tk",  // header del ticket (incluye formas de pago)
     TD_CTE: "cte-ct",  // cuenta de puntos del cliente
     TD_HDRFAB: 'hrd-fab',  //header de ticket del fabricante
     TD_LNFAB: 'lin-fab',  //linea de ticket del fabricante
     TD_REDEN_PTOS: 'rd-ptos',  // movimiento de redencion de puntos
     TC_USUARIO: '1',  // tipo de cliente es usuario
     TC_FABRICANTE: '2',  // tipo de cliente es fabricante
     TC_RETAILER: '3',  // tipo de cliente es adminstrador de Retailer
     TC_ADMIN: '4',  // tipo de cliente es adminstrador de eterTicket    
}

module.exports.ENTIDADES = {
    ETICKET: '1',
    COLIBRI:'2',
    COCACOLA:'3',
}