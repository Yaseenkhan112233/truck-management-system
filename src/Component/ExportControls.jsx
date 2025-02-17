import React, { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ExportControls = ({ rows }) => {
  const [exportType, setExportType] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [serialRange, setSerialRange] = useState({ start: "", end: "" });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [error, setError] = useState("");

  const years = useMemo(() => {
    return [
      ...new Set(rows.map((row) => new Date(row.date).getFullYear())),
    ].sort();
  }, [rows]);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const validateExport = () => {
    setError("");

    if (!exportType) {
      setError("Please select an export type");
      return false;
    }

    switch (exportType) {
      case "dateRange":
        if (!dateRange.start || !dateRange.end) {
          setError("Please select both start and end dates");
          return false;
        }
        break;
      case "serialRange":
        if (!serialRange.start || !serialRange.end) {
          setError("Please enter both start and end serial numbers");
          return false;
        }
        break;
      case "month":
        if (!selectedMonth || !selectedYear) {
          setError("Please select both month and year");
          return false;
        }
        break;
      case "year":
        if (!selectedYear) {
          setError("Please select a year");
          return false;
        }
        break;
    }
    return true;
  };

  // Rest of the filterRows and generatePDF functions remain the same...
  const filterRows = () => {
    let filteredRows = [...rows];

    switch (exportType) {
      case "dateRange":
        if (dateRange.start && dateRange.end) {
          filteredRows = rows.filter((row) => {
            const rowDate = new Date(row.date);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            rowDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            return rowDate >= startDate && rowDate <= endDate;
          });
        }
        break;

      case "serialRange":
        if (serialRange.start && serialRange.end) {
          const start = parseInt(serialRange.start, 10);
          const end = parseInt(serialRange.end, 10);
          filteredRows = rows.filter((_, index) => {
            const serialNo = index + 1;
            return serialNo >= start && serialNo <= end;
          });
        }
        break;

      case "month":
        if (selectedMonth && selectedYear) {
          filteredRows = rows.filter((row) => {
            const [year, month] = row.date.split("-");
            return month === selectedMonth && year === selectedYear;
          });
        }
        break;

      case "year":
        if (selectedYear) {
          filteredRows = rows.filter((row) => {
            const year = row.date.split("-")[0];
            return year === selectedYear;
          });
        }
        break;
    }

    return filteredRows;
  };

  const generatePDF = () => {
    if (!validateExport()) {
      return;
    }

    const filteredRows = filterRows();
    const doc = new jsPDF();

    let title = "Truck Report - ";
    switch (exportType) {
      case "dateRange":
        title += `Date Range (${dateRange.start} to ${dateRange.end})`;
        break;
      case "serialRange":
        title += `S.No Range (${serialRange.start} to ${serialRange.end})`;
        break;
      case "month":
        const monthLabel = months.find((m) => m.value === selectedMonth)?.label;
        title += `${monthLabel} ${selectedYear}`;
        break;
      case "year":
        title += `Year ${selectedYear}`;
        break;
      default:
        title += "All Records";
    }

    doc.text(title, 14, 10);

    const tableColumn = [
      "S no",
      "Date",
      "Driver Name",
      "Jobs",
      "Fuel",
      "Services",
      "Extra Charges",
      "Total",
      "Overall Total",
    ];

    const tableRows = [];

    filteredRows.forEach((row, rowIndex) => {
      row.jobs.forEach((job, index) => {
        const rowData = [
          index === 0 ? rowIndex + 1 : "",
          index === 0 ? row.date : "",
          index === 0 ? row.driverName : "",
          job.job,
          job.fuel,
          job.services,
          job.extraCharges,
          job.total,
          index === 0
            ? row.jobs
                .reduce((sum, j) => sum + (parseFloat(j.total) || 0), 0)
                .toFixed(2)
            : "",
        ];
        tableRows.push(rowData);
      });
    });

    const totalsRow = [
      "",
      "Totals:",
      "",
      `${filteredRows.length} Jobs`,
      filteredRows
        .flatMap((row) => row.jobs)
        .reduce((sum, job) => sum + (parseFloat(job.fuel) || 0), 0)
        .toFixed(2),
      filteredRows
        .flatMap((row) => row.jobs)
        .reduce((sum, job) => sum + (parseFloat(job.services) || 0), 0)
        .toFixed(2),
      filteredRows
        .flatMap((row) => row.jobs)
        .reduce((sum, job) => sum + (parseFloat(job.extraCharges) || 0), 0)
        .toFixed(2),
      filteredRows
        .flatMap((row) => row.jobs)
        .reduce((sum, job) => sum + (parseFloat(job.total) || 0), 0)
        .toFixed(2),
      filteredRows
        .reduce(
          (sum, row) =>
            sum +
            row.jobs.reduce(
              (jobSum, job) => jobSum + (parseFloat(job.total) || 0),
              0
            ),
          0
        )
        .toFixed(2),
    ];
    tableRows.push(totalsRow);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    doc.save(
      `TruckReport_${exportType}_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md ">
      <h2 className="text-lg font-bold mb-4">Export Options</h2>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700">
            Export Type: <span className="text-red-500">*</span>
          </label>
          <select
            value={exportType}
            onChange={(e) => {
              setExportType(e.target.value);
              setDateRange({ start: "", end: "" });
              setSerialRange({ start: "", end: "" });
              setSelectedMonth("");
              setSelectedYear("");
              setError("");
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select export type</option>
            <option value="all">All Records</option>
            <option value="dateRange">Date Range</option>
            <option value="serialRange">Serial Number Range</option>
            <option value="month">By Month</option>
            <option value="year">By Year</option>
          </select>
        </div>

        {exportType === "dateRange" && (
          <>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700">
                Start Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700">
                End Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        )}

        {exportType === "serialRange" && (
          <>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700">
                Start S.No: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={serialRange.start}
                onChange={(e) =>
                  setSerialRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700">
                End S.No: <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={serialRange.end}
                onChange={(e) =>
                  setSerialRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        )}

        {(exportType === "month" || exportType === "year") && (
          <>
            {exportType === "month" && (
              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700">
                  Select Month: <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a month</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700">
                Select Year: <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <button
          onClick={generatePDF}
          className={`h-10 px-4 ${
            !exportType
              ? "bg-green-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          disabled={!exportType}
        >
          Export to PDF
        </button>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default ExportControls;
