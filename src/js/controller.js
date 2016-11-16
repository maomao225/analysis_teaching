require('xuetangxData.directive')

var ctrlRoot = require('ctrl.root')
var ctrlHome = require('ctrl.home')

var app = angular.module('xuetangxData.controller', ['xuetangxData.directive'])

// root controller
app.controller('rootCtrl', ctrlRoot)

// home
app.controller('home', ['$scope', 'interfaces', '$location', '$rootScope', ctrlHome])
