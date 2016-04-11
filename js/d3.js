//pie chart visualization d3
function drawNodeGraph() {
  var diameter = 1360;
  var padding = 180;

  var tree = d3.layout.tree()
      .size([360, diameter / 2 - 120])
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  var svg = d3.select("#node").append("svg")
      .attr("width", diameter + padding*2)
      .attr("height", diameter + padding*2)
      .append("g")
      .attr("transform", "translate(" + ( diameter / 2 + padding ) + "," + ( diameter / 2 + padding ) + ")");

  d3.json("data/health-determinants.json", function(error, root) {
    if (error) throw error;

    var nodes = tree.nodes(root),
        links = tree.links(nodes);

    var link = svg.selectAll(".link")
        .data(links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

    var node = svg.selectAll(".node")
        .data(nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

    node.append("circle")
        .attr("r", 4.5);

    node.append("text")
        .attr("class", "nodeText") //attaching a class to the text
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { return d.name; });


  });
}



// treemap
function drawTreemap() {
  var margin = {top: 24, right: 0, bottom: 0, left: 0},
      width = 1000,
      height = 600 - margin.top - margin.bottom,
      formatNumber = d3.format(",d"),
      transitioning;

  var x = d3.scale.linear()
      .domain([0, width])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, height])
      .range([0, height]);

  var treemap = d3.layout.treemap()
      .children(function(d, depth) { return depth ? null : d._children; })
      .sort(function(a, b) { return a.value - b.value; })
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .round(false);

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("shape-rendering", "crispEdges");

  var grandparent = svg.append("g")
      .attr("class", "grandparent");

  grandparent.append("rect")
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", margin.top);

  grandparent.append("text")
      .attr("x", 0)
      .attr("y", 0 - margin.top)
      .attr("dy", "1em");

  d3.json("data/dataForTreemap.json", function(root) {
    initialize(root);
    accumulate(root);
    layout(root);
    display(root);

    function initialize(root) {
      root.x = root.y = 0;
      root.dx = width;
      root.dy = height;
      root.depth = 0;
    }

    // Aggregate the values for internal nodes. This is normally done by the
    // treemap layout, but not here because of our custom implementation.
    // We also take a snapshot of the original children (_children) to avoid
    // the children being overwritten when when layout is computed.
    function accumulate(d) {
      return (d._children = d.children)
          ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
          : d.value;
    }

    // Compute the treemap layout recursively such that each group of siblings
    // uses the same size (1×1) rather than the dimensions of the parent cell.
    // This optimizes the layout for the current zoom state. Note that a wrapper
    // object is created for the parent node for each group of siblings so that
    // the parent’s dimensions are not discarded as we recurse. Since each group
    // of sibling was laid out in 1×1, we must rescale to fit using absolute
    // coordinates. This lets us use a viewport to zoom.
    function layout(d) {
      if (d._children) {
        treemap.nodes({_children: d._children});
        d._children.forEach(function(c) {
          c.x = d.x + c.x * d.dx;
          c.y = d.y + c.y * d.dy;
          c.dx *= d.dx;
          c.dy *= d.dy;
          c.parent = d;
          layout(c);
        });
      }
    }

    function display(d) {
      grandparent
          .datum(d.parent)
          .on("click", transition)
        .select("text")
          .text(name(d));

      var g1 = svg.insert("g", ".grandparent")
          .datum(d)
          .attr("class", "depth");

      var g = g1.selectAll("g")
          .data(d._children)
        .enter().append("g");

      g.filter(function(d) { return d._children; })
          .classed("children", true)
          .on("click", transition);

      g.selectAll(".child")
          .data(function(d) { return d._children || [d]; })
        .enter().append("rect")
          .attr("class", "child")
          .call(rect);

      g.append("rect")
          .attr("class", "parent")
          .call(rect)
        .append("title")
          .text(function(d) { return formatNumber(d.value); });

      g.append("text")
          .attr("dy", "15px")
          .attr("dx", "5px")
          .attr("font-size", "16px")
          //.attr("fill", "#324E77")
          .text(function(d) { return d.name; })
          .call(text);
        g.append("text")
          .attr("dy", "35px")
          .attr("dx", "5px")
          .attr("font-size", "14px")
          .text(function(d) { if(d.source) return "source: ";})
          .call(text);

        g.append("text")
            .attr("dy", "55px")
          .attr("dx", "5px")
          .attr("font-size", "14px")
          .text(function(d) { return d.source; })
          .call(text);
        g.append("text")
            .attr("dy", "75px")
          .attr("dx", "5px")
          .attr("font-size", "14px")
          .text(function(d) { return d.source2; })
          .call(text);

          g.append("text")
            .attr("dy", "95px")
          .attr("dx", "5px")
          .attr("font-size", "14px")
          .text(function(d) { return d.source3; })
          .call(text);

          g.append("text")
            .attr("dy", "115px")
          .attr("dx", "5px")
          .attr("font-size", "14px")
          .text(function(d) { return d.source4; })
          .call(text);

      function transition(d) {
        if (transitioning || !d) return;
        transitioning = true;

        var g2 = display(d),
            t1 = g1.transition().duration(750),
            t2 = g2.transition().duration(750);

        // Update the domain only after entering new elements.
        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);

        // Enable anti-aliasing during the transition.
        svg.style("shape-rendering", null);

        // Draw child nodes on top of parent nodes.
        svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

        // Fade-in entering text.
        g2.selectAll("text").style("fill-opacity", 0);

        // Transition to the new view.
        t1.selectAll("text").call(text).style("fill-opacity", 0);
        t2.selectAll("text").call(text).style("fill-opacity", 1);
        t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);

        // Remove the old node when the transition is finished.
        t1.remove().each("end", function() {
          svg.style("shape-rendering", "crispEdges");
          transitioning = false;
        });
      }

      return g;
    }

    function text(text) {
      text.attr("x", function(d) { return x(d.x) + 6; })
          .attr("y", function(d) { return y(d.y) + 6; });
    }
    
    function rect(rect) {
      var color = d3.scale.category20c();

      rect.attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
          .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
         // .attr("fill", function(d) { return d.parent ? color(d.name) : null; });
    }

    function name(d) {
      return d.parent
          ? name(d.parent) + " / " + d.name
          : d.name;
    }
  });


}




// horizontal tree node
function drawHorizontalTree() {
    var width = 800,
    height = 2000;

var cluster = d3.layout.cluster()
    .size([height, width - 160]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#horizontal-tree").append("svg")
    .attr("width", 1000)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(50,0)");

d3.json("data/dataForTreemap.json", function(error, root) {
  if (error) throw error;

  var nodes = cluster.nodes(root),
      links = cluster.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 4.5);

  node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });
});

d3.select(self.frameElement).style("height", height + "px");
    
}