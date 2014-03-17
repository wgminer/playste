'use strict';

describe('Service: Soundcloudapi', function () {

  // load the service's module
  beforeEach(module('musicApp'));

  // instantiate service
  var Soundcloudapi;
  beforeEach(inject(function (_Soundcloudapi_) {
    Soundcloudapi = _Soundcloudapi_;
  }));

  it('should do something', function () {
    expect(!!Soundcloudapi).toBe(true);
  });

});
