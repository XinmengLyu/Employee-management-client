const initState = {
    data: [],
    currentPage: 0,
    hasMore: true,
    isLoading: false,
    warning: null,
    err: null,
    search: "",
    field: "",
    sort: "",
    manager: "",
    dr: "",
};

const list = (state = initState, action) => {
    switch (action.type) {
        case "GET_LIST_REQUEST": {
            return {
                ...state,
                isLoading: true,
                warning: null,
                err: null
            };
        }
        case "GET_LIST_SUCCESS": {
            return {
                ...state,
                data: action.data,
                currentPage: action.currentPage,
                hasMore: action.hasMore,
                isLoading: false,
                warning: null,
                err: null
            };
        }
        case "GET_LIST_FAIL": {
            return {
                ...state,
                isLoading: false,
                warning: null,
                err: action.err
            };
        }
        case "UPDATE_SEARCH": {
            return {
                ...state,
                currentPage: 0,
                search: action.search,
                manager: "",
                dr: "",
            };
        }
        case "UPDATE_MANAGER": {
            return {
                ...state,
                currentPage: 0,
                search: "",
                manager: action.manager,
                dr: "",
            }
        }
        case "UPDATE_DR": {
            return {
                ...state,
                currentPage: 0,
                search: "",
                manager: "",
                dr: action.dr,
            }
        }
        case "UPDATE_SORT": {
            return {
                ...state,
                currentPage: 0,
                field: action.field,
                sort: action.sort,
            };
        }
        case "LOAD_ANOTHER_PAGE": {
            return {
                ...state,
                data: [...state.data, ...action.data],
                currentPage: action.currentPage,
                hasMore: action.hasMore,
                isLoading: false,
                err: null,
            };
        }
        case "UPDATE_DB_REQUEST": {
            return {
                ...state,
                isLoading: true,
                warning: null,
                err: null,
            };
        }
        case "UPDATE_DB_SUCCCESS": {
            return {
                ...state,
                isLoading: false,
                warning: null,
                err: null
            };
        }
        case "UPADTE_DB_FAIL": {
            return {
                ...state,
                isLoading: false,
                warning: null,
                err: action.err,
            };
        }
        case "UPDATE_DB_WARNING": {
            return {
                ...state,
                isLoading: false,
                warning: action.warning,
                err: null
            };
        }
        default: {
            return state;
        }
    }
}

export default list;
