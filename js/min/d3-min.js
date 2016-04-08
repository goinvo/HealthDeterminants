var margin={top:24,right:0,bottom:0,left:0},width=1e3,height=600-margin.top-margin.bottom,formatNumber=d3.format(",d"),transitioning,x=d3.scale.linear().domain([0,width]).range([0,width]),y=d3.scale.linear().domain([0,height]).range([0,height]),treemap=d3.layout.treemap().children(function(t,n){return n?null:t._children}).sort(function(t,n){return t.value-n.value}).ratio(height/width*.5*(1+Math.sqrt(5))).round(!1),svg=d3.select("#chart").append("svg").attr("width",width+margin.left+margin.right).attr("height",height+margin.bottom+margin.top).style("margin-left",-margin.left+"px").style("margin.right",-margin.right+"px").append("g").attr("transform","translate("+margin.left+","+margin.top+")").style("shape-rendering","crispEdges"),grandparent=svg.append("g").attr("class","grandparent");grandparent.append("rect").attr("y",-margin.top).attr("width",width).attr("height",margin.top),grandparent.append("text").attr("x",6).attr("y",6-margin.top).attr("dy",".75em"),d3.json("data/data2.json",function(t){function n(t){t.x=t.y=0,t.dx=width,t.dy=height,t.depth=0}function e(t){return(t._children=t.children)?t.value=t.children.reduce(function(t,n){return t+e(n)},0):t.value}function r(t){t._children&&(treemap.nodes({_children:t._children}),t._children.forEach(function(n){n.x=t.x+n.x*t.dx,n.y=t.y+n.y*t.dy,n.dx*=t.dx,n.dy*=t.dy,n.parent=t,r(n)}))}function a(t){function n(t){if(!transitioning&&t){transitioning=!0;var n=a(t),r=e.transition().duration(750),d=n.transition().duration(750);x.domain([t.x,t.x+t.dx]),y.domain([t.y,t.y+t.dy]),svg.style("shape-rendering",null),svg.selectAll(".depth").sort(function(t,n){return t.depth-n.depth}),n.selectAll("text").style("fill-opacity",0),r.selectAll("text").call(i).style("fill-opacity",0),d.selectAll("text").call(i).style("fill-opacity",1),r.selectAll("rect").call(l),d.selectAll("rect").call(l),r.remove().each("end",function(){svg.style("shape-rendering","crispEdges"),transitioning=!1})}}grandparent.datum(t.parent).on("click",n).select("text").text(d(t));var e=svg.insert("g",".grandparent").datum(t).attr("class","depth"),r=e.selectAll("g").data(t._children).enter().append("g");return r.filter(function(t){return t._children}).classed("children",!0).on("click",n),r.selectAll(".child").data(function(t){return t._children||[t]}).enter().append("rect").attr("class","child").call(l),r.append("rect").attr("class","parent").call(l).append("title").text(function(t){return formatNumber(t.value)}),r.append("text").attr("dy",".75em").text(function(t){return t.name}).call(i),r}function i(t){t.attr("x",function(t){return x(t.x)+6}).attr("y",function(t){return y(t.y)+6})}function l(t){t.attr("x",function(t){return x(t.x)}).attr("y",function(t){return y(t.y)}).attr("width",function(t){return x(t.x+t.dx)-x(t.x)}).attr("height",function(t){return y(t.y+t.dy)-y(t.y)})}function d(t){return t.parent?d(t.parent)+" / "+t.name:t.name}n(t),e(t),r(t),a(t)});