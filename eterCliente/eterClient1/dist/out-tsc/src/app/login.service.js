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
var tablaUsuarios_1 = require("./tablaUsuarios");
var constantes_1 = require("./constantes");
var http_comm_service_1 = require("./http-comm.service");
var LoginService = /** @class */ (function () {
    function LoginService(httpGwy) {
        this.httpGwy = httpGwy;
    }
    LoginService.prototype.logUsuario = function (usuarioFir) {
        var apiUrl = constantes_1.constantes.urlBase + constantes_1.constantes.firmarse;
        //console.log('-loginService- Llamando a httGwy : ', apiUrl,usuarioFir.username,usuarioFir.passw);
        this.httpGwy.logUser(apiUrl, usuarioFir.username, usuarioFir.passw).subscribe(function (res) {
            usuarioFir.token = res['token'];
            usuarioFir.firmado = true;
            console.log(' - loginservice.logusuario, Usuario firmado ', usuarioFir);
        });
    };
    LoginService.prototype.setUsuarioActual = function (Usuario) {
        this.UsuarioActual = Usuario;
        var i = 0;
        // console.log('inicio de Usuario actual:',this.UsuarioActual);
        while (tablaUsuarios_1.USUARIOS[i++].username != Usuario.username)
            ;
        // console.log('i=',i);
        this.UsuarioActual = tablaUsuarios_1.USUARIOS[--i];
        //console.log('Finalmente el usuario queda como: ', this.UsuarioActual);
    };
    LoginService.prototype.getUsuarioActual = function () {
        //console.log('Regresando usuario actual', this.UsuarioActual);
        return this.UsuarioActual;
    };
    LoginService.prototype.getlistaUsuarios = function () {
        return tablaUsuarios_1.USUARIOS;
    };
    LoginService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_comm_service_1.HttpCommService])
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map