import axios from "axios";

//helper function
const decorateData = (data, pageOffset = 0) => {
    return data.map((user, index) => {
        return {
            key: index + pageOffset * 10,
            ...user
        }
    });
};

//basic action creaters for list reducer
const getListRequest = () => {
    return {
        type: "GET_LIST_REQUEST",
    }
};

const getListSuccess = (data) => {
    return {
        type: "GET_LIST_SUCCESS",
        data: data.docs,
        currentPage: data.page,
        hasMore: data.hasNextPage
    }
};

const getListFail = (err) => {
    return {
        type: "GET_LIST_FAIL",
        err: err
    }
};

const updateSearch = (search) => {
    return {
        type: "UPDATE_SEARCH",
        search: search
    }
};

const updateSort = (field, sort) => {
    return {
        type: "UPDATE_SORT",
        field: field,
        sort: sort
    }
};

const loadAnotherPage = (data) => {
    return {
        type: "LOAD_ANOTHER_PAGE",
        data: data.docs,
        currentPage: data.page,
        hasMore: data.hasNextPage
    }
};

//thunk call for list
export const getList = ({sch, fld, st}) => {
    return (dispatch, getState) => {
        dispatch(getListRequest());
        dispatch(updateSearch(sch));
        dispatch(updateSort(fld, st));
        const { search, field, sort } = getState().list;
        const url = "http://localhost:8080/api/employees?"
            + (search ? "search=" + search + "&&" : "")
            + (field ? "field=" + field + "&&" : "")
            + (sort ? "sort=" + sort : "");
        axios.get(url)
            .then(result => {
                result.data.docs = decorateData(result.data.docs);
                dispatch(getListSuccess(result.data));
            })
            .catch(err => {
                dispatch(getListFail(err));
            });
    };
};

// const updateList = (search = "", field = "", sort = "") => {
//     return (dispatch, getState) => {
//         dispatch(getListRequest());
//         if (search) dispatch(updateSearch(search));
//         if (field && sort) dispatch(updateSort(field, sort));
//         const { search, field, sort } = getState().list; const url = "http://localhost:8080/api/employees?"
//             + (search ? "search=" + search + "&&" : "")
//             + (field ? "field=" + field + "&&" : "")
//             + (sort ? "sort=" + sort : "");
//         axios.get(url)
//             .then(result => {
//                 result.docs = decorateData(result.docs);
//                 dispatch(getListSuccess(result));
//             })
//             .catch(err => {
//                 dispatch(getListFail(err));
//             });
//     };
// };

export const addPage = () => {
    return (dispatch, getState) => {
        const { hasMore, search, field, sort, currentPage } = getState().list;
        if (hasMore) {
            dispatch(getListRequest());
            const url = "http://localhost:8080/api/employees?"
                + (search ? "search=" + search + "&&" : "")
                + (field ? "field" + field + "&&" : "")
                + (sort ? "sort" + sort + "&&" : "")
                + ("page=" + (currentPage + 1));
            axios.get(url)
                .then(result => {
                    result.data.docs = decorateData(result.data.docs, currentPage);
                    dispatch(loadAnotherPage(result.data));
                })
                .catch(err => {
                    dispatch(getListFail(err));
                });
        }
    };
};