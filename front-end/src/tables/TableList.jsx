import Table from "./Table";
import "./TableList.css";

export default function TableList({ tables, date, setTables }) {
  return (
    <ul className="tables-list">
      {tables.map(({ status, table_name, ...rest }) => {
        return (
          <Table
            status={status}
            table_name={table_name}
            table={rest}
            date={date}
            setTables={setTables}
          />
        );
      })}
    </ul>
  );
}
