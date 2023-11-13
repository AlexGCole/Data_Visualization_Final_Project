function updatePiePaymentVizualization (data) {

// Clear existing SVG content
d3.select("#pie-graph-payment svg").remove();

//Count ItemsPurchased variable for bar values
let paymentMethodCounts = {};

// Assuming the column containing items is named "ItemPurchased"
data.forEach((row) => {
    const paymentMethodName = row.PaymentMethod;
    paymentMethodCounts[paymentMethodName] = (paymentMethodCounts[paymentMethodName] || 0) + 1;
});

// Convert the object to an array of objects for easier manipulation
let paymentMethodCountsArray = Object.entries(paymentMethodCounts).map(([item, count]) => ({ item, count }));

// Sort the array based on the item names
paymentMethodCountsArray.sort((a, b) => d3.ascending(a.item, b.item));

// Set dimensions for the SVG container
var width = 357;
var height = 357;
var radius = Math.min(width, height - 50) / 2;
var margin = { top: 0, right: 20, bottom: 20, left: 20 }; // Add margin values

// Create an SVG container
var svg = d3.select("#pie-graph-payment")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2 + margin.top) + ")"); // Center the pie chart with top margin

//Create tooltip for hover
var tooltip = d3.select("#pie-graph-payment")
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

// Hover on function
let pieHover = (event, d) => {
    d3.select(event.target).attr("fill", "#ffffff"); // Adjust color as needed
    tooltip.style("visibility", "visible")
      .style("opacity", 1)
      .html(d.data.count)
      .style("left", (event.pageX + 20) + "px")
      .style("top", (event.pageY - 20) + "px");
}



// Capture when the mouse moves
var mousemove = function(event, d) {
    // Find the corresponding category for the hovered arc
    var hoveredPaymentMethod = paymentMethodCountsArray.find(category => category.count === d.value);
    tooltip
        .html(hoveredPaymentMethod.item + ": " + d.value)
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 20) + "px");
}

// Hover off function
let pieNoHover = (event, d) => {
    d3.select(event.target).attr("fill", color); // Restore original color
    tooltip.style("visibility", "hidden").style("opacity", 0);
  
    // Reset the font color of the text element
    d3.select(event.target.parentNode).select("text")
      .style("fill", null); // Reset to the default font color
  };

  //Define colors
    var color = d3.scaleOrdinal()
            .domain(paymentMethodCountsArray.map(d => d.item))
            .range(["#6ED4D2", "#5CBFC0", "#4AA9AF", "#39949F", "#2A7E8F", "#1C6980"]); // Shades of orange
    var pieGraphStroke = "#151929"

// Create a pie chart
var pie = d3.pie();
var arc = d3.arc().innerRadius(0).outerRadius(radius);


// Create arcs and fill with data
var arcs = svg.selectAll("arc")
    .data(pie(paymentMethodCountsArray.map(function(d) { return d.count; })))
    .enter()
    .append("g")
    .attr("class", "arc");

// Fill arcs with colors
arcs.append("path")
    .attr("d", arc)
    .attr("stroke", pieGraphStroke)
    .style("stroke-width", "4px")
    .attr("fill", color)
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
    .style("font-size", "18px");



}