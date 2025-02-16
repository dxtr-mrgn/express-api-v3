export const defaultUserResponse = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0
};
export const invalidLoginUser = {
    payload: {
        login: '$$$',
        password: 'validpassword123',
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'login should match Login pattern',
                field: 'login'
            }
        ]
    }
};
export const invalidPasswordUser = {
    payload: {
        login: 'validLogin',
        password: [],
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'password should be string',
                field: 'password'
            }
        ]
    }
};
export const invalidEmailUser = {
    payload: {
        login: 'validLogin',
        password: 'password123',
        email: 'invalidemailgmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'email should match Email pattern',
                field: 'email'
            }
        ]
    }
};
export const missingLoginUser = {
    payload: {
        password: 'validpassword123',
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'login is required',
                field: 'login'
            }
        ]
    }
};
export const missingPasswordUser = {
    payload: {
        login: 'login',
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'password is required',
                field: 'password'
            }
        ]
    }
};
export const missingEmailUser = {
    payload: {
        login: 'login',
        password: 'validpassword123'
    },
    error: {
        errorsMessages: [
            {
                message: 'email is required',
                field: 'email'
            }
        ]
    }
};
export const missingAllUser = {
    payload: {},
    error: {
        errorsMessages: [
            {
                message: 'login is required',
                field: 'login'
            },
            {
                message: 'password is required',
                field: 'password'
            },
            {
                message: 'email is required',
                field: 'email'
            }
        ]
    }
};
export const tooLongLoginUser = {
    payload: {
        login: 'loginloginloginloginloginloginlogin',
        password: 'validpassword123',
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'login should contain 3 - 10 characters',
                field: 'login'
            }
        ]
    }
};
export const tooShortLoginUser = {
    payload: {
        login: 'lo',
        password: 'validpassword123',
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'login should contain 3 - 10 characters',
                field: 'login'
            }
        ]
    }
};

export const tooLongPasswordUser = {
    payload: {
        login: 'login',
        password: 'validpassword123validpassword123validpassword123validpassword123validpassword123',
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'password should contain 6 - 20 characters',
                field: 'password'
            }
        ]
    }
};
export const tooShortPasswordUser = {
    payload: {
        login: 'login',
        password: 'valid',
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'password should contain 6 - 20 characters',
                field: 'password'
            }
        ]
    }
};
export const validUser = {
    payload: {
        login: 'login',
        password: 'validpassword123',
        email: 'validemail@gmail.com'
    }
};

export const notUniqueLoginUser = {
    payload: {
        login: 'login',
        password: 'valid123',
        email: 'xxx@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'login should be unique',
                field: 'login'
            }
        ]
    }
};

export const notUniqueEmailUser = {
    payload: {
        login: 'XXX',
        password: 'valid123',
        email: 'validemail@gmail.com'
    },
    error: {
        errorsMessages: [
            {
                message: 'email should be unique',
                field: 'email'
            }
        ]
    }
};
