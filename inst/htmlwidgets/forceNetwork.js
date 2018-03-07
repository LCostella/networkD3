
HTMLWidgets.widget({

  name: "forceNetwork",

  type: "output",

  initialize: function(el, width, height) {

    d3.select(el).append("svg")
        .attr("width", width)
        .attr("height", height);

    return d3.forceSimulation();
  },

  resize: function(el, width, height, force) {

    d3.select(el).select("svg")
        .attr("width", width)
        .attr("height", height);

    force.force("center", d3.forceCenter(width / 2, height / 2))
        .restart();
  },

  renderValue: function(el, x, force) {

  // Compute the node radius  using the javascript math expression specified
    function nodeSize(d) {
      
            if(options.nodesize){
                    return eval(options.radiusCalculation);

            }else{
                    return 6}

    }

   
  //var teste = getElementsByTagName(nodes.label);
  //console.log(teste);
//ct$source("https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.11/crossfilter.min.js");
  // var cf = crossfilter(nodes);
   //var label = cf.dimension(function(x){console.log(x.label);return x.label});
//
    
   
  //console.log(x);    
  alert("essa eh minha versao");
  var toggle = 0;
  var options = x.options;          
   // convert links and nodes data frames to d3 friendly format
  var links = HTMLWidgets.dataframeToD3(x.links);
  var nodes = HTMLWidgets.dataframeToD3(x.nodes);
  //console.log(nodes[0]);
  var infos = nodes[0].group;
  var split = infos.split("**");
  var rota = split[0]; // TRACEROUTE OF EACH PROBE
  var label = split[1]; //  NODE'S LABELS 
  var rota2 = split[2];  //var group = split[2]; // GROUP VALUES.
  if(rota2 != undefined)      
     rota2 = rota2.split('&&');
   
   label = label.split("&&");
   //group = group.split("::");
  
   rota = rota.split("&&");
  // console.log(rota2);
   //console.log(rota);
   
   for(var i = 0; i < nodes.length; i++){
     if(rota2 != undefined) 
      auxRota = rota[i] + "//" + rota2[i];
     else
      auxRota = rota[i];
      //console.log(auxRota);

      nodes[i].label = label[i];
      //nodes[i].group = group[i];
      nodes[i].rota = auxRota;
      
      nodes[i].toggle = 0; ///highlight control.
    }
    for( var i = 0; i < nodes.length; i++){
      
      if(nodes[i].rota != undefined)
        nodes[i].rota = nodes[i].rota.split("//");

      id = nodes[i].name;
      k = id.substring(0,1);
     // console.log(k);
      if(id.substring(0, 1) === "P") {
        nodes[i].group = "#00FF00";
        nodes[i].size = 7;
        nodes[i].fill = "#3182bd";
      }
      if(id.substring(0, 1) === "A"){
        nodes[i].group = "#EEE9E9";
        nodes[i].size = 7;
        nodes[i].fill = "#3182bd";
      }
      if(id.substring(0, 1) === "R"){
        nodes[i].group = "#FFC125";
        nodes[i].size = 9;
        nodes[i].fill = "#FFC125";
      }
      if(id.substring(0,1) ==="M"){
        nodes[i].group = "#FFC125";
        nodes[i].size = 7.8;
        nodes[i].fill = "black";
      }
    }
    //console.log(nodes[1].rota)


    console.log(nodes);




var nodeByName = d3.map(nodes, function(d) { return d.name; });

  links.forEach(function(d) {
    d.source = nodeByName.get(d.source);
    d.target = nodeByName.get(d.target);
  });
    
    function neighboring(a, b) {
      return links[a.index + "," + b.index];
    }

    // get the width and height
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    var color = eval(options.colourScale);

    // set this up even if zoom = F
    var zoom = d3.zoom();
  
    // create d3 force layout
 
    force
      .nodes(d3.values(nodes))
      .force("link", d3.forceLink(links).distance(options.linkDistance))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(options.charge))
      .on("tick", tick);

    force.alpha(1).restart();

      var drag = d3.drag()
        .on("start", dragstart)
        .on("drag", dragged)
        .on("end", dragended)
      function dragstart(d) {
        if (!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      function dragended(d) {
        if (!d3.event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

    // select the svg element and remove existing children
    var svg = d3.select(el).select("svg");
    svg.selectAll("*").remove();
    // add two g layers; the first will be zoom target if zoom = T
    //  fine to have two g layers even if zoom = F
    svg = svg
        .append("g").attr("class","zoom-layer")
        .append("g")

    // add zooming if requested
    if (options.zoom) {
      function redraw() {
        d3.select(el).select(".zoom-layer")
          .attr("transform", d3.event.transform);
      }
      zoom.on("zoom", redraw)
      if(toggle ==0){
        d3.select(el).select("svg")
        .attr("pointer-events", "all")
        .call(zoom)
         .on("dblclick.zoom", null);
      }
      else{ d3.select(el).select("svg")
        .attr("pointer-events", "all")
        .call(zoom);}
    } else {
      zoom.on("zoom", null);
    }
    



    // draw links
    var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", function(d) { return d.colour ; })
      //.style("stroke", options.linkColour)
      .style("opacity", options.opacity)
      .style("stroke-width", eval("(" + options.linkWidth + ")"))
      .on("mouseover", function(d) {
          d3.select(this)
            .style("opacity", 1);
      })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("opacity", options.opacity);
      });


    if (options.arrows) {
      link.style("marker-end",  function(d) { return "url(#arrow-" + d.colour + ")"; });

      var linkColoursArr = d3.nest().key(function(d) { return d.colour; }).entries(links);

      svg.append("defs").selectAll("marker")
          .data(linkColoursArr)
          .enter().append("marker")
            .attr("id", function(d) { return "arrow-" + d.key; })
            .attr("viewBox", "0, -5, 10, 10")
            .attr("refX", 0)
            .attr("markerWidth", 4)
            .attr("markerHeight", 4)
            .attr("orient", "auto")
            .style("fill", "context-fill")
            .style("fill", function(d) { return d.key; })
            .style("opacity", options.opacity)
          .append("path")
            .attr("d", "M0,-5 L10,0 L0,5");
    }

    // draw nodes

    var node = svg.selectAll(".node")
      .data(force.nodes())
      .enter().append("g")
      .attr("class", "node")
      .style("fill",function(d) { return d.fill; })
      .style("opacity", options.opacity)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click",connectedNodes)
      .on("dblclick",info)
      .call(drag);

    node.append("circle")
      .attr('id', function(d) {return d.name; } )
      //.attr("r", function(d){return nodeSize(d);})
      .attr("r", function(d){return d.size;})
      .style("stroke",  function(d) { return (d.group); })
      .style("opacity", options.opacity)
      .style("stroke-width", "4.0px");

    node.append("svg:text")
      .attr("class", "nodetext")
      .attr("dx", "0") ///POSICIONAMENTO DA LABEL
      .attr("dy", "-1.3em")
      .text(function(d) { return d.label })
      .style("font", options.fontSize + "px " + options.fontFamily)
      //.style("opacity", options.opacityNoHover)
      .style("pointer-events", "none");

 
    
    
    function tick() {
      node.attr("transform", function(d) {
        if(options.bounded){ // adds bounding box
            d.x = Math.max(nodeSize(d), Math.min(width - nodeSize(d), d.x));
            d.y = Math.max(nodeSize(d), Math.min(height - nodeSize(d), d.y));
            
           
        }
      
       if(d.label =="ROOTB"){
               //d.x = Math.max(nodeSize(d), Math.min(width / 2, d.x));
               //d.y = Math.max(nodeSize(d), Math.min(height/2, d.y));
               d.x =  width/2;
               d.y =  0;
               // d.x = 0;
               //d.y = 0;
            }  
        return "translate(" + d.x + "," + d.y + ")"});

      function idx(d, type) {
        var linkWidthFunc = eval("(" + options.linkWidth + ")");
			  var a = d.target.x - d.source.x;
			  var b = d.target.y - d.source.y;
			  var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  			if (type == "x1") return (d.source.x + ((nodeSize(d.source) * a) / c));
  			if (type == "y1") return (d.source.y + ((nodeSize(d.source) * b) / c));
  			if (options.arrows) {
  			  if (type == "x2") return (d.target.x - ((((5 * linkWidthFunc(d)) + nodeSize(d.target)) * a) / c));
  			  if (type == "y2") return (d.target.y - ((((5 * linkWidthFunc(d)) + nodeSize(d.target)) * b) / c));
  			} else {
  			  if (type == "x2") return (d.target.x - ((nodeSize(d.target) * a) / c));
  			  if (type == "y2") return (d.target.y - ((nodeSize(d.target) * b) / c));
  			}
		  }

      link
        .attr("x1", function(d) { return idx(d, "x1"); })
        .attr("y1", function(d) { return idx(d, "y1"); })
        .attr("x2", function(d) { return idx(d, "x2"); })
        .attr("y2", function(d) { return idx(d, "y2"); });

  
    }


  
function connectedNodes(d) {
  
       if (d.toggle == 0) {
        //Reduce the opacity of all but the neighbouring nodes to 0.3.
        
        for(i =0; i < nodes.length; i++ ){
           console.log(d.rota[i]);
            d3.select("#" +nodes[i].name).transition()
                .duration(750)
                .style("opacity", 0.6);

        }

        d3.select("#" +d.name).transition()
                .duration(750)
                .style("opacity", "1")
                .style("fill", "red"); 

       if(d.rota != undefined){
        for( i = 0; i < d.rota.length; i++){
            console.log(d.rota[i]);
             d3.select("#" +d.rota[i]).transition()
                .duration(750)
                .style("opacity", "1")
                .style("fill", "red");    
          }
        } 
        d.toggle = 1;


    }else {
        //Restore everything back to normal
        if(d.rota != undefined){
           d3.select("#" + d.name).transition()
                .duration(750)
                .style("opacity", "1")
                .style("fill", "#3182bd");  
        for( i = 0; i <= d.rota.length; i++){
             d3.select("#" + d.rota[i]).transition()
                .duration(750)
                .style("opacity", "1")
                .style("fill", "#3182bd");  
          }
        } 
        d.toggle = 0;

        for (i = 0; i <= nodes.length; i++){
        		if(nodes[i].toggle == 1){
        			nodes[i].toggle = 0;
        			connectedNodes(nodes[i]);
        		}
        
        }

    }


}
$( "#v4" ).dblclick(function() {
    for(i =0; i < nodes.length; i++ ){
            nodes[i].toggle = 0;
            d3.select("#" +nodes[i].name).transition()
                .duration(750)
                .style("opacity", "1")
                .style("fill", "#3182bd");

        }


});
$( "#v6" ).dblclick(function() {
  for(i =0; i < nodes.length; i++ ){
            nodes[i].toggle = 0;
            d3.select("#" +nodes[i].name).transition()
                .duration(750)
                .style("opacity", "1")
                .style("fill", "#3182bd");

        }

});

    function mouseover(d) {
 
      // unfocus non-connected links and nodes
      //if (options.focusOnHover) {
      //var unfocusDivisor = 4;

        //link.transition().duration(200)
        //  .style("opacity", function(l) { return d != l.source && d != l.target ? +options.opacity / unfocusDivisor : +options.opacity });

        //node.transition().duration(200)
          //.style("opacity", function(o) { return d.index == o.index || neighboring(d, o) ? +options.opacity : +options.opacity / unfocusDivisor; });
      
      
     /// d3.select(this).select("circle").transition()
        //.duration(750)
      
        //.style("stroke-width","3.5px")
        //.style("stroke", "#ff0000")
      
        //.attr("r", function(d){return nodeSize(d)+5;})
     
      //d3.select(this).select("text").transition()
        //.duration(750)
        //.attr("x", 13)
        //.style("stroke-width", ".5px")
        //.style("font", options.TextSize + "px ")
        //.style("opacity", 1);
    }

    function mouseout() {
      //node.style("opacity", +options.opacity);
      //link.style("opacity", +options.opacity);
      //d3.selectAll("circle").transition()
        //.duration(750)
        //.style("fill", function(d) { return color(d.group); })
        
      //d3.select(this).select("circle").transition()
       // .duration(750)
        //.style("stroke-width","0px")
        
        //.attr("r", function(d){return nodeSize(d);});
     // d3.select(this).select("text").transition()
       // .duration(1250)
        //.attr("x", 0)
        //.style("font", options.fontSize + "px ")
        //.style("opacity", options.opacityNoHover);
    }

    function info(d) {
      var send = [d.label,d.name]
       Shiny.onInputChange("mydata", send);
       return eval(options.clickAction)
  
    } 
   
    // add legend option
    if(options.legend){
        var legendRectSize = 18;
        var legendSpacing = 4;
        var legend = svg.selectAll('.legend')
          .data(color.domain())
          .enter()
          .append('g')
          .attr('class', 'legend')
          .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = legendRectSize;
            var vert = i * height+4;
            return 'translate(' + horz + ',' + vert + ')';
          });

        legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color)
          .style('stroke', color);

        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { return d; });
    }
    
   
    //------------- MY FUNCTIONS: -------------------------------------------------------
      
    function rota(d) {
      
      for( i= 0; i < d.rota.length; i++)
      {
       alert("#" +d.rota[i]);
       d3.select("#" +d.rota[i]).transition()
          .duration(750)
          .style("fill", "red");  
        
      }
    }
    
     

    
    //----------------------------------------------------------------------------------
    

    // make font-family consistent across all elements
    d3.select(el).selectAll('text').style('font-family', options.fontFamily);
  },
});
