import * as d3 from "d3";
import React, {useEffect, useRef, useMemo, useState} from "react";

export default function Graph(props) {
    const [graphList, setGraphList] = useState(props.graphs);

    const createGraph = () => {
        // data array will store datapoints for the selected graphs
        let data = [];
        let colors = ['#fcba03', "#9405fa", "#cc0808", "#3bc708"]
        // initializing data array to have the correct size and a tick value at each point.
        // TODO: Data tick values are not the corresponding simulation output ticks since simulation outputs have been shortened.
        props.data['speed_kmh'].forEach((value, tick) => {
            data[tick] = {tick: tick}
        })
        
        props.graphs.forEach((dataName) => {
            let values1 = props.data[dataName];
            values1.forEach((d, index) => {
                data[index][dataName] = d;
            });
        });
    

        var leftMargin = props.graphs.length * 37.5;
        // set the dimensions and margins of the graph
        var margin = { top: 30, right: 50, bottom: 50, left: leftMargin };

        // Get the width of the "graphBox" div
        var graphBox = document.getElementById('graphBox');
        var width = graphBox.clientWidth - margin.left - margin.right;
        var height = graphBox.clientHeight - margin.top - margin.bottom;

        // Clean up previous graph before creating a new one
        d3.select('#graphBox svg').remove();
        
        // append the svg object to the body of the page
        var svg = d3.select("#graphBox").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        
        var x = d3.scaleLinear().range([0, width]);
        x.domain(d3.extent(data, (d) => { return d.tick; }));
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        
        let graphNumber = 0;
        props.graphs.forEach((dataName) => {
            var color = colors[graphNumber];
            var y = d3.scaleLinear().range([height, 0]);
            y.domain([d3.min(data, (d) => {return d[dataName]}), d3.max(data, (d) => { return d[dataName]; })]);
            // Append the y2-axis to the far left and shift it over some distance
            let YAxis = svg.append("g")
                .attr("transform", `translate(-${graphNumber * 40}, 0)`)  // Move to the left and shift it by 20 units
                .call(d3.axisLeft(y));
    
            YAxis.selectAll("text")
                .style("fill", color);
            
                // add the Line
            var valueLine = d3.line()
                .x((d) => { return x(d.tick); })
                .y((d) => { return y(d[dataName]); });
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 1.5)
                .attr("d", valueLine)

            svg.selectAll("mydots")
                .data([data])
                .enter()
                .append("circle")
                .attr("cx", d => 130 * graphNumber) // Adjust the x position to stack horizontally
                .attr("cy", -20) // Keep the vertical position constant
                .attr("r", 7)
                .style("fill", color);
            // Add one dot in the legend for each name.
            svg.selectAll("mylabels")
                .data([data])
                .enter()
                .append("text")
                .attr("x", d => 130 * graphNumber + 13) // Adjust the x position to stack horizontally
                .attr("y", -20) // Keep the vertical position constant
                .style("fill", color)
                .text(dataName)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle");
            graphNumber++;       
        })

        // Tooltip element that will be shown on hover
        const hover_tooltip = d3.select("body").append("div")
        .attr("class", "hover_tooltip")
        .style("opacity", 0);

        // Define lines to create a crosshair that follows the mouse
        const hoverLineVertical = svg.append("line")
            .attr("class", "hover-line")
            .style("stroke", "#666")
            .style("stroke-width", "2px")
            .style("stroke-dasharray", "3,3")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", height)
            .style("opacity", 0);

        const hoverLineHorizontal = svg.append("line")
            .attr("class", "hover-line")
            .style("stroke", "#666")
            .style("stroke-width", "2px")
            .style("stroke-dasharray", "3,3")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", 0)
            .attr("y2", 0)
            .style("opacity", 0);

        // Add a transparent overlay to capture hover events
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => {
                // show tooltip and horizontal line
                hover_tooltip.style("opacity", 1);
                hoverLineVertical.style("opacity", 1);
                hoverLineHorizontal.style("opacity", 1);
            }) 
            .on("mouseout", () => {
                // make tooltip and horizontal line invisible
                hover_tooltip.style("opacity", 0);
                hoverLineVertical.style("opacity", 0);
                hoverLineHorizontal.style("opacity", 0);
            }) 
            .on("mousemove", (event) => {
                // Calculate the corresponding data point based on the mouse position
                const xPosition = d3.pointer(event)[0];
                const xPositionInverted = x.invert(xPosition);
                const i = d3.bisectLeft(data.map(d => d.tick), xPositionInverted, 1);
                const dataPoint = data[i - 1];

                // Update tooltip text and position
                let tooltip_str = "";
                Object.keys(dataPoint).forEach((key) => {
                    tooltip_str += key + ": " + (Math.round(dataPoint[key] * 100000) / 100000) + "<br>";
                });
                hover_tooltip.html(tooltip_str)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 30) + "px");

                // Update crosshair position
                const yPosition = d3.pointer(event)[1]; 
                hoverLineHorizontal.attr("y1", yPosition).attr("y2", yPosition);
                hoverLineVertical.attr("x1", xPosition).attr("x2", xPosition);
        });
    }

    useEffect(() => {
        // Clean up previous graph before creating a new one
        createGraph();

    }, [props.graphs]);

    return(<></>);
}