import React from 'react';
import { Avatar, Button, Divider, Input, Typography, Spin, message } from 'antd';
import { InfinityTable } from 'antd-table-infinity';
import 'antd/dist/antd.css';
import '../style.css';
import { connect } from 'react-redux';
import { getList, addPage, deleteEmployee } from '../../redux/actions';

class Home extends React.Component {
    componentDidMount() {
        console.log("componentDidMount() called: ", this.props);
        const { search, field, sort, getList } = this.props;
        getList({ sch: search, fld: field, st: sort });
    }

    //define columns for the table
    columns = () => (
        [
            {
                title: "",
                dataIndex: "avatar",
                key: "avatar",
                width: 70,
                aligh: "right",
                render: (text, record) => (
                    <Avatar src={record.avatar} />
                )
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                width: 250,
                sorter: true,
                onHeaderCell: (column) => (
                    {
                        onClick: () => this.handleSort(column),
                    }
                ),
            },
            {
                title: "Title",
                dataIndex: "title",
                key: "title",
                width: 200,
                sorter: true,
                onHeaderCell: (column) => (
                    {
                        onClick: () => this.handleSort(column),
                    }
                ),
            },
            {
                title: "Gender",
                dataIndex: "gender",
                key: "gender",
                width: 80,
            },
            {
                title: "Start Date",
                dataIndex: "start_date",
                key: "start_date",
                width: 150,
                sorter: true,
                onHeaderCell: (column) => (
                    {
                        onClick: () => this.handleSort(column),
                    }
                ),
                render: (text, record) => (record.start_date.slice(0, 10))
            },
            {
                title: "Office Phone",
                dataIndex: "office_phone",
                key: "office_phone",
                width: 150,
                sorter: true,
                onHeaderCell: (column) => (
                    {
                        onClick: () => this.handleSort(column),
                    }
                ),
                render: (text, record) => (
                    <a href={`tel:${record.office_phone}`}>{record.office_phone}</a>
                )
            },
            {
                title: "Cell Phone",
                dataIndex: "cell_phone",
                key: "cell_phone",
                width: 150,
                sorter: true,
                onHeaderCell: (column) => (
                    {
                        onClick: () => this.handleSort(column),
                    }
                ),
                render: (text, record) => (
                    <a href={`tel:${record.cell_phone}`}>{record.cell_phone}</a>
                )
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                //width: 300,
                sorter: true,
                onHeaderCell: (column) => (
                    {
                        onClick: () => this.handleSort(column),
                    }
                ),
                render: (text, record) => (
                    <a href={`mailto:${record.email}`}>{record.email}</a>
                )
            },
            {
                title: "Manager",
                dataIndex: "manager",
                key: "manager",
                width: 250,
                render: (text, record) => (
                    record.manager ? <Button type="link" onClick={() => this.getManager(record.manager._id)}>{record.manager.name}</Button> : ""
                )
            },
            {
                title: "# of DR",
                dataIndex: "dirct_report",
                key: "dirct_report",
                width: 120,
                sorter: true,
                onHeaderCell: (column) => (
                    {
                        onClick: () => this.handleSort(column),
                    }
                ),
                render: (text, record) => (
                    record.direct_report? 
                        <Button type="link" onClick={() => this.getDR(record._id)} style={{ paddingLeft: "0" }} >
                            {record.direct_report}
                        </Button> : 0
                )
            },
            {
                title: 'Action',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <span>
                        <Button type="link" style={{ paddingRight: "0", paddingLeft: "0" }} onClick={() => this.handleClickEdit(record)} >Edit</Button>
                        <Divider type="vertical" />
                        <Button type="link" style={{ color: "red", paddingLeft: "0" }} onClick={() => this.handleDelete(record)} >Delete</Button>
                    </span>
                ),
            },
        ]
    );

    handleDelete = (record) => {
        //console.log("handleDelete called: ", record);
        this.props.deleteEmployee(record._id);
    };

    handleClickEdit = (record) => {
        this.props.history.push(`/edit/${record._id}`);
    };

    handleClickAdd = () => {
        //console.log("handleClickAdd called: ");
        this.props.history.push("/add");
    };

    handleSearchChange = e => {
        const { field, sort, getList } = this.props;
        getList({ sch: e.target.value, fld: field, st: sort });
    };

    getManager = (id) => {
        const { field, sort, getList} = this.props;
        getList({ fld: field, st: sort, mng: id});
    };

    getDR = (id) => {
        const { field, sort, getList} = this.props;
        getList({ fld: field, st: sort, d: id});
    };

    handleSort = column => {
        //console.log("handleSort called: ",column);
        const { search, field, sort, getList } = this.props;
        if (field !== column.dataIndex) {
            getList({ fld: column.dataIndex, st: "asc" });
        } else if (!sort) {
            getList({ fld: column.dataIndex, st: "asc" });
        } else if (sort === "asc") {
            getList({ fld: column.dataIndex, st: "desc" });
        } else if (sort === "desc") {
            getList({ fld: "", st: "" });
        }
    };

    handleReset = () => {
        this.props.getList({sch: "", fld: "", st: ""});
    };

    handleFetch = () => {
        const { hasMore, addPage } = this.props;
        if (hasMore) {
            addPage();
        } else {
            message.info("This is the end of the table");
        }
    };

    loadMoreContent = () => (
        <div
            style={{
                textAlign: 'center',
                paddingTop: 40,
                paddingBottom: 40,
                border: '1px solid #e8e8e8',
            }}
        >
            <Spin tip="Loading..." />
        </div>
    );

    render() {
        const { isLoading, err, getList, employees, search } = this.props;
        if (err) {
            window.setTimeout(getList, 5000);
            return (<Typography.Title>There has been an error. This page will refresh shortly.</Typography.Title>);
        } else return (
            <div className="table-container">
                <Typography.Title>Employees</Typography.Title>
                <Typography.Text>
                    Search:
                    <Input value={search} onChange={this.handleSearchChange} allowClear style={{ width: "120px", margin: "10px 5px" }} />
                    <Button type="primary" onClick={this.handleReset} style={{float: "right"}} > Reset</Button>
                </Typography.Text>
                <InfinityTable
                    key="key"
                    columns={this.columns()}
                    dataSource={employees}
                    pageSize={10}
                    scroll={{ y: 450 }}
                    loading={isLoading}
                    loadingIndicator={this.loadMoreContent()}
                    onFetch={this.handleFetch}
                    footer={() => <Button type="primary" icon="form" onClick={this.handleClickAdd} >Create New Employee</Button>}
                    bordered
                />
            </div>
        );
    };
}

const mapStateToProps = state => (
    {
        employees: state.list.data,
        currentPage: state.list.currentPage,
        hasMore: state.list.hasMore,
        isLoading: state.list.isLoading,
        err: state.list.err,
        search: state.list.search,
        field: state.list.field,
        sort: state.list.sort,
    }
);

const mapDispatchToProps = dispatch => (
    {
        getList: (info = {}) => {
            dispatch(getList(info));
        },
        addPage: () => {
            dispatch(addPage());
        },
        deleteEmployee: (id) => {
            dispatch(deleteEmployee(id));
        }
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
