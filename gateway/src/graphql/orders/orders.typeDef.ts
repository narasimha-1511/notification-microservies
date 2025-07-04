import gql from "graphql-tag";

const ordersTypeDefs = gql`

    enum OrderStatus {
        PENDING
        DELIVERED
        CANCELLED
        SHIPPED
    }

    input ProductInput {
        id: ID!
        quantity: Int!
    }

    type OrderProduct {
        id: ID!
        quantity: Int!
    }

    type Order {
        id: ID!
        products: [OrderProduct!]!
        status: OrderStatus!
        createdAt: String!
    }

    type PlaceOrderResponse {
        success: Boolean!
        message: String!
        order: Order
    }

    type OrdersResult {
        orders: [Order!]!
        totalOrders: Int!
        totalPages: Int!
        currentPage: Int!
        limit: Int!
    }

    type OrdersResponse {
        success: Boolean!
        message: String!
        result: OrdersResult
    }

    type Query {
        getOrderById(id: ID!): PlaceOrderResponse!
        getAllOrders(page: Int, limit: Int): OrdersResponse!
    }

    type Mutation {
        placeOrder(products: [ProductInput!]!): PlaceOrderResponse!
        updateOrderStatus(id: ID!, status: OrderStatus!): PlaceOrderResponse!
    }
`;

export default ordersTypeDefs;