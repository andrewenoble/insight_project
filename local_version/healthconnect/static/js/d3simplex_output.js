/*
"comment_data_json" is bound to the DOM and holds 
the topic coordinates (x, y)
and the topic projections (r, e, p) 
for the comment entered by the user 
on the final page of index.html.
This global variable receives the output of model.py 
and is defined in output.html.
*/

var width = 643.5;
var height = 585;       

var container = d3.select("#d3")

var svg = container
    .append("svg")
        .style("width", width + "px")
        .style("height", height + "px");    

var g = svg.append("g");


g.append("text")
    .attr("x", -0.73 * width)             
    .attr("y", 0.51 * height)
    .attr("fill", "rgb(255, 93, 49)")
    .attr("text-anchor", "left")
    .style("font-size", "32px")
    .attr("transform", function(d) {
        return "rotate(-60)" 
    })
    .text("Research Discussion");

g.append("text")
    .attr("x", 0.31 * width)             
    .attr("y", -0.445 * height)
    .attr("fill", "rgb(155, 33, 232)")
    .attr("text-anchor", "left")
    .style("font-size", "32px")
    .attr("transform", function(d) {
        return "rotate(60)" 
    })
    .text("Emotional Support"); 

g.append("text")
    .attr("x", 0.60 * width)             
    .attr("y", 0.99 * height)
    .attr("fill", "rgb(49, 190, 255)")
    .attr("text-anchor", "left")
    .style("font-size", "32px")
    .text("Problem Solving");    

var dataset;
d3.csv("../static/data/coords_and_text.csv", function(data) { 

    dataset = data;

    dataset.forEach(function(d){ 
        d['x'] = +d['x']; 
        d['y'] = +d['y'];
        d['r'] = +d['r'];
        d['e'] = +d['e'];
        d['p'] = +d['p'];
    });

    var rgbs = [];
    var rgbs_user = [];    
    var i;

    for (i = 0; i < dataset.length; i++) {
        rgbs.push("rgb(" + 
        Math.round((dataset[i].r * 255 + dataset[i].e * 155 + dataset[i].p * 49 )) + "," + 
        Math.round((dataset[i].r * 93  + dataset[i].e * 33  + dataset[i].p * 190)) + "," + 
        Math.round((dataset[i].r * 49  + dataset[i].e * 232 + dataset[i].p * 255)) + ")");
    }                 

    rgbs_user.push("rgb(" + 
        Math.round((comment_data_json.r * 255 + comment_data_json.e * 155 + comment_data_json.p * 49 )) + "," + 
        Math.round((comment_data_json.r * 93  + comment_data_json.e * 33  + comment_data_json.p * 190)) + "," + 
        Math.round((comment_data_json.r * 49  + comment_data_json.e * 232 + comment_data_json.p * 255)) + ")");

    var xScale = d3.scaleLinear().domain([
        d3.min(dataset, function(d) { return d.x - 0.05;}), 
        d3.max(dataset, function(d) { return d.x + 0.05;})])
        .range([0, width]);

    var yScale = d3.scaleLinear().domain([
        d3.min(dataset, function(d) { return d.y - 0.05;}), 
        d3.max(dataset, function(d) { return d.y + 0.10;})])
        .range([height, 0]);      

    g.append("ellipse")
        .attr("cx", function(d) { return xScale(comment_data_json.x); })
        .attr("cy", function(d) { return yScale(comment_data_json.y); })
        .attr("rx", 80)
        .attr("ry", 80)
        .attr("fill", function(d, i) { return rgbs_user[0]; })
        .attr("opacity", 0.2);   

    g.append("ellipse")
        .attr("cx", function(d) { return xScale(comment_data_json.x); })
        .attr("cy", function(d) { return yScale(comment_data_json.y); })
        .attr("rx", 8)
        .attr("ry", 8)
        .attr("fill", "black")
        .attr("opacity", 0.6);    

    g.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .attr("r", 3.3)
            .attr("fill", function(d, i) { return rgbs[i]; })
            .attr("class", "data_points")
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
});


var zoom = d3.zoom()
    .scaleExtent([4 / 5, 200]) // SETS MIN (0.5x orig size) AND MAX (8x orig size) ZOOM 
    .translateExtent([
        [-0.5 * width, -0.5 * height], 
        [1.5 * width, 1.5 * height]])
    .on("zoom", zoomed); 

var tip = d3.tip()
  	.attr("class", "d3-tip")
    .offset([-5, 0])
    .html(function(d) { return d.text; });    

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .call(zoom);

g.transition().call(tip); 
svg.call(zoom);

function zoomed() {
    g.transition().duration(200).attr("transform", d3.event.transform);
    d3.selectAll("circle")
        .transition().duration(400)
        .attr("r", 3.3 / d3.event.transform.k);    
}      
