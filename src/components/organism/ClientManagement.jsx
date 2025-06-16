import { useEffect, useState } from "react";
import { fetchClients } from "@/utils/clientApi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ClientCard from "./ClientCard";
import Heading from "../atoms/Heading/Heading";

export default function ClientManagement() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchClients().then(setClients);
  }, []);

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-soft col-span-2"
      style={{ background: "var(--client-card-bg)" }}
    >
      <div className="flex justify-between items-center mb-6">
        <Heading className="font-bold text-lg" level='6' style={{ color: "var(--client-card-title)" }}>
          Client Management
        </Heading>
        <button
          className="cursor-pointer text-primary flex items-center text-sm"
          style={{ color: "var(--color-primary)" }}
        >          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Add New Client
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {clients.map((client, idx) => (
          <ClientCard key={idx} client={client} />
        ))}
      </div>
    </div>
  );
}