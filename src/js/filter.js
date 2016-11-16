require('xuetangxData.service')

var filterIsInvalidNum = require('filter.isInvalidNum')
var filterDateRange = require('filter.dateRange')

var app = angular.module('xuetangxData.filter', ['xuetangxData.service'])

app.filter('isInvalidNum', filterIsInvalidNum)

app.filter('dateRange', ['dateFormat', filterDateRange])
