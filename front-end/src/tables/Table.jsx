import { useState } from "react";
import { listTables, deleteTable } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Table({ status, table_name, table }) {
  const history = useHistory();
  const [currentTable, setCurrentTable] = useState(table);
  const [error, setError] = useState(null);

  //US-05, event handler for table finish
  async function clearAndLoadTables() {
    const abortController = new AbortController();
    try {
      const response = await deleteTable(
        currentTable.table_id,
        abortController.signal
      );
      const tableToSet = response.find(
        (table) => table.table_id === currentTable.table_id
      );
      setCurrentTable({ ...tableToSet });
      listTables();
      return tableToSet;
    } catch (error) {
      setError(error);
    }
  }

  async function handleFinish(event) {
    event.preventDefault();
    setError(null);
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      await clearAndLoadTables();
      history.push("/tables");
      return;
    }
  }

  return (
    <>
      <tr className="table-row" data-table-id-status={table.table_id}>
        <th> {table.table_id} </th>
        <td data-title="Table Name"> {table_name} </td>
        <td data-title="Capacity"> {table.capacity} </td>
        <td data-title="Reservation ID"> {table.reservation_id} </td>
        {status === "Occupied" ? (
          <td
            data-table-id-status={`${table.table_id}`}
            data-title="Table Status"
          >
            {" "}
            {status.toLowerCase()}{" "}
          </td>
        ) : (
          <td data-title="Table Status" className="status">
            {" "}
            {status.toLowerCase()}{" "}
          </td>
        )}
        <td>
          {status === "Occupied" ? (
            <button
              className="finish-button"
              onClick={handleFinish}
              data-table-id-finish={`${table.table_id}`}
              value={table.table_id}
              data-title="Clear Tables"
            >
              Finish
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}
