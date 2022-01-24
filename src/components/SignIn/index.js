import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase/firebase';
import * as ROUTES from '../../constants/routes';
import { Form, Input, Button, Checkbox, message, Spin } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { withAuthorization } from '../Session';

import "./style.css";

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: true, ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setState({ loading: false })
  }

  onFinish = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
        this.success()
      })
      .catch(error => {
        this.setState({ error });
        message.warning(error.message);
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onFinishFailed = (errorInfo) => {
    message.warning(errorInfo.errorFields[0].errors);
  };

  success = () => {
    message.success('Successfully Logged In');
  };

  render() {
    const { email, password } = this.state;

    //const isInvalid = password === '' || email === '';

    return (
      <div>
        {this.state.loading ? (
          <Spin style={{ marginTop: '5%', marginLeft: '48%' }} indicator={antIcon} />
        ) : (
            <Form style={{ marginLeft: '40%', marginRight: '40%' }}
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}>
              <Form.Item>
                <Input
                  name="email"
                  onChange={this.onChange}
                  value={email}
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password
                  name="password"
                  onChange={this.onChange}
                  value={password}
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  type="password"
                  placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <span>
                  <Checkbox>Remember me</Checkbox>{" "}
                  <Link style={{ color: "#1890ff" }} to={ROUTES.PASSWORD_FORGET}>
                    Forgot Password?
            </Link>
                </span>
                <br />
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
                <br />
          Or <SignUpLink />
              </Form.Item>
            </Form>
          )}
      </div>

    );
  }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

const condition = authUser => authUser == null;
export default withAuthorization(condition, ROUTES.LANDING)(SignInPage);


export { SignInForm };