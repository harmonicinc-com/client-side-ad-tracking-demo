export interface Errors {
    [key: string]: {
        message: string;
        acknowledged?: boolean;
    }
}

export default interface ErrorContextInterface {
    errors: Errors,
    reportError: (key: string, message: string) => void;
    acknowledgeError: (key: string) => void;
}
