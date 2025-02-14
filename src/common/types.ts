export type ResultObj = {
    status: 'success' | 'error',
    id?: string,
    error?: any
}

export type errorMessage = {
    field: string,
    message: string
}
export type NotUniqueError = {
    errorsMessages: errorMessage[]
};