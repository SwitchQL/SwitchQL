export default `import { gql } from 'apollo-boost';

const queryEveryAuthor = gql\`
  {
    everyAuthor {
      id
      name
    }
  }
\`

const queryAuthorById = gql\`
  query($author: ID!) {
    author(id: $author) {
      id
      name
    }
  }
\`

const queryEveryBook_order = gql\`
  {
    everyBook_order {
      id
      book_id
      order_id
    }
  }
\`

const queryBook_orderById = gql\`
  query($book_order: ID!) {
    book_order(id: $book_order) {
      id
      book_id
      order_id
    }
  }
\`

const queryEveryBooks = gql\`
  {
    everyBooks {
      genre_id
      id
      test
      name
      publish_date
      author_id
    }
  }
\`

const queryBooksById = gql\`
  query($books: ID!) {
    books(id: $books) {
      genre_id
      id
      test
      name
      publish_date
      author_id
    }
  }
\`

const queryEveryGenre = gql\`
  {
    everyGenre {
      id
      name
    }
  }
\`

const queryGenreById = gql\`
  query($genre: ID!) {
    genre(id: $genre) {
      id
      name
    }
  }
\`

const queryEveryOrder = gql\`
  {
    everyOrder {
      id
      created_at
      user_id
      status_id
      shipping_id
    }
  }
\`

const queryOrderById = gql\`
  query($order: ID!) {
    order(id: $order) {
      id
      created_at
      user_id
      status_id
      shipping_id
    }
  }
\`

const queryEveryShipping_method = gql\`
  {
    everyShipping_method {
      id
      method
    }
  }
\`

const queryShipping_methodById = gql\`
  query($shipping_method: ID!) {
    shipping_method(id: $shipping_method) {
      id
      method
    }
  }
\`

const queryEveryStatus = gql\`
  {
    everyStatus {
      id
      code
    }
  }
\`

const queryStatusById = gql\`
  query($status: ID!) {
    status(id: $status) {
      id
      code
    }
  }
\`

const queryEveryUser = gql\`
  {
    everyUser {
      id
      phone_number
      address
      name
    }
  }
\`

const queryUserById = gql\`
  query($user: ID!) {
    user(id: $user) {
      id
      phone_number
      address
      name
    }
  }
\`

export {
  queryEveryAuthor,
  queryAuthorById ,
  queryEveryBook_order,
  queryBook_orderById ,
  queryEveryBooks,
  queryBooksById ,
  queryEveryGenre,
  queryGenreById ,
  queryEveryOrder,
  queryOrderById ,
  queryEveryShipping_method,
  queryShipping_methodById ,
  queryEveryStatus,
  queryStatusById ,
  queryEveryUser,
  queryUserById 
};`;
