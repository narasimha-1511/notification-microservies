# Personalized Notification System

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
  - [User Service](#user-service)
  - [Notification Service](#notification-service)
  - [Product Service](#product-service)
  - [Order Service](#order-service)
  - [Scheduler Service](#scheduler-service)
  - [GraphQL Gateway](#graphql-gateway)
- [Message Queue Integration](#message-queue-integration)
- [Personalized Recommendations](#personalized-recommendations)
- [Authentication](#authentication)
- [Setup & Running Locally](#setup--running-locally)
- [Dockerization](#dockerization)
- [Testing](#testing)
- [API Usage](#api-usage)
- [Extending & Monitoring](#extending--monitoring)
- [Notes](#notes)

---

## Overview

This project implements a microservices-based Personalized Notification System for an e-commerce platform. The system is designed to send personalized notifications to users based on their preferences and activity, using asynchronous, event-driven communication via RabbitMQ and exposing a unified GraphQL API to clients.

---

## Architecture
<!-- 
```mermaid
graph TD
  Client["Client (GraphQL Playground/Postman)"]
  Gateway["GraphQL Gateway"]
  Users["User Service"]
  Products["Product Service"]
  Orders["Order Service"]
  Notifications["Notification Service"]
  Scheduler["Scheduler Service"]
  RabbitMQ["RabbitMQ (Message Broker)"]
  DBUsers["Users DB"]
  DBProducts["Products DB"]
  DBOrders["Orders DB"]
  DBNotifications["Notifications DB"]

``` -->

- **API Gateway** All client requests go through the GraphQL Gateway.
- **Microservices** communicate asynchronously via RabbitMQ.
- **Each service** manages its own database. 
- **MongoDB** stores data for each service.
- **Caching** is implemented in the GraphQL Gateway. 

---

## Services

### User Service

- **Responsibilities:**
  - Register users (name, email, preferences)
  - Update user preferences (e.g., notification types: promotions, order updates, recommendations)
  - Fetch user details
  - JWT-based authentication

- **Events:**
  - Emits user creation/update events to RabbitMQ

### Notification Service

- **Responsibilities:**
  - Store notifications (id, userId, type, content, sentAt, read)
  - Mark notifications as read
  - Fetch unread notifications for a user
  - Fetch read notifcations for a user
  - Listen for events (e.g., order updates, promotions, recommendations) and create notifications

- **Events:**
  - Emits notification events (e.g., notification sent/read)

### Product Service

- **Responsibilities:**
  - Manage product catalog
  - Listen for order events to update inventory
  - Emit product recommendation events

### Order Service

- **Responsibilities:**
  - Manage orders (mock data)
  - Emit order status update events

### Scheduler Service

- **Responsibilities:**
  - Periodically send order status updates and promotional notifications (using cron jobs or background jobs)
  - Push notifications to users based on preferences

### GraphQL Gateway

- **Responsibilities:**
  - Expose a unified GraphQL API for all client interactions
  - Aggregate data from all microservices
  - Authenticate requests using JWT

---

## Message Queue Integration

- **RabbitMQ** is used for asynchronous, event-driven communication between microservices.
- Each service emits and listens to specific events to ensure state consistency.
- Example: When an order is placed, the Order Service emits an event; the Product Service listens and updates inventory; the Notification Service listens and notifies the user.

---

## Personalized Recommendations

- The system generates product recommendations based on mock purchase history and browsing activity.
- Recommendations are stored and sent as notifications to users, respecting their preferences.

---

## Authentication

- JWT authentication is implemented in the User Service.
- The GraphQL Gateway verifies JWT tokens for protected queries/mutations (e.g., placing an order).

---

## Setup & Running Locally

### Prerequisites

- Node.js (v16+)
- Yarn or npm
- Docker & Docker Compose
- RabbitMQ 
- MongoDB

### Environment Variables

Each service has its own `.example.env`. Key variables include:

- `MONGO_URI`
- `JWT_SECRET` (User Service & Gateway)

### Local Development

- Everything can be run locally using `docker compose up`

---

## Extending & Monitoring

- **Caching:** The GraphQL Gateway can cache frequently queried data (e.g., product listings).
- **Monitoring:** Integrate Prometheus/Grafana for monitoring RabbitMQ and service health.
- **Dead-letter Queues:** RabbitMQ can be configured to handle event delivery failures.

---

## Notes

- Personalized recommendations are based on mock data and can be extended.
- The system is designed for flexibility and can be extended with more services (e.g., analytics, recommendations).
- All code is modular and follows best practices for maintainability and scalability.