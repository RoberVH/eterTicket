"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var http_comm_service_1 = require("./http-comm.service");
describe('HttpCommService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [http_comm_service_1.HttpCommService]
        });
    });
    it('should be created', testing_1.inject([http_comm_service_1.HttpCommService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=http-comm.service.spec.js.map