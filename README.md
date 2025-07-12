# 🎉 Party Register

A web-based guest registration and management system built with **Node.js**, **Express**, **MongoDB**, and **vanilla JavaScript**. Designed for parties, events, or RSVP management — includes an admin dashboard and CSV export feature.

## 🌐 Live Demo
👉 [Visit Live Site](https://party-register.onrender.com)

## 📸 Features
- ✅ Register single or couple guests
- ✅ Store guest data in MongoDB Atlas
- ✅ View all registered guests in the admin panel
- ✅ Admin login protected by JWT
- ✅ Export guest list as CSV
- ✅ Responsive and modern UI *(Tailwind CSS optional)*

## 🔐 Admin Access
Visit [`/admin-login.html`](https://party-register.onrender.com/admin-login.html) to login as admin.

> **Credentials** (set in `.env`):
ADMIN_PASSWORD=your_admin_password
## 📦 Tech Stack
- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MongoDB Atlas
- **Deployment**: Render
- **CSV Export**: `json2csv` NPM package

## 🚀 Getting Started (Run Locally)
Install dependencies
npm install

Create a .env file in the root directory
SECRET_KEY=your_secret_key
ADMIN_PASSWORD=your_admin_password
MONGO_URI=your_mongo_atlas_uri

Run the server
node server.js


### Clone the repository
```bash
git clone https://github.com/damzG/Party-Register.git
cd Party-Register
📁 Folder Structure
Party-Register/
├── models/
│   └── Person.js
├── public/
│   ├── index.html
│   ├── admin.html
│   ├── admin-login.html
│   └── scripts.js
├── .env
├── .gitignore
├── server.js

🛡️ Security Notes
.env file is ignored from version control
Admin routes are protected using JWT authentication
Never expose your MongoDB URI or secret key in public repositories

🧠 Future Improvements
 Add email confirmation after guest registration
Add filters and search in admin table
Display total number of guests
Improve UI with Tailwind CSS
Add animations or success modals

🛠 Built with care by @damzG
Deployed on Render
