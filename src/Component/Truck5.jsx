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

function Truck5() {
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    date: currentDate,
    driverName: "",
    jobs: "",
    fuel: "",
    services: "",
    extraCharges: "",
    id: null,
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from Firestore (using 'Truck5' collection)
  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Truck5"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRows(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Save data to Firestore
  const saveData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        const docRef = doc(db, "Truck5", formData.id);
        await updateDoc(docRef, {
          date: formData.date,
          driverName: formData.driverName,
          jobs: formData.jobs,
          fuel: formData.fuel,
          services: formData.services,
          extraCharges: formData.extraCharges,
        });
      } else {
        await addDoc(collection(db, "Truck5"), {
          date: formData.date,
          driverName: formData.driverName,
          jobs: formData.jobs,
          fuel: formData.fuel,
          services: formData.services,
          extraCharges: formData.extraCharges,
        });
      }
      setFormData({
        date: currentDate,
        driverName: "",
        jobs: "",
        fuel: "",
        services: "",
        extraCharges: "",
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
        await deleteDoc(doc(db, "Truck5", id));
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
      id: row.id,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Truck5 Data Report", 14, 20);
    const headers = [
      "S No",
      "Date",
      "Driver Name",
      "Jobs",
      "Fuel",
      "Services",
      "Extra Charges",
    ];
    const tableData = rows.map((row, index) => [
      index + 1,
      row.date,
      row.driverName,
      row.jobs,
      row.fuel,
      row.services,
      row.extraCharges,
    ]);
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      theme: "grid",
    });
    doc.save("truck_data_report.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-full overflow-hidden">
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((row, index) => (
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Truck5;
