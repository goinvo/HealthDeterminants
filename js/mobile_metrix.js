$(document).ready(function() {

	$('.carousel').carousel();

	$.getJSON('health-determinants.json', function(data) {
	    console.log(data)
	    var matrixTemplate = $('#matrixTemplate').html();
	    var html = Mustache.render(matrixTemplate, data);
	      $('#mobile-matrix .carousel-inner').html(html);


	    $("#mobile-matrix .item:first-child").addClass('active');
	});
});