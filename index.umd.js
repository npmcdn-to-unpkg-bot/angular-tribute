(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('tributejs/src')) :
  typeof define === 'function' && define.amd ? define(['tributejs/src'], factory) :
  (global.AngularTribute = factory(global.Tribute));
}(this, function (Tribute) { 'use strict';

  Tribute = 'default' in Tribute ? Tribute['default'] : Tribute;

  if (typeof Tribute === 'undefined') {
    throw new Error('[AngularTribute] cannot locate tributejs!');
  }

  var AngularTribute = function AngularTribute($timeout) {
    return {
      restrict: 'A',
      scope: {
        values: '=',
        options: '=',
        onReplaced: '&',
        onNoMatch: '&'
      },
      controller: function controller($scope) {
        this.$onDestroy = function () {
          $scope.tribute.hideMenu();
        };
      },
      compile: function compile($element, $attrs) {
        var _this = this;

        return function ($scope, $element, $attrs) {
          if (typeof $scope.options === 'array') {
            $scope.tribute = new Tribute({
              collection: $scope.options
            });
          } else {
            $scope.tribute = new Tribute(angular.merge({
              values: $scope.values
            }, $scope.options || {}));
          }

          $scope.tribute.attach($element[0]);

          $element[0].addEventListener("tribute-replaced", function (e) {
            if (typeof $scope.onReplaced !== 'function') return;
            $timeout($scope.onReplaced.apply(_this));
          });
          $element[0].addEventListener("tribute-no-match", function (e) {
            if (typeof $scope.onNoMatch !== 'function') return;
            $timeout($scope.onNoMatch.apply(_this));
          });
        };
      }
    };
  };

  AngularTribute.$inject = ['$timeout'];

  return AngularTribute;

}));