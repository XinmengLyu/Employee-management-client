import React from 'react';
import axios from 'axios';
import { Select } from 'antd';
import 'antd/dist/antd.css';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    handleSearch = (search) => {
        //console.log("handleSearch() called: ", search);
        axios.get(`http://localhost:8080/api/search?text=${search}`)
            .then(res => {
                this.setState({ data: res.data });
            })
            .catch(err => console.log(err));
    }

    handleChange = (value) => {
        this.props.onChange({ target: { value: value } })
    }

    render() {
        const { data } = this.state;
        const { value } = this.props;
        //console.log("Search initial value: ", typeof this.props.value);
        return (
            <Select
                showSearch
                allowClear
                value={typeof value === "object" ? value.name : value}
                placeholder={this.props.placeholder}
                style={this.props.style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={null}
            >
                {data.map((d, i) => <Select.Option key={i} value={d._id}>{d.name}</Select.Option>)}
            </Select>
        );
    }
}

export default Search;
