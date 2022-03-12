import React, { useState } from 'react'
import { Form, Input, Button, Radio, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import firebase from 'firebase/compat/app'
import axios from 'axios'


export default function Create() {


  const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        visible={visible}
        title="Create a new collection"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input type="textarea" />
          </Form.Item>
          <Form.Item name="modifier" className="collection-create-form_last-form-item">
            <Radio.Group>
              <Radio value="public">Public</Radio>
              <Radio value="private">Private</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const CollectionsPage = () => {
    const [visible, setVisible] = useState(false);

    const onCreate = (values) => {
      console.log('Received values of form: ', values);
      axios.post('http://localhost:4000/createNewSet', {
      headers: { "Access-Control-Allow-Origin": "*" },
      userUID: firebase.auth().currentUser.uid,
      value: values
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      setVisible(false);
    };

    return (
      <div>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          New Collection
        </Button>
        <CollectionCreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </div>
    );
  };

  return (
    <div>
      <div style={{ margin: '20%' }}>
        <CollectionsPage />
      </div>
    </div>
  );
}