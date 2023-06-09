import React, { Component } from 'react';
import ZoomChart from './ZoomChart'

import '../App.css';

class Stats extends Component {
    createGraph(arrayName) {
        return(
            <ZoomChart name={arrayName} json={this.props.json}/>  
        )
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
                        <div id="statDiv">
                            <ul className="statUL">
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
