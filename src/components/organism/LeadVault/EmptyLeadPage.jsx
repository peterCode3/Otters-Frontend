import React, { useState } from "react";
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import FilterBar from "./FilterBar";
import Popup from "../Popup";
import CsvWizard from "../UploadCSV/CsvWizard";
import { faGrip, faList, faDownload } from "@fortawesome/free-solid-svg-icons";

const filterOptions = [
    {
        name: "dateRange",
        label: "Date Range",
        options: [
            { value: "30d", label: "Last 30 Days" },
            { value: "7d", label: "Last 7 Days" },
            { value: "month", label: "This Month" },
            { value: "year", label: "This Year" },
        ],
    },
    {
        name: "intent",
        label: "Intent",
        options: [
            { value: "", label: "All" },
            { value: "Demo Request", label: "Demo Request" },
            { value: "Trial Signup", label: "Trial Signup" },
            { value: "General Inquiry", label: "General Inquiry" },
            { value: "Pricing Question", label: "Pricing Question" },
        ],
    },
    {
        name: "scoreRange",
        label: "Score Range",
        options: [
            { value: "", label: "All" },
            { value: "7-10", label: "7-10" },
            { value: "5-6.9", label: "5-6.9" },
            { value: "below5", label: "Below 5" },
        ],
    },
    {
        name: "source",
        label: "Source",
        options: [
            { value: "", label: "All" },
            { value: "Website", label: "Website" },
            { value: "Partner", label: "Partner" },
            { value: "Referral", label: "Referral" },
            { value: "Ad Campaign", label: "Ad Campaign" },
        ],
    },
];


export default function EmptyLeadPage() {
    const [filterValues, setFilterValues] = useState({});
    const [openCsv, setOpenCsv] = useState(false);
    const handleFilterChange = (name, value) => {
        setFilterValues((prev) => ({ ...prev, [name]: value }));
        // Optionally, trigger a fetch for filtered leads here
    };

    return (
        <>

            <div className="flex min-h-screen bg-background text-text">
                {/* Sidebar */}
                <Sidebar />
                {/* Main Content */}
                <main className="ml-64 p-8 flex-1">
                    {/* Header */}
                    <DashboardHeader title='Leads Vault' btnText='Import CSV' onButtonClick={() => setOpenCsv(true)} />
                    {/* Toolbar */}
                    <FilterBar
                        filters={filterOptions}
                        values={filterValues}
                        onChange={handleFilterChange}
                        className="mb-4 gap-x-6 gap-y-4 bg-white shadow-soft rounded-xl px-6 py-4"
                        buttons={[
                            {
                                icon: faGrip,
                                label: "",
                                // onClick: () => setView("grid"),
                                // active: view === "grid",
                                className: "bg-white text-gray-500",
                            },
                            {
                                icon: faList,
                                label: "",
                                // onClick: () => setView("list"),
                                // active: view === "list",
                                className: "bg-primary text-white",
                            },
                            {
                                icon: faDownload,
                                label: "Export CSV",
                                // onClick: exportCsv,
                                className: "text-gray-500 border border-gray-200 rounded-lg px-3 py-2 text-sm flex items-center ml-2",
                            },
                        ]}
                    />

                    {/* Table Skeleton */}
                    <div className="mt-8 bg-white rounded-xl shadow-soft p-0 mb-8 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 rounded-xl">
                            <thead className="bg-gray-50 rounded-t-xl">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary tracking-wider rounded-tl-xl">Name &amp; Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary tracking-wider">IQ Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary tracking-wider">Intent</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary tracking-wider">Source</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary tracking-wider">Date Added</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-secondary tracking-wider rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {[...Array(6)].map((_, i) => (
                                    <tr key={i} className="hover:bg-blue-50 transition">
                                        <td className="px-6 py-5 align-middle">
                                            <div className="flex flex-col gap-2">
                                                <div className="w-32 h-5 rounded-full shimmer"></div>
                                                <div className="w-28 h-4 rounded shimmer"></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-middle">
                                            <div className="w-14 h-6 rounded-full shimmer mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-5 align-middle">
                                            <div className="w-16 h-6 rounded-full shimmer mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-5 align-middle">
                                            <div className="w-16 h-6 rounded-full shimmer mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-5 align-middle">
                                            <div className="w-20 h-5 rounded shimmer mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-5 align-middle">
                                            <div className="w-16 h-4 rounded shimmer mx-auto"></div>
                                        </td>
                                        <td className="px-6 py-5 align-middle text-center space-x-2">
                                            <span className="inline-flex items-center justify-center w-9 h-9 shimmer rounded-full mx-1"></span>
                                            <span className="inline-flex items-center justify-center w-9 h-9 shimmer rounded-full mx-1"></span>
                                            <span className="inline-flex items-center justify-center w-9 h-9 shimmer rounded-full mx-1"></span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Bulk Actions */}
                    <div className="bg-white rounded-xl p-5 shadow-soft mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="text-sm font-medium">0 leads selected</div>
                                <button className="text-primary text-sm">Select All</button>
                                <button className="text-secondary text-sm">Clear Selection</button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="bg-white text-secondary border border-gray-200 rounded-lg px-4 py-2 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                    <i className="fa-solid fa-download mr-2"></i>
                                    Export Selected
                                </button>
                                <button className="bg-white text-secondary border border-gray-200 rounded-lg px-4 py-2 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                    <i className="fa-solid fa-tag mr-2"></i>
                                    Add Tags
                                </button>
                                <button className="bg-white text-secondary border border-gray-200 rounded-lg px-4 py-2 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                    <i className="fa-solid fa-archive mr-2"></i>
                                    Archive Selected
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-secondary">
                            Showing 1-6 of 248 leads
                        </div>
                        <div className="flex space-x-2">
                            <button className="w-9 h-9 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button className="w-9 h-9 rounded border border-gray-200 bg-primary text-white flex items-center justify-center">1</button>
                            <button className="w-9 h-9 rounded border border-gray-200 flex items-center justify-center">2</button>
                            <button className="w-9 h-9 rounded border border-gray-200 flex items-center justify-center">3</button>
                            <button className="w-9 h-9 rounded border border-gray-200 flex items-center justify-center">4</button>
                            <button className="w-9 h-9 rounded border border-gray-200 flex items-center justify-center">5</button>
                            <button className="w-9 h-9 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </main>
                <Popup open={openCsv} onClose={() => setOpenCsv(false)}>
                    <CsvWizard />
                </Popup>
            </div>
            {/* Shimmer CSS */}
            <style jsx global>{`
        .shimmer {
          position: relative;
          overflow: hidden;
          background-color: var(--skeleton, #E3E8EE);
        }
        .shimmer::before {
          content: '';
          display: block;
          position: absolute;
          top: 0; left: -150px;
          height: 100%;
          width: 150px;
          background: linear-gradient(90deg, rgba(227,232,238,0) 0%, rgba(245,247,250,0.7) 40%, rgba(227,232,238,0) 100%);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          100% { left: 100%; }
        }
      `}</style>
        </>
    );
}