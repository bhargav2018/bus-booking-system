import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Bus = ({ username }) => {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchbus = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/project/Buslist/");
        setBuses(response.data);
      } 
      catch (error) {
        console.log("Error in fetching bus", error);
      }
    };
    fetchbus();
  }, []);
  
  const handlebutton = (id) => {
    navigate(`/busdetail/${id}`);
  };

  return (
  <div className="container bus-container">
    {username && (<h2 className="page-title">Welcome back, {username}!</h2>)}
    <h2 className="page-title">Available Buses</h2>
    {buses.length === 0 ? (<p>No buses available.</p>) : (
      <div className="bus-list">
          {buses.map((item) => (
            <div className="bus-card" key={item.id || item.bus_no}>
              <h3>{item.bus_name}<span> ({item.bus_no})</span></h3>
              <p><strong>Route:</strong> {item.origin} → {item.destination}</p>
              <p><strong>Seats:</strong> {item.no_of_seats}</p>
              <p><strong>Departure:</strong> {item.start_time}</p>
              <p><strong>Arrival:</strong> {item.reach_time}</p>
              <button onClick={() => handlebutton(item.id)}>View Details</button>
            </div>))
          }
        </div>
      )}
  </div>
  );
};

export default Bus;
