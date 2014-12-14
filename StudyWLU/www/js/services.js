var services = angular.module('starter.services', []);

services.service('DateService', function() {


	/*
		Takes todays date and returns a Eucllian Date code that can be used.

		@returns A date code that represents the current day of the week
	 */
    this.getDateCode = function() {
    	return "F";
		var currentDate = new Date();
		var codes = ['X', 'M', 'T', 'W', 'R', 'F', 'X'];
		return codes[currentDate.getDay()];

     };


});