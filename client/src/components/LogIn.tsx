import * as React from 'react'
import Auth from '../auth/Auth'
import './LogIn.css'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.Component<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <button className="LoginButton" onClick={this.onLogin}>
          Log in
        </button>
      </div>
    )
  }
}
