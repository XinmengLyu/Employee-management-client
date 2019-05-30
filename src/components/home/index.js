import React from 'react';
import { Button, Divider, Input, Typography, Spin } from 'antd';
import { InfinityTable } from 'antd-table-infinity';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { getList, addPage } from '../../redux/actions';

class Home extends React.Component {
    componentDidMount() {
        this.props.getList();
    }

    //define columns for the table
    columns = () => (
        [
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
                    <a href="">{record.office_phone}</a>
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
                    <a href="">{record.cell_phone}</a>
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
                    <a href="">{record.email}</a>
                )
            },
            {
                title: "Manager",
                dataIndex: "manager",
                key: "manager",
                width: 250,
                render: (text, record) => (
                    <a href="">{record.manager}</a>
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
                render: (text, record) => {
                    //console.log("table render : # of dr =>", record);
                    return <Button type="link" onClick={() => { }}>{record.direct_report}</Button>
                }
            },
            {
                title: 'Action',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <span>
                        <a href="">Edit</a>
                        <Divider type="vertical" />
                        <Button type="link" style={{ color: "red", paddingLeft: "0" }} onClick={() => this.handleDelete(record)} >Delete</Button>
                    </span>
                ),
            },
        ]
    );

    handleDelete = (record) => { console.log("handleDelete called: ", record); }

    handleClickAdd = () => { console.log("handleClickAdd called: "); }

    handleSearchChange = e => {
        const { field, sort } = this.props;
        this.props.getList({ sch: e.target.value, fld: field, st: sort });
    }

    handleSort = column => {
        //console.log("handleSort called: ",column);
        const { search, field, sort, getList } = this.props;
        if (field !== column.dataIndex) {
            getList({ sch: search, fld: column.dataIndex, st: "asc" });
        } else if (!sort) {
            getList({ sch: search, fld: column.dataIndex, st: "asc" });
        } else if (sort === "asc") {
            getList({ sch: search, fld: column.dataIndex, st: "desc" });
        } else if (sort === "desc") {
            getList({ sch: search, fld: "", st: "" });
        }
    }

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
        const { isLoading, err, getList, employees, search, addPage } = this.props;
        if (err) {
            //window.setTimeout(getList, 5000);
            return (<Typography.Title>There has been an error. This page will refresh shortly.</Typography.Title>);
        } else return (
            <div className="table-container">
                <Typography.Title>Employees</Typography.Title>
                <Typography.Text>
                    Search:
                <Input value={search} onChange={this.handleSearchChange} allowClear style={{ width: "120px", margin: "10px 5px" }} />
                </Typography.Text>
                <InfinityTable
                    key="key"
                    columns={this.columns()}
                    dataSource={employees}
                    pageSize={10}
                    scroll={{ y: 450 }}
                    loading={isLoading}
                    loadingIndicator={this.loadMoreContent}
                    onFetch={addPage}
                    footer={() => <Button type="primary" icon="form" onClick={this.handleClickAdd} >Create New Employee</Button>}
                    bordered
                />
            </div>
        );
    }
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
)

const mapDispatchToProps = dispatch => (
    {
        getList: (info = {}) => {
            dispatch(getList(info));
        },
        addPage: () => {
            dispatch(addPage());
        }
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(Home);
