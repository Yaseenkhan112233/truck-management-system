import React, { useState, useEffect } from "react";
import { db } from "../firabse/Fireabase";
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
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Truck2() {
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    date: currentDate,
    driverName: "",
    jobs: "",
    fuel: "",
    services: "",
    extraCharges: "",
    id: null,
    total: 0,
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
  const [year, setYear] = useState(new Date().getFullYear()); // Current year
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [filterType, setFilterType] = useState("recent");
  // const [rows, setRows] = useState([]);
  const rowsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");

  // Fetch data from Firestore (using 'Truck2' collection) and sort most recent first
  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Truck2"));
      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        let date;
        if (docData.date && docData.date.seconds) {
          date = new Date(docData.date.seconds * 1000); // Convert Firestore Timestamp to JavaScript Date
        } else {
          date = new Date(docData.date); // If it's already a string, parse as Date
        }
        return {
          id: doc.id,
          ...docData,
          date: date.toISOString(), // Ensure it's stored as ISO string for sorting
        };
      });
      // Sort the data in descending order (newest first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRows(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByMonth = (data) => {
    if (!filterValue) return data; // Return all data if no month is selected
    const selectedMonth = parseInt(filterValue, 10);
    return data.filter((row) => {
      const rowDate = new Date(row.date);
      return (
        rowDate.getMonth() + 1 === selectedMonth &&
        rowDate.getFullYear() === year
      );
    });
  };
  const filterByYear = (data) => {
    if (!filterValue) return data; // Return all data if no year is selected
    const selectedYear = parseInt(filterValue, 10);
    return data.filter((row) => {
      const rowDate = new Date(row.date);
      return rowDate.getFullYear() === selectedYear;
    });
  };
  const filterAllTime = (data) => {
    return data; // Return all data without filtering
  };
  const getFilteredData = () => {
    let filteredData = rows;
    if (filterType === "month") {
      filteredData = filterByMonth(filteredData);
    } else if (filterType === "year") {
      filteredData = filterByYear(filteredData);
    } else if (filterType === "all") {
      filteredData = filterAllTime(filteredData);
    }
    return filteredData;
  };
  // Prepare chart data based on filtered rows
  const prepareChartData = () => {
    const filteredData = getFilteredData();
    const fuelData = filteredData.map((row) => extractNumber(row.fuel));
    const jobsData = filteredData.map((row) => extractNumber(row.jobs));
    const servicesData = filteredData.map((row) => extractNumber(row.services));
    const extraChargesData = filteredData.map((row) =>
      extractNumber(row.extraCharges)
    );
    const totalData = filteredData.map((row) => row.total || 0);

    return {
      labels: filteredData.map((row) => row.date.split("T")[0]), // X-axis labels are dates
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
      ],
    };
  };

  // Save data to Firestore, including total
  const saveData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        const docRef = doc(db, "Truck2", formData.id);
        await updateDoc(docRef, {
          date: formData.date,
          driverName: formData.driverName,
          jobs: formData.jobs,
          fuel: formData.fuel,
          services: formData.services,
          extraCharges: formData.extraCharges,
          total: formData.total,
        });
      } else {
        await addDoc(collection(db, "Truck2"), {
          date: new Date(),
          driverName: formData.driverName,
          jobs: formData.jobs,
          fuel: formData.fuel,
          services: formData.services,
          extraCharges: formData.extraCharges,
          total: formData.total,
        });
      }
      setFormData({
        date: currentDate,
        driverName: "",
        jobs: "",
        fuel: "",
        services: "",
        extraCharges: "",
        total: 0,
        id: null,
      });
      fetchData();
    } catch (error) {
      console.error("Error saving document: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete data from Firestore with confirmation
  const deleteData = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (isConfirmed) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "Truck2", id));
        fetchData();
      } catch (error) {
        console.error("Error deleting document: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Edit data and populate the form
  const editData = (row) => {
    setFormData({
      date: row.date,
      driverName: row.driverName,
      jobs: row.jobs,
      fuel: row.fuel,
      services: row.services,
      extraCharges: row.extraCharges,
      total: row.total,
      id: row.id,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "fuel" ||
      name === "services" ||
      name === "extraCharges" ||
      name === "jobs"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      calculateTotal({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Extract number from a string (e.g., "300 (given by Yaseen)" -> 300)
  // Extract all numbers from a string and sum them
  const extractNumbersAndSum = (input) => {
    const numbers = input.match(/\d+/g); // Match all sequences of digits
    if (numbers) {
      return numbers.reduce((sum, num) => sum + parseFloat(num), 0); // Sum the numbers
    }
    return 0;
  };

  // Calculate total based on Jobs, Fuel, Services, and Extra Charges
  const calculateTotal = (updatedFormData) => {
    const jobs = extractNumbersAndSum(updatedFormData.jobs);
    const fuel = extractNumber(updatedFormData.fuel); // assuming extractNumber handles the fuel input properly
    const services = extractNumber(updatedFormData.services);
    const extraCharges = extractNumber(updatedFormData.extraCharges);
    const total = jobs + fuel + services + extraCharges;
    setFormData((prev) => ({
      ...prev,
      total,
    }));
  };

  // Extract number from a string (e.g., "300 (given by Yaseen)" -> 300)
  const extractNumber = (input) => {
    const match = input.match(/[\d\.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Calculate total sums for jobs, fuel, services, and extra charges
  const calculateColumnTotals = () => {
    const totalJobs = rows.reduce(
      (acc, row) => acc + extractNumber(row.jobs),
      0
    );
    const totalFuel = rows.reduce(
      (acc, row) => acc + extractNumber(row.fuel),
      0
    );
    const totalServices = rows.reduce(
      (acc, row) => acc + extractNumber(row.services),
      0
    );
    const totalExtraCharges = rows.reduce(
      (acc, row) => acc + extractNumber(row.extraCharges),
      0
    );
    return { totalJobs, totalFuel, totalServices, totalExtraCharges };
  };

  // Calculate overall total of the total column
  const calculateOverallTotal = () => {
    return rows.reduce((acc, row) => acc + (row.total || 0), 0);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage * rowsPerPage < rows.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Paginate rows based on the current page
  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Filter data by month and year
  const filterByDate = (data) => {
    return data.filter((row) => {
      const rowDate = new Date(row.date);
      return rowDate.getFullYear() === year && rowDate.getMonth() + 1 === month;
    });
  };

  // Handle filtering
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setCurrentPage(1);
  };

  // Export to PDF with modal-based filtering
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Truck2 Data Report", 14, 20);

    const headers = [
      "S No",
      "Date",
      "Driver Name",
      "Jobs",
      "Fuel",
      "Services",
      "Extra Charges",
      "Total",
    ];

    const tableData = rows.map((row, index) => [
      index + 1,
      row.date,
      row.driverName,
      row.jobs,
      row.fuel,
      row.services,
      row.extraCharges,
      row.total,
    ]);

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: {
        cellPadding: 2,
        fontSize: 10,
      },
      columnStyles: {
        3: { halign: "right" }, // Jobs column
        4: { halign: "right" }, // Fuel column
        5: { halign: "right" }, // Services column
        6: { halign: "right" }, // Extra Charges column
        7: { halign: "right" }, // Total column
      },
    });

    doc.save("truck_data_report.pdf");
  };

  // Modal Handlers
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFilterType("");
    setFilterValue("");
  };

  const handleExport = () => {
    let filteredData = [];

    if (filterType === "1") {
      // Filter by S No Range
      const start = parseInt(startValue, 10);
      const end = parseInt(endValue, 10);

      if (!isNaN(start) && !isNaN(end)) {
        filteredData = rows.filter(
          (_, index) => index + 1 >= start && index + 1 <= end
        );
      } else {
        alert("Please enter valid starting and ending S No values.");
        return;
      }
    } else if (filterType === "2") {
      // Filter by Date Range
      if (!startDate || !endDate) {
        alert("Please select both a start date and an end date.");
        return;
      }

      const startRange = new Date(startDate);
      const endRange = new Date(endDate);

      if (startRange > endRange) {
        alert("Start date cannot be later than end date.");
        return;
      }

      filteredData = rows.filter((row) => {
        const rowDate = new Date(row.date);
        return rowDate >= startRange && rowDate <= endRange;
      });
    } else if (filterType === "3") {
      // Filter by Month
      const selectedMonth = parseInt(filterValue, 10); // Get the selected month (1-12)
      if (!isNaN(selectedMonth)) {
        filteredData = rows.filter((row) => {
          const rowDate = new Date(row.date);
          return (
            rowDate.getMonth() + 1 === selectedMonth &&
            rowDate.getFullYear() === year
          );
        });
      }
    } else if (filterType === "4") {
      // Filter by Year
      const selectedYear = parseInt(filterValue, 10); // Get the selected year
      if (!isNaN(selectedYear)) {
        filteredData = rows.filter((row) => {
          const rowDate = new Date(row.date);
          return rowDate.getFullYear() === selectedYear;
        });
      }
    }

    if (filteredData.length === 0) {
      alert("No data found for the selected filter.");
      closeModal();
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Truck2 Data Report", 14, 20);

    const headers = [
      "S No",
      "Date",
      "Driver Name",
      "Jobs",
      "Fuel",
      "Services",
      "Extra Charges",
      "Total",
    ];

    const tableData = filteredData.map((row, index) => [
      index + 1,
      row.date,
      row.driverName,
      row.jobs,
      row.fuel,
      row.services,
      row.extraCharges,
      row.total,
    ]);

    const totalJobs = filteredData.reduce(
      (acc, row) => acc + extractNumber(row.jobs),
      0
    );
    const totalFuel = filteredData.reduce(
      (acc, row) => acc + extractNumber(row.fuel),
      0
    );
    const totalServices = filteredData.reduce(
      (acc, row) => acc + extractNumber(row.services),
      0
    );
    const totalExtraCharges = filteredData.reduce(
      (acc, row) => acc + extractNumber(row.extraCharges),
      0
    );
    const overallTotal = filteredData.reduce(
      (acc, row) => acc + (row.total || 0),
      0
    );

    const totalsRow = [
      "Totals:",
      "",
      "",
      totalJobs.toFixed(2),
      totalFuel.toFixed(2),
      totalServices.toFixed(2),
      totalExtraCharges.toFixed(2),
      overallTotal.toFixed(2),
    ];

    doc.autoTable({
      head: [headers],
      body: [...tableData, totalsRow],
      startY: 30,
      theme: "grid",
      styles: {
        cellPadding: 2,
        fontSize: 10,
      },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
      },
    });

    doc.save("truck_data_report.pdf");
    closeModal();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = filterByDate(rows);
  const columnTotals = calculateColumnTotals();

  return (
    <div className="container">
      <form onSubmit={saveData} className="mb-4">
        {/* First Row: Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="driverName"
            placeholder="Driver Name"
            value={formData.driverName}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="jobs"
            placeholder="Jobs"
            value={formData.jobs}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="fuel"
            placeholder="Fuel"
            value={formData.fuel}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="services"
            placeholder="Services"
            value={formData.services}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="extraCharges"
            placeholder="Extra Charges"
            value={formData.extraCharges}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Second Row: Total Field */}
        <div className="flex justify-center items-center mb-4">
          <label className="mr-2 font-medium">Total:</label>
          <input
            type="text"
            name="total"
            value={formData.total.toFixed(2)}
            readOnly
            className="w-32 border p-2 rounded-md bg-gray-100 text-center"
          />
        </div>

        {/* Save/Update Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {formData.id ? "Update" : "Save"}
        </button>
      </form>
      {/* Export Button */}
      <button
        onClick={openModal}
        className="w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors mb-1"
      >
        Export to PDF
      </button>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <table className="min-w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">S No</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Driver Name</th>
              <th className="border p-2">Jobs</th>
              <th className="border p-2">Fuel</th>
              <th className="border p-2">Services</th>
              <th className="border p-2">Extra Charges</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, index) => (
              <tr key={row.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{row.date}</td>
                <td className="border p-2">{row.driverName}</td>
                <td className="border p-2">{row.jobs}</td>
                <td className="border p-2">{row.fuel}</td>
                <td className="border p-2">{row.services}</td>
                <td className="border p-2">{row.extraCharges}</td>
                <td className="border p-2">{row.total}</td>
                <td className="border p-2">
                  <button
                    onClick={() => editData(row)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-700 transition-colors mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteData(row.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {/* Totals Row */}
            <tr className="font-bold">
              <td colSpan="3" className="border p-2 text-right">
                Totals:
              </td>
              <td className="border p-2">
                {columnTotals.totalJobs.toFixed(2)}
              </td>
              <td className="border p-2">
                {columnTotals.totalFuel.toFixed(2)}
              </td>
              <td className="border p-2">
                {columnTotals.totalServices.toFixed(2)}
              </td>
              <td className="border p-2">
                {columnTotals.totalExtraCharges.toFixed(2)}
              </td>
              <td className="border p-2">
                {calculateOverallTotal().toFixed(2)}
              </td>
              <td className="border p-2"></td>{" "}
              {/* Empty cell for Actions column */}
            </tr>
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        {/* Previous Button */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage * rowsPerPage >= rows.length}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentPage * rowsPerPage >= rows.length
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          {/* Modal Container */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Export Options
            </h2>

            {/* Filter Type Dropdown */}
            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Filter By:
              </span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Filter Type</option>
                <option value="1">By S No Range</option>
                <option value="2">By Date Range</option>
                <option value="3">By Months</option>
                <option value="4">By Years</option>
              </select>
            </label>

            {/* S No Range Input */}
            {filterType === "1" && (
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Starting S No:
                  </span>
                  <input
                    type="number"
                    value={startValue}
                    onChange={(e) => setStartValue(e.target.value)}
                    placeholder="Enter starting S No"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Ending S No:
                  </span>
                  <input
                    type="number"
                    value={endValue}
                    onChange={(e) => setEndValue(e.target.value)}
                    placeholder="Enter ending S No"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </label>
              </div>
            )}

            {/* Date Range Input */}
            {filterType === "2" && (
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date:
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    End Date:
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </label>
              </div>
            )}

            {/* Month Dropdown */}
            {filterType === "3" && (
              <div className="block mb-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Select Month:
                  </span>
                  <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Month</option>
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
                      <option key={index + 1} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {/* Year Dropdown */}
            {filterType === "4" && (
              <div className="block mb-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Select Year:
                  </span>
                  <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    {[
                      ...new Set(
                        rows.map((row) => new Date(row.date).getFullYear())
                      ),
                    ].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Chart Section */}
      <div className="mt-8">
        {/* Filter Controls */}
        <div className="flex space-x-4 mb-4">
          <select
            value={filterValue}
            onChange={(e) => {
              setFilterType("month");
              setFilterValue(e.target.value);
            }}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Month</option>
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
            ].map((monthName, index) => (
              <option key={index} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>

          <select
            value={filterValue}
            onChange={(e) => {
              setFilterType("year");
              setFilterValue(e.target.value);
            }}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Year</option>
            {[
              ...new Set(rows.map((row) => new Date(row.date).getFullYear())),
            ].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setFilterType("all");
              setFilterValue("");
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Show All-Time Data
          </button>
        </div>

        {/* Chart */}
        <Line data={prepareChartData()} />
      </div>
    </div>
  );
}

export default Truck2;
