import { useEffect, useState } from "react";

const ApproveReport = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch users and reports data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const [usersResponse, reportsResponse] = await Promise.all([
          fetch(`${API_URL}/allusers`),
          fetch(`${API_URL}/charts`),
        ]);

        if (!usersResponse.ok || !reportsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [usersData, reportsData] = await Promise.all([
          usersResponse.json(),
          reportsResponse.json(),
        ]);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setReports(Array.isArray(reportsData) ? reportsData : []);
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Handle status change for a report
  const handleStatusChange = async (reportId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "accepted" : "pending";
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}/${newStatus}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the reports state with the new status
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (err) {
      console.error("Error updating status", err);
      setError("Failed to update status. Please try again.");
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-white/80">Loading reports...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-red-500/50">
        <p className="text-center text-red-400 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 mx-auto block bg-purple-700 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render the main table
  return (
    <div className="px-6 py-8 bg-black text-white">
      <div className="mb-6 text-center">
        <span className="bg-purple-700 text-white text-sm font-medium px-4 py-1 rounded-full">
          Admin Panel
        </span>
        <h2 className="text-3xl font-bold mt-3 mb-2 text-white">Greencoin Report Verification</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Review and approve submitted waste reports to reward users with Greencoins based on their environmental contributions.
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-md">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">User</th>
                {/* <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Location</th> */}
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Current GC</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Waste Type</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Quantity</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Location Type</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Address</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Reward</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="py-4 px-3 text-left text-sm font-semibold text-gray-300">Approve</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => {
                  const user = users.find((u) => u.clerkId === report.user) || {};
                  return (
                    <tr
                      key={report._id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-200"
                    >
                      <td className="py-4 px-3 text-gray-300">{user.clerkId || "N/A"}</td>
                      {/* <td className="py-4 px-3 text-gray-300">{user.location || "N/A"}</td> */}
                      <td className="py-4 px-3">
                        <div className="flex items-center">
                          <span className="text-green-400 mr-1">•</span>
                          <span>{user.greenCoins || "0"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-gray-300">{report.waste_type}</td>
                      <td className="py-4 px-3 text-gray-300">{report.estimated_quantity}</td>
                      <td className="py-4 px-3 text-gray-300">{report.location_type}</td>
                      <td className="py-4 px-3 text-gray-300">{report.location}</td>
                      <td className="py-4 px-3">
                        <div className="flex items-center">
                          <span className="text-green-400 mr-1">+</span>
                          <span>{report.coinsEarned}</span>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          report.status === "accepted" 
                            ? "bg-green-900/40 text-green-400" 
                            : "bg-yellow-900/40 text-yellow-400"
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={report.status === "accepted"}
                            onChange={() => handleStatusChange(report._id, report.status)}
                            className="cursor-pointer appearance-none h-6 w-6 rounded border border-gray-600 bg-gray-800 checked:bg-green-700 checked:border-green-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                          />
                          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none text-white transition-opacity ${report.status === "accepted" ? "opacity-100" : "opacity-0"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 px-4 text-center text-gray-400">
                    <p>No waste reports found to approve.</p>
                    <p className="text-sm mt-1">New reports will appear here once users submit them.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-800 flex justify-between items-center">
          <span className="text-sm text-gray-400">
            Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
          </span>
  
        </div>
      </div>
    </div>
  );
};

export default ApproveReport;