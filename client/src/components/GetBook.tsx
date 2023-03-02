import * as React from 'react'
import { Form, Button, Grid, Loader, Header, Image, Icon } from 'semantic-ui-react'
import { deleteBook, getBookById } from '../api/books-api'
import Auth from '../auth/Auth'
import './GetBook.css'
import { Book } from '../types/Book'
import { History } from 'history'

interface GetBookState {
  name: string
  author: string,
  totalPages: number,
  currentPage: number,
  coverImageUrl?: string,
  loadingBooks: boolean
}

interface GetBookProps {
  match: {
    params: {
      bookId: string
    }
  }
  auth: Auth,
  history: History
}

export class GetBook extends React.Component<GetBookProps, GetBookState> {

  state: GetBookState = {
    name: '',
    author: '',
    totalPages: 0,
    currentPage: 0,
    coverImageUrl: '',
    loadingBooks: true
  }

  onBookDelete = async () => {
    try {
      await deleteBook(this.props.auth.getIdToken(), this.props.match.params.bookId)
      this.props.history.push(`/`)
      alert('Book deletion success')
    } catch {
      alert('Book deletion failed')
    }
  }

  onEditButtonClick = () => {
    this.props.history.push(`/books/${this.props.match.params.bookId}/edit`)
  }

  async componentDidMount() {
    try {
      const book = await getBookById(this.props.auth.getIdToken(), this.props.match.params.bookId)
      this.setState({
        ...book,
        loadingBooks: false
      })
      console.log(((this.state.currentPage / this.state.totalPages) * 100).toString() + "%")
    } catch (e) {
      alert(`Failed to fetch book: ${(e as Error).message}`)
    }
  }

  renderBook() {
    if (this.state.loadingBooks) {
      return this.renderLoading()
    }
    return this.renderBooksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Book
        </Loader>
      </Grid.Row>
    )
  }

  render() {
    return (
      <div>
        {this.renderBook()}
      </div>
    )
  }

  renderBooksList() {
    return (
      <div>
        <Header as="h1">{this.state.name}</Header>

        <div className='Item'>
          {this.state.coverImageUrl && (
            <Image src={this.state.coverImageUrl} size="small" wrapped />
          )}
        </div>

        <div className='Item'>
          <strong>Author</strong>
          <p>{this.state.author}</p>
        </div>

        <div className='Item'>
          <strong>Total Pages </strong>
          <p>{this.state.totalPages}</p>
        </div>

        <div className='Item'>
          <strong>Current Page </strong>
          <p>{this.state.currentPage}</p>
        </div>
        <div className='Item'>
          <strong>Completed</strong>
          <div className="progress-bar">

            <span className="progress-bar-fill" style={{ width: ((this.state.currentPage / this.state.totalPages) * 100).toString() + "%" }}></span>
          </div>
        </div>

        <div className='Item'>
          <Button
            icon
            color="blue"
            onClick={() => this.onEditButtonClick()}
          >
            <Icon name="pencil" />
            Edit Book
          </Button>
        </div>
        <div className='Item'>
          <Button
            icon
            color="red"
            onClick={() => this.onBookDelete()}
          >
            <Icon name="delete" />
            Delete Book
          </Button>
        </div>

      </div>
    )
  }

}
