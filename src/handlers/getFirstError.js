export default function getFirstError(error) {
    if (Array.isArray(error)) {
        return error[0];
    }

    return error;
}