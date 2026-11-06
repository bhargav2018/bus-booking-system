import axios from "axios";
import { useEffect, useState, useCallback } from "react";

const Userbooking = ({ token, userid }) => {
  const [booking, setBooking] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [cancelingId, setCancelingId] = useState(null);
  const fetchbooking = useCallback(async () => {
    if (!token || !userid) return;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/project/Userbookingview/${userid}/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setBooking(response.data);
      setError(null);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to fetch bookings"
      );
    }
  }, [userid, token]);

  useEffect(() => {
    fetchbooking();
  }, [fetchbooking]);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      setCancelingId(bookingId);
      setError(null);
      setMessage("");

      const response = await axios.post(
        `http://127.0.0.1:8000/project/CancelBookingview/${bookingId}/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setBooking((previous) =>
        previous.map((item) =>
          item.id === bookingId
            ? { ...item, status: "CANCELLED" }
            : item
        )
      );

      setMessage(
        response.data.message || "Booking cancelled successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to cancel booking."
      );
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="container booking-container">
      <h2 className="page-title">My Bookings</h2>
      {error && <p className="booking-error">{error}</p>}
      {message && <p className="booking-success">{message}</p>}
      {booking.length > 0 ? (
        <div className="booking-table-wrapper">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>Seat</th>
                <th>Status</th>
                <th>Booking Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {booking.map((item) => (
                <tr key={item.id}>
                  <td>{item.bus}</td>
                  <td>{item.seat?.seat_number}</td>
                  <td>{item.status === "BOOKED"? "Booked" : "Cancelled"}</td>
                  <td>{new Date(item.booking_time).toLocaleString()}</td>
                  <td>
                    {item.status === "BOOKED" ? (
                      <button
                        className="cancel-booking-button"
                        onClick={() => handleCancel(item.id)}
                        disabled={cancelingId === item.id}
                        >
                        {cancelingId === item.id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>) : ("—")
                    }
                  </td>
                </tr>))
              }
            </tbody>
          </table>
        </div>) : (!error && <p className="no-bookings">No bookings found.</p>)
      }
    </div>
  );
};

export default Userbooking;
