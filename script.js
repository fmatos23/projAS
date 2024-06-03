var offers = [];

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace(" active", "");
    }
    document.getElementById(tabName).className += " active";
}

document.getElementById("offerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (!storedProfile) {
        alert('You must be logged in to create an offer.');
        return;
    }

    const instrument = document.getElementById("instrument").value;
    const size = document.getElementById("size").value;
    const material = document.getElementById("material").value;
    const notes = document.getElementById("notes").value;
    const price = document.getElementById("price").value;
    const loanDuration = document.getElementById("loanDuration").value;
    const imageInput = document.getElementById("image").files[0];

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageBase64 = e.target.result;
        const newOffer = {
            instrument: instrument,
            size: size,
            material: material,
            notes: notes,
            price: price,
            loanDuration: loanDuration,
            image: imageBase64,
            status: "available",
            postedBy: `${storedProfile.firstName} ${storedProfile.lastName}`,
            contact: storedProfile.phone,
            email: storedProfile.email
        };

        offers.push(newOffer);
        saveOffers();
        displayFilteredOffers(offers);

        document.getElementById("offerForm").reset();
        openTab(event, 'viewOffers');
    };

    reader.readAsDataURL(imageInput);
});

function openModal(instrument, size, material, notes, price, loanDuration, image) {
    const modal = document.getElementById("detailsModal");
    const detailsContent = document.getElementById("detailsContent");
    detailsContent.innerHTML = `
        <img src="${image}" style="max-width: 200px;">
        <p><strong>Instrument:</strong> ${instrument}</p>
        <p><strong>Size:</strong> ${size}</p>
        <p><strong>Material:</strong> ${material}</p>
        <p><strong>Notes:</strong> ${notes}</p>
        <p><strong>Price:</strong> €${price}</p>
        <p><strong>Loan Duration (days):</strong> ${loanDuration}</p>
    `;
    modal.style.display = "block";
    const loanButtonModal = document.getElementById("loanButtonModal");
    loanButtonModal.onclick = function() {
        loanOfferModal();
    };
}

function closeModal() {
    const modal = document.getElementById("detailsModal");
    modal.style.display = "none";
}

function openPaymentTab() {
    window.open("payment.html", "_blank");
}

function loanOffer(index) {
    if (offers[index].status === "available") {
        offers[index].status = "loaned";
        saveOffers();
        const offer = document.getElementById("offerList").children[index];
        const loanButton = offer.querySelector(".loan-button");
        loanButton.disabled = true;
        loanButton.textContent = "Loaned";
        openPaymentTab();
    }
}

function loanOfferModal() {
    closeModal();
    const index = offers.length - 1;
    loanOffer(index);
}

function filterByInstrument(instrument) {
    const filteredOffers = offers.filter(offer => offer.instrument === instrument);
    displayFilteredOffers(filteredOffers);
}

function applyFilters() {
    const maxPrice = parseFloat(document.getElementById("priceFilter").value);
    const size = document.getElementById("sizeFilter").value;
    const material = document.getElementById("materialFilter").value;

    const filteredOffers = offers.filter(offer => {
        const passesPriceFilter = !maxPrice || parseFloat(offer.price) <= maxPrice;
        const passesSizeFilter = !size || offer.size === size;
        const passesMaterialFilter = !material || offer.material === material;
        return passesPriceFilter && passesSizeFilter && passesMaterialFilter;
    });

    displayFilteredOffers(filteredOffers);
}

function displayFilteredOffers(filteredOffers) {
    const offerList = document.getElementById("offerList");
    offerList.innerHTML = "";

    filteredOffers.forEach((offer, index) => {
        const div = document.createElement("div");
        div.classList.add("offer");

        const img = document.createElement("img");
        img.src = offer.image;
        div.appendChild(img);

        const name = document.createElement("p");
        name.textContent = offer.instrument;
        div.appendChild(name);

        const priceElem = document.createElement("p");
        priceElem.textContent = "€" + offer.price;
        div.appendChild(priceElem);

        const materialElem = document.createElement("p");
        materialElem.textContent = "Material: " + offer.material;
        div.appendChild(materialElem);

        const notesElem = document.createElement("p");
        notesElem.textContent = "Description: " + offer.notes;
        div.appendChild(notesElem);

        const sizeElem = document.createElement("p");
        sizeElem.textContent = "Size: " + offer.size;
        div.appendChild(sizeElem);

        const loanDurationElem = document.createElement("p");
        loanDurationElem.textContent = "Loan Duration: " + offer.loanDuration + " days";
        div.appendChild(loanDurationElem);

        const postedBy = document.createElement("p");
        postedBy.textContent = `Posted by: ${offer.postedBy} (${offer.contact})`;
        div.appendChild(postedBy);

        const loanButton = document.createElement("button");
        loanButton.textContent = offer.status === "available" ? "Loan" : "Loaned";
        loanButton.className = "loan-button";
        loanButton.disabled = offer.status !== "available";
        loanButton.onclick = function() {
            loanOffer(index);
        };
        div.appendChild(loanButton);

        offerList.appendChild(div);
    });
}

document.getElementById("instrumentFilter").addEventListener("change", function() {
    const selectedInstrument = this.value;
    if (selectedInstrument === "All") {
        displayFilteredOffers(offers);
    } else {
        filterByInstrument(selectedInstrument);
    }
});

document.getElementById("applyFiltersBtn").addEventListener("click", applyFilters);

function toggleFilters() {
    const searchFilters = document.querySelector('.search-filters');
    if (searchFilters.style.display === 'none' || !searchFilters.style.display) {
        searchFilters.style.display = 'flex';
    } else {
        searchFilters.style.display = 'none';
    }
}

function goBack() {
    window.location.href = 'index.html';
}

function goHome() {
    window.location.href = 'index.html';
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (storedProfile && storedProfile.email === email && storedProfile.password === password) {
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password!');
    }
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;

    const profile = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password
    };
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile created successfully!');
    window.location.href = 'login.html';
});

function loadOffers() {
    offers = JSON.parse(localStorage.getItem('offers')) || [];
}

function saveOffers() {
    localStorage.setItem('offers', JSON.stringify(offers));
}

window.onload = function() {
    loadOffers();
    displayFilteredOffers(offers);
};
