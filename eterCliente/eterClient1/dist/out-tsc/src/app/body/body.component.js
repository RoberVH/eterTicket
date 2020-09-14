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
var BodyComponent = /** @class */ (function () {
    function BodyComponent(servResultados) {
        var _this = this;
        this.servResultados = servResultados;
        this.Ticket = {};
        this.viewMode = 'UnTicket';
        servResultados.mostrarResultados.subscribe(function (objResul) {
            console.log('objResul ', objResul);
            _this.Ticket = objResul.Ticket;
            _this.viewMode = 'UnTicket';
        });
    }
    BodyComponent.prototype.ngOnInit = function () {
    };
    BodyComponent.prototype.desp_1ticket = function (ticket) {
    };
    BodyComponent = __decorate([
        core_1.Component({
            selector: 'app-body',
            templateUrl: './body.component.html',
            styleUrls: ['./body.component.css']
        }),
        __metadata("design:paramtypes", [get_res_bc_service_1.GetResBCService])
    ], BodyComponent);
    return BodyComponent;
}());
exports.BodyComponent = BodyComponent;
//# sourceMappingURL=body.component.js.map