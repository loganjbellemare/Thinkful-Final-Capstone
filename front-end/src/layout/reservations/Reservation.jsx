export default function Reservation({ reservation }) {
  return (
    <li
      key={reservation.reservation_id}
      data-reservation-id-status={reservation.reservation_id}
      className="reservation"
    >
      ID: {reservation.reservation_id}
      <br />
      Status: {reservation.status}
      <br />
      First Name: {reservation.first_name}
      <br />
      Last Name: {reservation.last_name}
      <br />
      Mobile Number: {reservation.mobile_number}
      <br />
      Reservation Date: {reservation.reservation_date}
      <br />
      Reservation Time: {reservation.reservation_time}
      <hr />
      {reservation.status === "booked" ? (
        <a
          href={`/reservations/${reservation.reservation_id}/seat`}
          className="seat-button"
        >
          Seat
        </a>
      ) : (
        <></>
      )}
    </li>
  );
}
