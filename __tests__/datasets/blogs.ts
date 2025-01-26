export const invalidNameBlog = {
    payload: {
        'name': 1,
        'description': 'valid',
        'websiteUrl': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZA'
    },
    error: {
        errorsMessages: [
            {
                message: 'name should be string',
                field: 'name'
            }
        ]
    }
};
export const invalidDescBlog = {
    payload: {
        'name': 'valid',
        'description': 1,
        'websiteUrl': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZA'
    },
    error: {
        errorsMessages: [
            {
                message: 'description should be string',
                field: 'description'
            }
        ]
    }
};
export const invalidUrlBlog = {
    payload: {
        'name': 'valid',
        'description': 'string',
        'websiteUrl': 1
    },
    error: {
        errorsMessages: [
            {
                message: 'website url should be string',
                field: 'websiteUrl'
            }
        ]
    }
};
export const missingNameBlog = {
    payload: {
        'description': 'string',
        'websiteUrl': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZA'
    },
    error: {
        errorsMessages: [
            {
                message: 'name is required',
                field: 'name'
            }
        ]
    }
};
export const missingDescBlog = {
    payload: {
        'name': 'valid name',
        'websiteUrl': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZA'
    },
    error: {
        errorsMessages: [
            {
                message: 'description is required',
                field: 'description'
            }
        ]
    }
};
export const missingUrlBlog = {
    payload: {
        'name': 'valid name',
        'description': 'string'
    },
    error: {
        errorsMessages: [
            {
                message: 'website url is required',
                field: 'websiteUrl'
            }
        ]
    }
};
export const missingAllBlog = {
    payload: {},
    error: {
        errorsMessages: [
            {
                message: 'name is required',
                field: 'name'
            },
            {
                message: 'description is required',
                field: 'description'
            },
            {
                message: 'website url is required',
                field: 'websiteUrl'
            }
        ]
    }
};
export const tooLongNameBlog = {
    payload: {
        'name': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZA',
        'description': 'string',
        'websiteUrl': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZA'
    },
    error: {
        errorsMessages: [
            {
                message: 'name should contain 1 - 15 characters',
                field: 'name'
            }
        ]
    }
};
export const tooLongDescBlog = {
    payload: {
        'name': 'valid',
        'description': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZAmhttps://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZAmhttps://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZAmhttps://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZAmhttps://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZAm',
        'websiteUrl': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZA'
    },
    error: {
        errorsMessages: [
            {
                message: 'description should contain 1 - 500 characters',
                field: 'description'
            }
        ]
    }
};
export const tooLongUrlBlog = {
    payload: {
        'name': 'valid name',
        'description': 'string',
        'websiteUrl': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZAhttps://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q'
    },
    error: {
        errorsMessages: [
            {
                message: 'website url should contain 1 - 100 characters',
                field: 'websiteUrl'
            }
        ]
    }
};
export const incorrectUrlPattern = {
    payload: {
        'name': 'valid name',
        'description': 'string',
        'websiteUrl': '1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb'
    },
    error: {
        errorsMessages: [
            {
                message: 'website url must match URL pattern',
                field: 'websiteUrl'
            }
        ]
    }
};
export const validBlog = {
    payload: {
        'name': 'valid name',
        'description': 'valid desc',
        'websiteUrl': 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.kKX8WgmbfmBjIMUIFDjMZA'
    }
};
