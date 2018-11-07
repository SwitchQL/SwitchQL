const graphql = require('graphql');

const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const variableType = GraphQLObjectType({
  name: 'variable',
  fields: () => ({
    id: { type: GraphQLID },
    
  })
});