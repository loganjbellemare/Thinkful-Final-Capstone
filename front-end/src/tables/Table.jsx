export default function Table({ id, status, table_name, table }) {
  return (
    <li key={id} className="table">
      Table: {table_name}
      <p>ID: {id}</p>
      <p>Status: {status}</p>
      {Object.entries(table).map(([key, value]) => (
        <p key={key}>
          {key}: {value}
        </p>
      ))}
      {status === "occupied" ? (
        <button
          data-table-id-finish={id}
          type="button"
          className="finish-button"
          value={id}
        >
          Finish
        </button>
      ) : null}
    </li>
  );
}
