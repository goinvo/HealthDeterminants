$(document).ready(function() {

	$('.carousel').carousel();

	$.getJSON('health-determinants.json', function(data) {
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
		$("#core-health-matrix table tr:nth-child(n+21)").toggle("slow", function(){
			$("#view-more-link .glyphicon").toggleClass("glyphicon-menu-down glyphicon-menu-up");

			if($("#view-more-link .glyphicon").hasClass('glyphicon-menu-up')) {
				$("#view-more-content").html('view top <span id="rest-row-number">20</span> rows </span>');
			}
			else {
				$("#view-more-content").html('view all metrics</span>');
			}
		});
		
	});

	// typeahead
	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;

	    // an array that will be populated with substring matches
	    matches = [];

	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');

	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(strs, function(i, str) {
	      if (substrRegex.test(str)) {
	        matches.push(str);
	      }
	    });

	    cb(matches);
	  };
	};

	var coreLabels;
	$.ajax({
	    url: "core.csv",
	    async: false,
	    success: function (data) {
	        coreLabels = data.split('\n');
	        for(var i = 0; i < coreLabels.length; i++) {
	        	coreLabels[i].replace(/"/g, ' ');
	        	if(coreLabels[i].charAt(0)=='"') {
	        		coreLabels[i] = coreLabels[i].substring(1, coreLabels[i].length - 1);
	        	}
	        	if(coreLabels[i].charAt(coreLabels[i].length - 1)=='"') {
	        		coreLabels[i] = coreLabels[i].substring(0, coreLabels[i].length - 1);
	        	}
	        }
	        //console.log(coreLabels);

	        // call a function on complete 
	        $('#core-health-matrix .input-group .typeahead').typeahead({
			  hint: true,
			  highlight: true
			},
			{
			  name: 'corelabels',
			  source: substringMatcher(coreLabels),
			  limit: 10,
			  templates: {
			    empty: [
			      '<div class="empty-message">unable to find any record that match the current query</div>'
			    ]
			  }
			});
	    }
	});

	

	
});