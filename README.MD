
# 🛒 Personalized Notification System — Microservices-Based E-commerce Backend

![Node.js](https://img.shields.io/badge/Node.js-16.x-brightgreen?logo=node.js)
![Docker](https://img.shields.io/badge/Dockerized-✔️-blue?logo=docker)
![GraphQL](https://img.shields.io/badge/Gateway-GraphQL-ff69b4?logo=graphql)
![MongoDB](https://img.shields.io/badge/MongoDB-Used-success?logo=mongodb)
![RabbitMQ](https://img.shields.io/badge/Event%20Driven-RabbitMQ-orange?logo=rabbitmq)
![Monitoring](https://img.shields.io/badge/Monitoring-Grafana%20%7C%20Prometheus%20%7C%20Loki-yellow?logo=grafana)

---

## 🧠 Overview

A **Production-Ready Microservices-Based Personalized Notification System** for an E-commerce Platform, built with:

- 🔁 Event-driven architecture (RabbitMQ)
- ⚡ Unified GraphQL Gateway
- 🔐 JWT-based Auth & Role Management
- 📦 Independent MongoDB-backed microservices
- 📊 Monitoring with Prometheus, Grafana, and Loki
- 🐳 Fully Dockerized — run locally in seconds

> 🚀 Designed for high scalability, real-time communication, and developer productivity.

---

## 🔧 Architecture

```mermaid
graph TD
  Client["🧑‍💻 Client (Postman / GraphQL Playground)"]
  Gateway["🚪 GraphQL Gateway"]
  Users["👤 User Service"]
  Notifications["🔔 Notification Service"]
  Products["📦 Product Service"]
  Orders["🧾 Order Service"]
  Scheduler["⏰ Scheduler Service"]
  RabbitMQ["📨 RabbitMQ (Broker)"]
  Redis["⚡ Redis (Cache)"]
  Loki["📄 Loki (Logs)"]
  Prometheus["📈 Prometheus"]
  Grafana["📊 Grafana Dashboard"]

  Client --> Gateway
  Gateway --> Users
  Gateway --> Notifications
  Gateway --> Products
  Gateway --> Orders

  Users -->|MongoDB| DB1[(Users DB)]
  Notifications -->|MongoDB| DB2[(Notifications DB)]
  Products -->|MongoDB| DB3[(Products DB)]
  Orders -->|MongoDB| DB4[(Orders DB)]

  Orders -- OrderEvents --> RabbitMQ
  Products -- InventoryUpdate --> RabbitMQ
  Notifications -- ListenEvents --> RabbitMQ
  Scheduler -- Promotions & Triggers --> RabbitMQ

  Gateway --> Redis
  Loki --> Grafana
  Prometheus --> Grafana
````

---

## 🧩 Services

### 🧑‍💼 User Service

* Register/Login with JWT
* User preferences for notification types
* Preference updates & authentication middleware

### 🔔 Notification Service

* Store, mark, fetch notifications
* Event listeners for orders, promos, recos
* Respect user preferences

### 📦 Product Service

* Product catalog management
* Inventory updates via order events

### 🧾 Order Service

* Order placement, updates, and tracking
* Emits events for inventory + user notifications

### ⏰ Scheduler Service

* Cron-based notification triggers
* Periodic promotions & order status checks

### 🚪 GraphQL Gateway

* Unified API layer
* Authentication middleware
* Aggregates data from all microservices
* Redis-based caching

---

## 📬 Event-Driven Communication

All services communicate via **RabbitMQ**.
Each service **emits and consumes events** based on its responsibilities:

| Event                      | Emitter   | Consumers               |
| -------------------------- | --------- | ----------------------- |
| `order.placed`             | Orders    | Products, Notifications |
| `product.out_of_stock`     | Products  | Notifications           |
| `promo.campaign`           | Scheduler | Notifications           |
| `recommendation.generated` | Scheduler | Notifications           |

---

## 🔐 Authentication

* JWT Tokens (generated in **User Service**)
* All protected GraphQL mutations require a valid token
* Token is verified in the **GraphQL Gateway**

---

## 📊 Observability & Monitoring

* **Loki** → stores logs from all services
* **Prometheus** → scrapes `/metrics` from services
* **Grafana** → visualizes both (use dashboards or build your own)

### 📸 Screenshots:

> ![Grafana Overview](https://github.com/user-attachments/assets/8e4b6b31-304c-43e8-bdfa-3d37b5f47c7c)
> ![Notification Dashboard](https://github.com/user-attachments/assets/98cc2115-696c-4c3f-a211-9b7adc964329)

---

## ⚙️ Local Development Setup

### 📦 Prerequisites

* [Node.js v16+](https://nodejs.org)
* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### 🧪 Running Locally

```bash
git clone https://github.com/narasimha-1511/ecommerce-microservices.git
cd ecommerce-microservices

# Start the entire ecosystem (DBs, Gateway, Microservices, Monitoring tools)
docker compose up --build
```

* Gateway accessible at: [`http://localhost:8000/graphql`](http://localhost:8000/graphql)
* Grafana: [`http://localhost:3000`](http://localhost:3000) (default user/pass: `admin` / `admin`)
* Prometheus: [`http://localhost:9090`](http://localhost:9090)
* Loki: [`http://localhost:3100`](http://localhost:3100)
* RabbitMQ Dashboard: [`http://localhost:15672`](http://localhost:15672) (default user/pass: `guest` / `guest`)

---

## 📮 Postman Collection

You can test all APIs using the Postman collection below:

https://www.postman.com/aviation-geologist-50887892/workspace/narasimha-projects/collection/68603dd24acaedd6ec650f04?action=share&creator=42408643&active-environment=42408643-d918b243-596b-460f-9146-8fbb744bc02e

---

## 📁 Folder Structure

```txt
ecommerce-microservices/
│
├── gateway/               → GraphQL API Gateway
├── services/
│   ├── users/             → User Service
│   ├── notifications/     → Notification Service
│   ├── products/          → Product Service
│   ├── orders/            → Order Service
│   └── scheduler/         → Scheduler Service
│
├── monitoring/            → Prometheus config
├── docker-compose.yml     → All-in-one orchestration
└── README.md
```

---
