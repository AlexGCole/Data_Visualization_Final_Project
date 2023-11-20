
function updateBarVisualization(data) {

// Set dimensions for the SVG container
var margin = { top: 5, right: 50, bottom: 50, left: 70 },
    width = 1100 - margin.left - margin.right,
    height = 700;

//Pre-defined colors
var origcolor = "#74A5D9"
var changeColor = "#AEDFF7"; // Light gray color

// Clear existing SVG content to render changes dynamically
d3.select("#bar-graph svg").remove();

// Create an SVG container
var svg = d3
    .select("#bar-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Create tooltip
var tooltip = d3.select("#bar-graph")
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

// Capture when the mouse hovers
let barHover = e => {

    let hbar = d3.select(e.srcElement)
    hbar.attr("fill", changeColor)
    tooltip.style("visibility", "visible")
        .style("opacity", 1)
        .style("stroke", "black")
        .style("opacity", 1)

}

// Capture when the mouse moves
var mousemove = function(event, d) {
    tooltip
    .html(d.item + ": " + d.count)
    .style("left", (event.pageX + 20) + "px")
    .style("top", (event.pageY - 20) + "px");
}

//Capture when the mouse stops hovering
let barNoHover = e => {
    d3.select(e.srcElement).transition().attr("fill",origcolor)
    tooltip.style("visibility", "hidden")
        .style("opacity", 0)
        .style("stroke", "none")
        .style("opacity", 0.8)
}

//Count ItemsPurchased variable for bar values
let itemCounts = {};

data.forEach((row) => {
    const itemName = row.ItemPurchased;
    itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
    
});

// Convert the object to an array of objects for easier manipulation
let itemCountsArray = Object.entries(itemCounts).map(([item, count]) => ({ item, count }));

// Sort the array based on the item names
itemCountsArray.sort((a, b) => d3.ascending(a.item, b.item));

// X axis
var x = d3.scaleBand()
    .range([0, width])
    .domain(itemCountsArray.map(function(d) { return d.item; }))
    .padding(0.1);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("path, line")
    .style("fill", "none")
    .style("stroke", "white");

svg.selectAll(".tick text")
    .style("fill", "white")
    .attr("transform", "translate(-10,15)rotate(-45)");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 180])
    .range([height, 0]);

svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("path, line")
    .style("fill", "none") 
    .style("stroke", "white"); 

svg.selectAll(".tick text")
    .style("fill", "white");
        
svg.selectAll("mybar")
    .data(itemCountsArray)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.item); })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", origcolor)
    .on("mouseover", barHover)
    .on("mousemove", mousemove)
    .on("mouseout", barNoHover);
        

    
    }