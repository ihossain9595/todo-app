"use client";

import dynamic from "next/dynamic";
import DataTableComponent, { TableColumn, ConditionalStyles } from "react-data-table-component";

const RDT = dynamic(() => import("react-data-table-component"), { ssr: false }) as typeof DataTableComponent;

type DataTableProps<T extends object> = {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  conditionalRowStyles?: ConditionalStyles<T>[];
};

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "var(--color-muted)",
      borderBottomWidth: "1px",
      borderBottomColor: "var(--color-border)",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "var(--color-muted-foreground)",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      minHeight: "52px",
      fontSize: "0.875rem",
      color: "var(--color-foreground)",
      borderBottomColor: "var(--color-border)",
      "&:hover": {
        backgroundColor: "var(--color-muted)",
        cursor: "default",
      },
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  noData: {
    style: {
      padding: "2rem",
      color: "var(--color-muted-foreground)",
      fontSize: "0.875rem",
    },
  },
};

const DataTable = <T extends object>({ columns, data, emptyMessage = "No records found.", conditionalRowStyles }: DataTableProps<T>) => {
  return (
    <RDT
      columns={columns}
      data={data}
      customStyles={customStyles}
      conditionalRowStyles={conditionalRowStyles}
      noDataComponent={<p className="text-slate-500 text-center py-8">{emptyMessage}</p>}
      className="border overflow-hidden rounded-lg!"
      persistTableHead
    />
  );
};

export default DataTable;
