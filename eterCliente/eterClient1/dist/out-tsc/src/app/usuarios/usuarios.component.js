"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var login_service_1 = require("../login.service");
//import { Console } from '@angular/core/src/console';
var UsuariosComponent = /** @class */ (function () {
    function UsuariosComponent(loginService, fb) {
        this.loginService = loginService;
        this.fb = fb;
    }
    UsuariosComponent.prototype.ngOnInit = function () {
        this.Usuarios = this.loginService.getlistaUsuarios();
        //console.log('Todos mis Usuarios ', this.Usuarios);
        this.loginService.setUsuarioActual(this.Usuarios[0]);
        this.usuarioFirmado = this.loginService.getUsuarioActual();
        //console.log('En usuario.component el usuario firmado es: ', this.usuarioFirmado);
        this.frmUsuarios = this.fb.group({
            ctrlUsuario: [this.Usuarios[0]],
        });
        // Ffrma al usuario inicial
        this.loginService.logUsuario(this.Usuarios[0]);
        this.onChanges();
    };
    UsuariosComponent.prototype.setUsuario = function (idusuario) {
        this.loginService.setUsuarioActual(idusuario);
        this.usuarioFirmado = this.loginService.getUsuarioActual();
    };
    UsuariosComponent.prototype.onChanges = function () {
        var _this = this;
        this.frmUsuarios.get('ctrlUsuario').valueChanges
            .subscribe(function (value) {
            console.log('Usuario cambio (value) ', value);
            _this.usuarioFirmado = value;
            if (!_this.usuarioFirmado.firmado) {
                // firmar usuario
                //console.log('invocando logUsuario: ');
                _this.loginService.logUsuario(_this.usuarioFirmado);
                //console.log('desde login.service.onCHanges, el token del usario firmado: ',this.usuarioFirmado.token);
                //console.log('usarios.component,onChanges, Ahora usuarioFirmado es: ',this.usuarioFirmado);
            }
        });
    };
    UsuariosComponent = __decorate([
        core_1.Component({
            selector: 'app-usuarios',
            templateUrl: './usuarios.component.html',
            styleUrls: ['./usuarios.component.css']
        }),
        __metadata("design:paramtypes", [login_service_1.LoginService, forms_1.FormBuilder])
    ], UsuariosComponent);
    return UsuariosComponent;
}());
exports.UsuariosComponent = UsuariosComponent;
//# sourceMappingURL=usuarios.component.js.map