'use strict';

describe('Service: Songservice', function () {

  // load the service's module
  beforeEach(module('musicApp'));

  // instantiate service
  var Songservice;
  beforeEach(inject(function (_Songservice_) {
    Songservice = _Songservice_;
  }));

  it('should do something', function () {
    expect(!!Songservice).toBe(true);
  });

});
