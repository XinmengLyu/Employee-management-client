import axios from "axios";

//helper function
const decorateData = (data, pageOffset = 0) => {
    return data.map((user, index) => {
        return {
            key: index + pageOffset * 10,
            ...user
        };
    });
};

//basic action creaters for list reducer
const getListRequest = () => {
    return {
        type: "GET_LIST_REQUEST",
    };
};

const getListSuccess = (data) => {
    return {
        type: "GET_LIST_SUCCESS",
        data: data.docs,
        currentPage: data.page,
        hasMore: data.hasNextPage
    };
};

const getListFail = (err) => {
    return {
        type: "GET_LIST_FAIL",
        err: err
    };
};

const updateSearch = (search) => {
    return {
        type: "UPDATE_SEARCH",
        search: search
    };
};

const updateManager = (manager) => {
    return {
        type: "UPDATE_MANAGER",
        manager: manager,
    };
};

const updateDR = (dr) => {
    return {
        type: "UPDATE_DR",
        dr: dr,
    };
};

const updateSort = (field, sort) => {
    return {
        type: "UPDATE_SORT",
        field: field,
        sort: sort
    };
};

const loadAnotherPage = (data) => {
    return {
        type: "LOAD_ANOTHER_PAGE",
        data: data.docs,
        currentPage: data.page,
        hasMore: data.hasNextPage
    };
};

const updateDBRequest = () => {
    return {
        type: "UPDATE_DB_REQUEST",
    };
};

const updateDBSuccess = () => {
    return {
        type: "UPDATE_DB_SUCCCESS"
    };
};

const updateDBFail = (err) => {
    return {
        type: "UPADTE_DB_FAIL",
        err: err,
    };
};

const updateDBWarning = (warning) => {
    return {
        type: "UPDATE_DB_WARNING",
        warning: warning
    };
};

//thunk calls for list
export const getList = ({ sch, fld, st, mng, d }) => {
    return (dispatch, getState) => {
        if(getState().list.isLoading) return;

        dispatch(getListRequest());
        if(sch !== undefined) dispatch(updateSearch(sch));
        if(mng) dispatch(updateManager(mng));
        if(d) dispatch(updateDR(d));
        dispatch(updateSort(fld, st));
        const { search, field, sort, manager, dr } = getState().list;
        const url = "http://localhost:8080/api/employees?"
            + (search ? "search=" + search + "&&" : "")
            + (manager ? "manager=" + manager + "&&" : "")
            + (dr ? "dr=" + dr + "&&" : "")
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

export const addPage = () => {
    return (dispatch, getState) => {
        const { hasMore, search, manager, dr, field, sort, currentPage } = getState().list;
        if (hasMore) {
            dispatch(getListRequest());
            const url = "http://localhost:8080/api/employees?"
                + (search ? "search=" + search + "&&" : "")
                + (manager ? "manager=" + manager + "&&" : "")
                + (dr ? "dr=" + dr + "&&" : "")
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

export const addEmployee = (employee, history) => {
    return (dispatch) => {
        dispatch(updateDBRequest());
        axios.post("http://localhost:8080/api/employees", { ...employee })
            .then(res => {
                dispatch(updateDBSuccess());
                history.push('/');
            })
            .catch(err => {
                dispatch(updateDBFail(err));
                window.setTimeout(() => history.push("/"), 5000);
            });
    };
};

export const deleteEmployee = (id) => {
    return (dispatch, getState) => {
        dispatch(getListRequest());
        axios.delete(`http://localhost:8080/api/employees/${id}`)
            .then((res) => {
                const { search, field, sort } = getState().list;
                const url = "http://localhost:8080/api/employees?"
                    + (search ? "search=" + search + "&&" : "")
                    + (field ? "field=" + field + "&&" : "")
                    + (sort ? "sort=" + sort : "");
                return axios.get(url)
            })
            .then(res => {
                console.log("res.data", res.data);
                res.data.docs = decorateData(res.data.docs);
                dispatch(getListSuccess(res.data));
            })
            .catch(err => {
                dispatch(getListFail(err));
            });
    };
};

export const editEmployee = (id, employee, history) => {
    return (dispatch) => {
        dispatch(updateDBRequest());
        axios.put(`http://localhost:8080/api/employees/${id}`, { ...employee })
            .then(res => {
                if (res.status === 200){
                    dispatch(updateDBSuccess());
                    history.push("/");
                }else {
                    dispatch(updateDBWarning(res.data));
                }
            })
            .catch(err => {
                dispatch(updateDBFail(err));
                window.setTimeout(() => history.push("/"), 5000);
            });
    };
};

//actions on detail reducer
const getDetailRequest = () => (
    {
        type: "GET_DETAIL_REQUEST"
    }
);

const getDetailSuccess = data => (
    {
        type: "GET_DETAIL_SUCCESS",
        data: data
    }
);

const getDetailFail = err => (
    {
        type: "GET_DETAIL_FAIL",
        err: err
    }
);

export const getDetail = (id, history) => {
    return (dispatch) => {
        dispatch(getDetailRequest());
        axios.get(`http://localhost:8080/api/employees/${id}`)
            .then((res) => {
                dispatch(getDetailSuccess(res.data));
            })
            .catch((err) => {
                dispatch(getDetailFail(err));
                window.setTimeout(() => history.push("/"), 5000);
            });
    };
};
