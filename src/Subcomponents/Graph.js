import * as d3 from "d3";
import React, {useEffect, useRef, useMemo, useState} from "react";

export default function Graph(props) {
    const [graphList, setGraphList] = useState(props.graphs);

    const createGraph = async () => {
        // data array will store datapoints for the selected graphs
        let data = [];
        let colors = ['#fcba03', "#9405fa", "#cc0808", "#3bc708"]
        // initializing data array to have the correct size and a tick value at each point.
        // TODO: Data tick values are not the corresponding simulation output ticks since simulation outputs have been shortened.
        props.data['speed_kmh'].forEach((value, tick) => {
            data[tick] = {tick: tick}
        })
        
        graphList.forEach((dataName) => {
            let values1 = props.data[dataName];
            values1.forEach((d, index) => {
                data[index][dataName] = d;
            });
        });
    

        var leftMargin = graphList.length * 37.5;
        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 50, bottom: 50, left: leftMargin };

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
        
        
        var x = d3.scaleLinear().range([0, width]);
        x.domain(d3.extent(data, (d) => { return d.tick; }));
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        
        let graphNumber = 0;
        graphList.forEach((dataName) => {
            var color = colors[graphNumber];
            var y = d3.scaleLinear().range([height, 0]);
            y.domain([d3.min(data, (d) => {return d[dataName]}), d3.max(data, (d) => { return d[dataName]; })]);
            // Append the y2-axis to the far left and shift it over some distance
            let YAxis = svg.append("g")
                .attr("transform", `translate(-${graphNumber * 37.5}, 0)`)  // Move to the left and shift it by 20 units
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
            graphNumber++;
        })
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