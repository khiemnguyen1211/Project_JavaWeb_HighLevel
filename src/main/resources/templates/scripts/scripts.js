const addressModal = document.getElementById("address-modal");
const openModalButton = document.getElementById("address-btn");
const closeModalButton = document.getElementById("close-modal");
const customerAddressInput = document.getElementById("customer-address");
const addressForm = document.getElementById("address-form");

// Show the modal
openModalButton.addEventListener("click", () => {
    addressModal.style.display = "block";
});

// Close the modal
closeModalButton.addEventListener("click", () => {
    addressModal.style.display = "none";
});

// Submit the form and populate the address input
addressForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const street = document.getElementById("street").value;
    const city = document.getElementById("city").value;
    const zipcode = document.getElementById("zipcode").value;

    const fullAddress = `${street}, ${city}, ${zipcode}`;
    customerAddressInput.value = fullAddress;

    addressModal.style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target === addressModal) {
        addressModal.style.display = "none";
    }
});
