var services = angular.module('starter.services', []);

/*
	This is a basic service that contains some misc utilities for dealing with dates
	in the Eucllian system that powers their system with odd date codes
 */
services.service('DateService', function() {

	/*
		Takes todays date and returns a Eucllian Date code that can be used.

		@returns A date code that represents the current day of the week
	 */
    this.getDateCode = function() {
    	return "R";
		var currentDate = new Date();
		var codes = ['X', 'M', 'T', 'W', 'R', 'F', 'X'];
		return codes[currentDate.getDay()];
     };
});


services.service('LaurierService', function() {

	/*
		Returns an array of classrooms that are available throughout Laurier.

		@Returns 	An array of strings of the name of the buildings
	 */
	this.getRooms = function() {
		return [
		'Bricker Academic Building',
		'Dr. Alvin Woods Building',
		'Science Building',
		'Arts Building',
		'Schlegel Centre',
		'202 Regina Street',
		'Peters Building',
		'Seminary'
		];
	}


});