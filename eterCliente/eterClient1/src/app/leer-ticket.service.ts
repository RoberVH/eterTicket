import { Injectable } from '@angular/core';
import { usuario } from './usuario';
import { USUARIOS } from './tablaUsuarios';
import { constantes } from './constantes';
import { HttpCommService } from './http-comm.service';

@Injectable({
  providedIn: 'root'
})
export class LeerTicketService {

  constructor(private httpGwy:HttpCommService) { }

  public obtenTicket(){
    let params={
      numcliente:'8021',
      fecini:'2018/10/03',
      tiendaID:'304'
    }
    
    console.log('llamando a consultaDatos');
    this.httpGwy.consultaDatos('url',params);
    console.log('Hecho consulta de un ticket');
    }

  }

