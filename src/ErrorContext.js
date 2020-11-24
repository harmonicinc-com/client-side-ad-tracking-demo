import React, { useState } from 'react';

const ErrorContext = React.createContext({
    errors: {},
    reportError: (key, message) => {},
    acknowledgeError: (key) => {}
});

function DefaultErrorContextProvider(props) {
    const [errors, setErrors] = useState({});

    const reportError = (key, message) => {
        setErrors({
            ...errors,
            [key]: {
                message: message,
                acknowledged: false
            }
        });
    }

    const acknowledgeError = (key) => {
        const error = errors[key];
        if (error) {
            setErrors({
                ...errors,
                [key]: {
                    ...error,
                    acknowledged: true
                }
            });
        }
    }

    return (
        <ErrorContext.Provider value={{errors, reportError, acknowledgeError}}>
            {props.children}
        </ErrorContext.Provider>
    );
}

export { ErrorContext, DefaultErrorContextProvider } ;
