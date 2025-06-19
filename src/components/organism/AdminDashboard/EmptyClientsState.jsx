import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faPlus,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Popup from "../Popup";
import AddNewClient from "../AddNewClient";
import Heading from "../../atoms/Heading/Heading";

export default function EmptyClientsState() {
    const [open, setOpen] = useState(false);

    return (
        <div>
        <div className="flex flex-col items-center justify-center h-[600px] bg-transparent">
            <div className="bg-white rounded-2xl shadow-soft px-10 py-14 flex flex-col items-center max-w-xl text-center">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'var(--bg-light-primary)'}}>
                        <FontAwesomeIcon icon={faUsers} className="text-primary text-4xl" />
                    </div>
                    <Heading className="text-2xl font-bold mb-2" level='3' style={{ color: "var(--unqualified-title)" }}>No Clients Added Yet</Heading>
                    <p className="text-secondary text-base font-normal">
                        Get started by adding your first client to unlock the full power of the Soft Dashboard Interface. Once added, you'll be able to monitor leads, track scoring trends, and manage activity effortlessly.
                    </p>
                </div>
                <button
                    className="mt-4 cursor-pointer bg-primary text-white font-semibold px-8 py-3 rounded-lg shadow-soft flex items-center transition hover:bg-primary/90"
                    onClick={() => setOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add New Client
                </button>
                <div className="mt-8 flex flex-col items-center space-y-2 w-full">
                    <div className="flex items-center text-sm text-secondary justify-center">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-primary mr-2" />
                        Want to learn more?
                        <span className="ml-1 text-primary underline hover:text-primary/80 transition cursor-pointer">
                            Read the onboarding guide
                        </span>
                    </div>
                </div>
            </div>
            <Popup open={open} onClose={() => setOpen(false)}>
                <AddNewClient />
            </Popup>
            
        </div>
        <div id="empty-bento-placeholder" className="grid grid-cols-3 gap-6 mt-12 opacity-70 pointer-events-none">
            <div className="rounded-xl bg-white h-32"></div>
            <div className="rounded-xl bg-white h-32"></div>
            <div className="rounded-xl bg-white h-32"></div>
            <div className="rounded-xl bg-white h-56 col-span-2"></div>
            <div className="rounded-xl bg-white h-56"></div>
            <div className="rounded-xl bg-white h-80 col-span-3"></div>
        </div>
        </div>
    );
}