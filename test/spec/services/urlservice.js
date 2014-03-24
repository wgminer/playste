'use strict';

describe('Service: Urlservice', function () {

  // load the service's module
  beforeEach(module('musicApp'));

  // instantiate service
  var Urlservice;
  beforeEach(inject(function (_Urlservice_) {
    Urlservice = _Urlservice_;
  }));

  it('should do something', function () {
    expect(!!Urlservice).toBe(true);
  });

});
