const graphql = require("graphql");
const graphql_iso_date = require("graphql-iso-date");
const pgp = require("pg-promise")();
const connect = {};
// WARNING - Properly secure the connection string
connect.conn = pgp();

const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
	GraphQLFloat,
	GraphQLNonNull,
} = graphql;

const { GraphQLDate, GraphQLTime, GraphQLDateTime } = graphql_iso_date;

const authorType = new GraphQLObjectType({
	name: "author",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		everyRelatedBooks: {
			type: new GraphQLList(booksType),
			resolve (parent, args) {
				const sql = `SELECT * FROM "books" WHERE "author_id" = ${parent.id}`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	}),
});

const book_orderType = new GraphQLObjectType({
	name: "book_order",
	fields: () => ({
		id: { type: GraphQLID },
		book_id: { type: GraphQLID },
		order_id: { type: GraphQLID },
		relatedBooks: {
			type: booksType,
			resolve (parent, args) {
				const sql = `SELECT * FROM "books" WHERE "id" = ${parent.book_id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		relatedOrder: {
			type: orderType,
			resolve (parent, args) {
				const sql = `SELECT * FROM "order" WHERE "id" = ${parent.order_id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	}),
});

const booksType = new GraphQLObjectType({
	name: "books",
	fields: () => ({
		genre_id: { type: GraphQLID },
		id: { type: GraphQLID },
		test: { type: GraphQLFloat },
		name: { type: GraphQLString },
		publish_date: { type: GraphQLDate },
		author_id: { type: GraphQLID },
		relatedGenre: {
			type: genreType,
			resolve (parent, args) {
				const sql = `SELECT * FROM "genre" WHERE "id" = ${parent.genre_id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		everyRelatedBook_order: {
			type: new GraphQLList(book_orderType),
			resolve (parent, args) {
				const sql = `SELECT * FROM "book_order" WHERE "book_id" = ${parent.id}`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		relatedAuthor: {
			type: authorType,
			resolve (parent, args) {
				const sql = `SELECT * FROM "author" WHERE "id" = ${parent.author_id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	}),
});

const genreType = new GraphQLObjectType({
	name: "genre",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		everyRelatedBooks: {
			type: new GraphQLList(booksType),
			resolve (parent, args) {
				const sql = `SELECT * FROM "books" WHERE "genre_id" = ${parent.id}`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	}),
});

const orderType = new GraphQLObjectType({
	name: "order",
	fields: () => ({
		id: { type: GraphQLID },
		created_at: { type: GraphQLDate },
		user_id: { type: GraphQLID },
		status_id: { type: GraphQLID },
		shipping_id: { type: GraphQLID },
		everyRelatedBook_order: {
			type: new GraphQLList(book_orderType),
			resolve (parent, args) {
				const sql = `SELECT * FROM "book_order" WHERE "order_id" = ${
					parent.id
				}`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		relatedUser: {
			type: userType,
			resolve (parent, args) {
				const sql = `SELECT * FROM "user" WHERE "id" = ${parent.user_id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		relatedStatus: {
			type: statusType,
			resolve (parent, args) {
				const sql = `SELECT * FROM "status" WHERE "id" = ${parent.status_id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		relatedShipping_method: {
			type: shipping_methodType,
			resolve (parent, args) {
				const sql = `SELECT * FROM "shipping_method" WHERE "id" = ${
					parent.shipping_id
				}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	}),
});

const shipping_methodType = new GraphQLObjectType({
	name: "shipping_method",
	fields: () => ({
		id: { type: GraphQLID },
		method: { type: GraphQLString },
		everyRelatedOrder: {
			type: new GraphQLList(orderType),
			resolve (parent, args) {
				const sql = `SELECT * FROM "order" WHERE "shipping_id" = ${parent.id}`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	}),
});

const statusType = new GraphQLObjectType({
	name: "status",
	fields: () => ({
		id: { type: GraphQLID },
		code: { type: GraphQLString },
		everyRelatedOrder: {
			type: new GraphQLList(orderType),
			resolve (parent, args) {
				const sql = `SELECT * FROM "order" WHERE "status_id" = ${parent.id}`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	}),
});

const userType = new GraphQLObjectType({
	name: "user",
	fields: () => ({
		id: { type: GraphQLID },
		phone_number: { type: GraphQLString },
		address: { type: GraphQLString },
		name: { type: GraphQLString },
		everyRelatedOrder: {
			type: new GraphQLList(orderType),
			resolve (parent, args) {
				const sql = `SELECT * FROM "order" WHERE "user_id" = ${parent.id}`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		everyAuthor: {
			type: new GraphQLList(authorType),
			resolve () {
				const sql = `SELECT * FROM "author"`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		author: {
			type: authorType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `SELECT * FROM "author" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		everyBook_order: {
			type: new GraphQLList(book_orderType),
			resolve () {
				const sql = `SELECT * FROM "book_order"`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		book_order: {
			type: book_orderType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `SELECT * FROM "book_order" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		everyBooks: {
			type: new GraphQLList(booksType),
			resolve () {
				const sql = `SELECT * FROM "books"`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		books: {
			type: booksType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `SELECT * FROM "books" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		everyGenre: {
			type: new GraphQLList(genreType),
			resolve () {
				const sql = `SELECT * FROM "genre"`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		genre: {
			type: genreType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `SELECT * FROM "genre" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		everyOrder: {
			type: new GraphQLList(orderType),
			resolve () {
				const sql = `SELECT * FROM "order"`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		order: {
			type: orderType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `SELECT * FROM "order" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		everyShipping_method: {
			type: new GraphQLList(shipping_methodType),
			resolve () {
				const sql = `SELECT * FROM "shipping_method"`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		shipping_method: {
			type: shipping_methodType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `SELECT * FROM "shipping_method" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		everyStatus: {
			type: new GraphQLList(statusType),
			resolve () {
				const sql = `SELECT * FROM "status"`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		status: {
			type: statusType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `SELECT * FROM "status" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		everyUser: {
			type: new GraphQLList(userType),
			resolve () {
				const sql = `SELECT * FROM "user"`;
				return connect.conn
					.many(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		user: {
			type: userType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `SELECT * FROM "user" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addAuthor: {
			type: authorType,
			args: {
				name: { type: GraphQLString },
			},
			resolve (parent, args) {
				const sql = `INSERT INTO "author" (name) VALUES ('${args.name}')`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		updateAuthor: {
			type: authorType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
			},
			resolve (parent, args) {
				let updateValues = "";
				for (const prop in args) {
					if (prop !== "id") {
						updateValues += `${prop} = '${args[prop]}' `;
					}
				}
				const sql = `UPDATE "author" SET ${updateValues} WHERE "id" = ${
					args.id
				}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		deleteAuthor: {
			type: authorType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `DELETE FROM "author" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		addBook_order: {
			type: book_orderType,
			args: {
				book_id: { type: GraphQLID },
				order_id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `INSERT INTO "book_order" (book_id, order_id) VALUES ('${
					args.book_id
				}', '${args.order_id}')`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		updateBook_order: {
			type: book_orderType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				book_id: { type: GraphQLID },
				order_id: { type: GraphQLID },
			},
			resolve (parent, args) {
				let updateValues = "";
				for (const prop in args) {
					if (prop !== "id") {
						updateValues += `${prop} = '${args[prop]}' `;
					}
				}
				const sql = `UPDATE "book_order" SET ${updateValues} WHERE "id" = ${
					args.id
				}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		deleteBook_order: {
			type: book_orderType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `DELETE FROM "book_order" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		addBooks: {
			type: booksType,
			args: {
				genre_id: { type: GraphQLID },
				test: { type: GraphQLFloat },
				name: { type: GraphQLString },
				publish_date: { type: GraphQLDate },
				author_id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `INSERT INTO "books" (genre_id, test, name, publish_date, author_id) VALUES ('${
					args.genre_id
				}', '${args.test}', '${args.name}', '${args.publish_date}', '${
					args.author_id
				}')`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		updateBooks: {
			type: booksType,
			args: {
				genre_id: { type: GraphQLID },
				id: { type: new GraphQLNonNull(GraphQLID) },
				test: { type: GraphQLFloat },
				name: { type: GraphQLString },
				publish_date: { type: GraphQLDate },
				author_id: { type: GraphQLID },
			},
			resolve (parent, args) {
				let updateValues = "";
				for (const prop in args) {
					if (prop !== "id") {
						updateValues += `${prop} = '${args[prop]}' `;
					}
				}
				const sql = `UPDATE "books" SET ${updateValues} WHERE "id" = ${
					args.id
				}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		deleteBooks: {
			type: booksType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `DELETE FROM "books" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		addGenre: {
			type: genreType,
			args: {
				name: { type: GraphQLString },
			},
			resolve (parent, args) {
				const sql = `INSERT INTO "genre" (name) VALUES ('${args.name}')`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		updateGenre: {
			type: genreType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
			},
			resolve (parent, args) {
				let updateValues = "";
				for (const prop in args) {
					if (prop !== "id") {
						updateValues += `${prop} = '${args[prop]}' `;
					}
				}
				const sql = `UPDATE "genre" SET ${updateValues} WHERE "id" = ${
					args.id
				}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		deleteGenre: {
			type: genreType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `DELETE FROM "genre" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		addOrder: {
			type: orderType,
			args: {
				created_at: { type: GraphQLDate },
				user_id: { type: GraphQLID },
				status_id: { type: GraphQLID },
				shipping_id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `INSERT INTO "order" (created_at, user_id, status_id, shipping_id) VALUES ('${
					args.created_at
				}', '${args.user_id}', '${args.status_id}', '${args.shipping_id}')`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		updateOrder: {
			type: orderType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				created_at: { type: GraphQLDate },
				user_id: { type: GraphQLID },
				status_id: { type: GraphQLID },
				shipping_id: { type: GraphQLID },
			},
			resolve (parent, args) {
				let updateValues = "";
				for (const prop in args) {
					if (prop !== "id") {
						updateValues += `${prop} = '${args[prop]}' `;
					}
				}
				const sql = `UPDATE "order" SET ${updateValues} WHERE "id" = ${
					args.id
				}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		deleteOrder: {
			type: orderType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `DELETE FROM "order" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		addShipping_method: {
			type: shipping_methodType,
			args: {
				method: { type: GraphQLString },
			},
			resolve (parent, args) {
				const sql = `INSERT INTO "shipping_method" (method) VALUES ('${
					args.method
				}')`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		updateShipping_method: {
			type: shipping_methodType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				method: { type: GraphQLString },
			},
			resolve (parent, args) {
				let updateValues = "";
				for (const prop in args) {
					if (prop !== "id") {
						updateValues += `${prop} = '${args[prop]}' `;
					}
				}
				const sql = `UPDATE "shipping_method" SET ${updateValues} WHERE "id" = ${
					args.id
				}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		deleteShipping_method: {
			type: shipping_methodType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `DELETE FROM "shipping_method" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		addStatus: {
			type: statusType,
			args: {
				code: { type: GraphQLString },
			},
			resolve (parent, args) {
				const sql = `INSERT INTO "status" (code) VALUES ('${args.code}')`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		updateStatus: {
			type: statusType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				code: { type: GraphQLString },
			},
			resolve (parent, args) {
				let updateValues = "";
				for (const prop in args) {
					if (prop !== "id") {
						updateValues += `${prop} = '${args[prop]}' `;
					}
				}
				const sql = `UPDATE "status" SET ${updateValues} WHERE "id" = ${
					args.id
				}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		deleteStatus: {
			type: statusType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `DELETE FROM "status" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		addUser: {
			type: userType,
			args: {
				phone_number: { type: GraphQLString },
				address: { type: GraphQLString },
				name: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve (parent, args) {
				const sql = `INSERT INTO "user" (phone_number, address, name) VALUES ('${
					args.phone_number
				}', '${args.address}', '${args.name}')`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		updateUser: {
			type: userType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				phone_number: { type: GraphQLString },
				address: { type: GraphQLString },
				name: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve (parent, args) {
				let updateValues = "";
				for (const prop in args) {
					if (prop !== "id") {
						updateValues += `${prop} = '${args[prop]}' `;
					}
				}
				const sql = `UPDATE "user" SET ${updateValues} WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
		deleteUser: {
			type: userType,
			args: {
				id: { type: GraphQLID },
			},
			resolve (parent, args) {
				const sql = `DELETE FROM "user" WHERE "id" = ${args.id}`;
				return connect.conn
					.one(sql)
					.then(data => data)
					.catch(err => "The error is", err);
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
