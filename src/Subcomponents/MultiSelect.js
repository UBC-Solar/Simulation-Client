import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import React from 'react';
import '../App.css';

export default function MultiSelect(props) {

    const handleChange = props.handleChange;
    const control = props.Select;

    return (
        <div>
          <FormControl className="selectDiv" sx={{ m: 1, minWidth: 200, marginTop: 3, marginBottom: 0 }} size="large">
            <InputLabel sx={{color: "white"}} id="demo-simple-select-label">View Graph</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              sx={{ 
                color: "white",
                '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                },
                '.MuiSvgIcon-root ': {
                    fill: "white !important",
                }
             }}
              value={control}
              label="Graph To Display"
              onChange={handleChange}
            >
              <MenuItem value="SOC">State of Charge</MenuItem>
              <MenuItem value="Speed">Speed</MenuItem>
              <MenuItem value="Distances">Distances</MenuItem>
            </Select>
          </FormControl>
        </div>
      );
}