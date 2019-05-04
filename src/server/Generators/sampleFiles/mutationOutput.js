export default `import { gql } from 'apollo-boost';

const addAuthorMutation = gql\`
  mutation($name: String) {
    addAuthor(name: $name) {
      id
      name
    }
  }
\`

const updateAuthorMutation = gql\`
  mutation($id: ID!, $name: String) {
    updateAuthor(id: $id, name: $name) {
      id
      name
    }
  }
\`

const deleteAuthorMutation = gql\`
  mutation($id: ID!) {
    deleteAuthor($id: ID) {
      id
      name
    }
  }
\`

const addBook_orderMutation = gql\`
  mutation($book_id: ID, $order_id: ID) {
    addBook_order(book_id: $book_id, order_id: $order_id) {
      id
      book_id
      order_id
    }
  }
\`

const updateBook_orderMutation = gql\`
  mutation($id: ID!, $book_id: ID, $order_id: ID) {
    updateBook_order(id: $id, book_id: $book_id, order_id: $order_id) {
      id
      book_id
      order_id
    }
  }
\`

const deleteBook_orderMutation = gql\`
  mutation($id: ID!) {
    deleteBook_order($id: ID) {
      id
      book_id
      order_id
    }
  }
\`

const addBooksMutation = gql\`
  mutation($genre_id: ID, $test: Float, $name: String, $publish_date: Date, $author_id: ID) {
    addBooks(genre_id: $genre_id, test: $test, name: $name, publish_date: $publish_date, author_id: $author_id) {
      genre_id
      id
      test
      name
      publish_date
      author_id
    }
  }
\`

const updateBooksMutation = gql\`
  mutation($genre_id: ID, $id: ID!, $test: Float, $name: String, $publish_date: Date, $author_id: ID) {
    updateBooks(genre_id: $genre_id, id: $id, test: $test, name: $name, publish_date: $publish_date, author_id: $author_id) {
      genre_id
      id
      test
      name
      publish_date
      author_id
    }
  }
\`

const deleteBooksMutation = gql\`
  mutation($id: ID!) {
    deleteBooks($id: ID) {
      genre_id
      id
      test
      name
      publish_date
      author_id
    }
  }
\`

const addGenreMutation = gql\`
  mutation($name: String) {
    addGenre(name: $name) {
      id
      name
    }
  }
\`

const updateGenreMutation = gql\`
  mutation($id: ID!, $name: String) {
    updateGenre(id: $id, name: $name) {
      id
      name
    }
  }
\`

const deleteGenreMutation = gql\`
  mutation($id: ID!) {
    deleteGenre($id: ID) {
      id
      name
    }
  }
\`

const addOrderMutation = gql\`
  mutation($created_at: Date, $user_id: ID, $status_id: ID, $shipping_id: ID) {
    addOrder(created_at: $created_at, user_id: $user_id, status_id: $status_id, shipping_id: $shipping_id) {
      id
      created_at
      user_id
      status_id
      shipping_id
    }
  }
\`

const updateOrderMutation = gql\`
  mutation($id: ID!, $created_at: Date, $user_id: ID, $status_id: ID, $shipping_id: ID) {
    updateOrder(id: $id, created_at: $created_at, user_id: $user_id, status_id: $status_id, shipping_id: $shipping_id) {
      id
      created_at
      user_id
      status_id
      shipping_id
    }
  }
\`

const deleteOrderMutation = gql\`
  mutation($id: ID!) {
    deleteOrder($id: ID) {
      id
      created_at
      user_id
      status_id
      shipping_id
    }
  }
\`

const addShipping_methodMutation = gql\`
  mutation($method: String) {
    addShipping_method(method: $method) {
      id
      method
    }
  }
\`

const updateShipping_methodMutation = gql\`
  mutation($id: ID!, $method: String) {
    updateShipping_method(id: $id, method: $method) {
      id
      method
    }
  }
\`

const deleteShipping_methodMutation = gql\`
  mutation($id: ID!) {
    deleteShipping_method($id: ID) {
      id
      method
    }
  }
\`

const addStatusMutation = gql\`
  mutation($code: String) {
    addStatus(code: $code) {
      id
      code
    }
  }
\`

const updateStatusMutation = gql\`
  mutation($id: ID!, $code: String) {
    updateStatus(id: $id, code: $code) {
      id
      code
    }
  }
\`

const deleteStatusMutation = gql\`
  mutation($id: ID!) {
    deleteStatus($id: ID) {
      id
      code
    }
  }
\`

const addUserMutation = gql\`
  mutation($phone_number: String, $address: String, $name: String!) {
    addUser(phone_number: $phone_number, address: $address, name: $name) {
      id
      phone_number
      address
      name
    }
  }
\`

const updateUserMutation = gql\`
  mutation($id: ID!, $phone_number: String, $address: String, $name: String!) {
    updateUser(id: $id, phone_number: $phone_number, address: $address, name: $name) {
      id
      phone_number
      address
      name
    }
  }
\`

const deleteUserMutation = gql\`
  mutation($id: ID!) {
    deleteUser($id: ID) {
      id
      phone_number
      address
      name
    }
  }
\`

export {
  addAuthorMutation,
  updateAuthorMutation,
  deleteAuthorMutation,
  addBook_orderMutation,
  updateBook_orderMutation,
  deleteBook_orderMutation,
  addBooksMutation,
  updateBooksMutation,
  deleteBooksMutation,
  addGenreMutation,
  updateGenreMutation,
  deleteGenreMutation,
  addOrderMutation,
  updateOrderMutation,
  deleteOrderMutation,
  addShipping_methodMutation,
  updateShipping_methodMutation,
  deleteShipping_methodMutation,
  addStatusMutation,
  updateStatusMutation,
  deleteStatusMutation,
  addUserMutation,
  updateUserMutation,
  deleteUserMutation
};`;
