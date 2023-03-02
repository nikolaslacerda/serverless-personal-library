import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, patchBook, uploadFile } from '../api/books-api'
import { History } from 'history'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditBookProps {
  match: {
    params: {
      bookId: string
    }
  }
  auth: Auth,
  history: History
}

interface EditBookState {
  newBookName: string
  newAuthorName: string,
  newTotalPages: number,
  newCurrentPage: number
  file: any
  uploadState: UploadState
}

export class EditBook extends React.Component<
  EditBookProps,
  EditBookState
> {
  
  state: EditBookState = {
    newBookName: '',
    newAuthorName: '',
    newTotalPages: 0,
    newCurrentPage: 0,
    file: undefined,
    uploadState: UploadState.NoUpload
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

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.bookId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      await patchBook(this.props.auth.getIdToken(), this.props.match.params.bookId, {
        name: this.state.newBookName,
        author: this.state.newAuthorName,
        currentPage: Number(this.state.newCurrentPage),
        totalPages: Number(this.state.newTotalPages),
        favorite: false
      })
      this.props.history.push(`/`)
      alert('Book was updated!')
    } catch (e) {
      alert('Could not updated a book: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Update Your Book</h1>

        <Form onSubmit={this.handleSubmit}>

          <Form.Field>
            <label>Book Cover</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

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
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
