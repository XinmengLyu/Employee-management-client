const initState = {
    data: [],
    currentPage: 0,
    hasMore: true,
    isLoading: false,
    err: null,
    search: "",
    field: "",
    sort: "",
};

const list = (state = initState, action) => {
    switch (action.type) {
        case "GET_LIST_REQUEST": {
            return {
                ...state,
                isLoading: true,
                err: null
            }
        }
        case "GET_LIST_SUCCESS": {
            return {
                ...state,
                data: action.data,
                currentPage: action.currentPage,
                hasMore: action.hasMore,
                isLoading: false,
                err: null
            }
        }
        case "GET_LIST_FAIL": {
            return {
                ...state,
                isLoading: false,
                err: action.err
            }
        }
        case "UPDATE_SEARCH": {
            return {
                ...state,
                currentPage: 0,
                search: action.search
            }
        }
        case "UPDATE_SORT": {
            return {
                ...state,
                currentPage: 0,
                field: action.field,
                sort: action.sort,
            }
        }
        case "LOAD_ANOTHER_PAGE": {
            return {
                ...state,
                data: [...state.data, ...action.data],
                currentPage: action.currentPage,
                hasMore: action.hasMore,
                isLoading: false,
                err: null,
            }
        }
        case "UPDATE_DB_REQUEST": {
            return {
                ...state,
                isLoading: true,
                err: null,
            }
        }
        case "UPDATE_DB_SUCCCESS": {
            return {
                ...state,
                isLoading: false,
                err: null
            }
        }
        case "UPADTE_DB_FAIL": {
            return {
                ...state,
                isLoading: false,
                err: action.err,
            }
        }
        default: {
            return state;
        }
    }
}

export default list;
