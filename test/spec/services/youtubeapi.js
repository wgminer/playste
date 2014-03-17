'use strict';

describe('Service: Youtubeapi', function () {

  // load the service's module
  beforeEach(module('musicApp'));

  // instantiate service
  var Youtubeapi;
  beforeEach(inject(function (_Youtubeapi_) {
    Youtubeapi = _Youtubeapi_;
  }));

  it('should do something', function () {
    expect(!!Youtubeapi).toBe(true);
  });

});
