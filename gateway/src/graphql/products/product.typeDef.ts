import gql from "graphql-tag";

const productTypeDef = gql`
    type Product {
        id: ID!
        name: String!
        description: String
        price: Float!
        quantity: Int!
        createdAt: String!
    }

    input ProductsInput {
        page: Int
        limit: Int
    }

    input AddProductInput {
        name: String!
        description: String
        price: Float!
        quantity: Int!
    }

    type ProductsResult {
        products: [Product]
        totalProducts: Int!
        currentPage: Int!
        totalPages: Int!
        limit: Int!
    }

    type ProductsResponse {
        success: Boolean!
        message: String!
        result: ProductsResult
    }

    type ProductResponse {
        success: Boolean!
        message: String!
        product: Product
    }

    type Query {
        getAllProducts(input: ProductsInput): ProductsResponse!
        getProductById(id: ID!): ProductResponse!
    }

    type Mutation {
        addProduct(input: AddProductInput!): ProductResponse!
    }
`;

export default productTypeDef;