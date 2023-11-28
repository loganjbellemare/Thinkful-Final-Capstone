import Reservation from "./Reservation";
import "./ReservationList.css";

export default function ReservationList({ reservations }) {
  return (
    <ul className="reservations-list">
      {reservations.map(({ reservation_id, ...rest }) => {
        return (
          <Reservation reservation_id={reservation_id} reservation={rest} />
        );
      })}
    </ul>
  );
}
