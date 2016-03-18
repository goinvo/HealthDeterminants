var clickMetrics = document.getElementById("1");

clickMetrics.onclick = function(){
	if (clickMetrics.style.fontWeight !== "bold") {
		clickMetrics.style.fontWeight = "bold";
	} else {
		clickMetrics.style.fontWeight = "normal";
	}
}

// document.getElementByClass("node").onclick = function(){
// 	alert("2");
// }
// $("g.node").click(function(){
// 	console.log("aaaaaaaaa")
// });
