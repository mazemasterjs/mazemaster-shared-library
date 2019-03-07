import {expect} from 'chai';
import {Service} from '../src/Service';

describe('Service Tests', () => {
    let svc = new Service('service.json');
    let svcName: string = 'example';
    let svcBaseUrl: string = '/example/';
    let svcEpCount: number = 4;
    let svcEp0Name: string = 'test';
    let svcEp0Desc: string = 'Test endpoint.';
    let svcEp0CType: string = 'application/json';
    let svcEp0Method: string = 'get';
    let svcEp0Url: string = 'test/';
    let svcEp0ArgsCnt: number = 3;
    let svcEp0Arg0Name: string = 'test-arg-1';
    let svcEp0Arg0Desc: string = 'This is a sample argument of type integer.';
    let svcEp0Arg0Type: string = 'integer';

    it('Service object should not be null', () => {
        expect(svc).not.be.null;
    });

    it(`Service.Name should equal ${svcName}`, () => {
        expect(svc.Name).to.equal(svcName);
    });

    it(`Service.BaseUrl should equal ${svcBaseUrl}`, () => {
        expect(svc.BaseUrl).to.equal(svcBaseUrl);
    });

    it(`Service.Endpoints.length should equal ${svcEpCount}`, () => {
        expect(svc.Endpoints.length).to.equal(svcEpCount);
    });

    it(`Service.Endpoints[0].Name should equal ${svcEp0Name}`, () => {
        expect(svc.Endpoints[0].Name).to.equal(svcEp0Name);
    });

    it(`Service.Endpoints[0].ContentType should equal ${svcEp0CType}`, () => {
        expect(svc.Endpoints[0].ContentType).to.equal(svcEp0CType);
    });

    it(`Service.Endpoints[0].Method should equal ${svcEp0Method}`, () => {
        expect(svc.Endpoints[0].Method).to.equal(svcEp0Method);
    });

    it(`Service.Endpoints[0].Url should equal ${svcEp0Url}`, () => {
        expect(svc.Endpoints[0].Url).to.equal(svcEp0Url);
    });

    it(`Service.Endpoints[0].Description should equal ${svcEp0Desc}`, () => {
        expect(svc.Endpoints[0].Description).to.equal(svcEp0Desc);
    });

    it(`Service.Endpoints[0].Arguments.length should equal ${svcEp0ArgsCnt}`, () => {
        expect(svc.Endpoints[0].Arguments.length).to.equal(svcEp0ArgsCnt);
    });

    it(`Service.Endpoints[0].Arguments[0].Name should equal ${svcEp0Arg0Name}`, () => {
        expect(svc.Endpoints[0].Arguments[0].Name).to.equal(svcEp0Arg0Name);
    });

    it(`Service.Endpoints[0].Arguments[0].Description should equal ${svcEp0Arg0Desc}`, () => {
        expect(svc.Endpoints[0].Arguments[0].Description).to.equal(svcEp0Arg0Desc);
    });

    it(`Service.Endpoints[0].Arguments[0].Type should equal ${svcEp0Arg0Type}`, () => {
        expect(svc.Endpoints[0].Arguments[0].Type).to.equal(svcEp0Arg0Type);
    });
});

describe('Service Anti-Tests', () => {
    it('Service object should error on empty file name', () => {
        expect(function() {
            let svc: Service = new Service('');
        }).to.throw('ILLEGAL ARGUMENT: serviceFile cannot be empty.');
    });

    it('Service object should error when service file is not found', () => {
        let svc: Service;
        expect(function() {
            let svc: Service = new Service('fake-file-name.fake');
        }).to.throw('FILE NOT FOUND: fake-file-name.fake');
    });
});
