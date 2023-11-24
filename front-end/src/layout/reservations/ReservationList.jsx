import Reservation from "./Reservation";

export default function ReservationList({ reservations }) {
  return (
    <div className="reservations-box">
      <ul className="reservations-list">
        {reservations.map(({ reservation_id, ...rest }) => {
          return <Reservation id={reservation_id} reservation={rest} />;
        })}
      </ul>
    </div>
  );
}
