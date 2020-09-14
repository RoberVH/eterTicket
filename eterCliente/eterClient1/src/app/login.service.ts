import { Injectable } from '@angular/core';
import { usuario } from './usuario';
import { USUARIOS } from './tablaUsuarios';
import { constantes } from './constantes';
import { HttpCommService } from './http-comm.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public UsuarioActual:usuario;
  private token;
  constructor(private httpGwy:HttpCommService){}

  logUsuario(usuarioFir):any {
   let apiUrl=constantes.urlBase + constantes.firmarse;
   //console.log('-loginService- Llamando a httGwy : ', apiUrl,usuarioFir.username,usuarioFir.passw);
   this.httpGwy.logUser(apiUrl,usuarioFir.username,usuarioFir.passw).subscribe((res:{}) => {
    usuarioFir.token=res['token']; 
    usuarioFir.firmado=true;
    console.log(' - loginservice.logusuario, Usuario firmado ', usuarioFir);
    });
   }
   
   
  setUsuarioActual(Usuario):void{
    this.UsuarioActual=Usuario;
    console.log('En login ahora usario es: ', this.UsuarioActual)
    let i=0;
   // console.log('inicio de Usuario actual:',this.UsuarioActual);
   /* while(USUARIOS[i++].username!=Usuario.username);
   // console.log('i=',i);
    this.UsuarioActual=USUARIOS[--i];*/
    //console.log('Finalmente el usuario queda como: ', this.UsuarioActual);
   }

  getUsuarioActual():usuario {
    //console.log('Regresando usuario actual', this.UsuarioActual);
  return this.UsuarioActual;
  }

  getlistaUsuarios():usuario[] {
    return USUARIOS;
    }
}
