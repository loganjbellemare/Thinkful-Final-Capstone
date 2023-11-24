import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../layout/reservations/ReservationList";
import { today, next, previous } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDateState }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function updateQueryParam(newDate) {
    history.push(`/dashboard?date=${newDate}`);
  }

  function handleNext(event) {
    event.preventDefault();
    setDateState((currentDate) => {
      const newDate = next(currentDate);
      updateQueryParam(newDate);
      return newDate;
    });
  }

  function handlePrevious(event) {
    event.preventDefault();
    setDateState((currentDate) => {
      const newDate = previous(currentDate);
      updateQueryParam(newDate);
      return newDate;
    });
  }

  function handleToday(event) {
    event.preventDefault();
    setDateState((currentDate) => {
      const newDate = today();
      updateQueryParam(newDate);
      return newDate;
    });
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ReservationList reservations={reservations} />
      <div>
        <button type="button" onClick={handlePrevious}>
          Previous
        </button>
        <button type="button" onClick={handleToday}>
          Today
        </button>
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;
