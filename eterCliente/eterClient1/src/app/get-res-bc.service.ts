import { Injectable, EventEmitter, Output } from '@angular/core';
import { usuario } from './usuario';
import { USUARIOS } from './tablaUsuarios';
import { constantes } from './constantes';
import { LoginService } from './login.service';
import { HttpCommService } from './http-comm.service';
import { HttpHeaders } from '@angular/common/http';

//import { ticket } from './ticket';


@Injectable({
  providedIn: 'root'
})
export class GetResBCService {

  private UsuarioActual:usuario;
  private token:string;
  //private Ticket:ticket;
  public Ticket={};
  public CtacTe={};

  @Output() public mostrarResultados: EventEmitter<any> = new EventEmitter();

  constructor(private httpGwy:HttpCommService, private login:LoginService ){}

  leerTicket(params:string[]) {
    
    let url=constantes.apiUrl + constantes.leeHeaderTk;
    this.UsuarioActual=this.login.getUsuarioActual();
    // leer header primero
    const headers = new HttpHeaders().set("access-token",this.UsuarioActual.token).set("ticketid",params['ticketID']);
    console.log('headers es', headers.keys());
    if (params['ticketID']=='')  {
        console.log("Error, no hay parametros");
        this.mostrarResultados.emit({tipoResul:'SinParametros',Ticket:null});

      }  else {
        // leer header de ticket de la Blockchain
          this.httpGwy.consultaDatos(url,headers).subscribe((res) => {
        // console.log(' - Consulta web de header ticket: ', res);
          if(res) { 
                this.Ticket['header']=res;
                //console.log ('Ticket (1): ',this.Ticket);
                url=constantes.apiUrl + constantes.leerlineasTicket;
                // leer lineas de ticket de la Blockchain
                this.httpGwy.consultaDatos(url,headers).subscribe((results) => {
                //  console.log(' - Consulta web lineas del ticket: ', results);
                  this.Ticket['lineas']=results;
                // console.log(' Ticket (2): ', this.Ticket);
                //Avisa a tus supscritores (Body component) que hay resultados por mostrar
                this.mostrarResultados.emit({tipoResul:'UnTicket',Ticket:this.Ticket});
                });
              } else { 
                  console.log('No Hubo resultado');
                  this.mostrarResultados.emit({tipoResul:'SinResults',Ticket:null});
              }
            }, (error) => {
             // console.log('Emitiendo error ');
              this.mostrarResultados.emit({tipoResul:'MsjError',error});
            });
      }
    }      

    leermultiplesTickets(params:string[]) {
    
      let url=constantes.apiUrl + constantes.leerMulTks;
      this.UsuarioActual=this.login.getUsuarioActual();
      // leer header primero
      //const headers = new HttpHeaders().set("access-token",this.UsuarioActual.token);
      let headers: HttpHeaders = new HttpHeaders();
      headers= headers.append('access-token',this.UsuarioActual.token);
      if (params['ticketID']!='') {
        headers= headers.append("ticketid",params['ticketID']);
      }
      if (params['fecini']!='') {
      headers= headers.append("fecini",params['fecini']);
      }
      if (params['fecfinal']!='') {
      headers= headers.append("fecfinal",params['fecfinal']);
      }
      if (params['tiendaId']!='') {
        headers= headers.append("tiendaid",params['tiendaId']);
      }
      if (params['numcliente']!='') {
        headers= headers.append("numcliente",params['numcliente']);
      }
      console.log('headers es', headers.keys());
      if (headers.keys().length==1) {
        console.log("Error, no hay parametros");
        this.mostrarResultados.emit({tipoResul:'SinParametros',Ticket:null});

      }
      else {
      // leer headers de tickets de la Blockchain
      //this.httpGwy.consultaDatos(url,headers).subscribe((results:{}) => {
        this.httpGwy.consultaDatos(url,headers).subscribe((results) => {
          console.log(' - Consulta web hdrs del ticket: ', results);
          if(results.length!=0) { 
            //console.log('hubo resultados');
            this.Ticket['header']=results;
            console.log(' Ticket: ', this.Ticket);
            //Avisa a tus supscritores (Body component) que hay resultados por mostrar
            this.mostrarResultados.emit({tipoResul:'variosHeaders',Ticket:this.Ticket});
            }
            else {
            console.log('No Hubo resultado');
            this.mostrarResultados.emit({tipoResul:'SinResults',Ticket:null});
          }
        }, (error) => {
          console.log('Emitiendo error ');
          
          this.mostrarResultados.emit({tipoResul:'MsjError',error});
          
        });
      }
    }    

    
    leersaldoCte(params:string[]) {
    
      let url=constantes.apiUrl + constantes.leersaldoCte;
      this.UsuarioActual=this.login.getUsuarioActual();
      console.log('En leersaldocte');
      // leer header primero
      //const headers = new HttpHeaders().set("access-token",this.UsuarioActual.token);
      let headers: HttpHeaders = new HttpHeaders();
      headers= headers.append('access-token',this.UsuarioActual.token);
      if (this.UsuarioActual.nivel>1 && params['numcliente']=='') {
          console.log("Error, no hay parametros");
          this.mostrarResultados.emit({tipoResul:'SinParametros',Ticket:null});
          return;
        } else {
          headers= headers.append("numcliente",params['numcliente']);
      }
      console.log('En url',url,headers);
      this.httpGwy.consultaDatos(url,headers).subscribe((results) => {
        if(results.length!=0) { 
         this.CtacTe=results;
          this.mostrarResultados.emit({tipoResul:'CtaCte',CtaCte:this.CtacTe});
          }
          else {
          this.mostrarResultados.emit({tipoResul:'SinResults',CtaCte:null});
        }
      }, (error) => {
        console.log('Emitiendo error ');
        this.mostrarResultados.emit({tipoResul:'MsjError',error});
      });        
      }

      leerhptscjs(params:string[]) {
    
        let url=constantes.apiUrl + constantes.leerhptscjs;
        let headers: HttpHeaders = new HttpHeaders();
        this.UsuarioActual=this.login.getUsuarioActual();
        headers= headers.append('access-token',this.UsuarioActual.token);
        console.log('En leerhptscjs')
        if (this.UsuarioActual.nivel>1 && params['numcliente']=='') {
          console.log("Error, no hay parametros");
          this.mostrarResultados.emit({tipoResul:'SinParametros',Ticket:null});
          return;
        } else {
          headers= headers.append("numcliente",params['numcliente']);
      }
      this.httpGwy.consultaDatos(url,headers).subscribe((results) => {
        if(results.length!=0) { 
          this.mostrarResultados.emit({tipoResul:'hptscjs',histCanje:results});
          }
          else {
          this.mostrarResultados.emit({tipoResul:'SinResults',histCanje:null});
        }
      }, (error) => {
        console.log('Emitiendo error ');
        this.mostrarResultados.emit({tipoResul:'MsjError',error});
      });       
      
      }
}
