import { makeExecutableSchema } from "@graphql-tools/schema";
import userTypeDef from "./user-service/user.typeDef";
import userResolvers from "./user-service/user.resolver";
import { mergeResolvers } from "@graphql-tools/merge";
import { mergeTypeDefs } from "@graphql-tools/merge";

const typeDefs = mergeTypeDefs([userTypeDef]);
const resolvers = mergeResolvers([userResolvers]);

export const Schema = makeExecutableSchema({
    typeDefs,
    resolvers
})