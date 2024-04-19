import React, { useEffect } from "react";
import PropTypes from "prop-types";
const Calendar = () => {

    //this gets tile background color, more red = more events scheduled during time


    /**
     * TODO: fetch data here when API is complete
     * for now use this example
    */
    let calData = {
        "Sunday": Array.from({ length: 96 }, () => Math.floor(Math.random() * 4)),
        "Monday": Array.from({ length: 96 }, () => Math.floor(Math.random() * 4)),
        "Tuesday": Array.from({ length: 96 }, () => Math.floor(Math.random() * 4)),
        "Wednesday":Array.from({ length: 96 }, () => Math.floor(Math.random() * 4)),
        "Thursday": Array.from({ length: 96 }, () => Math.floor(Math.random() * 4)),
        "Friday": Array.from({ length: 96 }, () => Math.floor(Math.random() * 4)),
        "Saturday": Array.from({ length: 96 }, () => Math.floor(Math.random() * 4)),
        "Sunday": Array.from({ length: 96 }, () => Math.floor(Math.random() * 4)),
    };

    //map like so
    //calData[Sunday][0]
    
    return(
        <table className="calendar-table">
            <thead>
                <tr>
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                </tr>
            </thead>  

            <CalBody calData={calData}/>

            <style>
                {`
                .calendar-table {
                    border-collapse: collapse;
                }
                .calendar-table th {
                    border: 1px solid black;
                    padding: 10px;
                }
                `}
            </style>
        </table>
    );
};

//TODO: add col with time markers for each hr, ie 8:00am, 9:00am...
const CalBody = ({calData}) =>{
    let rows = [];
    for(let i = 0; i < 96; i++){ //for each row
        rows.push( //we need to fix this, it's horrendous
            <tr>
                <CalBlock rgbColor={calData["Sunday"][i]}/>
                <CalBlock rgbColor={calData["Monday"][i]}/>
                <CalBlock rgbColor={calData["Tuesday"][i]}/>
                <CalBlock rgbColor={calData["Wednesday"][i]}/>
                <CalBlock rgbColor={calData["Thursday"][i]}/>
                <CalBlock rgbColor={calData["Friday"][i]}/>
                <CalBlock rgbColor={calData["Saturday"][i]}/>
            </tr>
        );
    }
    return(
        <tbody>
            {rows}
        </tbody>
    )
};

const CalBlock = ({rgbColor}) => {
    const tileBackground = (events) => {
        let gbVal = 255 - (55 * events);
        if(gbVal < 0){ 
            gbVal = 0;
        }else if (gbVal > 255){//this should never happen
            gbVal = 255;
        }
        return `rgb(255, ${gbVal}, ${gbVal})`;
    }
    
    const blockStyle = {
        border: '1px solid black',
        width:'60px',
        height:'45px',
        backgroundColor: tileBackground(rgbColor)
    };
    return(
        <td style={blockStyle} />
    )
};

Calendar.propTypes = {
    profileID: PropTypes.string
};
export default Calendar;
