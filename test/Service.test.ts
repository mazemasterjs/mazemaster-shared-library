import { expect } from 'chai';
import { Service } from '../src/Service';
import { Endpoint } from '../src/Endpoint';

describe(__filename + ' - Service Tests', () => {
  const svc = new Service('service.json');
  const svcName: string = 'example';
  const svcBaseUrl: string = '/example/';
  const svcEpCount: number = 4;
  const svcEp0Name: string = 'test';
  const svcEp0Desc: string = 'Test endpoint.';
  const svcEp0CType: string = 'application/json';
  const svcEp0Method: string = 'get';
  const svcEp0Url: string = 'test/';
  const svcEp0ArgsCnt: number = 3;
  const svcEp0Arg0Name: string = 'test-arg-1';
  const svcEp0Arg0Desc: string = 'This is a sample argument of type integer.';
  const svcEp0Arg0Type: string = 'integer';
  const validServiceData = { name: 'valid-name', baseUrl: 'valid-base-url' };

  it('Service object should not be null', () => {
    return expect(svc).not.be.null;
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

  it(`Service.getEndpointByName('${svcEp0Name}') should return endpoint with name: '${svcEp0Name}'`, () => {
    const epTest: Endpoint = svc.getEndpointByName(svcEp0Name);
    expect(epTest.Name).to.equal(svcEp0Name);
  });

  it(`Service.getEndpointByName('does-not-exist') should return null`, () => {
    const epTest: Endpoint = svc.getEndpointByName('does-not-exist');
    return expect(epTest).to.be.null;
  });

  it(`Service.loadFromJson(validServiceData) should return service with name ${validServiceData.name}`, () => {
    const tstSvc = new Service();
    tstSvc.loadFromJson(validServiceData);
    return expect(tstSvc.Name).to.equal(validServiceData.name);
  });
});

describe('Service Anti-Tests', () => {
  const invalidServiceData1 = { name: 999, baseUrl: 'valid-base-url' };
  const invalidServiceData2 = { name: 'valid-name', baseUrl: 999 };

  it('Service object should error when service file is not found', () => {
    expect(() => {
      return new Service('fake-file-name.fake');
    }).to.throw('FILE NOT FOUND: fake-file-name.fake');
  });

  it(`Service.loadFromJson(invalidServiceData1) should throw error.`, () => {
    const tstSvc = new Service();
    return expect(() => {
      tstSvc.loadFromJson(invalidServiceData1);
    }).to.throw('Service.name must be a string.');
  });

  it(`Service.loadFromJson(invalidServiceData2) should throw error.`, () => {
    const tstSvc = new Service();
    return expect(() => {
      tstSvc.loadFromJson(invalidServiceData2);
    }).to.throw('Service.baseUrl must be a string.');
  });
});
