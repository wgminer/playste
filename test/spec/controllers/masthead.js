'use strict';

describe('Controller: MastheadctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('musicApp'));

  var MastheadctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MastheadctrlCtrl = $controller('MastheadctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
