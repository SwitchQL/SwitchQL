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
    deleteAuthor(id: $id) {
      id
      name
    }
  }
\`

const addBook_orderMutation = gql\`
  mutation($book_id: ID, $order_id: ID) {
    addBook_order(book_id: $book_id, order_id: $order_id) {
      book_id
      id
      order_id
    }
  }
\`

const updateBook_orderMutation = gql\`
  mutation($book_id: ID, $id: ID!, $order_id: ID) {
    updateBook_order(book_id: $book_id, id: $id, order_id: $order_id) {
      book_id
      id
      order_id
    }
  }
\`

const deleteBook_orderMutation = gql\`
  mutation($id: ID!) {
    deleteBook_order(id: $id) {
      book_id
      id
      order_id
    }
  }
\`

const addBooksMutation = gql\`
  mutation($author_id: ID, $genre_id: ID, $name: String, $publish_date: Date, $test: Float) {
    addBooks(author_id: $author_id, genre_id: $genre_id, name: $name, publish_date: $publish_date, test: $test) {
      author_id
      genre_id
      id
      name
      publish_date
      test
    }
  }
\`

const updateBooksMutation = gql\`
  mutation($author_id: ID, $genre_id: ID, $id: ID!, $name: String, $publish_date: Date, $test: Float) {
    updateBooks(author_id: $author_id, genre_id: $genre_id, id: $id, name: $name, publish_date: $publish_date, test: $test) {
      author_id
      genre_id
      id
      name
      publish_date
      test
    }
  }
\`

const deleteBooksMutation = gql\`
  mutation($id: ID!) {
    deleteBooks(id: $id) {
      author_id
      genre_id
      id
      name
      publish_date
      test
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
    deleteGenre(id: $id) {
      id
      name
    }
  }
\`

const addOrderMutation = gql\`
  mutation($created_at: Date, $shipping_id: ID, $status_id: ID, $user_id: ID) {
    addOrder(created_at: $created_at, shipping_id: $shipping_id, status_id: $status_id, user_id: $user_id) {
      created_at
      id
      shipping_id
      status_id
      user_id
    }
  }
\`

const updateOrderMutation = gql\`
  mutation($created_at: Date, $id: ID!, $shipping_id: ID, $status_id: ID, $user_id: ID) {
    updateOrder(created_at: $created_at, id: $id, shipping_id: $shipping_id, status_id: $status_id, user_id: $user_id) {
      created_at
      id
      shipping_id
      status_id
      user_id
    }
  }
\`

const deleteOrderMutation = gql\`
  mutation($id: ID!) {
    deleteOrder(id: $id) {
      created_at
      id
      shipping_id
      status_id
      user_id
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
    deleteShipping_method(id: $id) {
      id
      method
    }
  }
\`

const addStatusMutation = gql\`
  mutation($code: String) {
    addStatus(code: $code) {
      code
      id
    }
  }
\`

const updateStatusMutation = gql\`
  mutation($code: String, $id: ID!) {
    updateStatus(code: $code, id: $id) {
      code
      id
    }
  }
\`

const deleteStatusMutation = gql\`
  mutation($id: ID!) {
    deleteStatus(id: $id) {
      code
      id
    }
  }
\`

const addUserMutation = gql\`
  mutation($address: String, $name: String!, $phone_number: String) {
    addUser(address: $address, name: $name, phone_number: $phone_number) {
      address
      id
      name
      phone_number
    }
  }
\`

const updateUserMutation = gql\`
  mutation($address: String, $id: ID!, $name: String!, $phone_number: String) {
    updateUser(address: $address, id: $id, name: $name, phone_number: $phone_number) {
      address
      id
      name
      phone_number
    }
  }
\`

const deleteUserMutation = gql\`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      address
      id
      name
      phone_number
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
