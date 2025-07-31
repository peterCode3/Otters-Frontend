import React, { useState, useEffect } from "react";
import LeadsTable from "./LeadsTable";
import FilterBar from "./FilterBar";
import { fetchClientsById } from "@/utils/clientApi";
import LeadHeader from "./LeadHeader";
import { fetchArchiveLeadByClientId } from "@/utils/archiveleadApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGrip,
    faList,
    faDownload,
} from "@fortawesome/free-solid-svg-icons";

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

export default function LeadVaultPage({ description, clientId, leads: propLeads, apiSource = ('leads'), ArchiveActionText }) {
    const [filterValues, setFilterValues] = useState({});
    const [client, setClient] = useState(null);
    const [view, setView] = useState('list');
    const [filteredLeads, setFilteredLeads] = useState(propLeads);
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState('');
    const pageSize = 20;
    useEffect(() => {
        if (clientId) {
            fetchClientsById(clientId).then((clientData) => setClient(clientData));
        }
    }, [clientId]);


    useEffect(() => {
        if (apiSource === 'archive') {
            (async function fetchFilteredLeads() {
                const data = await fetchArchiveLeadByClientId(clientId, page, pageSize, filterValues);
                console.log('total aya h nae', data.total)
                setFilteredLeads(data.leads || []);
                setTotal(data.total);
            })();
        }
    }, [filterValues, apiSource, clientId, page]);



    const handleFilterChange = (name, value) => {
        setFilterValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleResetFilters = () => {
        setFilterValues({});
    };



    return (
        <section>
            {client && (
                <LeadHeader
                    title={client.username}
                    subtitle="All leads for this client"
                    avatarUrl={client.logo}
                    tags={Array.isArray(client.industry_tag) ? client.industry_tag : [client.industry_tag].filter(Boolean)}
                    actions={
                        <FilterBar
                            filters={filterOptions}
                            values={filterValues}
                            onChange={handleFilterChange}
                            className="mb-4 gap-x-6 gap-y-4 bg-white shadow-soft rounded-xl px-6 py-4"
                            buttons={[
                                {
                                    icon: faGrip,
                                    label: "",
                                    onClick: () => setView('grid'),
                                    active: view === 'grid',
                                    // className: view === 'grid' ? "bg-primary text-white" : "text-gray-500",
                                },
                                {
                                    icon: faList,
                                    label: "",
                                    onClick: () => setView('list'),
                                    active: view === 'list',
                                    // className: view === 'list' ? "bg-primary text-white" : "text-gray-500",
                                },
                            ]}
                        />
                    }

                />
            )}
            <LeadsTable
                description={description}
                page = {page}
                setPage={setPage}
                clientId={clientId}
                Archivetotal= {total}
                filters={filterValues} 
                ResetFilter={handleResetFilters} 
                leads={filteredLeads} view={view} 
                setView={setView} 
                ArchiveActionText={ArchiveActionText} />
        </section>
    );
}