import React from 'react'
import Heading from '../atoms/Heading/Heading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons'

function DashboardHeader({title, btnText}) {
    return (
        <header className="mb-8">
            <div className="flex justify-between items-center">
                <Heading
                    level='4'
                    className="text-2xl font-bold"
                    style={{ color: 'var(--dashboard-header-title)' }}
                >
                    {title}
                </Heading>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="pl-10 pr-4 py-2 rounded-lg border w-64 focus:outline-none focus:ring-1"
                            style={{
                                background: 'var(--dashboard-header-input-bg)',
                                borderColor: 'var(--dashboard-header-input-border)',
                                color: 'var(--dashboard-header-input-text)',
                            }}
                        />
                        <div
                            className="absolute left-3 top-2.5"
                            style={{ color: 'var(--dashboard-header-input-placeholder)' }}
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                    </div>
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg font-medium flex items-center"
                        style={{
                            background: 'var(--dashboard-header-btn-bg)',
                            color: 'var(--dashboard-header-btn-text)',
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        {btnText}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default DashboardHeader