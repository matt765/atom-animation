"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { elements, ElementConfig } from "../AtomModel/elementsData";
import styles from "./Statistics.module.css";

export const Statistics = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "symbol",
          header: "Symbol",
        },
        {
          accessorKey: "protons",
          header: "Atomic Number",
        },
        {
          accessorKey: "atomicWeight",
          header: "Atomic Weight",
        },
        {
          accessorKey: "meltingPointK",
          header: "Melting Point (K)",
          cell: (info) => info.getValue() ?? "N/A",
        },
        {
          accessorKey: "boilingPointK",
          header: "Boiling Point (K)",
          cell: (info) => info.getValue() ?? "N/A",
        },
        {
          accessorKey: "stateAtSTP",
          header: "State at STP",
        },
      ] as ColumnDef<ElementConfig>[],
    []
  );

  const table = useReactTable({
    data: elements,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Element Statistics</h1>
      <div className={styles.controls}>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className={styles.filterInput}
          placeholder="Search all columns..."
        />
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? styles.sortableHeader
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
