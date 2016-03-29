$(document).ready(function() {

	$('.carousel').carousel();

	$.getJSON('health-determinants.json', function(data) {
	    console.log(data)
	    var metrixTemplate = $('#metrixTemplate').html();
	    var html = Mustache.to_html(metrixTemplate, data);
	      $('#mobile-metrix .carousel-inner').html(html);


	    $("#mobile-metrix .item:first-child").addClass('active');
	});
});