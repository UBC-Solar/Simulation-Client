import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

class Stats extends Component {
    constructor(props) {
        super(props);
    }

    createGraph(arrayName) {
        const graphable_array = this.props.json[arrayName].map((element, key) => {
            return {"value": element};
        })
        return (
            <div>
                {arrayName}
                <LineChart width={400} height={400} data={graphable_array}>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" label={arrayName} />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis />
                    <YAxis />
                </LineChart>
            </div>
        );  
    }

    render() {
        let returnString = () => {
            let loadingString = "simulation running";
            let emptyString = "NO DATA..."
            if(this.props.loading){
                return <div>{loadingString}</div>;
            } else {
                if (this.props.json["empty"] === undefined){
                    return(
                        <div>
                            <ul>
                                <li>{"distance traveled: " + Math.round(this.props.json["distance_travelled"])}</li>
                                <li>{"time taken: " + Math.round(this.props.json["time_taken"])}</li>
                                <li>{"final SOC: " + Math.round(this.props.json["final_soc"])}</li>
                                <li>{this.createGraph("speed_kmh")}</li>
                                <li>{this.createGraph("distances")}</li>
                                <li>{this.createGraph("state_of_charge")}</li>
                                <li>{this.createGraph("influx_soc")}</li>
                            </ul>

                        </div>
                    );
                } else {
                    return <div>{emptyString}</div>;
                }
            }
        }
        
        return(
            <div>
                {returnString()}
            </div>
        );
    }
}

export default Stats;
