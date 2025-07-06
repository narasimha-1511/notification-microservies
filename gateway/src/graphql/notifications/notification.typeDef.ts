import { gql } from "graphql-tag";

const notificationTypeDef = gql`
    enum NotificationType {
        PROMOTIONS
        NEWSLETTER
        ORDER_UPDATES
        RECOMMENDATIONS
    }

    type Notification {
        id: ID!
        userId: ID!
        type: NotificationType!
        content: String!
        sentAt: String!
        read: Boolean!
    }

    input PostNotificationInput {
        type: NotificationType!
        content: String!
    }

    input NotificationsInput {
        page: Int
        limit: Int
    }

    type PostNotificationResponse {
        success: Boolean!
        message: String!
        notification: Notification
    }

    type MarkAsReadResponse {
        success: Boolean!
        message: String!
    }

    type NotificationsResult {
        notifications: [Notification!]!
        totalNotifications: Int!
        currentPage: Int!
        totalPages: Int!
        limit: Int!
    }

    type NotificationsResponse {
        success: Boolean!
        message: String!
        result: NotificationsResult
    }
    
    type NotificationResponse {
        success: Boolean!
        message: String!
        notification: Notification
    }

    type Query {
        notifications: NotificationResponse!
        unreadNotifications(input: NotificationsInput): NotificationsResponse!
        readNotifications(input: NotificationsInput): NotificationsResponse!
        getNotificationById(id: ID!): NotificationResponse!
    }

    type Mutation {
        postNotification(input: PostNotificationInput!): PostNotificationResponse!
        markAsRead(id: ID!): MarkAsReadResponse!
    }
`;

export default notificationTypeDef;