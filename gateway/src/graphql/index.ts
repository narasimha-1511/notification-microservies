import { makeExecutableSchema } from "@graphql-tools/schema";

import userTypeDef from "./users/user.typeDef";
import userResolvers from "./users/user.resolver";
import notificationTypeDef from "./notifications/notification.typeDef";
import notificationResolvers from "./notifications/notification.resolver";
import productTypeDef from "./products/product.typeDef";
import productResolvers from "./products/product.resolver";
import ordersTypeDef from "./orders/orders.typeDef";
import ordersResolvers from "./orders/orders.resolvers";

import { mergeResolvers } from "@graphql-tools/merge";
import { mergeTypeDefs } from "@graphql-tools/merge";

const typeDefs = mergeTypeDefs([userTypeDef, notificationTypeDef, productTypeDef , ordersTypeDef]);
const resolvers = mergeResolvers([userResolvers, notificationResolvers, productResolvers , ordersResolvers]);

export const Schema = makeExecutableSchema({
    typeDefs,
    resolvers
})