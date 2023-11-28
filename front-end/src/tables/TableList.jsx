import Table from "./Table";
import "./TableList.css";

export default function TableList({ tables }) {
  return (
    <ul className="tables-list">
      {tables.map(({ table_id, status, table_name, ...rest }) => {
        return (
          <Table
            id={table_id}
            status={status}
            table_name={table_name}
            table={rest}
          />
        );
      })}
    </ul>
  );
}
