import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
 
import AuthUserContext from './context';
import { withFirebase } from '../Firebase/firebase';
 
const withAuthorization = (condition, Route) => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(Route);
        }
      });
    }

 
    componentWillUnmount() {
      this.listener();
    }
 
    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : <Spin style={{ marginTop: '5%', marginLeft: '48%' }} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          }
        </AuthUserContext.Consumer>
      );
    }
  }
 
  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};
 
export default withAuthorization;