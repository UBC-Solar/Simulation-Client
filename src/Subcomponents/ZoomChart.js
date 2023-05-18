import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis,ReferenceArea } from 'recharts';


const initialState = {
    data: this.props.json[this.props.name],
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    top: "dataMax+1",
    bottom: "dataMin-1",
    top2: "dataMax+20",
    bottom2: "dataMin-20",
    animation: true
};

class ZoomChart extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }
    getAxisYDomain = (from, to, ref, offset) => {
        const refData = this.state.data.slice(from - 1, to);
        let [bottom, top] = [refData[0][ref], refData[0][ref]];
        refData.forEach(d => {
            if (d[ref] > top) top = d[ref];
            if (d[ref] < bottom) bottom = d[ref];
        });
      
        return [(bottom | 0) - offset, (top | 0) + offset];
    };

    zoom() {
        let { refAreaLeft, refAreaRight, data } = this.state;

        if (refAreaLeft === refAreaRight || refAreaRight === "") {
            this.setState(() => ({
                refAreaLeft: "",
                refAreaRight: ""
            }));
            return;
        }
    
        // xAxis domain
        if (refAreaLeft > refAreaRight)
            [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    
        // yAxis domain
        const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, "cost", 1);
        const [bottom2, top2] = getAxisYDomain(
            refAreaLeft,
            refAreaRight,
            "impression",
            50
        );
    
        this.setState(() => ({
            refAreaLeft: "",
            refAreaRight: "",
            data: data.slice(),
            left: refAreaLeft,
            right: refAreaRight,
            bottom,
            top,
            bottom2,
            top2
        }));
    }
    
    zoomOut() {
        this.setState(({ data }) => ({
            data: data.slice(),
            refAreaLeft: "",
            refAreaRight: "",
            left: "dataMin",
            right: "dataMax",
            top: "dataMax+1",
            top2: "dataMax+50",
            bottom: "dataMin"
        }));
    }
    
    render(){
        const {
            data,
            left,
            right,
            refAreaLeft,
            refAreaRight,
            top,
            bottom,
            top2,
            bottom2
          } = this.state;

        const graphable_array = this.props.json[arrayName].map((element, key) => {
            return {"value": element};
        })
        return (
            <div>
                <div className="graphTitle">{arrayName}</div>
                <button className="btn update" onClick={this.zoomOut.bind(this)}>
                    Zoom Out
                </button>
                <LineChart
                    width={400}
                    height={400}
                    data={graphable_array}
                    onMouseDown={e => this.setState({ refAreaLeft: e.activeLabel })}
                    onMouseMove={e => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
                    onMouseUp={this.zoom.bind(this)}
                 >
                    <CartesianGrid stroke="#ccc" />
                    <XAxis
                        allowDataOverflow={true}
                        domain={[left, right]}
                        type="number"
                    />
                    <YAxis
                        allowDataOverflow={true}
                        domain={[bottom, top]}
                        type="number"
                        yAxisId="1"
                    />

                    <Line
                        yAxisId="1"
                        type="natural"
                        dataKey="value"
                        stroke="#8884d8"
                        animationDuration={300}
                    />

                    {
                        refAreaLeft && refAreaRight ? (
                        <ReferenceArea
                            yAxisId="1"
                            x1={refAreaLeft}
                            x2={refAreaRight}
                            strokeOpacity={0.3}
                        />) : null
                    }
                </LineChart>
            </div>
        );
    }
}

export default Stats;