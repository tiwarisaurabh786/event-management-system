#  Event Management System - Full Stack

**Student** और **Admin** dashboard complete event platform.

## ✨ Features
✅ Student: Events browse + register  
✅ Admin: Create/Edit/Delete events
✅ Real-time seat counter
✅ Search + Filters (category, seats, date)
✅ Mobile responsive design

## Setup 

### Database (PostgreSQL)
```bash
psql -U postgres -d event_management -f schema.sql

### Backend
cd backend
mvn spring-boot:run
Backend: http://localhost:8080

### Frontend
cd frontend  
npm install && npm start
Frontend: http://localhost:3000

### Test Users
first register and then login to my portal...

Student: tiwarisoravvka@gmail.com
Admin: admin@events.com / admin123

###  Screenshots

![Student Dashboard](screenshots/student-dashborard.png)
![Admin Dashboard](screenshots/admin-events-dashboard.png)  
![Login Page](screenshots/login.png)
![Admin Event CRUD Dashboard](screenshots/admin-event-crud.png)
![Register Page](screenshots/register.png)
![Student Registration Dashboard](screenshots/student-registration.png)
![Admin Event Search](screenshots/admin-event-search.png)

