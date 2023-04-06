import React, { Component } from 'react';

class App extends Component {
    constructor(props) {
        super(props);
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
                        <ul>
                            <li>{"distance traveled: " + Math.round(this.props.json["distance_travelled"])}</li>
                            <li>{"time taken: " + Math.round(this.props.json["time_taken"])}</li>
                            <li>{"final SOC: " + Math.round(this.props.json["final_soc"])}</li>
                        </ul>   
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

export default App;
