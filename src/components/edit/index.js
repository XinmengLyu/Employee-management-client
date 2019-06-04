import React from 'react';
import { connect } from 'react-redux';
import { Typography, Form, Spin, Input, Select, DatePicker, Alert, Button } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import Search from './search';
import Avatar from './avatar';
import '../style.css';
import { getDetail, editEmployee } from '../../redux/actions';

class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = { disabled: false };
    }

    componentDidMount() {
        const { getDetail, match: { params }, history } = this.props;
        getDetail(params.uid, history);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { match: { params }, form, history, editEmployee } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log("handleSubmit() called", values);
                const employee = {
                    name: values.name,
                    title: values.title,
                    gender: values.gender,
                    start_date: values.start_date,
                    office_phone: values.office_phone,
                    cell_phone: values.cell_phone,
                    email: values.email,
                    manager: (typeof values.manager === "object" ? values.manager._id : values.manager),
                    avatar: values.avatar
                };
                editEmployee(params.uid, employee, history);
            } else {
                console.log("handleSubmit() called err: ", err);
            }
        });
    };

    handleChange = (e, name) => {
        const { form } = this.props;
        form.setFieldsValue({ [name]: e.target.value });
        const values = form.getFieldsValue();
        let hasEmpty = false;
        for (let key of Object.keys(values)) {
            if (key === "manager" || key === "avatar") {
                hasEmpty = hasEmpty || false;
            } else hasEmpty = hasEmpty || !values[key];
        }
        this.setState({ disabled: hasEmpty });
    }

    handleClick = () => {
        this.props.history.push("/");
    }

    render() {
        const { employee, isDetailLoading, detailErr, isListLoading, listErr, listWarning, form: { getFieldDecorator } } = this.props;
        const { disabled } = this.state;

        const formItemLayout = {
            // layout: "vertical",
            // labelCol: {
            //     xs: { span: 24 },
            //     sm: { span: 6 },
            // },
            // wrapperCol: {
            //     xs: { span: 24 },
            //     sm: { span: 8 },
            // },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 8,
                    offset: 0,
                },
            },
        };

        if (listErr || detailErr) return (<Typography.Title>There has been an error. Please try again later.</Typography.Title>);
        else return (
            <div className="container">
                <Typography.Title>Create New Employee</Typography.Title>
                <div className="form-container">
                    <Spin spinning={isDetailLoading}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <div className="form-avatar">
                                <Form.Item label="avatar">
                                    {getFieldDecorator("avatar", {
                                        initialValue: employee.avatar
                                    })(
                                        <Avatar onChange={e => this.handleChange(e, "avatar")} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="form-text">
                                <Form.Item label="Name">
                                    {getFieldDecorator("name", {
                                        rules: [{ required: true, message: "Please input name!" }],
                                        initialValue: employee.name,
                                    })(
                                        <Input placeholder="Name" onChange={e => this.handleChange(e, "name")} />
                                    )}
                                </Form.Item>
                                <Form.Item label="Title">
                                    {getFieldDecorator("title", {
                                        rules: [{ required: true, message: "Please input title!" }],
                                        initialValue: employee.title,
                                    })(
                                        <Input placeholder="Title" onChange={e => this.handleChange(e, "title")} />
                                    )}
                                </Form.Item>
                                <Form.Item label="Gender">
                                    {getFieldDecorator("gender", {
                                        initialValue: employee.gender,
                                        rules: [{ required: true }]
                                    })(
                                        <Select>
                                            <Select.Option value="Male">Male</Select.Option>
                                            <Select.Option value="Female">Female</Select.Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="start_date">
                                    {getFieldDecorator("start_date", {
                                        rules: [{ type: "object", required: true, message: "Please select start date!" }],
                                        initialValue: moment(employee.start_date),
                                    })(<DatePicker />)}
                                </Form.Item>
                                <Form.Item label="Office Phone">
                                    {getFieldDecorator("office_phone", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please input office phone!"
                                            },
                                            {
                                                pattern: /^[0-9]{10}$/,
                                                message: "Please enter valid phone number!"
                                            }
                                        ],
                                        initialValue: employee.office_phone,
                                    })(
                                        <Input placeholder="Office Phone" onChange={e => this.handleChange(e, "office_phone")} />
                                    )}
                                </Form.Item>
                                <Form.Item label="Cell Phone">
                                    {getFieldDecorator("cell_phone", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please input office phone!"
                                            },
                                            {
                                                pattern: /^[0-9]{10}$/,
                                                message: "Please enter valid phone number!"
                                            }
                                        ],
                                        initialValue: employee.cell_phone,
                                    })(
                                        <Input placeholder="Cell Phone" onChange={e => this.handleChange(e, "cell_phone")} />
                                    )}
                                </Form.Item>
                                <Form.Item label="Email">
                                    {getFieldDecorator("email", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please input email!"
                                            },
                                            {
                                                type: "email",
                                                message: "Please enter valid email!"
                                            }
                                        ],
                                        initialValue: employee.email,
                                    })(
                                        <Input placeholder="Email" onChange={e => this.handleChange(e, "email")} />
                                    )}
                                </Form.Item>
                                <Form.Item label="Manager">
                                    {getFieldDecorator("manager", {
                                        initialValue: employee.manager
                                    })(
                                        <Search placeholder="Choose a Manager..." onChange={e => this.handleChange(e, "manager")} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="form-button">
                                {listWarning &&
                                    <Form.Item {...tailFormItemLayout}>
                                        <Alert message="You can't choose this manager!" type="error" />
                                    </Form.Item>}
                                <Form.Item {...tailFormItemLayout} >
                                    <span>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon="download"
                                            disabled={disabled}
                                            loading={isListLoading}
                                        >
                                            Save Change
                                        </Button>
                                        <Button
                                            type="danger"
                                            icon="close-circle"
                                            onClick={this.handleClick}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Cancel
                                        </Button>
                                    </span>
                                </Form.Item>
                            </div>
                        </Form>
                    </Spin>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        listErr: state.list.err,
        isListLoading: state.list.isLoading,
        listWarning: state.list.warning,
        employee: state.detail.data,
        detailErr: state.detail.err,
        isDetailLoading: state.detail.isLoading,
    }
);

const mapDispatchToProps = dispatch => (
    {
        getDetail: (id, history) => dispatch(getDetail(id, history)),
        editEmployee: (id, employee, history) => dispatch(editEmployee(id, employee, history))
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
