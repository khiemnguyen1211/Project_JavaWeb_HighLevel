const addressModal = document.getElementById("address-modal");
const openModalButton = document.getElementById("address-btn");
const closeModalButton = document.getElementById("close-modal");
const customerAddressInput = document.getElementById("customer-address");
const addressForm = document.getElementById("address-form");
const addressDisplay = document.getElementById("address-display");

// Show the modal
openModalButton.addEventListener("click", () => {
    addressModal.style.display = "block";
});

// Close the modal
closeModalButton.addEventListener("click", () => {
    addressModal.style.display = "none";
});

// Submit the address form
addressForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const streetName = document.getElementById("street-name").value.trim();
    const suburb = document.getElementById("suburb").value.trim();
    const state = document.getElementById("state").value.trim();
    const postcode = document.getElementById("postcode").value.trim();

    if (!streetName || !suburb || !state || !postcode) {
        alert("Please fill in all address fields.");
        return;
    }


    // Combine the address
    customerAddressInput.value = `${streetName}, ${suburb}, ${state}, ${postcode}`;

    // Close the modal
    addressModal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target === addressModal) {
        addressModal.style.display = "none";
    }
});





let map;
let marker;
let geocoder;
let responseDiv;
let response;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: { lat: -34.397, lng: 150.644 },
        mapTypeControl: false,
    });
    geocoder = new google.maps.Geocoder();

    const inputText = document.createElement("input");

    inputText.type = "text";
    inputText.placeholder = "Enter a location";

    const submitButton = document.createElement("input");

    submitButton.type = "button";
    submitButton.value = "Geocode";
    submitButton.classList.add("button", "button-primary");

    const clearButton = document.createElement("input");

    clearButton.type = "button";
    clearButton.value = "Clear";
    clearButton.classList.add("button", "button-secondary");
    response = document.createElement("pre");
    response.id = "response";
    response.innerText = "";
    responseDiv = document.createElement("div");
    responseDiv.id = "response-container";
    responseDiv.appendChild(response);

    const instructionsElement = document.createElement("p");

    instructionsElement.id = "instructions";
    instructionsElement.innerHTML =
        "<strong>Instructions</strong>: Enter an address in the textbox to geocode or click on the map to reverse geocode.";
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(
        instructionsElement
    );
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);
    marker = new google.maps.Marker({
        map,
    });
    map.addListener("click", (e) => {
        geocode({ location: e.latLng });
    });
    submitButton.addEventListener("click", () =>
        geocode({ address: inputText.value })
    );
    clearButton.addEventListener("click", () => {
        clear();
    });
    clear();
}

function clear() {
    marker.setMap(null);
}

function geocode(request) {
    clear();
    geocoder
        .geocode(request)
        .then((result) => {
            const { results } = result;

            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            marker.setMap(map);
            response.innerText = JSON.stringify(result, null, 2);
            return results;
        })
        .catch((e) => {
            alert("Geocode was not successful for the following reason: " + e);
        });
}

window.initMap = initMap;




