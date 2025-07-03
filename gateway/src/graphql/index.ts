import { makeExecutableSchema } from "@graphql-tools/schema";

import userTypeDef from "./users/user.typeDef";
import userResolvers from "./users/user.resolver";
import notificationTypeDef from "./notifications/notification.typeDef";
import notificationResolvers from "./notifications/notification.resolver";

import { mergeResolvers } from "@graphql-tools/merge";
import { mergeTypeDefs } from "@graphql-tools/merge";

const typeDefs = mergeTypeDefs([userTypeDef, notificationTypeDef]);
const resolvers = mergeResolvers([userResolvers, notificationResolvers]);

export const Schema = makeExecutableSchema({
    typeDefs,
    resolvers
})