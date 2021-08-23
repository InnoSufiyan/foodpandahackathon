const resturantName = document.getElementById("resturantNameRegistration");
const resturantNumber = document.getElementById("resturantNumberRegistration");
const resturantEmail = document.getElementById("resturantEmailRegistration");
const resturantPassword = document.getElementById(
  "resturantPasswordRegistration"
);

const ResturantloginEmail = document.getElementById("ResturantloginEmail");
const ResturantloginPassword = document.getElementById(
  "ResturantloginPassword"
);

const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPhone = document.getElementById("customerPhone");
const customerCountry = document.getElementById("customerCountry");
const customerCity = document.getElementById("customerCity");
const customerPassword = document.getElementById("customerPassword");

const customerLoginEmail = document.getElementById("customerLoginEmail");
const customerLoginPassword = document.getElementById("customerLoginPassword");

function resturantRegistration() {
  const resturantOwner = {
    resturantName: resturantNameRegistration.value,
    resturantNumber: resturantNumberRegistration.value,
    resturantEmail: resturantEmailRegistration.value,
    resturantPassword: resturantPasswordRegistration.value,
  };

  // console.log(resturantOwner)

  firebase
    .auth()
    .createUserWithEmailAndPassword(
      resturantEmail.value,
      resturantPassword.value
    )
    .then((userCredential) => {
      // Signed in
      // var user = userCredential.user;
      console.log(userCredential.user.uid);
      firebase
        .database()
        .ref(`Resturant/${userCredential.user.uid}`)
        .set(resturantOwner)
        .then(() => {
          alert("User register hogaya");
          location.href = "loginResturant.html";
        });
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      alert(errorMessage);
      // ..
    });
}

function loginResturant() {
  firebase
    .auth()
    .signInWithEmailAndPassword(
      ResturantloginEmail.value,
      ResturantloginPassword.value
    )
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user.uid);
      localStorage.setItem("currentLoginResturant", user.uid);
      location.href = "resturantDashboard.html";
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
}

function customerRegistration() {
  const customer = {
    customerName: customerName.value,
    customerEmail: customerEmail.value,
    customerPhone: customerPhone.value,
    customerCountry: customerCountry.value,
    customerCity: customerCity.value,
    customerPassword: customerPassword.value,
  };

  // console.log(resturantOwner)

  firebase
    .auth()
    .createUserWithEmailAndPassword(customerEmail.value, customerPassword.value)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user);
      firebase
        .database()
        .ref(`Customer/${userCredential.user.uid}`)
        .set(customer)
        .then(() => {
          alert("customer register hogaya");
          location.href = "loginCustomer.html";
        });
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      // ..
    });
}

function loginCustomer() {
  firebase
    .auth()
    .signInWithEmailAndPassword(
      customerLoginEmail.value,
      customerLoginPassword.value
    )
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user);
      location.href = "customerDashboard.html";
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
}

function resturantDashboardload() {
  const resturantName = document.getElementById("resturantName");

  currentResturantUID = localStorage.getItem("currentLoginResturant");
  console.log(currentResturantUID);

  firebase
    .database()
    .ref(`Resturant/${currentResturantUID}`)
    .once("value", (data) => {
      console.log(data.val());
      console.log(data.val().resturantName);
      const resturantNamefromFirebase = data.val().resturantName;
      resturantName.innerText = `${resturantNamefromFirebase} Admin Panel`;
      console.log(resturantName.innerText);
    });

  // resturantName.innerText = "dadaddsad"
}

function customerDashboardload() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid);
      firebase
        .database()
        .ref(`Customer/${user.uid}`)
        .once("value", (data) => {
          console.log(data.val());
          console.log(data.val().resturantName);
          const myResturants = document.getElementById("myResturants");
          const customerNamefromFirebase = data.val().customerName;
          myResturants.innerHTML = `Welcome ${customerNamefromFirebase}`;
        });
      firebase
        .database()
        .ref(`Resturant`)
        .once("value", (data) => {
          console.log(data.val());
          for (key in data.val()) {
            console.log(data.val()[key]);
            const resturantsforUser =
              document.getElementById("resturantsforUser");
            var foodkey = key;
            console.log(foodkey);
            console.log(resturantsforUser);
            const forFood = document.createElement("div");
            forFood.setAttribute("class", "col-lg-4 col-md-6 p-0");
            forFood.setAttribute("id", foodkey);
            forFood.addEventListener("click", (e) => {
              localStorage.setItem("Resturant", e.path[2].getAttribute("id"));
              location.href = "resturantmenuforuser.html";
            });
            resturantsforUser.appendChild(forFood);
            forFood.innerHTML = `<a 
            class="imggallery"
          >
            <img src="images/1.jpg" alt="" class="img-fluid" />
            <div class="overlay"></div>
            <div class="imgtext">${data.val()[key].resturantName}</div>
          </a>`;
          }
        });
    } else {
      console.log("user is signed out");
    }
  });

  // firebase
  //   .database()
  //   .ref(`Resturant/${currentResturantUID}`)
  //   .once("value", (data) => {
  //     console.log(data.val());
  //     console.log(data.val().resturantName);
  //     const resturantNamefromFirebase = data.val().resturantName;
  //     resturantName.innerText = `${resturantNamefromFirebase} Admin Panel`;
  //     console.log(resturantName.innerText);
  //   });

  // resturantName.innerText = "dadaddsad"
}

function createDish() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const itemName = document.getElementById("itemName");
      const itemPrice = document.getElementById("itemPrice");
      const category = document.getElementById("category").value;
      const delivery = document.getElementById("delivery").value;

      var uid = user.uid;

      var key = firebase
        .database()
        .ref(`Resturant/${uid}/food/${category}`)
        .push().key;
      console.log(key);
      const foodDetails = {
        key: key,
        itemName: itemName.value,
        itemPrice: itemPrice.value,
        category: category,
        delivery: delivery,
      };
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log(uid);
      firebase
        .database()
        .ref(`Resturant/${uid}/food/${key}`)
        .set(foodDetails)
        .then(() => {
          console.log("Food Details added check");
        });

      // ...
    } else {
      // User is signed out
      // ...
      console.log("user is signed out");
    }
  });
}

function getFoodData() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;

      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log(uid);
      firebase
        .database()
        .ref(`Resturant/${uid}/food`)
        .once("value", (data) => {
          console.log(data.val());
          for (key in data.val()) {
            console.log(data.val()[key]);
            const differentDishes =
              document.getElementsByClassName("differentdishes");
            const mycard = document.createElement("div");
            mycard.setAttribute("class", "card");
            mycard.setAttribute("style", "width: 18rem");
            differentDishes[0].appendChild(mycard);
            mycard.innerHTML = `
            <img class="card-img-top" src="https://source.unsplash.com/random/309x200" alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">${data.val()[key].itemName}</h5>
              <p class="card-text">
              ${data.val()[key].itemName} in only ${
              data.val()[key].itemPrice
            } Rs and category is : ${data.val()[key].category}
              </p>
              <p class="card-text"> ${data.val()[key].delivery} </p>
              <a href="#" class="btn btn-primary">OrderNow</a>
            </div>
          `;
          }
        });
    } else {
      // User is signed out
      // ...
      console.log("user is signed out");
    }
  });
}

function customerResturantDishPage() {
  const uid = localStorage.getItem("Resturant");
  console.log(uid);
  firebase
    .database()
    .ref(`Resturant/${uid}/food`)
    .once("value", (data) => {
      for (key in data.val()) {
        console.log(data.val()[key]);
        const differentdishesfromResturant = document.getElementsByClassName(
          "differentdishesfromResturant"
        );
        const mycard = document.createElement("div");
        mycard.setAttribute("class", "card");
        mycard.setAttribute("style", "width: 18rem");
        differentdishesfromResturant[0].appendChild(mycard);
        mycard.innerHTML = `
            <img class="card-img-top" src="https://source.unsplash.com/random/309x200" alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">${data.val()[key].itemName}</h5>
              <p class="card-text">
              ${data.val()[key].itemName} in only 200 Rs and category is : ${
          data.val()[key].category
        }
              </p>
              <p class="card-text"> ${data.val()[key].delivery} </p>
              <a href="#" class="btn btn-primary">OrderNow</a>
            </div>
          `;
      }
    });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}
