$(document).ready(function() {
	$.getJSON('health-determinants.json', function(data) {
	    console.log(data)
	});
});