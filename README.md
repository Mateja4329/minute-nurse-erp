Copyright (c) 2026 Mateja Glišović. All Rights Reserved.

# Minute Nurse ERP (WIP)

A comprehensive Enterprise Resource Planning (ERP) system designed to digitalize home healthcare management, shift scheduling, and patient record tracking. 

This project is built using a **Monorepo** architecture, housing multiple client applications that communicate with a centralized REST API.

## 1. System Architecture & Repository Structure

* **/client_web** (React.js)
  Web-based SPA primarily focused on the administrative control panel. Used by clinic management for CRUD operations, schedule allocation, and medical staff oversight.
* **/client_mobile** (Flutter / Dart)
  Cross-platform mobile application (Android & iOS). Designed for medical staff to view daily schedules and submit field reports, and for patients to quickly schedule appointments.
* **/server** (FastAPI / Python)
  The core backend service. Handles all business logic, JWT authentication, and secure data transactions.
* **Database** (PostgreSQL / Docker)
  Relational database orchestrated via the `docker-compose.yml` file located in the root directory.

## 2. Tech Stack

* **Frontend:** React, React Bootstrap, Flutter (Dart)
* **Backend:** Python, FastAPI
* **Database:** PostgreSQL
* **DevOps / Tools:** Docker, Docker Compose, Git

## 3. Quick Start

- Start the web client:
cd client_web
npm install
npm start

- Start the mobile client:
cd client_mobile
flutter pub get
flutter run

Developed as part of the Web-Oriented Technologies and Mobile Information Technologies courses at the Faculty of Technical Sciences, University of Novi Sad.
