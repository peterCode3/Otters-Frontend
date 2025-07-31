import React from 'react'
import NotifyForm from '../../template/NotifyForm'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';


function ArchivedNotifiy({onAction, onclose,heading='Archive Lead(s)?', description, 
    subDescription = 'You can still access them from archived records.', primaryButtonText ='Archive Lead(s)'}) {
    return (
        <NotifyForm
            icon={faTriangleExclamation}
            heading={heading}
            title="Confirmation"
            description={description}
            subDescription={subDescription}
            primaryButtonClass='cursor-pointer w-full hover:bg-primary/90 text-white font-medium py-3 rounded-lg mb-3'
            primaryButtonText={primaryButtonText}
            onPrimary={onAction}
            secondaryButtonClass='cursor-pointer w-full border border-primary text-primary font-medium py-3 rounded-lg'
            secondaryButtonText="Cancel"
            onSecondary={onclose}
        />)
}

export default ArchivedNotifiy