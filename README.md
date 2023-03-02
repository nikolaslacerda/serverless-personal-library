# Serverless Personal Library

Application to manage your books


# Functionality of the application

This application will allow creating/removing/updating/fetching books. Each book item can optionally have an cover image. 
Each user only has access to books that he/she has created.

# Books

* `bookId` (string) - a unique id for an book
* `createdAt` (string) - date and time when an book was created
* `name` (string) - name of a book
* `author` (string) - name of a author
* `totalPages` (number) - number of pages 
* `currentPage` (number) - current page
* `coverImageUrl` (string) (optional) - a URL pointing to an image attached to a book
   
# Features
- Add Book
- Get All Books
- Get Book By Id
- Update Book
- Add Book Cover
- Delete Book
- See Book Progress

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.
