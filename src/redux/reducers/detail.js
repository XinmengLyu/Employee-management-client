const initState = {
    data: {},
    isLoading: false,
    err: null,
};

const detail = (state = initState, action) => {
    switch (action.type) {
        case "GET_DETAIL_REQUEST": {
            return {
                ...state,
                isLoading: true,
                err: null
            };
        }
        case "GET_DETAIL_SUCCESS": {
            return {
                data: action.data,
                isLoading: false,
                err: null
            };
        }
        case "GET_DETAIL_FAIL": {
            return {
                ...state,
                isLoading: false,
                err: action.err
            };
        }
        default: {
            return state;
        }
    }
}

export default detail;
