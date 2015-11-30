<!DOCTYPE html>
<meta charset="utf-8">
<title>Double Input Test</title>

<p>
  <label for="nHeight" 
         style="display: inline-block; width: 240px; text-align: right">
         height = <span id="nHeight-value">…</span>
  </label>
  <input type="range" min="1" max="280" id="nHeight">
</p>

<p>
  <label for="nWidth" 
         style="display: inline-block; width: 240px; text-align: right">
         width = <span id="nWidth-value">…</span>
  </label>
  <input type="range" min="1" max="400" id="nWidth">
</p>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script>

var width = 600;
var height = 300;
 
var holder = d3.select("body")
      .append("svg")
      .attr("width", width)    
      .attr("height", height); 

// draw a rectangle
holder.append("rect")
    .attr("x", 300)
    .attr("y", 150)
    .style("fill", "none")
    .style("stroke", "blue")
    .attr("height", 150) 
    .attr("width", 200);

// read a change in the height input
d3.select("#nHeight").on("input", function() {
  updateHeight(+this.value);
});

// read a change in the width input
d3.select("#nWidth").on("input", function() {
  updateWidth(+this.value);
});

// update the values
updateHeight(150);
updateWidth(100);

// Update the height attributes
function updateHeight(nHeight) {

  // adjust the text on the range slider
  d3.select("#nHeight-value").text(nHeight);
  d3.select("#nHeight").property("value", nHeight);

  // update the rectangle height
  holder.selectAll("rect") 
    .attr("y", 150-(nHeight/2)) 
    .attr("height", nHeight); 
}

// Update the width attributes
function updateWidth(nWidth) {

  // adjust the text on the range slider
  d3.select("#nWidth-value").text(nWidth);
  d3.select("#nWidth").property("value", nWidth);

  // update the rectangle width
  holder.selectAll("rect")
    .attr("x", 300-(nWidth/2)) 
    .attr("width", nWidth);
}

</script>