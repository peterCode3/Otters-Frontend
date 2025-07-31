import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';


function EmptyFilter({ResetFilter}) {
    return (
        <div id="leads-empty-state" className="flex items-center justify-center h-[480px]">
            <div className="bg-white rounded-2xl shadow-soft px-10 py-12 max-w-lg w-full flex flex-col items-center text-center">
                <div className="mb-6 flex items-center justify-center w-20 h-20 bg-[#DFEBF7] rounded-full">
                    <FontAwesomeIcon icon={faFaceFrown} className="text-4xl text-[var(--color-primary)]" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-2">No leads match your current filters.</h2>
                <p className="text-base text-softblue mb-6">Try adjusting filters or clearing your search.</p>
                <button onClick={ResetFilter} className="bg-[var(--color-primary)] cursor-pointer text-white font-semibold px-6 py-3 rounded-lg shadow-soft hover:bg-[#0093b8] transition">
                    Reset Filters
                </button>
            </div>
        </div>
    )
}

export default EmptyFilter