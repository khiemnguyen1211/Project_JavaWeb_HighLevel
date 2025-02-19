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




//integrate googlemap
let map;
let marker;
let geocoder;
let autocomplete;
let formAutocomplete;

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: -33.8568, lng: 151.2153 }, // Default center
    });

    marker = new google.maps.Marker({
        map,
        draggable: true,
    });

    geocoder = new google.maps.Geocoder();

    // Autocomplete for main address input
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("customer-address"),
        { types: ["geocode"], componentRestrictions: { country: "AU" } }
    );

    autocomplete.addListener("place_changed", function () {
        let place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            alert("No details available for the selected address.");
            return;
        }

        // Move marker and center map with zoom
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        marker.setPosition(place.geometry.location);
        marker.setMap(map);

        // Fill address field
        document.getElementById("customer-address").value = place.formatted_address;

        // Fill form fields
        fillFormFields(place);
    });

    // Autocomplete for form fields (street, suburb, state, postcode)
    formAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById("street-name"),
        { types: ["geocode"], componentRestrictions: { country: "AU" } }
    );

    formAutocomplete.addListener("place_changed", fillInAddress);

    // Marker drag event to update address and zoom in
    google.maps.event.addListener(marker, "dragend", function () {
        geocodePosition(marker.getPosition());
    });
}

// Reverse geocode to update form when marker moves
function geocodePosition(pos) {
    geocoder.geocode({ location: pos }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                document.getElementById("customer-address").value = results[0].formatted_address;
                fillFormFields(results[0]);

                // Zoom in when marker moves
                map.setCenter(pos);
                map.setZoom(17);
            }
        }
    });
}

// Extract and fill form fields (with street number)
function fillInAddress() {
    const place = formAutocomplete.getPlace();
    if (!place.geometry) {
        alert("No details available for this address!");
        return;
    }

    fillFormFields(place);

    // Move marker, center map, and zoom in
    map.setCenter(place.geometry.location);
    map.setZoom(17);
    marker.setPosition(place.geometry.location);
}

// Helper function to extract address components
function fillFormFields(place) {
    let streetNumber = "";
    let streetName = "";
    let suburb = "";
    let state = "";
    let postcode = "";

    place.address_components.forEach((component) => {
        const types = component.types;
        if (types.includes("street_number")) {
            streetNumber = component.long_name; // Street number
        }
        if (types.includes("route")) {
            streetName = component.long_name; // Street name
        }
        if (types.includes("locality")) {
            suburb = component.long_name; // Suburb
        }
        if (types.includes("administrative_area_level_1")) {
            state = component.short_name; // State
        }
        if (types.includes("postal_code")) {
            postcode = component.long_name; // Postcode
        }
    });

    // Combine street number and name
    document.getElementById("street-name").value = streetNumber
        ? `${streetNumber} ${streetName}`
        : streetName;

    document.getElementById("suburb").value = suburb;
    document.getElementById("state").value = state;
    document.getElementById("postcode").value = postcode;
}

// Assign the function to global window object
window.initMap = initMap;








