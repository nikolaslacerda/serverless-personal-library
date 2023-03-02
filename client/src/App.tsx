import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import './App.css'
import Auth from './auth/Auth'
import { EditBook } from './components/EditBook'
import { AddBook } from './components/AddBook'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Books } from './components/Books'
import { GetBook } from './components/GetBook'

export interface AppProps { }

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState { }

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <div className='App-header'>
          <span>Personal Library</span>
          {this.logInLogOutButton()}
        </div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <div className='logout' onClick={this.handleLogout} >
          Log Out
        </div>
      )
    } else {
      return (
        <LogIn auth={this.props.auth} />
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>

        <Route
          path="/books/add"
          exact
          render={props => {
            return <AddBook {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/"
          exact
          render={props => {
            return <Books {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/books/:bookId"
          exact
          render={props => {
            return <GetBook {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/books/:bookId/edit"
          exact
          render={props => {
            return <EditBook {...props} auth={this.props.auth} />
          }}
        />



        <Route component={NotFound} />
      </Switch>
    )
  }
}
