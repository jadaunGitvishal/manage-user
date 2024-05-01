import React, { useState, useEffect } from "react";
import axios from "axios";
import "./userCount.css";
import moment from "moment";

const UserCount = ({ key }) => {
  const [userRegistrations, setUserRegistrations] = useState([]);

  useEffect(() => {
    fetchUserRegistrations();
  }, [key]); // Re-fetch user registrations when key changes

  const fetchUserRegistrations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user-registrations"
      );
      // Format dates using Moment.js to match the local timezone
      const formattedRegistrations = response.data.map((registration) => ({
        ...registration,
        date: moment(registration.date).format("YYYY-MM-DD"),
      }));
      setUserRegistrations(formattedRegistrations);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
    }
  };

  return (
    <div className="user-count">
      <h3 className="user-count-header">Last 7 Days User Count</h3>
      {userRegistrations.length === 0 ? (
        <p>No user registrations in the last 7 days.</p>
      ) : (
        <ul className="registration-list">
          {userRegistrations.map((registration) => (
            <li key={registration.date} className="registration-item">
              <span className="date">{`${registration.date.slice(0, 10)} - ${
                registration.count
              } `}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserCount;
