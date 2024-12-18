"use client";

import { useState, useEffect } from "react";

const Dashboard = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch data when the page is loaded
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/endpoints");
        const data = await res.json();
        setEndpoints(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {endpoints.map((endpoint) => {
        const isExpanded = expandedId === endpoint.id;

        const getStatusColour = (status) => {
          switch (status) {
            case "success":
              return "bg-green-300";
            case "failure":
            case "error":
              return "bg-red-300";
            case "slow":
              return "bg-yellow-300";
            default:
              return "bg-gray-300";
          }
        };

        return (
          <div
            key={endpoint.id}
            className={`p-4 rounded-lg shadow-md ${getStatusColour(
              endpoint.status
            )}`}
          >
            <h3 className="text-xl font-bold">{endpoint.name}</h3>
            <p className="text-sm">{endpoint.url}</p>

            <p className="mt-2">
              {endpoint.lastChecked && (
                <>
                  Last check: {endpoint.status} -
                  {new Date(endpoint.lastChecked).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </>
              )}
              {!endpoint.lastChecked && <>Last check: Never</>}
            </p>

            <button
              onClick={() => setExpandedId(isExpanded ? null : endpoint.id)} // Toggle expansion
              className="mt-4 bg-white text-black py-2 px-4 rounded-lg"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>

            {isExpanded && (
              <div className="mt-4">
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(endpoint.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Frequency:</strong> {endpoint.frequency} minutes
                </p>
                {endpoint.lastErrorMessage && (
                  <p>
                    <strong>Last Error Message:</strong>{" "}
                    {endpoint.lastErrorMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
