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
	$("#core-health-matrix table tr:nth-child(n+21)").hide();
	var restRows = $("#core-health-matrix table tbody tr").length - 20;
	$("#rest-row-number").text(restRows);

	$("#view-more-link").click(function(event) {
		/* Act on the event */
		$("#core-health-matrix table tr:nth-child(n+21)").toggle("slow", function(){
			$("#view-more-link .glyphicon").toggleClass("glyphicon-menu-down glyphicon-menu-up");

			if($("#view-more-link .glyphicon").hasClass('glyphicon-menu-up')) {
				$("#view-more-content").html('view the first <span id="rest-row-number">20</span> rows </span>');
			}
			else {
				$("#view-more-content").html('view the rest <span id="rest-row-number"></span> rows </span>');
				$("#rest-row-number").text(restRows);
			}
		});
		
	});
});