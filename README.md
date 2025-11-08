
# 🌾 Growvia 

![Microservices Architecture](https://img.shields.io/badge/🏗️_Architecture-Microservices-2496ED?style=for-the-badge&logoColor=white)
![Event Driven Design](https://img.shields.io/badge/Design📨-Event--Driven-FF6B35?style=for-the-badge&logoColor=white)

![Docker](https://img.shields.io/badge/Containerization-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Minikube](https://img.shields.io/badge/Local_Deployment-Minikube-F5B93E?style=for-the-badge&logo=kubernetes&logoColor=white)

**A modern multi-vendor e-commerce marketplace connecting local farmers with consumers**

> **Built with Microservices Architecture & Event-Driven Design**

[Overview](#project-overview) • [Tech Stack](#tech-stack) • [Features & Capabilities](#features--capabilities) • [Architecture](#architecture) • [CI/CD](#cicd-pipeline) • [Monitoring](#monitoring--observability) • [Roadmap](#future-roadmap) • [Screenshots](#screenshots) 

---

## Project Overview

**Growvia** is a scalable, event-driven e-commerce platform designed to bridge the gap between local farmers and consumers. Built from the ground up with modern microservices architecture, the platform enables farmers to list and sell their products while providing customers with an intuitive shopping experience.

### What Makes Growvia Special?
- **Multi-Vendor Support** - Multiple farmers can list products independently  
- **Real-Time Updates** - Instant notifications and live order tracking  
- **Secure Payments** - PCI-compliant payment processing with Stripe  
- **Smart Search** - Elasticsearch-powered advanced filtering  
- **Order Management** - Complete order lifecycle with farmer approval workflow
- **Fully Responsive UI** - Seamless experience across desktop, tablet, and mobile devices  
- **Production Ready** - Containerized with Docker and orchestrated with Kubernetes

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe.js-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js_23-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe_API-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

### Databases & Storage
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

### Message Queue & Real-Time
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Redis Pub/Sub](https://img.shields.io/badge/Redis_Pub/Sub-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### DevOps & Infrastructure
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Nginx Ingress](https://img.shields.io/badge/Nginx_Ingress-009639?style=for-the-badge&logo=nginx&logoColor=white)

### Monitoring & Observability
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![Kibana](https://img.shields.io/badge/Kibana-005571?style=for-the-badge&logo=kibana&logoColor=white)
![Elastic APM](https://img.shields.io/badge/Elastic_APM-005571?style=for-the-badge&logo=elastic&logoColor=white)
![Metricbeat](https://img.shields.io/badge/Metricbeat-005571?style=for-the-badge&logo=elastic&logoColor=white)
![Heartbeat](https://img.shields.io/badge/Heartbeat-005571?style=for-the-badge&logo=elastic&logoColor=white)

### Testing & Quality
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Faker.js](https://img.shields.io/badge/Faker.js-FF6B6B?style=for-the-badge&logo=faker&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

---

## Technical Documentation
**Coming Soon:**
- Architecture Diagrams (System & Sequence)
- API Documentation
- Event Flow Documentation (RabbitMQ)
- Database Schemas (ERD)


---

## Features & Capabilities

### User Experience

#### For Farmers
- **Profile Management** - Create and customize your farm profile with images and descriptions
- **Product Listings** - Add, edit, and manage your products with multiple images
- **Order Control** - Review and approve/reject orders within 7 days
- **Inventory Tracking** - Automatic stock updates when orders are completed
- **Revenue Insights** - Track your sales and download invoices
- **Instant Alerts** - Real-time notifications for new orders

#### For Customers
- **Browse & Discover** - Explore products from multiple local farmers
- **Advanced Search** - Filter by category, location, price, and more
- **Wishlist** - Save your favorite products for later
- **Shopping Cart** - Add items from multiple farmers in one order
- **Secure Checkout** - Pay safely with credit/debit cards via Stripe
- **Order Tracking** - Monitor your order status in real-time

#### For Guests

- **Product Browsing** - Explore the marketplace without creating an account
- **Search Functionality** - Use advanced filters to find products
- **Farmer Profiles** - View farmer information and offerings

>  **Note:** Account creation is required to make purchases

### Technical Capabilities

#### Responsive Design
- **Mobile-first approach** - Optimized for all screen sizes
- **Cross-device compatibility** - Seamless experience on desktop, tablet, and mobile
- **Tailwind CSS** - Utility-first responsive design system
- **Progressive enhancement** - Core functionality works on all devices

#### Security & Authentication
- **JWT-based authentication** with secure token management
- **Cookie-session storage** for session handling
- **PCI-compliant payments** - No raw card data stored
- **Password reset flow** with time-limited tokens
- **Email verification** required for account activation

#### Performance & Scalability
- **Redis caching** at API Gateway level (15-min TTL for newest products/farmers)
- **Selective cache invalidation** via Redis Pub/Sub
- **Elasticsearch** for lightning-fast product search
- **Horizontal scaling** - Each service scales independently
- **Load balancing** with Kubernetes

#### Event-Driven Architecture
- **Asynchronous processing** via RabbitMQ message queues
- **Decoupled services** for better maintainability
- **Event sourcing** for order state management
- **Reliable message delivery** with acknowledgments

#### Advanced Search & Filtering
- **Elasticsearch-powered search** across products and farmers
- **Multi-criteria filtering** (category, subcategory, location, price)
- **Real-time indexing** - Products searchable immediately after creation
- **Dual search modes** - Search for products OR farmers
- **Autocomplete suggestions** (planned)

#### Smart Order Management
- **Farmer approval workflow** - Orders require farmer confirmation within 7 days
- **Stock validation** before order acceptance
- **Payment hold mechanism** - Funds authorized but not captured until approval
- **Automatic refunds** on order rejection
- **Real-time status tracking** (Pending → Accepted → Processing → On the Way → Delivered)
- **Invoice generation** automatically on order completion

#### Real-Time Notifications
- **WebSocket (Socket.IO)** for instant push notifications
- **Email notifications** for important events
- **Notification history** stored per user
- **Multi-channel delivery** (Email + Push)
- **Farmer alerts** on new orders
- **Customer updates** on order status changes

#### Reliability & Monitoring
- **Centralized logging** with Elasticsearch + Kibana
- **Health checks** with Heartbeat
- **Performance monitoring** via Elastic APM
- **System metrics** tracked with Metricbeat
- **Error tracking** and alerting
- **Service discovery** in Kubernetes

#### DevOps & CI/CD
- **Automated testing** with Jest before deployment
- **Jenkins pipelines** for continuous integration
- **Docker multi-stage builds** for optimized images
- **Kubernetes orchestration** for container management
- **Rolling updates** with zero downtime
- **Slack notifications** for build status

#### Data Management
- **Database per service** pattern for data isolation
- **MongoDB** for flexible document storage (Users, Products, Notifications)
- **PostgreSQL** for transactional data (Authentication, Orders)
- **Redis** for caching and session management
- **Elasticsearch** for search and analytics

---

## Architecture

Growvia employs a **microservices architecture** with **event-driven communication** to ensure scalability, maintainability, and fault tolerance.

### Architecture Principles

- **Service Independence** - Each microservice is independently deployable and scalable  
- **Event-Driven Communication** - Services communicate asynchronously via RabbitMQ message queues  
- **API Gateway Pattern** - Centralized entry point for all client requests  
- **Database Per Service** - Each service manages its own database (MongoDB/PostgreSQL)  
- **Distributed Logging** - Centralized logging with Elasticsearch and Kibana  
- **Caching Strategy** - Redis-based caching at the API Gateway level

### Communication Patterns

| Pattern | Technology | Purpose |
|---------|-----------|---------|
| **Client ↔ API Gateway** | HTTP/REST + WebSocket | User requests and real-time updates |
| **API Gateway ↔ Microservices** | HTTP/REST + WebSocket | Request routing and responses |
| **Service ↔ Service** | RabbitMQ (Event-Driven) | Asynchronous inter-service communication |
| **Cache Invalidation** | Redis Pub/Sub | Real-time cache updates |



### Microservices Overview

Growvia consists of **7 independent microservices**, each handling specific business logic. All services communicate via **RabbitMQ** for event-driven messaging and expose **HTTP/REST APIs** for synchronous operations.

| Service | Purpose |
|---------|---------|
| **API Gateway** | Entry point, authentication, caching |
| **Authentication** | User registration, login, JWT management |
| **Users** | Farmer & customer profile management |
| **Products** | Product catalog, search, inventory |
| **Orders** | Order lifecycle, farmer approval |
| **Payments** | Stripe integration, payment processing |
| **Notifications** | Email & push notifications |

> 📚 **Detailed architecture diagrams and documentation coming soon!**

---

### API Gateway Service

**The central entry point for all client requests**

**Key Responsibilities:**
- JWT authentication & authorization
- Request routing to microservices
- Redis caching with 5-minute TTL for newest products/farmers
- WebSocket management (Socket.IO)
- Centralized error handling

**Notable:** Pure orchestration layer with no direct database access. Implements smart cache invalidation via Redis Pub/Sub.

---

### Authentication Service

**Handles user authentication and authorization**

**Key Responsibilities:**
- User registration & login with JWT tokens
- Email verification workflow
- Password reset with time-limited tokens
- Product search via Elasticsearch (accessible to guests)

**Database:** PostgreSQL  

---

### User Service 

**Manages farmer and customer profiles**

**Key Responsibilities:**
- Farmer profiles: farm details, images, location, social links
- Customer profiles: wishlist, order history, saved farmers
- Image uploads via Cloudinary integration

**Database:** MongoDB  
**Notable:** Uses `userID` from Authentication Service as foreign key, shared across all services

---

### Product Service 

**Product catalog and search**

**Key Responsibilities:**
- Product CRUD operations with multi-image support
- Elasticsearch-powered search with dual modes (products or farmers)
- 8 main categories with subcategories (Fruits, Vegetables, Dairy, Eggs, Grains, Artisan Goods, Herbs & Plants, Livestock)
- Stock availability tracking

**Database:** MongoDB (storage) + Elasticsearch (queries)  
**Notable:** All queries run against Elasticsearch for performance, MongoDB serves as source of truth

---

### Order Service

**Complete order lifecycle management**

**Key Responsibilities:**
- Order creation and status tracking (7 states: pending → accepted → processing → onTheWay → delivered)
- Farmer approval workflow with 7-day window (Stripe authorization limit)
- Stock validation before order acceptance
- Automatic invoice generation on completion

**Order Types:**
- **With Stripe Payment:** Authorization hold → farmer approval → payment capture
- **Cash on Delivery:** Direct farmer approval without payment processing

**Database:** PostgreSQL  
**Notable:** Coordinates with Payment Service for secure transactions and automatic refunds on rejection

---

### Payment Service

**Secure Stripe payment integration**

**Key Responsibilities:**
- Payment intent creation with tokenized card data
- Payment authorization (hold funds until farmer approval)
- Payment capture after farmer confirmation
- Automatic refunds on order rejection

**Security:** PCI-compliant - no raw card data touches backend, only payment_method_id tokens  
**Database:** Stateless service (no database)  
**Notable:** 7-day authorization window enforcement, idempotent operations for safe retries

---

### Notification Service

**Multi-channel notification delivery**

**Key Responsibilities:**
- Email notifications: verification, password reset, order updates, invoices
- Push notifications via WebSocket: real-time order alerts and status updates
- Notification history storage per user

**Database:** MongoDB  
**Notable:** Stores notification snapshots (no live data lookups), multi-channel delivery with retry mechanism

---

### Shared Library (@veckovn/growvia-shared)

**Centralized code published on npm for all microservices**

**Includes:**
- TypeScript interfaces and types
- Zod validation schemas
- Common utility functions
- Error handling classes
- Event definitions for RabbitMQ

**Benefits:** Type safety across services, code reusability, single source of truth, simplified maintenance

---

## CI/CD Pipeline

Automated deployment with **Jenkins**:

- Webhook-triggered builds (GitHub)  
- Service-specific deployments (monorepo)  
- Automated testing (Jest)  
- Docker image building and publishing  
- Slack notifications  
- Multi-stage builds for optimization

**Pipeline Flow:**
```
GitHub Push → Webhook Trigger → Run Tests → Build Docker Image 
→ Push to Docker Hub → Slack Notification → Deploy to Kubernetes
```

---

## Monitoring & Observability

**Elastic Stack Integration:**

- **Kibana Dashboards** - Visualize logs and metrics
- **Elasticsearch** - Centralized logging and search
- **Metricbeat** - System and container metrics
- **Heartbeat** - Service health monitoring
- **APM Server** - Application performance tracking

**What We Monitor:**
- API Gateway errors and request patterns
- Service-to-service communication
- Payment transactions and failures
- User activities and authentication events
- System resource usage

---

## Future Roadmap

### Phase 2: IoT & SaaS Features (Planned)

Transform Growvia into a hybrid platform with **subscription-based IoT features** for farmers:

**Real-Time Sensor Monitoring:**
- Temperature, humidity, soil moisture, pH levels
- Greenhouse sensors (CO₂, light intensity)

**Data Analytics Dashboard:**
- Historical data tracking and visualization
- ML-powered predictions and recommendations
- Smart alerts for optimal farming conditions

**Subscription Model:**
- Tiered pricing (Basic, Pro, Enterprise)
- Stripe subscription management
- Automated billing and renewal reminders


## Screenshots

### Landing Page

**Guest View**
<img width="992" height="930" alt="1" src="https://github.com/user-attachments/assets/f6d66e57-d0a1-4e6d-8ab4-d57a314309ee" />
<img width="990" height="842" alt="4" src="https://github.com/user-attachments/assets/452e27f9-280b-4be4-8781-d6e99e5103de" />
<img width="993" height="746" alt="8" src="https://github.com/user-attachments/assets/52a126c3-89a9-4ce1-ac21-5c0ca8fa53bd" />

**Customer(SignedIn) View**
<img width="993" height="569" alt="9" src="https://github.com/user-attachments/assets/2ee0351b-ee41-478d-a610-3b302115385f" />
<img width="993" height="569" alt="10" src="https://github.com/user-attachments/assets/8115dc83-1d8f-4150-8e11-af16c5afc1ec" />
<img width="899" height="545" alt="9" src="https://github.com/user-attachments/assets/56d3f3e8-1197-48e1-b38e-84874a4d9c2b" />


### Authentication

**SignIn** 

<img width="993" height="964" alt="1" src="https://github.com/user-attachments/assets/164c0762-dece-42af-8201-a2ed17aed926" />


**SignUp Customer**

<img width="993" height="964" alt="2" src="https://github.com/user-attachments/assets/86108913-1de0-4901-94c5-bf9575a87838" />


**SignUp Farmer**

<img width="993" height="964" alt="3" src="https://github.com/user-attachments/assets/1dfe9af7-54fe-4e21-b096-a3b98aee0c76" />
<img width="993" height="964" alt="4" src="https://github.com/user-attachments/assets/c3f385c0-08a6-42a9-8bc7-006dfe7c5346" />


### Marketplace

**Product View**

<img width="993" height="903" alt="1" src="https://github.com/user-attachments/assets/642c88a8-5f21-48df-a6ed-7b76f3bcc820" />


**Farmer View**

<img width="991" height="776" alt="6" src="https://github.com/user-attachments/assets/85979906-5ee1-4d88-b93c-d42862e01a1c" />

**Customer Cart**

<img width="986" height="876" alt="10" src="https://github.com/user-attachments/assets/499c1b63-e78e-448f-a202-9c5b24c35861" />

--- 

> 📝 **Note:** Additional screenshots will be uploaded soon.
