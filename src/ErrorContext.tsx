import React, { useState } from 'react';
import ErrorContextInterface, {Errors} from "../types/ErrorContextInterface";

const ErrorContext = React.createContext<ErrorContextInterface>({
    errors: {},
    reportError: () => {},
    acknowledgeError: () => {}
});

function DefaultErrorContextProvider(props: any) {
    const [errors, setErrors] = useState<Errors>({});

    const reportError = (key: string, message: string) => {
        setErrors({
            ...errors,
            [key]: {
                message: message,
                acknowledged: false
            }
        });
    }

    const acknowledgeError = (key: string) => {
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
