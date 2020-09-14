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
//import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
var http_1 = require("@angular/common/http");
//import { map, filter, catchError, mergeMap } from 'rxjs/operators';
var rxjs_1 = require("rxjs");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var httpOptionslogin = {
    headers: new http_1.HttpHeaders({
        'Content-Type': 'application/json',
        'Response-Type': 'text',
    })
};
var HttpCommService = /** @class */ (function () {
    function HttpCommService(http) {
        this.http = http;
        this.paramsGetBase = {
            params: {
                'Content-Type': 'application/json',
                'Response-Type': 'json',
            }
        };
    }
    HttpCommService.prototype.logUser = function (endPoint, usuario, password) {
        var loginJson = { username: '', passw: '' };
        loginJson.username = usuario;
        loginJson.passw = password;
        //console.log('-logUser en http-comm - loginJson ',loginJson);
        var loginStr = JSON.stringify(loginJson);
        //console.log('-logUser en http-comm - por postear loginStr ',loginStr);
        return this.http.post(endPoint, loginStr, httpOptionslogin);
    };
    HttpCommService.prototype.consultaDatos = function (endPoint, headers) {
        console.log('entrando a consultadatos');
        //console.log('consultaDatos. Asi sera el llamado: ', endPoint,JSON.stringify(headers));
        return this.http.get(endPoint, { headers: headers })
            .catch(this.handleError);
    };
    HttpCommService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        console.log('Mi manejadore de Error: ', error);
        return rxjs_1.throwError(errMsg);
        // if (error.status==500) { this.router.navigate(['login'])} else {return throwError(errMsg)}
    };
    HttpCommService.prototype.extractData = function (res) {
        return res.json();
    };
    HttpCommService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], HttpCommService);
    return HttpCommService;
}());
exports.HttpCommService = HttpCommService;
//# sourceMappingURL=http-comm.service.js.map