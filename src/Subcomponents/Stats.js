import React, { Component } from 'react';
import ZoomChart from './ZoomChart'
import Graph from './Graph'
import secondsToDhms from "../HelperFunctions/TimeString"

import '../App.css';
import loading from "../Images/loading.gif"
import MultiSelect from './MultiSelect';

class Stats extends Component {
    createGraph(arrayName) {
        return(
            <ZoomChart name={arrayName} json={this.props.json}/>  
        )
    }

    render() {
        let returnString = () => {
            let emptyString = "NO DATA..."
            if(this.props.loading){
                return <img alt='loading' style={{width: '75px', height: '75px', marginTop: '375px'}} src={loading}/>
            } else {
                if (this.props.json["empty"] === undefined){
                    return(
                        <div id="statDiv">
                            <div id="graphBox">
                                <Graph data={this.props.json}/>
                            </div>

                        </div>
                    );
                } else {
                    return <div>{emptyString}</div>;
                }
            }
        }
        
        return(
            <div>
                <MultiSelect Select={this.props.Select} handleChange={this.props.handleChange}/>
                {returnString()}
            </div>
        );
    }
}

export default Stats;
