import React from 'react'
import NotifyForm from '../../template/NotifyForm'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';


function ArchivedNotifiy({onAction, onclose, description}) {
    return (
        <NotifyForm
            icon={faTriangleExclamation}
            heading="Archive Lead(s)?"
            title="Confirmation"
            description={description}
            subDescription="You can still access them from archived records."
            primaryButtonClass='cursor-pointer w-full hover:bg-primary/90 text-white font-medium py-3 rounded-lg mb-3'
            primaryButtonText="Archive Lead(s)"
            onPrimary={onAction}
            secondaryButtonClass='cursor-pointer w-full border border-primary text-primary font-medium py-3 rounded-lg'
            secondaryButtonText="Cancel"
            onSecondary={onclose}
        />)
}

export default ArchivedNotifiy