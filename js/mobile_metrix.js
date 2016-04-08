$(document).ready(function() {

	// switch graph view 
	$("#chart").show();
	$("#node").hide();
	drawTreemap();
	drawNodeGraph();
	$("#graph a").click(function(event) {
		/* Act on the event */
		$("#graph a.select").removeClass('select');
		$(this).addClass('select')
	});

	$("#drawTreemap").click(function(event) {
		/* Act on the event */
		$("#chart").show();
		$("#node").hide();
	});
	$("#drawNodeGraph").click(function(event) {
		/* Act on the event */
		$("#chart").hide();
		$("#node").show();
	});



	$('.carousel').carousel();

	$.getJSON('data/health-determinants.json', function(data) {
	    //console.log(data)
	    var matrixTemplate = $('#matrixTemplate').html();
	    var html = Mustache.render(matrixTemplate, data);
	      $('#mobile-matrix .carousel-inner').html(html);


	    $("#mobile-matrix .item:first-child").addClass('active');
	});

	// core health table
	$("#core-health-matrix table tr:nth-child(n+21)").hide();
	// var restRows = $("#core-health-matrix table tbody tr").length - 20;
	// $("#rest-row-number").text(restRows);

	$("#view-more-link").click(function(event) {
		/* Act on the event */
		$("#core-health-matrix table tr:nth-child(n+21)").toggle();
		$("#view-more-link .glyphicon").toggleClass("glyphicon-menu-down glyphicon-menu-up");

		if($("#view-more-link .glyphicon").hasClass('glyphicon-menu-up')) {
			$("#view-more-content").text('View less metrics ');
		}
		else {
			$("#view-more-content").text('View all metrics ');
		}
		
	});


	// start typing
	$('#core-health-matrix input').on('input', function() {
	    // do something
	    //console.log($(this).val())
	    $("#view-more-link").hide();
	    $("#core-health-matrix .input-group .glyphicon").show();
	    if($(this).val().trim() != "") {
	    	var count = 0;
		    for(var i = 1; i < $("#core-health-matrix table tr").length; i++) {
		    	if( $("#core-health-matrix table tr:nth-child("+ ( i + 1 ) +") td:first-child").text().toLowerCase().indexOf($(this).val().toLowerCase()) != -1 )	 {
		    		//console.log( $("#core-health-matrix table tr:nth-child("+ ( i + 1 ) +")  td:first-child").text() )
		    		$("#core-health-matrix table tr:nth-child("+ ( i + 1 ) +")").show();
		    	}
		    	else {
		    		//console.log("none")
		    		$("#core-health-matrix table tr:nth-child("+ ( i + 1 ) +")").hide();
		    		count ++;
		    	}
		    }
		    if(count == $("#core-health-matrix table tr").length - 1) {
		    	$("#core-health-matrix #no-data-text").show();
		    }
		    else {
		    	$("#core-health-matrix #no-data-text").hide();
		    }
	    }
	});

	// select and clean input
	$("#core-health-matrix input").keyup(function() {

	    if (!this.value) {
	        $("#core-health-matrix table tr").show();
	    	$("#core-health-matrix #no-data-text").hide();
	    	if($("#view-more-link .glyphicon").hasClass('glyphicon-menu-up')) {
	    		$("#view-more-link").show();
			}
			else {
				$("#core-health-matrix table tr:nth-child(n+21)").hide();
	    		$("#view-more-link").show();
			}
			$("#core-health-matrix .input-group .glyphicon").hide();
	    }

	});
	// click clear button
	$("#core-health-matrix .input-group .glyphicon").click(function(event) {
		/* Act on the event */
		$("#core-health-matrix input").val("");
		$("#core-health-matrix table tr").show();
    	$("#core-health-matrix #no-data-text").hide();
    	if($("#view-more-link .glyphicon").hasClass('glyphicon-menu-up')) {
    		$("#view-more-link").show();
		}
		else {
			$("#core-health-matrix table tr:nth-child(n+21)").hide();
    		$("#view-more-link").show();
		}
		$("#core-health-matrix .input-group .glyphicon").hide();
	});
	
});