export const missingPasswordAuth = {
    error: {
        errorsMessages: [
            {
                message: 'password is required',
                field: 'password'
            }
        ]
    }
};
export const missingLoginOrEmailAuth = {
    error: {
        errorsMessages: [
            {
                message: 'loginOrEmail is required',
                field: 'loginOrEmail'
            }
        ]
    }
};
export const invalidPasswordAuth = {
    error: {
        errorsMessages: [
            {
                message: 'password should be string',
                field: 'password'
            }
        ]
    }
};
export const invalidLoginOrEmailAuth = {
    error: {
        errorsMessages: [
            {
                message: 'loginOrEmail should be string',
                field: 'loginOrEmail'
            }
        ]
    }
};
