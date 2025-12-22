// Dummy users (later you’ll replace with DB + backend APIs) [file:21]
const users = [
  { username: "user1",  password: "user123",  role: "user"  },
  { username: "admin1", password: "admin123", role: "admin" }
];

let appointments = []; // {patient, doctor, date, slot, username}

const loginSection = document.getElementById("login-section");
const userSection  = document.getElementById("user-section");
const adminSection = document.getElementById("admin-section");

const loginMsg     = document.getElementById("loginMsg");
const roleSelect   = document.getElementById("role");
const usernameInput= document.getElementById("username");
const passwordInput= document.getElementById("password");

const bookingMsg   = document.getElementById("bookingMsg");
const userTableBody  = document.querySelector("#userTable tbody");
const adminTableBody = document.querySelector("#adminTable tbody");

let currentUser = null;

// LOGIN FUNCTION (called from HTML onclick)
function doLogin() {
  const role = roleSelect.value;
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const found = users.find(
    u => u.username === username && u.password === password && u.role === role
  );

  if (!found) {
    loginMsg.textContent =
      "Invalid credentials. Try: user1/user123 or admin1/admin123.";
    loginMsg.style.color = "red";
    return;
  }

  currentUser = found;
  loginMsg.textContent = "";
  usernameInput.value = "";
  passwordInput.value = "";

  if (role === "user") {
    showUserDashboard();
  } else {
    showAdminDashboard();
  }
}

function showUserDashboard() {
  loginSection.classList.add("hidden");
  adminSection.classList.add("hidden");
  userSection.classList.remove("hidden");
  fillUserTable();
}

function showAdminDashboard() {
  loginSection.classList.add("hidden");
  userSection.classList.add("hidden");
  adminSection.classList.remove("hidden");
  fillAdminTable();
}

function logout() {
  currentUser = null;
  userSection.classList.add("hidden");
  adminSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
}

// BOOK APPOINTMENT (called from HTML onclick)
function bookAppointment() {
  if (!currentUser || currentUser.role !== "user") {
    bookingMsg.textContent = "Please login as user to book.";
    bookingMsg.style.color = "red";
    return;
  }

  const patientName = document.getElementById("patientName").value.trim();
  const doctor = document.getElementById("doctor").value;
  const date = document.getElementById("date").value;
  const slot = document.getElementById("slot").value;

  if (!patientName || !doctor || !date || !slot) {
    bookingMsg.textContent = "All fields are required.";
    bookingMsg.style.color = "red";
    return;
  }

  const exists = appointments.some(
    a => a.doctor === doctor && a.date === date && a.slot === slot
  );
  if (exists) {
    bookingMsg.textContent =
      "This slot is already booked. Please choose another slot.";
    bookingMsg.style.color = "red";
    return;
  }

  const appointment = {
    patient: patientName,
    doctor,
    date,
    slot,
    username: currentUser.username
  };
  appointments.push(appointment);

  bookingMsg.textContent = "Appointment booked successfully!";
  bookingMsg.style.color = "green";
  document.getElementById("patientName").value = "";

  fillUserTable();
  fillAdminTable();
}

function fillUserTable() {
  userTableBody.innerHTML = "";
  if (!currentUser) return;

  const my = appointments.filter(a => a.username === currentUser.username);
  my.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.doctor}</td>
      <td>${a.date}</td>
      <td>${a.slot}</td>
    `;
    userTableBody.appendChild(tr);
  });
}

function fillAdminTable() {
  adminTableBody.innerHTML = "";
  appointments.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.patient}</td>
      <td>${a.doctor}</td>
      <td>${a.date}</td>
      <td>${a.slot}</td>
    `;
    adminTableBody.appendChild(tr);
  });
}
