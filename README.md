<div align="center">

# 🎟️ Event Management System  
### Full-Stack Event Platform | Student & Admin Dashboards

A complete **Event Management System** built with a modern full-stack architecture, allowing students to browse and register for events while enabling admins to manage events efficiently with real-time updates.

🔗 **GitHub Repository**  
👉 https://github.com/tiwarisaurabh786/event-management-system  

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)
![Full Stack](https://img.shields.io/badge/Full--Stack-Application-success?style=for-the-badge)

</div>

---

## 📌 Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Why This Project Stands Out](#why-this-project-stands-out)
- [Tech Stack](#tech-stack)
- [Application Workflow](#application-workflow)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [How to Run Locally](#how-to-run-locally)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

<a id="about-the-project"></a>
## 🚀 About the Project

The **Event Management System** is a full-stack web application designed to manage events in an organized and scalable way.

It provides:
- A **Student dashboard** to browse events and register seamlessly  
- An **Admin dashboard** to create, update, delete, and search events  
- A **real-time seat availability system** to prevent overbooking  

This project demonstrates **backend-driven business logic, role-based access, database design, and clean frontend integration**.

---

<a id="key-features"></a>
## 🎯 Key Features

### 👨‍🎓 Student Module
✅ Browse all available events  
✅ Register for events  
✅ View registered events  
✅ Real-time seat availability  

### 🛠️ Admin Module
✅ Create / Edit / Delete events  
✅ Search & filter events  
✅ Manage seat capacity  
✅ View student registrations  

### 🌐 General
✅ Role-based access (Admin / Student)  
✅ Real-time seat counter  
✅ Mobile-responsive UI  
✅ Clean and intuitive UX  

---

<a id="why-this-project-stands-out"></a>
## 🧠 Why This Project Stands Out

💡 This project is not just CRUD — it focuses on **real-world system behavior**.

- Enforced **seat limit validation**  
- Prevented duplicate registrations  
- Clean **REST API design**  
- Clear **separation of concerns**  
- Scalable architecture suitable for production  

It reflects **industry-level backend thinking** and **practical full-stack development**.

---

<a id="tech-stack"></a>
## 🏗️ Tech Stack

### 🖥 Backend
- Java  
- Spring Boot  
- Spring MVC  
- Spring Data JPA  
- RESTful APIs  

### 🗄 Database
- PostgreSQL  

### 🎨 Frontend
- React.js  
- HTML5  
- CSS3  
- JavaScript  

### 🛠 Tools
- Git & GitHub  
- Maven  
- Postman  

---

<a id="application-workflow"></a>
## 🔄 Application Workflow

1️⃣ User registers & logs in  
2️⃣ Role assigned (Student / Admin)  
3️⃣ Student browses events & registers  
4️⃣ Seat count updates in real time  
5️⃣ Admin manages events via dashboard  
6️⃣ Database syncs changes instantly  

---

<a id="screenshots"></a>
## 📸 Screenshots

### 🎓 Student Dashboard
![Student Dashboard](screenshots/student-dashborard.png)

---

### 🛠️ Admin Dashboard
![Admin Dashboard](screenshots/admin-events-dashboard.png)

---

### 🔐 Login Page
![Login Page](screenshots/login.png)

---

### 🧩 Admin Event CRUD
![Admin Event CRUD Dashboard](screenshots/admin-event-crud.png)

---

### 📝 Registration Page
![Register Page](screenshots/register.png)

---

### 📋 Student Registration Dashboard
![Student Registration Dashboard](screenshots/student-registration.png)

---

### 🔍 Admin Event Search
![Admin Event Search](screenshots/admin-event-search.png)

---

<a id="project-structure"></a>
## 📂 Project Structure

Event-Management-System/
│
├── backend/
│ ├── controllers/
│ ├── services/
│ ├── repositories/
│ ├── models/
│ ├── config/
│ └── application.yml
│
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── styles/
│
├── screenshots/
│ └── project UI images
│
├── schema.sql
├── README.md
└── pom.xml

---

<a id="how-to-run-locally"></a>
## ⚙️ How to Run Locally

### 1️⃣ Clone Repository
```bash
git clone https://github.com/tiwarisaurabh786/event-management-system.git
cd event-management-system
2️⃣ Database Setup (PostgreSQL)
psql -U postgres -d event_management -f schema.sql
3️⃣ Run Backend
cd backend
mvn clean install
mvn spring-boot:run
Backend runs on:
👉 http://localhost:8080

4️⃣ Run Frontend
cd frontend
npm install
npm start
Frontend runs on:
👉 http://localhost:3000

🔑 Test Users
First register from UI, then login.

Student:
📧 tiwarisoravvka@gmail.com

Admin:
📧 admin@events.com
🔑 Password: admin123
```
---
<a id="future-enhancements"></a>

## 🔮 Future Enhancements

-🔐 JWT-based authentication

-📧 Email notifications for registrations

-📊 Admin analytics dashboard

-🧾 Event history & reports

-☁️ Cloud deployment (AWS / Render)

---

<a id="author"></a>
## 👤 Author

<div align="center">

### **Saurabh Tiwari**  
**Java Full-Stack Developer | Backend | Cloud**

📧 **Email:** tiwarisoravvka@gmail.com  
🔗 **GitHub:** https://github.com/tiwarisaurabh786  
🔗 **LeetCode:** https://leetcode.com/u/SaurabhGates/
</div> ```
