import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationButton = ({ onClick, disabled, className, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 ${className}`}
  >
    {children}
  </button>
);

import React, { useState, useEffect } from "react";
import { db } from "../firabse/Fireabase"; // Ensure this path is correct
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExportControls from "./ExportControls";
import ChartComponent from "./ChartComponent";

const TruckTable = ({ rows = [], onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Calculate total pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  // Get current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate totals using all rows (not just current page)
  const totalsRow = [
    "",
    "Totals:",
    `${rows.length} Jobs`,
    "",
    rows
      .flatMap((row) => row.jobs)
      .reduce((sum, job) => sum + (parseFloat(job.fuel) || 0), 0)
      .toFixed(2),
    rows
      .flatMap((row) => row.jobs)
      .reduce((sum, job) => sum + (parseFloat(job.services) || 0), 0)
      .toFixed(2),
    rows
      .flatMap((row) => row.jobs)
      .reduce((sum, job) => sum + (parseFloat(job.extraCharges) || 0), 0)
      .toFixed(2),
    rows
      .flatMap((row) => row.jobs)
      .reduce((sum, job) => sum + (parseFloat(job.total) || 0), 0)
      .toFixed(2),
    rows
      .flatMap((row) => row.jobs)
      .reduce((sum, job) => sum + (parseFloat(job.total) || 0), 0)
      .toFixed(2),
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse mt-5">
        <thead>
          <tr>
            <th className="border border-black p-2">S no</th>
            <th className="border border-black p-2">Date</th>
            <th className="border border-black p-2">Driver Name</th>
            <th className="border border-black p-2">Jobs</th>
            <th className="border border-black p-2">Fuel</th>
            <th className="border border-black p-2">Services</th>
            <th className="border border-black p-2">Extra Charges</th>
            <th className="border border-black p-2">Total</th>
            <th className="border border-black p-2">Overall Total</th>
            <th className="border border-black p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.jobs.map((job, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <>
                      <td rowSpan={row.jobs.length} className="border p-2">
                        {indexOfFirstRow + rowIndex + 1}
                      </td>
                      <td rowSpan={row.jobs.length} className="border p-2">
                        {row.date}
                      </td>
                      <td rowSpan={row.jobs.length} className="border p-2">
                        {row.driverName}
                      </td>
                    </>
                  )}
                  <td className="border p-2">{job.job}</td>
                  <td className="border p-2">{job.fuel}</td>
                  <td className="border p-2">{job.services}</td>
                  <td className="border p-2">{job.extraCharges}</td>
                  <td className="border p-2">{job.total}</td>
                  {index === 0 && (
                    <>
                      <td rowSpan={row.jobs.length} className="border p-2">
                        {row.jobs.reduce(
                          (sum, j) => sum + (parseFloat(j.total) || 0),
                          0
                        )}
                      </td>
                      <td rowSpan={row.jobs.length} className="border p-2">
                        <button
                          onClick={() => onEdit(row)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="border p-2 font-bold">
              Totals:
            </td>
            <td className="border p-2 ">{rows.length} Jobs</td>
            <td className="border p-2">{totalsRow[4]}</td>
            <td className="border p-2">{totalsRow[5]}</td>
            <td className="border p-2">{totalsRow[6]}</td>
            <td className="border p-2">{totalsRow[7]}</td>
            <td className="border p-2">{totalsRow[8]}</td>
          </tr>
        </tfoot>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 p-4">
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstRow + 1} to{" "}
          {Math.min(indexOfLastRow, rows.length)} of {rows.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Truck1 component to manage form data and table
function Truck1() {
  const currentDate = new Date().toISOString().split("T")[0];
  const [rows, setRows] = useState([]); // Data displayed in the table
  const [formData, setFormData] = useState({
    date: currentDate,
    driverName: "",
    jobs: [{ job: "", fuel: "", services: "", extraCharges: "", total: 0 }],
    id: null,
  });
  const [editMode, setEditMode] = useState(false);
  // const [filterType, setFilterType] = useState("all-time"); // Default: Show all data

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default: Current Month (1-12)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default: Current Year

  const removeJobRow = (indexToRemove) => {
    if (formData.jobs.length > 1) {
      setFormData((prev) => ({
        ...prev,
        jobs: prev.jobs.filter((_, index) => index !== indexToRemove),
      }));
    }
  };
  // Prepare data for Chart.js
  // 🛠 Filtering Function
  const getFilteredData = () => {
    return rows.filter((row) => {
      const rowDate = new Date(row.date);
      return (
        rowDate.getMonth() + 1 === selectedMonth &&
        rowDate.getFullYear() === selectedYear
      );
    });
  };

  // 📊 Prepare Data for Chart.js
  const prepareChartData = () => {
    const filteredData = getFilteredData();

    if (!filteredData.length) return { labels: [], datasets: [] };

    const labels = filteredData.map((row) => row.date.split("T")[0]);

    const fuelData = filteredData.map((row) =>
      row.jobs.reduce((sum, job) => sum + (parseFloat(job.fuel) || 0), 0)
    );
    const jobsData = filteredData.map((row) => row.jobs.length);
    const servicesData = filteredData.map((row) =>
      row.jobs.reduce((sum, job) => sum + (parseFloat(job.services) || 0), 0)
    );
    const extraChargesData = filteredData.map((row) =>
      row.jobs.reduce(
        (sum, job) => sum + (parseFloat(job.extraCharges) || 0),
        0
      )
    );
    const totalData = filteredData.map((row) =>
      row.jobs.reduce((sum, job) => sum + (parseFloat(job.total) || 0), 0)
    );

    let runningTotal = 0;
    const overallTotalData = totalData.map((dailyTotal) => {
      runningTotal += dailyTotal;
      return runningTotal;
    });

    return {
      labels,
      datasets: [
        {
          label: "Fuel",
          data: fuelData,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
          tension: 0.1,
        },
        {
          label: "Jobs",
          data: jobsData,
          borderColor: "rgba(153, 102, 255, 1)",
          fill: false,
          tension: 0.1,
        },
        {
          label: "Services",
          data: servicesData,
          borderColor: "rgba(255, 159, 64, 1)",
          fill: false,
          tension: 0.1,
        },
        {
          label: "Extra Charges",
          data: extraChargesData,
          borderColor: "rgba(255, 99, 132, 1)",
          fill: false,
          tension: 0.1,
        },
        {
          label: "Total",
          data: totalData,
          borderColor: "rgba(255, 205, 86, 1)",
          fill: false,
          tension: 0.1,
        },
        {
          label: "Overall Total",
          data: overallTotalData,
          borderColor: "rgba(54, 162, 235, 1)",
          fill: false,
          tension: 0.1,
          borderWidth: 2,
        },
      ],
    };
  };

  const handleInputChange = (e, jobIndex) => {
    const { name, value } = e.target;
    const updatedJobs = [...formData.jobs];

    if (name === "job") {
      updatedJobs[jobIndex][name] = value;
    } else {
      const numericValue = value === "" ? "" : parseFloat(value) || 0;
      updatedJobs[jobIndex][name] = value;

      if (name === "fuel" || name === "extraCharges" || name === "services") {
        const total = calculateJobTotal(updatedJobs[jobIndex]);
        updatedJobs[jobIndex].total = total;
      }
    }

    setFormData((prev) => ({ ...prev, jobs: updatedJobs }));
  };

  const addJobRow = () => {
    setFormData((prev) => ({
      ...prev,
      jobs: [
        ...prev.jobs,
        { job: "", fuel: "", services: "", extraCharges: "", total: 0 },
      ],
    }));
  };

  const calculateJobTotal = (jobData) => {
    const fuel = parseFloat(jobData.fuel) || 0;
    const extraCharges = parseFloat(jobData.extraCharges) || 0;
    const services = parseFloat(jobData.services) || 0;
    return fuel + extraCharges + services;
  };

  const calculateOverallTotal = () => {
    return formData.jobs.reduce((acc, job) => acc + job.total, 0);
  };

  const saveData = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const docRef = doc(db, "Truck1", formData.id);
        await updateDoc(docRef, {
          date: formData.date,
          driverName: formData.driverName,
          jobs: formData.jobs,
        });
        setEditMode(false);
      } else {
        await addDoc(collection(db, "Truck1"), {
          date: formData.date,
          driverName: formData.driverName,
          jobs: formData.jobs,
        });
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving or updating document: ", error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: currentDate,
      driverName: "",
      jobs: [{ job: "", fuel: "", services: "", extraCharges: "", total: 0 }],
      id: null,
    });
    setEditMode(false);
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Truck1"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        jobs: Array.isArray(doc.data().jobs) ? doc.data().jobs : [],
      }));

      const sortedData = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setRows(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "Truck1", id));
      fetchData();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (driver) => {
    setFormData({
      date: driver.date,
      driverName: driver.driverName,
      jobs: driver.jobs,
      id: driver.id,
    });
    setEditMode(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Truck Data Management</h1>
      <form onSubmit={saveData} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Driver Name
          </label>
          <input
            type="text"
            name="driverName"
            placeholder="Driver Name"
            value={formData.driverName}
            onChange={(e) =>
              setFormData({ ...formData, driverName: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {formData.jobs.map((job, index) => (
          <div key={index} className="mb-4 border p-4 rounded relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Job {index + 1}</h3>
              {formData.jobs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeJobRow(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Remove Job
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job input fields remain the same */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job
                </label>
                <input
                  type="text"
                  name="job"
                  placeholder="Job"
                  value={job.job}
                  onChange={(e) => handleInputChange(e, index)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fuel
                </label>
                <input
                  type="text"
                  name="fuel"
                  placeholder="Fuel"
                  value={job.fuel}
                  onChange={(e) => handleInputChange(e, index)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Extra Charges
                </label>
                <input
                  type="text"
                  name="extraCharges"
                  placeholder="Extra Charges"
                  value={job.extraCharges}
                  onChange={(e) => handleInputChange(e, index)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Services
                </label>
                <input
                  type="text"
                  name="services"
                  placeholder="Services"
                  value={job.services}
                  onChange={(e) => handleInputChange(e, index)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total
                </label>
                <input
                  type="text"
                  name="total"
                  placeholder="Total"
                  value={job.total}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={addJobRow}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Job
          </button>
          <div>
            <span className="font-bold mr-2">Overall Total:</span>
            {calculateOverallTotal().toFixed(2)}
          </div>
          <div>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editMode ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </form>
      <ExportControls rows={rows} />

      <TruckTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} />
      {/* 🛠 Month-Year Selection */}
      <div className="flex gap-4 mb-4 mt-8">
        {/* Month Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Month:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="mt-1 block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="mt-1 block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ChartComponent chartData={prepareChartData()} />
    </div>
  );
}

export default Truck1;
