import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Api } from "../utils/api";
import { Process } from "../types/process";
import { ProcessResponse } from "../types/processResponse";
import { Header } from "../components/Header";
import { Pagination, PaginationResponse } from "../components/Pagination";

const Processes = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationResponse, setPaginationResponse] = useState<PaginationResponse>({
    total: 0,
    page: 1,
    per_page: 25,
    total_pages: 1,
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        let queryParams = `order=start_time|desc&page=${currentPage}`;

        if (startDateTime) {
          const formattedStart = format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss");
          queryParams += `&query=start_time|gte|${formattedStart}`;
        }
        if (endDateTime) {
          const formattedEnd = format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss");
          queryParams += `${startDateTime ? "," : "&query="}start_time|lte|${formattedEnd}`;
        }

        const response = await Api.get(`/processes?${queryParams}`) as ProcessResponse;
        setProcesses(response.items);
        setPaginationResponse(response.pagination);
      } catch (error) {
        console.error("Failed to fetch processes:", error);
      }
    };

    fetchProcesses();
  }, [currentPage, startDateTime, endDateTime]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filterId = params.get("filter");
    if (filterId && processes.length > 0) {
      const process = processes.find((p) => p.command_id === filterId);
      if (process) {
        setExpandedId(process.id);
        setHighlightedId(process.id);
        setTimeout(() => {
          const element = document.getElementById(`process-${process.id}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
        setTimeout(() => {
          setHighlightedId(null);
        }, 3000);
      }
    }
  }, [processes]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return <span className="badge badge-success">Success</span>;
    } else if (status === "failed") {
      return <span className="badge badge-error">Failed</span>;
    } else if (status === "running") {
      return <span className="badge badge-warning">Running</span>;
    }
    return <span className="badge">{status}</span>;
  };

  const handleClearFilters = () => {
    setStartDateTime(null);
    setEndDateTime(null);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto">
        <Header currentPage="processes" />

        {showFilters && (
          <div className="card bg-base-100 shadow-xl mb-4">
            <div className="card-body">
              <div className="flex gap-4 items-end flex-wrap">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Date & Time</span>
                  </label>
                  <Flatpickr
                    value={startDateTime || undefined}
                    onChange={(dates) => setStartDateTime(dates[0] || null)}
                    options={{
                      enableTime: true,
                      enableSeconds: true,
                      time_24hr: true,
                      dateFormat: "Y-m-d H:i:S",
                    }}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Date & Time</span>
                  </label>
                  <Flatpickr
                    value={endDateTime || undefined}
                    onChange={(dates) => setEndDateTime(dates[0] || null)}
                    options={{
                      enableTime: true,
                      enableSeconds: true,
                      time_24hr: true,
                      dateFormat: "Y-m-d H:i:S",
                    }}
                    className="input input-bordered"
                  />
                </div>
                <button
                  onClick={handleClearFilters}
                  className="btn btn-ghost"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-ghost btn-sm"
                title="Toggle Filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>
            </div>
            <div>
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="text-base-content">Type</th>
                    <th className="text-base-content">Status</th>
                    <th className="text-base-content">Start Time</th>
                    <th className="text-base-content">End Time</th>
                    <th className="text-base-content"></th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process) => (
                    <React.Fragment key={process.id}>
                      <tr
                        id={`process-${process.id}`}
                        className={`hover cursor-pointer transition-colors ${
                          highlightedId === process.id ? "bg-warning bg-opacity-30" : ""
                        }`}
                        onClick={() => toggleExpand(process.id)}
                      >
                        <td className="font-medium">{process.type}</td>
                        <td>{getStatusBadge(process.status)}</td>
                        <td>{format(new Date(process.start_time), "MMM d, yyyy HH:mm:ss")}</td>
                        <td>
                          {process.end_time
                            ? format(new Date(process.end_time), "MMM d, yyyy HH:mm:ss")
                            : "-"}
                        </td>
                        <td className="text-right">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform ${
                              expandedId === process.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </td>
                      </tr>
                      {expandedId === process.id && (
                        <tr>
                          <td colSpan={5} className="bg-base-200">
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Command:</h4>
                                <pre className="bg-base-300 p-3 rounded text-sm whitespace-pre-wrap break-words">
                                  {process.command}
                                </pre>
                              </div>
                              {process.output && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">Output:</h4>
                                  <pre className="bg-base-300 p-3 rounded text-sm overflow-x-auto max-h-64 overflow-y-auto">
                                    {process.output}
                                  </pre>
                                </div>
                              )}
                              {process.error && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 text-error">
                                    Error:
                                  </h4>
                                  <pre className="bg-base-300 p-3 rounded text-sm overflow-x-auto max-h-64 overflow-y-auto text-error">
                                    {process.error}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              paginationResponse={paginationResponse}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Processes;
