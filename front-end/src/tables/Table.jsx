import { useState } from "react";
import { listTables } from "../utils/api";
import { deleteTable } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Table({ status, table_name, table, date, setTables }) {
  const history = useHistory();
  const [error, setError] = useState(null);

  //US-05, event handler for table finish
  async function handleFinish(event) {
    event.preventDefault();
    const controller = new AbortController();
    const confirmDelete = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirmDelete) {
      await deleteTable(Number(event.target.value), controller.signal).catch(
        (err) => setError(err)
      );
      const updatedTables = await listTables(controller.signal).catch((err) =>
        setError(err)
      );
      setTables(updatedTables);
      history.push(`/dashboard?date=${date}`);
    }
    return controller.abort();
  }

  return (
    <li key={table.table_id} className="table">
      Table: {table_name}
      <p>ID: {table.table_id}</p>
      <p>Status: {status}</p>
      {Object.entries(table).map(([key, value]) => (
        <p key={key}>
          {key}: {value}
        </p>
      ))}
      {status === "Occupied" ? (
        <button
          data-table-id-finish={table.table_id}
          type="button"
          className="finish-button"
          value={table.table_id}
          onClick={handleFinish}
        >
          occupied - finish
        </button>
      ) : null}
    </li>
  );
}
