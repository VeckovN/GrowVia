# Growvia – Microservice App Based on Event-Driven Architecture

> ⚠️ **This README is not final.**  
> It is a work in progress and will be continuously updated as development progresses.  
> Additional documentation, screenshots, and deployment details will be added soon.

## Table of Contents
* [Technical Documentation](#technical-documentation)
* [Project Overview](#project-overview)
* [Technologies](#technologies)
* [User Types](#user-types)
* [Core Features](#core-features)

## Technical Documentation
📚 **Coming Soon...**

## Project Overview

This project consists of two main parts:

- **E-commerce Marketplace (Core Functionality) **
- **IoT Sensor Features for Farmers (Subscription-based SaaS layer )**

### E-commerce Marketplace (Main Part)
- **Backend**: Implemented
- **Frontend**: Currently in development

**Growvia** is a microservice-based, event-driven, multi-vendor e-commerce platform designed to connect local farmers with consumers.  
The platform supports several user roles including **farmers**, **customers**, **guests**, and a potential **admin panel** (currently under consideration).

Farmers can register, manage their profiles, create and manage product listings, confirm and update orders, and have invoices generated automatically.

While the primary focus is the marketplace, Growvia is built with extensibility in mind, serving as a foundation for future real-time features, personalized experiences, and analytics.

### IoT Features (Second Part)

Farmers will be able to subscribe to IoT-based features, gaining access to real-time and historical sensor data such as:
- Temperature
- Humidity
- Soil moisture
- pH levels
.etc

The platform will offer data-driven insights including predictions, alerts, and recommendations based on historical sensor trends.

### Consumer Experience

Customers can:

- Create personal profiles
- Browse products with advanced filtering options
- Add items to their cart
- Place orders via **Stripe**
- Track order statuses (real-time delivery tracking under consideration)

Guests may explore the marketplace but must register to complete purchases.

---

## Technologies

- **Frontend**: ReactJS, Redux, Tailwind CSS, HTML5, CSS3
- **Backend**: NodeJS, Express
- **Architecture**: Microservices, Event-Driven
- **Databases**:
  - MongoDB, Redis, Neo4j, PostgreSQL, MySQL
  - Elasticsearch + Kibana (for logging & analytics)
- **Real-Time**: Socket.IO
- **Payment Integration**: Stripe
- **Design**: Figma
- **DevOps**: Docker, Kubernetes 

---

## User Types

- Farmer
- Customer
- Guest

---

## Core Features

### 🛒 E-Commerce Core
- Multi-vendor platform for local food products
- Profile and product management for farmers
- Secure order placement and payment via Stripe
- Auto-generated invoices for completed orders


### 🔍 Search & Filtering
- Advanced filtering by product, category, location, or farmer profile
- Real-time UX (cached and optimized filtering planned)

### 📦 Order Management
- Status tracking for customers
- Order lifecycle management for farmers
- Real-time tracking 

### 🌱 IoT Integration *(Second Part)*
- Sensor data visualization (temperature, humidity, soil, pH)
- Historical data tracking and analytics
- Smart alerts and recommendations
- Greenhouse sensor support (CO₂, light intensity) planned
