import React, { useEffect } from "react";
import PropTypes from "prop-types";


const tdStyle = {
    border: '1px solid black',
    width: '5%',
    height: '20px' // Adjust the height value as needed
};


const Calendar = ({schedule}) => {
    //this gets tile background color, more red = more events scheduled during time
    console.log(schedule)

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
    };
    return(
        <table className="calendar-table">
            <thead>
                <tr>
                    <th><b>Time</b></th>
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                </tr>
            </thead>  
            <CalBody calData={schedule}/>

            <style>
                {`
                .calendar-table {
                    border-collapse: collapse;
                    width:50%;
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
        let isHrRow = (i % 4) == 0; //every block 15min, if it's 4th block then it's a row that is the start of an hour
        rows.push( //we need to fix this, it's horrendous
            <tr key={i} style={{ borderTop: `${isHrRow ? 5 : 1}px solid black` }}>
                <CalTime timeBlocks={i}/>
                <CalBlock  numEvents={calData["sunday"].slots[i]}/>
                <CalBlock  numEvents={calData["monday"].slots[i]} />
                <CalBlock  numEvents={calData["tuesday"].slots[i]} />
                <CalBlock  numEvents={calData["wednesday"].slots[i]} />
                <CalBlock  numEvents={calData["thursday"].slots[i]} />
                <CalBlock  numEvents={calData["friday"].slots[i]} />
                <CalBlock  numEvents={calData["saturday"].slots[i]} />
            </tr>
        );
    }
    return(
        <tbody>
            {rows}
        </tbody>
    )
};

const CalTime =(props) => {//96 blocks of 15 min each
    const nonHrStyle = {
        ...tdStyle,
        backgroundColor: 'white',
    }

    if(props.timeBlocks % 4 == 0){ //it is hour row, get hour
        let hr = Math.floor(props.timeBlocks / 4);
        let timeStampStr = "";

        //this is horrendous
        if (hr == 0){
            timeStampStr = "12AM";
        } else if (hr == 12){
            timeStampStr = "12PM";
        } else {
            if(hr > 12){
                timeStampStr = `${hr - 12}PM`;
            } else {
                timeStampStr = `${hr}AM`;
            }
        }
        return(
            <td style={tdStyle}>
                <b>{timeStampStr}</b>
            </td>
        )
    } else {
        return(<td style={nonHrStyle}/>); //if it's not an hour block, no need to show formatting
    }
};



const CalBlock = (props) => {
    const tileBackground = (events) => {
        if(events == -1){ //this is a permanent recurring block
            return("rgb(128, 128, 128)");
        } 

        let gbVal = 255 - (55 * events);
        if(gbVal < 0){ 
            gbVal = 0;
        }else if (gbVal > 255){//this should never happen
            gbVal = 255;
        }
        return `rgb(255, ${gbVal}, ${gbVal})`;
    }
    
    const blockStyle = {
        ...tdStyle,
        backgroundColor: tileBackground(props.numEvents)
    };
    return(
        <td style={blockStyle} />
    )
};

Calendar.propTypes = {
    profileID: PropTypes.string
};
export default Calendar;