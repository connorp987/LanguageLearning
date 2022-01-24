import React, { Component } from 'react';

import { withAuthorization } from '../Session';
import firebase from 'firebase/compat/app'
import { Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield } from '@fortawesome/free-solid-svg-icons'

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      admin: false
    };

    this.deleteDB = this.deleteDB.bind(this)
    this.createAdmin = this.createAdmin.bind(this)
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });

    let user = firebase.auth().currentUser;

    if (user != null) {
      fetch("http://localhost:4000/checkAdmin", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: 'follow', // manual, *follow, error
        //referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({ uid: user.uid })
      })
        .then(res => res.json())
        .then(json => {
          if (json.admin === true) {
            this.setState({
              admin: true
            });
          }
        });
    }
  }
  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  deleteDB() {
    fetch('http://localhost:4000/deleteAll', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      //redirect: 'follow', // manual, *follow, error
      //referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({test: 'wow'})
     })
  }

  async createAdmin(userUID) {
    /*fetch('http://localhost:9000/testAPI/setCustomClaims', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      //redirect: 'follow', // manual, *follow, error
      //referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({test: 'wow'})
     })*/

     console.log(userUID)
     /*
     ******VERY USEFUL IN FUTURE******
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     let user = firebase.auth().currentUser;
      let name, email, photoUrl, uid, emailVerified;
      if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
      }*/

        await fetch('http://localhost:4000/createAdmin', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: 'follow', // manual, *follow, error
        //referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({userUID: 'jC2nvVk5ndWd8Y8MJHJIQcpdrzS2'})
      }).then(res=>res.json()).then(json=>{console.log(json)})    
  }



  
  render() {
    const { users, loading } = this.state;

    const UserList = ({ users }) => {
      if(users[0] !== undefined) {
        //console.log(users[0].admin)
      }
      
      return (
      <ul>
        {users.map(user => (
          <li key={user.uid} style={{marginTop: '10px'}}>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Username:</strong> {user.username}
            </span>
            {(user.admin)? (<FontAwesomeIcon style={adminStyle} icon={faUserShield} />) : (<Button style={adminStyle} onClick={()=>this.createAdmin(user.uid)}> Make Admin</Button>)}
            
          </li>
        ))}
      </ul>
    )};

    const AdminPage = () => (
      <div style={{marginLeft: '30px', marginRight: '30px'}}>
        <script src="https://kit.fontawesome.com/319adf3f89.js" crossOrigin="anonymous"></script>
        <h1>Admin</h1>

        <p>Always run Update database first. Update database creates the UPC codes in firebase, and Update 
          db Attributes updates and adds onto the existing UPC's in firebase
        </p>
        <Button onClick={this.updateDB} type="primary" size='large'>
          Update database
        </Button>
        <Button style={{marginLeft: 20}} onClick={this.updateDB_Attributes} type="primary" size='large'>
          Update database Attributes
        </Button>
        <Button style={{marginLeft: 300}} onClick={this.deleteDB} type="danger" size='large'>
          Delete db!!!!!
        </Button>
        <br />
        <Button style={{marginTop: '20px'}} onClick={this.createAdmin} type="primary" size='large'>
          Create admin
        </Button>
        <iframe  title="title" name="hiddenFrame" style={{width:0,height:0, border: 0, display: "none"}}></iframe>
        <form style={{marginTop: 20}} method="POST" action="http://localhost:9000/testAPI/submit-form"  target="hiddenFrame" encType="multipart/form-data">
          <input type="file" name="document" />
          <input type="submit" />
        </form>
        {loading && <div>Loading ...</div>}
        <UserList users={users} />
      </div>
    )

    const UnauthorizedUser = () => (
      <div>
        <h1>
          You are unauthorized to view this page
        </h1>
      </div>
    )

    return (
      <div>{this.state.admin ? <AdminPage /> : <UnauthorizedUser />}</div>
    );
  }
}

const adminStyle = {
  marginLeft: '10px',
  marginRight: '10px'
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AdminPage);