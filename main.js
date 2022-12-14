d3.csv('driving.csv', d3.autoType).then(data=>{
  console.log('driving', data);

                                      // CREATING A SCATTERPLOT //
// Margin Convention
  const margin = ({top: 20, right: 20, bottom: 20, left: 50});
  const width = 660 - margin.left - margin.right;
  const height = 550 - margin.top - margin.bottom;

  // Create a SVG
  const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
  // Create x- and y-scales
  const xScale = d3
    .scaleLinear().nice()
    .domain([3500,10500])
    .range([0,600]);
  const yScale = d3
    .scaleLinear().nice()
    .domain([1.2, 3.4])
    .range([510,0]);
    
  // Create Axes
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .ticks(7);
  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat(d => "$" + `${d.toFixed(2)}`);
          
  svg.append("g")
    .attr("class", "axis x-axis")
    .call(xAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
    .attr("y2", -height)
    .attr("stroke-opacity", 0.1))
    .attr("transform", `translate(0, ${height})`);

  svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1));
     
  // Define a line path generator
  const line = d3
    .line()
    .x(d=>xScale(d.miles))
    .y(d=>yScale(d.gas));
  // Create a path
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2.5)
    .attr("d", line);

  // Add circles for data points
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('cx', d=>xScale(d.miles))
    .attr('cy', d=>yScale(d.gas))
    .attr('fill','white')
    .attr('stroke','black');

  // Generate labels for data points
  const label = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(${xScale(d.miles)},${yScale(d.gas)})`)

  label.append("text")
    .text(d=>d.year)
    .each(position)
    .call(halo);
      
  // Add an axis title
  svg.append("text")
    .attr('x', width-7)
    .attr('y', height-5)
    .attr('font-size','12px')
    .style("text-anchor", "end")
    .text("Miles per person per year");

  svg.append("text")
    .attr('x', 5)
    .attr('y', 5)
    .attr('font-size','12px')
    .style("text-anchor", "front")
    .text("Cost per gallon")
    .each(position)
    .call(halo);
      
  // Avoid overlaps between labels
  function position(d) {
    const t = d3.select(this);
      switch (d.side) {
        case "top":
          t.attr("text-anchor", "middle").attr("dy", "-0.7em");
          break;
        case "right":
          t.attr("dx", "0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "start");
          break;
        case "bottom":
          t.attr("text-anchor", "middle").attr("dy", "1.4em");
          break;
        case "left":
          t.attr("dx", "-0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "end");
          break;
      }
  }

  // Add white glows to the labels
  function halo(text) {
    text
      .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
  }
});