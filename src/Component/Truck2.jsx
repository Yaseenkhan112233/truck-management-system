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
  const rowsPerPage = 10;

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
      data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Correct sorting order

      // Update rows with sorted data
      setRows(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
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
          total: formData.total, // Save total to Firestore
        });
      } else {
        // Ensure date is stored in a consistent format
        await addDoc(collection(db, "Truck2"), {
          date: new Date(), // Store the current date/time when saved
          driverName: formData.driverName,
          jobs: formData.jobs,
          fuel: formData.fuel,
          services: formData.services,
          extraCharges: formData.extraCharges,
          total: formData.total, // Save total to Firestore
        });
      }

      // Reset the form after saving
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

      // Re-fetch and sort data after saving
      fetchData(); // Call fetchData to ensure the table is updated immediately
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
        fetchData(); // Re-fetch data after deleting
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
      total: row.total, // Set total from Firestore
      id: row.id,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For fields fuel, services, and extraCharges, handle both numbers and strings
    if (name === "fuel" || name === "services" || name === "extraCharges") {
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
  const extractNumber = (input) => {
    const match = input.match(/[\d\.]+/); // Regular expression to match numbers
    return match ? parseFloat(match[0]) : 0; // Return the first matched number or 0 if no match
  };

  // Calculate total based on Fuel, Services, and Extra Charges
  const calculateTotal = (updatedFormData) => {
    const fuel = extractNumber(updatedFormData.fuel);
    const services = extractNumber(updatedFormData.services);
    const extraCharges = extractNumber(updatedFormData.extraCharges);
    const total = fuel + services + extraCharges;

    setFormData((prev) => ({
      ...prev,
      total, // Set the total value
    }));
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

  // Export data to PDF, including overall total, in the same format as displayed
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

    // First, create the main table without totals
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
        4: { halign: "right" }, // Fuel column
        5: { halign: "right" }, // Services column
        6: { halign: "right" }, // Extra Charges column
        7: { halign: "right" }, // Total column
      },
    });

    // Calculate totals
    const totalFuel = rows.reduce(
      (acc, row) => acc + (parseFloat(row.fuel) || 0),
      0
    );
    const totalServices = rows.reduce(
      (acc, row) => acc + (parseFloat(row.services) || 0),
      0
    );
    const totalExtraCharges = rows.reduce(
      (acc, row) => acc + (parseFloat(row.extraCharges) || 0),
      0
    );
    const overallTotal = calculateOverallTotal();

    // Create totals row in a separate table
    const totalsData = [
      [
        "FUEL ", // S No
        totalFuel.toFixed(2), // Fuel total
        "SERVICE ", // Date
        totalServices.toFixed(2), // Services total
        "EXTRA ", // Driver Name
        totalExtraCharges.toFixed(2), // Extra Charges total
        "OVERALL :", // Jobs
        overallTotal.toFixed(2), // Overall total
      ],
    ];

    // Add the totals table with some spacing
    doc.autoTable({
      body: totalsData,
      startY: doc.lastAutoTable.finalY + 5, // Add 5 units of space
      theme: "grid",
      styles: {
        cellPadding: 2,
        fontSize: 10,
      },
      columnStyles: {
        4: { halign: "right" }, // Fuel column
        5: { halign: "right" }, // Services column
        6: { halign: "right" }, // Extra Charges column
        7: { halign: "right" }, // Total column
      },
    });

    // Save the generated PDF
    doc.save("truck_data_report.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = filterByDate(rows);

  return (
    <div className="p-4 md:p-6 max-w-full overflow-hidden">
      {/* Filter by Month and Year */}
      <div className="flex justify-between mb-6">
        <div>
          <label className="mr-4">Month:</label>
          <select
            value={month}
            onChange={handleMonthChange}
            className="border p-2 rounded-md"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-4">Year:</label>
          <select
            value={year}
            onChange={handleYearChange}
            className="border p-2 rounded-md"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Form */}
      <form onSubmit={saveData} className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="text"
            name="driverName"
            placeholder="Driver Name"
            value={formData.driverName}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="text"
            name="jobs"
            placeholder="Jobs"
            value={formData.jobs}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="text"
            name="fuel"
            placeholder="Fuel"
            value={formData.fuel}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="text"
            name="services"
            placeholder="Services"
            value={formData.services}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="text"
            name="extraCharges"
            placeholder="Extra Charges"
            value={formData.extraCharges}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* Total Input Field */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          <input
            type="text"
            name="total"
            value={formData.total.toFixed(2)}
            readOnly
            className="w-full border p-2 rounded-md bg-gray-100 text-center"
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {formData.id ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {/* Export Button */}
      <div className="mb-4">
        <button
          onClick={exportToPDF}
          className="w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Export to PDF
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p>Loading...</p>
        </div>
      ) : (
        /* Responsive Table */
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jobs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Extra Charges
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRows.map((row, index) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {row.date}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {row.driverName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {row.jobs}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {row.fuel}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {row.services}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {row.extraCharges}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {row.total}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editData(row)}
                            className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteData(row.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Overall Total Row */}
                  <tr>
                    <td
                      colSpan="7"
                      className="text-right px-4 py-2 text-sm font-medium text-gray-500"
                    >
                      Overall Total
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-500">
                      {calculateOverallTotal().toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mb-4 flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage * rowsPerPage >= filteredRows.length}
          className="bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Truck2;
