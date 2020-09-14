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
var get_res_bc_service_1 = require("../get-res-bc.service");
var ComandosComponent = /** @class */ (function () {
    function ComandosComponent(consultar) {
        this.consultar = consultar;
        this.arr = [];
    }
    ComandosComponent.prototype.onSubmit = function (form) {
        //console.log('Invocado: ',this.selecto);
        this.arr = form.value;
        // console.log('valores:: ',JSON.stringify(this.arr));
        switch (this.selecto) {
            case 'leerT':
                this.consultar.leerTicket(this.arr);
        }
    };
    /* public leerT(){
       this.selecto=this.seleccion;
       console.log('selecto: ',this.selecto);
     }
   
     public leerTs(){
       this.selecto=this.seleccion;
       console.log('selecto: ',this.selecto);
     }
   
     public saldoCte(){
       this.selecto=this.seleccion;
       console.log('selecto: ',this.selecto);
     }
     */
    ComandosComponent.prototype.ngOnInit = function () {
    };
    ComandosComponent = __decorate([
        core_1.Component({
            selector: 'app-comandos',
            templateUrl: './comandos.component.html',
            styleUrls: ['./comandos.component.css']
        }),
        __metadata("design:paramtypes", [get_res_bc_service_1.GetResBCService])
    ], ComandosComponent);
    return ComandosComponent;
}());
exports.ComandosComponent = ComandosComponent;
//# sourceMappingURL=comandos.component.js.map