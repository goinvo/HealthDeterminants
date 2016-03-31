$(document).ready(function() {

	$('.carousel').carousel();

	$.getJSON('health-determinants.json', function(data) {
	    console.log(data)
	    var matrixTemplate = $('#matrixTemplate').html();
	    var html = Mustache.render(matrixTemplate, data);
	      $('#mobile-matrix .carousel-inner').html(html);


	    $("#mobile-matrix .item:first-child").addClass('active');
	});

	// core health table
	$("#core-health-table tr:nth-child(n+21)").hide();
});