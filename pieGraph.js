function updatePieVizualization (data) {

//Count ItemsPurchased variable for bar values
let categoryCounts = {};

data.forEach((row) => {
    const categoryName = row.Category;
    categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
});

// Convert the object to an array of objects for easier manipulation
let categoryCountsArray = Object.entries(categoryCounts).map(([item, count]) => ({ item, count }));

// Sort the array based on the item names
categoryCountsArray.sort((a, b) => d3.ascending(a.item, b.item));

// Set dimensions for the SVG container
var width = 357;
var height = 357;
var radius = Math.min(width, height - 50) / 2;
var margin = { top: 0, right: 20, bottom: 20, left: 20 };

//Pre-defined colors
var pieColor = d3.scaleOrdinal()
.domain(categoryCountsArray.map(d => d.item))
.range(["#9ACBED", "#7DB7DD", "#5FA2D0", "#4B8FC2", "#346EAD"]);
var pieGraphStroke = "#151929"

// Clear existing SVG content to render changes dynamically
d3.select("#pie-graph svg").remove();

// Create an SVG container
var svg = d3
    .select("#pie-graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2 + margin.top) + ")"); 
    
//Create tooltip
var tooltip = d3.select("#pie-graph")
.append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

//Capture when the mouse hovers
let pieHover = (event, d) => {
    d3.select(event.target).attr("fill", "#ffffff");
    tooltip.style("visibility", "visible")
      .style("opacity", 1)
      .html(d.count)
      .style("left", (event.pageX + 20) + "px")
      .style("top", (event.pageY - 20) + "px");

    // Change the font color of the sibling text element
    d3.select(event.target.parentNode)
            .select("text")
            .style("fill", "black");
}

// Capture when the mouse moves
var mousemove = function(event, d) {
    var hoveredCategory = categoryCountsArray.find(category => category.count === d.value);
    
    tooltip
        .html(hoveredCategory.item + ": " + d.value)
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 20) + "px");
}

//Capture when the mouse stops hovering
let pieNoHover = (event, d) => {
    d3.select(event.target).attr("fill", pieColor);
    tooltip.style("visibility", "hidden").style("opacity", 0);
  
    d3.select(event.target.parentNode).select("text")
      .style("fill", "white");
  };

// Create a pie chart
var pie = d3.pie();
var arc = d3.arc().innerRadius(75).outerRadius(radius);


// Create arcs and fill with data
var arcs = svg.selectAll("arc")
    .data(pie(categoryCountsArray.map(function(d) { return d.count; })))
    .enter()
    .append("g")
    .attr("class", "arc");

// Fill arcs with colors
arcs.append("path")
    .attr("d", arc)
    .attr("stroke", pieGraphStroke)
    .style("stroke-width", "4px")
    .attr("fill", pieColor)
    .on("mouseover", pieHover)
    .on("mousemove", mousemove)
    .on("mouseout", pieNoHover);

// Add text labels with percentages
arcs.append("text")
    .attr("transform", function (d) {
        var centroid = arc.centroid(d);
        return "translate(" + centroid + ")";
    })
    .attr("text-anchor", "middle")
    .text(function (d) {
        var percentage = ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100;
        return percentage.toFixed(1) + "%";
    })
    .style("font-size", "16px")
    .style("fill", "white")

}