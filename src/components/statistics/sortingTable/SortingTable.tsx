"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { elements } from "../../../elementsData/elementsData";
import type { ElementConfig } from "@/elementsData/types";
import styles from "./SortingTable.module.css";
import { FilterIcon } from "@/assets/icons/FilterIcon";
import { SortIcon } from "@/assets/icons/SortIcon";

const formatHeader = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace("K", "(K)");
};

export const SortingTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setSortMenuOpen] = useState(false);

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const tableData = useMemo(() => elements, []);

  const columns = useMemo<ColumnDef<ElementConfig>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "symbol",
        header: "Symbol",
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "protons",
        header: formatHeader("protons"),
        cell: (info) => info.getValue() ?? "N/A",
      },
      {
        accessorKey: "neutrons",
        header: formatHeader("neutrons"),
        cell: (info) => info.getValue() ?? "N/A",
      },
      {
        accessorKey: "electrons",
        header: formatHeader("electrons"),
        cell: (info) => info.getValue() ?? "N/A",
      },
      {
        accessorKey: "atomicWeight",
        header: formatHeader("atomicWeight"),
        cell: (info) => info.getValue() ?? "N/A",
      },
      {
        accessorKey: "group",
        header: formatHeader("group"),
        cell: (info) => {
          const value = info.getValue<number>();
          return value > 0 ? value : "N/A";
        },
      },
      {
        accessorKey: "period",
        header: formatHeader("period"),
        cell: (info) => info.getValue() ?? "N/A",
      },
      {
        id: "meltingPointK",
        header: formatHeader("meltingPointK"),
        accessorFn: (row) =>
          row.phaseTransitions.find((pt) => pt.type === "melting")
            ?.temperature_K,
        cell: (info) => info.getValue() ?? "N/A",
      },
      {
        id: "boilingPointK",
        header: formatHeader("boilingPointK"),
        accessorFn: (row) =>
          row.phaseTransitions.find((pt) => pt.type === "boiling")
            ?.temperature_K,
        cell: (info) => info.getValue() ?? "N/A",
      },
      {
        accessorKey: "stateAtSTP",
        header: formatHeader("stateAtSTP"),
        cell: (info) => info.getValue() ?? "N/A",
      },
    ],
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      )
        setFilterMenuOpen(false);
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      )
        setSortMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFacetedValues = (columnId: string) =>
    Array.from(
      table.getColumn(columnId)?.getFacetedUniqueValues()?.keys() ?? []
    ).sort((a, b) => Number(a) - Number(b));

  return (
    <div className={styles.sortingTableContainer}>
      <div className={styles.controlsContainer}>
        <div className={styles.searchAndChipsWrapper}>
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={styles.searchInput}
            placeholder="Search table..."
          />
          <div className={styles.chipsContainer}>
            {table.getState().columnFilters.map((filter) => {
              const column = table.getColumn(filter.id);
              const header =
                typeof column?.columnDef.header === "string"
                  ? column.columnDef.header
                  : filter.id;
              return (
                <div key={filter.id} className={styles.chip}>
                  <span>
                    {header}: <strong>{filter.value as string}</strong>
                  </span>
                  <button onClick={() => column?.setFilterValue(undefined)}>
                    ×
                  </button>
                </div>
              );
            })}
            {table.getState().sorting.map((sort) => {
              const column = table.getColumn(sort.id);
              const header =
                typeof column?.columnDef.header === "string"
                  ? column.columnDef.header
                  : sort.id;
              return (
                <div key={sort.id} className={styles.chip}>
                  <span>
                    {header} <strong>({sort.desc ? "Desc" : "Asc"})</strong>
                  </span>
                  <button onClick={() => column?.clearSorting()}>×</button>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <div className={styles.dropdownContainer} ref={filterMenuRef}>
            <button
              onClick={() => setFilterMenuOpen(!isFilterMenuOpen)}
              className={styles.dropdownButton}
            >
              <FilterIcon /> Filter by
            </button>
            {isFilterMenuOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownSection}>By State</div>
                {getFacetedValues("stateAtSTP").map((value) => (
                  <button
                    key={String(value)}
                    onClick={() => {
                      table
                        .getColumn("stateAtSTP")
                        ?.setFilterValue(String(value));
                      setFilterMenuOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    {String(value)}
                  </button>
                ))}
                <div className={styles.dropdownSection}>By Period</div>
                {getFacetedValues("period").map((value) => (
                  <button
                    key={String(value)}
                    onClick={() => {
                      table.getColumn("period")?.setFilterValue(String(value));
                      setFilterMenuOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    Period {String(value)}
                  </button>
                ))}
                <div className={styles.dropdownSection}>By Group</div>
                {getFacetedValues("group")
                  .filter((v) => v > 0)
                  .map((value) => (
                    <button
                      key={String(value)}
                      onClick={() => {
                        table.getColumn("group")?.setFilterValue(String(value));
                        setFilterMenuOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      Group {String(value)}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div className={styles.dropdownContainer} ref={sortMenuRef}>
            <button
              onClick={() => setSortMenuOpen(!isSortMenuOpen)}
              className={styles.dropdownButton}
            >
              <SortIcon /> Sort by
            </button>
            {isSortMenuOpen && (
              <div className={styles.dropdownMenu}>
                {table.getAllLeafColumns().map((column) => {
                  if (!column.getCanSort()) return null;
                  return (
                    <button
                      key={column.id}
                      onClick={() => {
                        column.toggleSorting(false);
                        setSortMenuOpen(false);
                      }}
                      className={styles.dropdownItem}
                    >
                      {typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : column.id}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    <div
                      className={
                        header.column.getCanSort() ? styles.sortableHeader : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{ asc: " 🔼", desc: " 🔽" }[
                        header.column.getIsSorted() as string
                      ] ?? null}
                    </div>
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
