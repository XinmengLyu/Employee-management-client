import React from 'react';
import { Upload, Icon, message } from 'antd';

class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { imageUrl: null, isLoading: false };
    }

    beforeUpload = (file) => {
        console.log("beforeUpload() called", file);
        const isImage = /^image/.test(file.type);
        if(!isImage){
            message.info("The file you choose is not a image!");
        }
        return isImage;
    };

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange = (info, callback) => {
        //console.log("handleChange() call in avatar: ", info);
        const { file: { status, originFileObj } } = info;
        if (status === "loading") {
            this.setState({ isLoading: true });
        } else if (status === "done") {
            this.getBase64(originFileObj, imgUrl => {
                this.setState(
                    { imageUrl: imgUrl, isLoading: false },
                    () => callback({ target: { value: this.state.imageUrl } })
                );
            });
        }
    };

    render() {
        const { imageUrl, isLoading } = this.state;
        const uploadButton = (
            <div>
                <Icon type={isLoading ? 'loading' : 'user'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Upload
                className="avatar-upload"
                name="avatar"
                action="http://localhost:8080/avatar"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={(info) => this.handleChange(info, this.props.onChange)}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{height: "256px", width: "256px"}}/> : uploadButton}
            </Upload>
        );
    }
}

export default Avatar;
