export default function Reservation({ id, reservation }) {
  return (
    <li key={id} className="reservation">
      ID: {id}
      {Object.entries(reservation).map(([key, value]) => (
        <p key={key}>
          {key}: {value}
        </p>
      ))}
    </li>
  );
}
