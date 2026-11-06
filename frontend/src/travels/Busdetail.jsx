import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Busdetail = ({ token }) => {
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const { busid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchdetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/project/busdetail/${busid}/`
        );

        console.log("Bus detail response:", response.data);
        setBus(response.data);

        const activeTrip =
          response.data.trips?.find((trip) => trip.is_active) ||
          response.data.trips?.[0];

        setSeats(activeTrip?.trip_seats || []);
      } catch (error) {
        console.log("Error fetching details:", error);
      }
    };

    fetchdetails();
  }, [busid]);

  const handlebook = async (tripSeatId) => {
    if (!token) {
      alert("Please login for booking");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/project/Bookingview/",
        {
          trip_seat: tripSeatId
        },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      alert("Booking successful!");

      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.id === tripSeatId
            ? { ...seat, is_booked: true }
            : seat
        )
      );

      navigate("/booking");
    } catch (error) {
      alert(
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Booking failed"
      );
    }
  };

  if (!bus) {
    return <div className="container">Loading bus details...</div>;
  }

  return (
    <div className="container bus-detail-container">
      <h2 className="page-title">Bus Details</h2>
      <div className="bus-detail-card">
        <h3>{bus.bus_name}</h3>
        <p><strong>Bus Number:</strong> {bus.bus_no}</p>
        <p><strong>Route:</strong> {bus.origin} → {bus.destination}</p>
        <p><strong>Features:</strong> {bus.features}</p>
      </div>
      <h3 className="seat-title">Select Your Seat</h3>
      <div className="seat-info">
        <span className="available-dot"></span> Available
        <span className="booked-dot"></span> Booked
      </div>
      <div className="seat-grid">
        {seats.length > 0 ? (
          seats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handlebook(seat.id)}
              disabled={seat.is_booked}
              className={seat.is_booked ? "booked" : "available"}>
              {seat.seat_number}
              <br />
              {seat.is_booked ? "Booked" : "Available"}
            </button>
          ))
        ) : (
          <p>No seats available</p>
        )}
      </div>
    </div>
  );
};

export default Busdetail;
