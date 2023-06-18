import React from "react";
import Slider from '@mui/material/Slider';
import {Row, Col} from 'react-bootstrap';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import '../App.css';


export default function SimArgs(props) {
    const mapGran = props.mapGran;
    const simArgs = props.args;
    const commitChangeMap = props.commitChangeMap;
    const commitChangeSim = props.commitChangeSim;

    return(
        <div id="simArgSection">
            <div className='simArgDiv'>
                Map Granularity
                <Slider 
                    marks={true}
                    min={10}
                    max={90}
                    step={10}
                    defaultValue={mapGran}
                    onChangeCommitted={commitChangeMap}
                    valueLabelDisplay="auto"
                    key={`slider-${mapGran}`}
                />
            </div>
            <div className='simArgDiv'>
                Input Granularity
                <Slider 
                    marks={true}
                    min={1}
                    max={10}
                    step={2}
                    defaultValue={simArgs.granularity}
                    onChangeCommitted={commitChangeSim}
                    valueLabelDisplay="auto"
                    key={`slider-${simArgs.granularity}`}
                    color="secondary"
                />
            </div>
            <div className='simArgDiv'>
                <Row>
                    <Col xs={6}>
                        <ToggleButtonGroup color="primary"> 
                            <ToggleButton className="toggle">Left</ToggleButton>
                            <ToggleButton>RIGHT</ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                    <Col xs={6}>
                        <ToggleButtonGroup color="primary">
                            <ToggleButton>LEFT</ToggleButton>
                            <ToggleButton>RIGHT</ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
            </div>
        </div>
    )
}