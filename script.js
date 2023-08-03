

  // Function to handle login
  function login() {
    const login_id = document.getElementById("login_id").value;
    const password = document.getElementById("password").value;

    fetch(authAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "login_id": login_id,
        "password": password
      })
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Invalid credentials");
      }
    })
    .then(data => {
      // Save the token in local storage for further API calls
      localStorage.setItem("token", data.token);
      // Redirect to the Customer List screen
      window.location.href = "customer_list.html";
    })
    .catch(error => {
      alert(error.message);
    });
  }

  // Function to fetch and display the list of customers
  function getCustomerList() {
    const token = localStorage.getItem("token");
    fetch(`${customerAPI}?cmd=get_customer_list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const customerList = document.getElementById("customerList");
      customerList.innerHTML = "";

      data.forEach(customer => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${customer.first_name}</td>
          <td>${customer.last_name}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
          <td>
            <button onclick="deleteCustomer('${customer.uuid}')">Delete</button>
            <button onclick="updateCustomer('${customer.uuid}')">Update</button>
          </td>
        `;
        customerList.appendChild(row);
      });
    })
    .catch(error => {
      alert(error.message);
    });
  }

  // Function to create a new customer
  function addCustomer() {
    const token = localStorage.getItem("token");
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const street = document.getElementById("street").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    fetch(customerAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "cmd": "create",
        "first_name": first_name,
        "last_name": last_name,
        "street": street,
        "address": address,
        "city": city,
        "state": state,
        "email": email,
        "phone": phone
      })
    })
    .then(response => {
      if (response.status === 201) {
        alert("Customer created successfully");
        // Redirect to the Customer List screen
        window.location.href = "customer_list.html";
      } else {
        throw new Error("Failed to create customer");
      }
    })
    .catch(error => {
      alert(error.message);
    });
  }

  // Function to delete a customer
  function deleteCustomer(uuid) {
    const token = localStorage.getItem("token");
    fetch(customerAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "cmd": "delete",
        "uuid": uuid
      })
    })
    .then(response => {
      if (response.status === 200) {
        alert("Customer deleted successfully");
        getCustomerList(); // Refresh the customer list
      } else if (response.status === 400) {
        throw new Error("UUID not found");
      } else {
        throw new Error("Error while deleting customer");
      }
    })
    .catch(error =>
        {
            alert(error.message);
          })
        }

        function updateCustomer(uuid) {
          const token = localStorage.getItem("token");
          const first_name = document.getElementById("first_name").value;
          const last_name = document.getElementById("last_name").value;
          const street = document.getElementById("street").value;
          const address = document.getElementById("address").value;
          const city = document.getElementById("city").value;
          const state = document.getElementById("state").value;
          const email = document.getElementById("email").value;
          const phone = document.getElementById("phone").value;
      
          fetch(customerAPI, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              "cmd": "update",
              "uuid": uuid,
              "first_name": first_name,
              "last_name": last_name,
              "street": street,
              "address": address,
              "city": city,
              "state": state,
              "email": email,
              "phone": phone
            })
          })
          .then(response => {
            if (response.status === 200) {
              alert("Customer updated successfully");
              // Redirect to the Customer List screen
              window.location.href = "customer_list.html";
            } else if (response.status === 400) {
              throw new Error("Body is Empty");
            } else if (response.status === 500) {
              throw new Error("UUID not found");
            } else {
              throw new Error("Error while updating customer");
            }
          })
          .catch(error => {
            alert(error.message);
          });
          
        }
      
        // Wait for the DOM to be ready before calling the getCustomerList function
        document.addEventListener("DOMContentLoaded", () => {
          getCustomerList();
        });
      