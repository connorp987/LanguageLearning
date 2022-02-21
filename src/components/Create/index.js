import React from 'react'
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import firebase from 'firebase/compat/app'
import axios from 'axios'


export default function Create() {

  const onFinish = values => {
    console.log('Received values of form:', values);
  };

  function createSet() {
    axios.post('http://localhost:4000/createNewSet', {
      headers: {"Access-Control-Allow-Origin": "*"},
      userUID: firebase.auth().currentUser.uid
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div>
      <Button onClick={() => createSet()} >Click me</Button>
      <div style={{ margin: '20%' }}>
        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'first']}
                      rules={[{ required: true, message: 'Missing first name' }]}
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'last']}
                      rules={[{ required: true, message: 'Missing last name' }]}
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}