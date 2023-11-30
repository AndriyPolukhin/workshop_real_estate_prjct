export const typeDefs = `#graphql
    type Listing {
        id: ID!
        title: String!
        image: String!
        address: String!
        price: Int!
        numOfGuests: Int!
        numOfBeds: Int!
        numOfBaths: Int!
        rating: Int!
    }

    type Query {
        listings: [Listing!]!
    }

    type Mutation {
        deleteListing(id: ID!): Listing!
    }

`
