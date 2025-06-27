import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NotifyForm({
    icon,
    iconClass = "text-yellow-500 text-3xl",
    heading,
    title,
    description,
    subDescription,
    primaryButtonText,
    onPrimary,
    secondaryButtonText,
    onSecondary,
    primaryButtonClass = "w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg mb-3",
    secondaryButtonClass = "w-full border border-primary text-primary font-medium py-3 rounded-lg",
}) {
    return (
        <div className="min-h-screen flex items-center justify-center text-text p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-soft boxshadow-soft p-8 md:p-10 text-center">
                    {title && (
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center">
                                <span className="text-xl font-bold">{title}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-center mb-6">
                        <span className="bg-yellow-100 rounded-full p-4 mb-2 flex items-center justify-center">
                            <span className={iconClass}>
                                <FontAwesomeIcon icon={icon} />
                            </span>
                        </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">{heading}</h2>
                    <p className="text-secondary mb-4">{description}</p>
                    {subDescription && (
                        <p className="text-secondary text-sm mb-6">{subDescription}</p>
                    )}
                    <button className={primaryButtonClass} style={{background: 'var(--color-primary)'}} onClick={onPrimary}>
                        {primaryButtonText}
                    </button>
                    <button className={`${secondaryButtonClass}, cursor-pointer`} onClick={onSecondary}>
                        {secondaryButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}