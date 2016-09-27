// "comment_data_json" holds the topic coordinates (x, y)
// and the topic projections (r, e, p) for the comment 
// entered by the user on the final page of index.html.
// This global variable receives the output of model.py 
// and is defined in output.html.

var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height");

var dataset;                    

d3.csv("../static/data/doc_symplex_coord_plus_topic_fracs.csv", function(data) { 

dataset = data;

dataset.forEach(function(d){ 
    d['x'] = +d['x']; 
    d['y'] = +d['y'];
    d['r'] = +d['r'];
    d['e'] = +d['e'];
    d['p'] = +d['p']; 
})

var rgbs = [];
var rgbs_user = [];
var text, i;

for (i = 0; i < dataset.length; i++) {
    rgbs.push("rgb(" + 
        Math.round(dataset[i].r * 255) + "," + 
        Math.round(dataset[i].e * 255) + "," + 
        Math.round(dataset[i].p * 255) + ")");
}                  

rgbs_user.push("rgb(" + 
    Math.round(comment_data_json.r * 255) + "," + 
    Math.round(comment_data_json.e * 255) + "," + 
    Math.round(comment_data_json.p * 255) + ")");              

var g = svg.append("g");

var xScale = d3.scaleLinear().domain([
    d3.min(dataset, function(d) { return d.x - 0.05;}), 
    d3.max(dataset, function(d) { return d.x + 0.05;})])
    .range([0, width]);

var yScale = d3.scaleLinear().domain([
    d3.min(dataset, function(d) { return d.y - 0.05;}), 
    d3.max(dataset, function(d) { return d.y + 0.10;})])
    .range([height, 0]);       

g.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.x); })
    .attr("cy", function(d) { return yScale(d.y); })
    .attr("r", 2)
    .attr("fill", function(d, i) { return rgbs[i]; })
    .attr("opacity", 0.6);
    //.on("mouseover", function() {
    //  d3.select(this)
    //    .attr("fill", "orange");
    //});
    //.on("click"), function(d) {
    //  console.log(d);
    //};
    //.on("mouseover", mouseover)
    //.on("mouseout", mouseover)
    //.append("title").text(function() {return "Hi"; });d

g.append("circle")
    .attr("cx", function(d) { return xScale(comment_data_json.x); })
    .attr("cy", function(d) { return yScale(comment_data_json.y); })
    .attr("r", 20)
    .attr("fill", function(d, i) { return rgbs_user[0]; })
    .attr("opacity", 0.3);
        
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all") // THIS MAKES CATCHING ANY MOUSEOVER EVENTS ABOVE IMPOSSIBLE!!!!!!!!!!!!!
    .on("click", function(d) {
    console.log("a");
    })
    .call(d3.zoom()
        .scaleExtent([1 / 2, 8]) // SETS MIN (0.5x orig size) AND MAX (4x orig size) ZOOM 
        .on("zoom", function() {
            g.attr("transform", d3.event.transform);
        })); 

function zoomed() {
g.attr("transform", d3.event.transform);
}

g.append("text")
    .attr("x", -0.73 * width)             
    .attr("y", 0.51 * height)
    .attr("fill", "rgb(255,0,0)")
    .attr("text-anchor", "left")
    .style("font-size", "32px")
    .attr("transform", function(d) {
        return "rotate(-60)" 
    })
    .text("Research Discussion");

g.append("text")
    .attr("x", 0.31 * width)             
    .attr("y", -0.445 * height)
    .attr("fill", "rgb(0,255,0)")
    .attr("text-anchor", "left")
    .style("font-size", "32px")
    .attr("transform", function(d) {
        return "rotate(60)" 
    })
    .text("Emotional Support"); 

g.append("text")
    .attr("x", 0.63 * width)             
    .attr("y", 0.99 * height)
    .attr("fill", "rgb(0,0,255)")
    .attr("text-anchor", "left")
    .style("font-size", "32px")
    .text("Problem Solving");  

});
