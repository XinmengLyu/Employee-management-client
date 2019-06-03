import React from 'react';
import { connect } from 'react-redux';
import { Typography, Form, Input, Select, DatePicker, Button } from 'antd';
import 'antd/dist/antd.css';
import Search from './search';
import Avatar from './avatar';
import './add.css';
import { addEmployee } from '../../redux/actions';

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = { disabled: true };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, history, addEmployee } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);
                addEmployee(values, history);
            } else {
                console.log(err);
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
    };

    handleClick = () => {
        this.props.history.push("/");
    }

    render() {
        const { err, isLoading, form: { getFieldDecorator } } = this.props;
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

        if (err) return (<Typography.Title>There has been an error. Please try again later.</Typography.Title>);
        else return (
            <div className="container">
                <Typography.Title>Create New Employee</Typography.Title>
                <div className="form-container">
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <div className="form-avatar">
                            <Form.Item label="avatar">
                                {getFieldDecorator("avatar")(
                                    <Avatar onChange={e => this.handleChange(e, "avatar")} />
                                )}
                            </Form.Item>
                        </div>
                        <div className="form-text">
                            <Form.Item label="Name">
                                {getFieldDecorator("name", {
                                    rules: [{ required: true, message: "Please input name!" }]
                                })(
                                    <Input placeholder="Name" onChange={e => this.handleChange(e, "name")} />
                                )}
                            </Form.Item>
                            <Form.Item label="Title">
                                {getFieldDecorator("title", {
                                    rules: [{ required: true, message: "Please input title!" }]
                                })(
                                    <Input placeholder="Title" onChange={e => this.handleChange(e, "title")} />
                                )}
                            </Form.Item>
                            <Form.Item label="Gender">
                                {getFieldDecorator("gender", {
                                    initialValue: "Male",
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
                                    rules: [{ type: "object", required: true, message: "Please select start date!" }]
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
                                    ]
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
                                    ]
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
                                    ]
                                })(
                                    <Input placeholder="Email" onChange={e => this.handleChange(e, "email")} />
                                )}
                            </Form.Item>
                            <Form.Item label="Manager">
                                {getFieldDecorator("manager")(
                                    <Search placeholder="Choose a Manager..." onChange={e => this.handleChange(e, "manager")} />
                                )}
                            </Form.Item>
                        </div>
                        <div className="form-button">
                            <Form.Item {...tailFormItemLayout} >
                                <span>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon="download"
                                        disabled={disabled}
                                        loading={isLoading}
                                    >
                                        Add Emplloyee
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
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        err: state.list.err,
        isLoading: state.list.isLoading
    }
);

const mapDispatchToProps = dispatch => (
    {
        addEmployee: (employee, history) => dispatch(addEmployee(employee, history)),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add));
