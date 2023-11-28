export default function Reservation({ reservation_id, reservation }) {
  return (
    <li key={reservation_id} className="reservation">
      ID: {reservation_id}
      {Object.entries(reservation).map(([key, value]) => (
        <p key={key}>
          {key}: {value}
        </p>
      ))}
      <a href={`/reservations/${reservation_id}/seat`} className="seat-button">
        Seat
      </a>
    </li>
  );
}
