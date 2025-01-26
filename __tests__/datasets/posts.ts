export const invalidTitlePost = {
    payload: {
        'title': [],
        'shortDescription': 'valid shortDescription',
        'content': 'valid content',
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'title should be string',
                field: 'title'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
};
export const invalidDescPost = {
    payload: {
        'title': 'valid title',
        'shortDescription': [],
        'content': 'valid content',
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'shortDescription should be string',
                field: 'shortDescription'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
};
export const invalidContentPost = {
    payload: {
        'title': 'valid title',
        'shortDescription': 'valid shortDescription',
        'content': [],
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'content should be string',
                field: 'content'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
};
export const invalidBlogIdPost = {
    payload: {
        'title': 'valid title',
        'shortDescription': 'valid shortDescription',
        'content': 'valid content',
        'blogId': []
    },
    error: {
        errorsMessages: [
            {
                message: 'blogId should be string',
                field: 'blogId'
            }
        ]
    }
};
export const missingTitlePost = {
    payload: {
        'shortDescription': 'valid shortDescription',
        'content': 'valid content',
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'title is required',
                field: 'title'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
};
export const missingDescPost = {
    payload: {
        'title': 'valid title',
        'content': 'valid content',
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'shortDescription is required',
                field: 'shortDescription'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
};
export const missingContentPost = {
    payload: {
        'title': 'valid title',
        'shortDescription': 'valid shortDescription',
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'content is required',
                field: 'content'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
};
export const missingIdPost = {
    payload: {
        'title': 'valid title',
        'shortDescription': 'valid shortDescription',
        'content': 'valid content'
    },
    error: {
        errorsMessages: [
            {
                message: 'blogId is required',
                field: 'blogId'
            }
        ]
    }
};
export const missingAllPost = {
    payload: {},
    error: {
        errorsMessages: [
            {
                message: 'title is required',
                field: 'title'
            },
            {
                message: 'shortDescription is required',
                field: 'shortDescription'
            },
            {
                message: 'content is required',
                field: 'content'
            },
            {
                message: 'blogId is required',
                field: 'blogId'
            }
        ]
    }
};
export const tooLongTitlePost = {
    payload: {
        'title': 'valid title valid title valid title valid title valid title',
        'shortDescription': 'valid shortDescription',
        'content': 'valid content',
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'title should contain 1 - 30 characters',
                field: 'title'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
}
export const tooLongDescPost = {
    payload: {
        'title': 'valid title',
        'shortDescription': 'valid shortDescription valid shortDescription valid shortDescription valid shortDescription valid shortDescription valid shortDescription valid shortDescription',
        'content': 'valid content',
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'shortDescription should contain 1 - 100 characters',
                field: 'shortDescription'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
}
export const tooLongContentPost = {
    payload: {
        'title': 'valid title',
        'shortDescription': 'valid shortDescription',
        'content': 'valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content valid content ',
        'blogId': 'valid blogId',
    },
    error: {
        errorsMessages: [
            {
                message: 'content should contain 1 - 1000 characters',
                field: 'content'
            },
            { message: 'blogId is invalid', field: 'blogId' }
        ]
    }
}
export const validPost = {
    payload: {
        'title': 'valid title',
        'shortDescription': 'valid shortDescription',
        'content': 'valid content',
        'blogId': 'valid blogId',
    }
}
