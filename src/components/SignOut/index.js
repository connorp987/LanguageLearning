import React from 'react';
 
import { withFirebase } from '../Firebase/firebase';
import * as ROUTES from "../../constants/routes";
 
const SignOutButton = ({ firebase }) => (
    
      <div
          style={{ textDecoration: "none"}}
          to={ROUTES.LANDING}
          onClick={()=>{
            firebase.doSignOut()
            //window.location.href = "/"
          }}
        >
          Sign Out
      </div>
);
 
export default withFirebase(SignOutButton);