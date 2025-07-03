import { gql } from "graphql-tag";

export const userTypeDef = gql`
  enum UserPreferences {
      PROMOTIONS
      NEWSLETTER
      ORDER_UPDATES
      RECOMMENDATIONS
  }

  type User {
    id: ID!
    name: String!
    email: String!
    preferences: [UserPreferences!]!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    preferences: [UserPreferences!]
  }

  input UpdatePreferencesInput {
    preferences: [UserPreferences!]!
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    accessToken: String
  }

  type UserResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type LoginResponse {
    success: Boolean!
    message: String!
    accessToken: String
  }

  type RegisterResponse {
    success: Boolean!
    message: String!
    accessToken: String
  }

  type UpdatePreferencesResponse {
    success: Boolean!
    message: String!
    updatedPreferences: [UserPreferences!]
  }

  type Query {
    user: UserResponse!
  }

  type Mutation {
    register(input: RegisterInput!): RegisterResponse!
    login(input: LoginInput!): LoginResponse!
    updatePreferences(input: UpdatePreferencesInput!): UpdatePreferencesResponse!
  }
`;

export default userTypeDef;
