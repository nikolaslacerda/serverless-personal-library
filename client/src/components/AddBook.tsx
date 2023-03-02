import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { createBook } from '../api/books-api'
import Auth from '../auth/Auth'
import { History } from 'history'

interface AddBookState {
  newBookName: string
  newAuthorName: string,
  newTotalPages: number,
  newCurrentPage: number
}

interface AddBookProps {
  auth: Auth,
  history: History
}

export class AddBook extends React.Component<AddBookProps, AddBookState> {

  state: AddBookState = {
    newBookName: '',
    newAuthorName: '',
    newTotalPages: 0,
    newCurrentPage: 0
}

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;

    console.log(target);
    console.log(name);

    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });

    console.log(this.state)
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      await createBook(this.props.auth.getIdToken(), {
        name: this.state.newBookName,
        author: this.state.newAuthorName,
        currentPage: Number(this.state.newCurrentPage),
        totalPages: Number(this.state.newTotalPages)
      })
      this.props.history.push(`/`)
      alert('Book created!')
    } catch {
      alert('Book creation failed')
    }
  }

  render() {
    return (
      <div>
        <h1>Add new book to your personal library</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input name="newBookName" type="text" onChange={this.handleChange}/>
          </Form.Field>

          <Form.Field>
            <label>Author</label>
            <input name="newAuthorName" type="text" onChange={this.handleChange}/>
          </Form.Field>

          <Form.Field>
            <label>Total Pages</label>
            <input name="newTotalPages" type="text" onChange={this.handleChange}/>
          </Form.Field>

          <Form.Field>
            <label>Current Page</label>
            <input name="newCurrentPage" type="text" onChange={this.handleChange}/>
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        <Button type="submit">Add</Button>
      </div>
    )
  }
}
