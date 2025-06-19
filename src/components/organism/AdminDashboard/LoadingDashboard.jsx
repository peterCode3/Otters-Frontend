import React, { useState } from "react";
export default function LoadingDashboard() {

    return (
        <div className="ml-64 p-8 min-h-screen transition-colors bg-[var(--body-background)] text-text">
            <div id="empty-bento-placeholder" className="mb-6 grid grid-cols-4 gap-6 mt-12 pointer-events-none">
                <div className="rounded-xl bg-white h-23"></div>
                <div className="rounded-xl bg-white h-23"></div>
                <div className="rounded-xl bg-white h-23"></div>
                <div className="rounded-xl bg-white h-23"></div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="rounded-xl bg-white h-56 col-span-2"></div>
                    <div className="rounded-xl bg-white h-56"></div>
                </div>
                
                <div className="rounded-xl bg-white h-80 col-span-4 mb-6"></div>
                <div className="rounded-xl bg-white h-80 col-span-4"></div>
        </div>
    );
}