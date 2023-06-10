
import React, { useState } from "react";
import { LineChart, Line, ReferenceArea, XAxis, YAxis } from "recharts";

import '../App.css';


const MIN_ZOOM = 5; // adjust based on your data
const DEFAULT_ZOOM = { x1: null, y1: null, x2: null, y2: null };
const CHART_WIDTH = 400;


const Normalize = (min, max, dataset) => {
  const range = max.x - min.x;
  const newData = dataset.map((element) => {
    let val = (element.x - min.x) / range;
    return ({
      x: element.x,
      y: element.y,
      norm: val * CHART_WIDTH,
    });
  });
  return newData;
}


export default function ZoomChart(props) {
    const raw = props.json[props.name];
    const data = raw.map((element, key) => {
        return(
            {
              x: key,
              y: element,
            }
        )
    });

  // data currently on the plot
  const [filteredData, setFilteredData] = useState(data);
  // zoom coordinates
  const [zoomArea, setZoomArea] = useState(DEFAULT_ZOOM);
  // flag if currently zooming (press and drag)
  const [isZooming, setIsZooming] = useState(false);
  // flag if zoomed in
  const isZoomed = (filteredData?.length !== data?.length);


  // reset the states on zoom out
  function handleZoomOut() {
    setFilteredData(data);
    setZoomArea(DEFAULT_ZOOM);
  }

  /**
   * Two possible events:
   * 1. Clicking on a dot(data point) to select
   * 2. Clicking on the plot to start zooming
   */
  function handleMouseDown(e) {
    setIsZooming(true);
    const { chartX, chartY } = e || {};

    setZoomArea({ x1: chartX, y1: chartY, x2: chartX, y2: chartY });
  }

  // Update zoom end coordinates
  function handleMouseMove(e) {
    if (isZooming) {
      setZoomArea((prev) => ({ ...prev, x2: e?.chartX, y2: e?.chartY }));
    }
    
  }

  // When zooming stops, update with filtered data points
  // Ignore if not enough zoom
  function handleMouseUp(e) {
    if (isZooming) {
      setIsZooming(false);
      let { x1, y1, x2, y2 } = zoomArea;

      // ensure x1 <= x2 and y1 <= y2
      if (x1 > x2) [x1, x2] = [x2, x1];
      if (y1 > y2) [y1, y2] = [y2, y1];

      if (x2 - x1 < MIN_ZOOM || y2 - y1 < MIN_ZOOM) {
        // console.log("zoom cancel");
      } else {
        // console.log("zoom stop");
        const norm = Normalize(filteredData[0], filteredData[filteredData.length-1], filteredData) 
        const dataPointsInRange = norm.filter(
          (d) => (d.norm) >= (x1) && (d.norm) <= (x2)
        );
        setFilteredData(dataPointsInRange);
        setZoomArea(DEFAULT_ZOOM);
      }
    }
  }

  return (
    <div className="plot-container">
      <div>{props.name}</div>
      {isZoomed && <button className="chartButton" onClick={handleZoomOut}>Zoom Out</button>}
      <LineChart
        width={CHART_WIDTH}
        height={CHART_WIDTH}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        data={filteredData}
      >
        <XAxis
          type="number"
          dataKey="x"
          domain={["auto", "auto"]}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={["auto", "auto"]}
          allowDecimals={true}
        />
        <Line 
            dataKey='y'
            stroke="#8884d8"
            animationDuration={300}
        />

      </LineChart>
    </div>
  );
}
