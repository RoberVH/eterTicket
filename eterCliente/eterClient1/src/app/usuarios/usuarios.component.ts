import { Component, OnInit  } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { LoginService } from '../login.service';
import { usuario } from '../usuario';


//import { Console } from '@angular/core/src/console';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  
  public usuarioFirmado:usuario;
  public Usuarios:usuario[];
  public frmUsuarios: FormGroup;

  constructor(private loginService:LoginService, private fb: FormBuilder){}

  ngOnInit() {
    this.Usuarios=this.loginService.getlistaUsuarios();
    //console.log('Todos mis Usuarios ', this.Usuarios);
    this.loginService.setUsuarioActual(this.Usuarios[0]);
    this.usuarioFirmado= this.loginService.getUsuarioActual();
    //console.log('En usuario.component el usuario firmado es: ', this.usuarioFirmado);
    this.frmUsuarios = this.fb.group({
      ctrlUsuario: [this.Usuarios[0]],
    })
       // Ffrma al usuario inicial
    this.loginService.logUsuario(this.Usuarios[0]);
    this.onChanges();
  }

  public setUsuario(idusuario){
    this.loginService.setUsuarioActual(idusuario);
    this.usuarioFirmado=this.loginService.getUsuarioActual();
    
  }

  onChanges():void{
  this.frmUsuarios.get('ctrlUsuario').valueChanges
  .subscribe(
    (value) => {
      console.log('Usuario cambio (value) ',value);
      this.usuarioFirmado=value;
      this.setUsuario(this.usuarioFirmado);
      if (!this.usuarioFirmado.firmado) {
        // firmar usuario
        //console.log('invocando logUsuario: ');
        this.loginService.logUsuario(this.usuarioFirmado);
        //console.log('desde login.service.onCHanges, el token del usario firmado: ',this.usuarioFirmado.token);
        //console.log('usarios.component,onChanges, Ahora usuarioFirmado es: ',this.usuarioFirmado);
 
      }
    }
  );
  }
}
