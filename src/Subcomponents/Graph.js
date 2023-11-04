import * as d3 from "d3";
import React, {useEffect, useRef, useMemo, useState} from "react";

export default function Graph(props) {
    const createGraph = async () => {
        console.log("testing");
        console.log(props.data)
            let values1 = props.data['speed_kmh'];
            let tick = 0;
            let data = [];
            values1.forEach((d) => {
                const dataPoint = {
                    tick: tick++,
                    speed: d,
                }
                data.push(dataPoint);
            });
            let values2 = props.data['state_of_charge'];
            values2.forEach((p, index) => {
                data[index].soc = p;
            })
            console.log(data)

            // set the dimensions and margins of the graph
            var margin = { top: 20, right: 50, bottom: 50, left: 70 };

            // Get the width of the "graphBox" div
            var graphBox = document.getElementById('graphBox');
            var width = graphBox.clientWidth - margin.left - margin.right;
            var height = graphBox.clientHeight - margin.top - margin.bottom;

            // append the svg object to the body of the page
            var svg = d3.select("#graphBox").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            // Add X axis and Y axis
            var x1 = d3.scaleLinear().range([0, width]);
            var y1 = d3.scaleLinear().range([height, 0]);
            x1.domain(d3.extent(data, (d) => { return d.tick; }));
            y1.domain([0, d3.max(data, (d) => { return d.speed; })]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x1));
            svg.append("g")
                .call(d3.axisLeft(y1));
            
            var y2 = d3.scaleLinear().range([height, 0]);
            y2.domain([0, d3.max(data, (d) => { return d.soc; })]);
            // Append the y2-axis to the far left and shift it over some distance
            let YAxis2 = svg.append("g")
                .attr("transform", `translate(-30, 0)`)  // Move to the left and shift it by 20 units
                .call(d3.axisLeft(y2));

            YAxis2.selectAll("text")
                .style("fill", "#fcba03");

            // add the Line
            var valueLine = d3.line()
                .x((d) => { return x1(d.tick); })
                .y((d) => { return y1(d.speed); });
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", valueLine)
    }

    useEffect(() => {
        createGraph();
        return () => {
            // Cleanup code to remove the SVG element
            d3.select('#graphBox svg').remove();
          };
      }, []);
      
    return(<></>);
}