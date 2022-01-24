import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Form,
  Input,
  Tooltip,
  Button,
  message
} from 'antd';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase/firebase';
import { QuestionCircleOutlined } from '@ant-design/icons';

import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...INITIAL_STATE,
      confirmDirty: false,
    };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
          })
          .then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
            message.success('Account creation was successful!')
          })
          .catch(error => {
            this.setState({ error });
            message.warning(error.message)
          });
      })
      .catch(error => {
        this.setState({ error });
        message.warning(error.message)
      });
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo
    } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' || !email.includes('@');

    return (

      <Form style={{ marginLeft: '30%', marginRight: '40%', maxWidth: '40%' }} {...formItemLayout}
        onFinish={this.onSubmit}
        onFinishFailed={this.onFinishFailed}>
        <Form.Item label="E-mail">
          <Input
            name="email"
            onChange={this.onChange}
            value={email}
            type="text"
            placeholder="Email Address"
          />
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          <Input.Password
            onChange={this.onChange}
            value={passwordOne}
            name="passwordOne"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          <Input.Password
            onChange={this.onChange}
            value={passwordTwo}
            name="passwordTwo"
            onBlur={this.handleConfirmBlur}
            placeholder="Password Confirm"
          />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Full Name&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
        >
          <Input
            onChange={this.onChange}
            value={username}
            name="username"
            placeholder="Full name"
          />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button disabled={isInvalid} type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const SignUpLink = () => (
  <span>
    <Link style={{ color: '#1890ff' }} to={ROUTES.SIGN_UP}>Register Now!</Link>
  </span>
);
const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };