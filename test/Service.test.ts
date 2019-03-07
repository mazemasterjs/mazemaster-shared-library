import {Config} from '../src/Config';
import {expect} from 'chai';
import {Service} from '../src/Service/Service';

describe('Service Tests', () => {
    let svc = new Service(Config.getInstance().SERVICE_DOC_FILE);
    let svcName: string = 'example';
    let svcBaseUrl: string = '/example/';
    let svcEpCount: number = 4;
    let svcEp0Name: string = 'test';
    let svcEp0ArgsCnt: number = 3;
    let svcEp0Arg0Name: string = 'test-arg-1';

    it('Service object should not be null', () => {
        expect(svc).not.be.null;
    });

    it(`Service.Name should equal ${svcName}.`, () => {
        expect(svc.name).to.equal(svcName);
    });

    it(`Service.BaseUrl should equal ${svcBaseUrl}.`, () => {
        expect(svc.baseUrl).to.equal(svcBaseUrl);
    });

    it(`Service.Endpoints.length should equal ${svcEpCount}.`, () => {
        expect(svc.endpoints.length).to.equal(svcEpCount);
    });

    it(`Service.Endpoints[0].Name should equal ${svcEp0Name}.`, () => {
        expect(svc.endpoints[0].name).to.equal(svcEp0Name);
    });

    it(`Service.Endpoints[0].Arguments.length should equal ${svcEp0ArgsCnt}.`, () => {
        expect(svc.endpoints[0].arguments.length).to.equal(svcEp0ArgsCnt);
    });

    it(`Service.Endpoints[0].Arguments[0].name should equal ${svcEp0Arg0Name}.`, () => {
        expect(svc.endpoints[0].arguments[0].name).to.equal(svcEp0Arg0Name);
    });
});
