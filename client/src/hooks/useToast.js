import { useState } from 'react';

export const useToast = (initialMessage = '', initialType = '') => {
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState(initialType);
    const [toastMessage, setToastMessage] = useState(initialMessage);

    const showToastWithMessage = (message, type = 'default') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const hideToast = () => {
        setShowToast(false);
    };

    return [
        showToast,
        toastType,
        toastMessage,
        hideToast,
        showToastWithMessage
    ];
};
