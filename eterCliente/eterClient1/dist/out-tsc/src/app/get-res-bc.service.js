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
var constantes_1 = require("./constantes");
var login_service_1 = require("./login.service");
var http_comm_service_1 = require("./http-comm.service");
var http_1 = require("@angular/common/http");
//import { ticket } from './ticket';
var GetResBCService = /** @class */ (function () {
    function GetResBCService(httpGwy, login) {
        this.httpGwy = httpGwy;
        this.login = login;
        //private Ticket:ticket;
        this.Ticket = {};
        this.mostrarResultados = new core_1.EventEmitter();
    }
    GetResBCService.prototype.leerTicket = function (params) {
        var _this = this;
        var url = constantes_1.constantes.apiUrl + constantes_1.constantes.leeHeaderTk;
        this.UsuarioActual = this.login.getUsuarioActual();
        // leer header primero
        var headers = new http_1.HttpHeaders().set("access-token", this.UsuarioActual.token).set("ticketid", params['ticketID']);
        // leer header de ticket de la Blockchain
        this.httpGwy.consultaDatos(url, headers).subscribe(function (res) {
            // console.log(' - Consulta web de header ticket: ', res);
            if (res) {
                //console.log('hubo resultados');
                _this.Ticket['header'] = res;
                //console.log ('Ticket (1): ',this.Ticket);
                url = constantes_1.constantes.apiUrl + constantes_1.constantes.leerlineasTicket;
                // leer lineas de ticket de la Blockchain
                _this.httpGwy.consultaDatos(url, headers).subscribe(function (results) {
                    //  console.log(' - Consulta web lineas del ticket: ', results);
                    _this.Ticket['lineas'] = results;
                    // console.log(' Ticket (2): ', this.Ticket);
                    //Avisa a tus supscritores (Body component) que hay resultados por mostrar
                    _this.mostrarResultados.emit({ tipoResul: 'tiket', resultado: _this.Ticket });
                });
            }
            else {
                console.log('No Hubo resultado');
            }
        });
        //console.log('Hecho consulta de un ticket');*/
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], GetResBCService.prototype, "mostrarResultados", void 0);
    GetResBCService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_comm_service_1.HttpCommService, login_service_1.LoginService])
    ], GetResBCService);
    return GetResBCService;
}());
exports.GetResBCService = GetResBCService;
//# sourceMappingURL=get-res-bc.service.js.map