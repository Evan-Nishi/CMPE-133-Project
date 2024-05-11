import React from "react";
import PropTypes from "prop-types";

const tdStyle = {
  border: "1px solid black",
  width: "5%",
  height: "20px",
};

const Calendar = ({ schedule, events }) => {
  return (
    <table className="calendar-table">
      <thead>
        <tr>
          <th>
            <b>Time</b>
          </th>
          <th>Sunday</th>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
        </tr>
      </thead>
      <CalBody calData={schedule} events={events} />

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

function getDayOfWeek(date) {
  return new Date(date).getDay();
}

const CalBody = ({ calData, events }) => {
  const timeSlots = 96;
  const weekSlots = Array.from({ length: 7 }, () =>
    Array.from({ length: timeSlots }, () => ({ isStart: false, events: [] }))
  );

  events.forEach((event) => {
    const dayIndex = getDayOfWeek(new Date(event.date));
    for (let i = event.start; i < event.end; i++) {
      weekSlots[dayIndex][i].events.push(event);
      if (i === event.start) {
        weekSlots[dayIndex][i].isStart = true;
      }
    }
  });

  const rows = weekSlots[0].map((_, slotIndex) => (
    <tr key={slotIndex}>
      <CalTime timeBlocks={slotIndex} />
      {weekSlots.map((day, dayIndex) => {
        const slot = day[slotIndex];
        return <CalBlock key={dayIndex} slot={slot} />;
      })}
    </tr>
  ));

  return <tbody>{rows}</tbody>;
};

const CalTime = (props) => {
  const nonHrStyle = {
    ...tdStyle,
    backgroundColor: "white",
  };

  if (props.timeBlocks % 4 === 0) {
    let hr = Math.floor(props.timeBlocks / 4);
    let timeStampStr = "";

    if (hr === 0) {
      timeStampStr = "12AM";
    } else if (hr === 12) {
      timeStampStr = "12PM";
    } else {
      if (hr > 12) {
        timeStampStr = `${hr - 12}PM`;
      } else {
        timeStampStr = `${hr}AM`;
      }
    }
    return (
      <td style={tdStyle}>
        <b>{timeStampStr}</b>
      </td>
    );
  } else {
    return <td style={nonHrStyle} />;
  }
};

const CalBlock = ({ slot }) => {
  const blockStyle = {
    ...tdStyle,
    backgroundColor: slot.events.length > 0 ? "rgb(255, 200, 200)" : "white",
  };

  return (
    <td style={blockStyle}>
      {slot.isStart &&
        slot.events.map((event, index) => (
          <div
            key={index}
            title={`Event: ${event.title} from slot ${event.start} to ${event.end}`}
          >
            {event.title}
          </div>
        ))}
    </td>
  );
};

Calendar.propTypes = {
  schedule: PropTypes.object.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Calendar;
