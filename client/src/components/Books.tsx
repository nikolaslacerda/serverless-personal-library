import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import './Books.css'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { getCoverImage, getBooks, patchBook } from '../api/books-api'
import Auth from '../auth/Auth'
import { Book } from '../types/Book'

interface BooksProps {
  auth: Auth
  history: History
}

interface BooksState {
  books: Book[]
  loadingBooks: boolean
}

export class Books extends React.PureComponent<BooksProps, BooksState> {
  state: BooksState = {
    books: [],
    loadingBooks: true
  }

  onAddButtonClick = () => {
    this.props.history.push(`/books/add`)
  }

  onEditButtonClick = (book: Book) => {
    this.props.history.push(`/books/${book.bookId}`)
  }

  getImageCover = async (coverUrl: string) => {
    try {
      await getCoverImage(coverUrl)
      return coverUrl
    } catch {
      return "https://upload.wikimedia.org/wikipedia/commons/b/b9/No_Cover.jpg"
    }
  }

  async componentDidMount() {
    try {
      const books = await getBooks(this.props.auth.getIdToken())
      for (const x of books) {
        const coverImageUrl = await this.getImageCover(x.coverImageUrl || '')
        x.coverImageUrl = coverImageUrl
      }
      this.setState({
        books,
        loadingBooks: false
      })

    } catch (e) {
      alert(`Failed to fetch books: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Your Books</Header>
        {this.renderCreateBookInput()}
        {this.renderBooks()}
      </div>
    )
  }

  renderCreateBookInput() {
    return (
      <Button
        icon
        color="blue"
        onClick={() => this.onAddButtonClick()}
      >
        <Icon name="add" /> Add a new book
      </Button>
    )
  }

  renderBooks() {
    if (this.state.loadingBooks) {
      return this.renderLoading()
    }

    return this.renderBooksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Books
        </Loader>
      </Grid.Row>
    )
  }

  renderBooksList() {
    return (
      <div className='books-cards'>
        {this.state.books.map((book, pos) => {
          return (
            <div className='card-book' onClick={() => this.onEditButtonClick(book)}>
              <div key={book.bookId}>
                <div className='book_title'>
                  <strong>{book.name.length > 15 ? book.name.substring(0, 15) + '...' : book.name}</strong>
                </div>
                <span className='cover'>
                  <img src={book.coverImageUrl} />
                </span>
                <div className='progress'>
                  <strong>Progress: </strong> {((book.currentPage / book.totalPages) * 100).toFixed(1).toString() + "%"}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
