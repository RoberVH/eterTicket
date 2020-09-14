"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var get_res_bc_service_1 = require("./get-res-bc.service");
describe('GetResBCService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [get_res_bc_service_1.GetResBCService]
        });
    });
    it('should be created', testing_1.inject([get_res_bc_service_1.GetResBCService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=get-res-bc.service.spec.js.map