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
    var instrument = document.getElementById("instrument").value;
    var size = document.getElementById("size").value;
    var material = document.getElementById("material").value;
    var notes = document.getElementById("notes").value;
    var price = document.getElementById("price").value;
    var loanDuration = document.getElementById("loanDuration").value;
    var image = document.getElementById("image").files[0];
    var offerList = document.getElementById("offerList");

    var div = document.createElement("div");
    div.classList.add("offer");

    var img = document.createElement("img");
    img.src = URL.createObjectURL(image);
    div.addEventListener("click", function() {
        openModal(instrument, size, material, notes, price, loanDuration, img.src);
    });
    div.appendChild(img);

    var name = document.createElement("p");
    name.textContent = instrument;
    div.appendChild(name);

    var priceElem = document.createElement("p");
    priceElem.textContent = "$" + price;
    div.appendChild(priceElem);

    var loanButton = document.createElement("button");
    loanButton.textContent = "Loan";
    loanButton.className = "loan-button";
    loanButton.onclick = function() {
        loanOffer(offers.length - 1);
    };
    div.appendChild(loanButton);

    var newOffer = {
        instrument: instrument,
        size: size,
        material: material,
        notes: notes,
        price: price,
        loanDuration: loanDuration,
        image: img.src,
        status: "available"
    };

    offers.push(newOffer);

    offerList.appendChild(div);

    document.getElementById("instrument").value = "";
    document.getElementById("size").value = "";
    document.getElementById("material").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("price").value = "";
    document.getElementById("loanDuration").value = "";
    document.getElementById("image").value = "";

    openTab(event, 'viewOffers');
});

function openModal(instrument, size, material, notes, price, loanDuration, image) {
    var modal = document.getElementById("detailsModal");
    var detailsContent = document.getElementById("detailsContent");
    detailsContent.innerHTML = `
        <img src="${image}" style="max-width: 200px;">
        <p><strong>Instrument:</strong> ${instrument}</p>
        <p><strong>Size:</strong> ${size}</p>
        <p><strong>Material:</strong> ${material}</p>
        <p><strong>Notes:</strong> ${notes}</p>
        <p><strong>Price:</strong> $${price}</p>
        <p><strong>Loan Duration (weeks):</strong> ${loanDuration}</p>
    `;
    modal.style.display = "block";
    var loanButtonModal = document.getElementById("loanButtonModal");
    loanButtonModal.onclick = function() {
        loanOfferModal();
    };
}

function closeModal() {
    var modal = document.getElementById("detailsModal");
    modal.style.display = "none";
}

function openPaymentTab() {
    var paymentWindow = window.open("payment.html", "_blank");
}

function loanOffer(index) {
    if (offers[index].status === "available") {
        offers[index].status = "loaned";
        var offer = document.getElementById("offerList").children[index];
        var loanButton = offer.querySelector(".loan-button");
        loanButton.disabled = true;
        loanButton.textContent = "Loaned";
        openPaymentTab();
    }
}

function loanOfferModal() {
    var modal = document.getElementById("detailsModal");
    modal.style.display = "none";
    var index = offers.length - 1;
    loanOffer(index);
}

// Filter offers by instrument type
function filterByInstrument(instrument) {
    var filteredOffers = offers.filter(function(offer) {
        return offer.instrument === instrument;
    });
    displayFilteredOffers(filteredOffers);
}

// Apply additional filters for price, size, and material
function applyFilters() {
    var maxPrice = parseFloat(document.getElementById("priceFilter").value);
    var size = document.getElementById("sizeFilter").value;
    var material = document.getElementById("materialFilter").value;

    var filteredOffers = offers.filter(function(offer) {
        var passesPriceFilter = !maxPrice || parseFloat(offer.price) <= maxPrice;
        var passesSizeFilter = !size || offer.size === size;
        var passesMaterialFilter = !material || offer.material === material;
        return passesPriceFilter && passesSizeFilter && passesMaterialFilter;
    });

    displayFilteredOffers(filteredOffers);
}

// Display filtered offers in the offer list
function displayFilteredOffers(filteredOffers) {
    var offerList = document.getElementById("offerList");
    offerList.innerHTML = ""; // Clear existing offers

    filteredOffers.forEach(function(offer) {
        var div = document.createElement("div");
        div.classList.add("offer");

        var img = document.createElement("img");
        img.src = offer.image;
        div.appendChild(img);

        var name = document.createElement("p");
        name.textContent = offer.instrument;
        div.appendChild(name);

        var priceElem = document.createElement("p");
        priceElem.textContent = "$" + offer.price;
        div.appendChild(priceElem);

        var loanButton = document.createElement("button");
        loanButton.textContent = "Loan";
        loanButton.className = "loan-button";
        loanButton.onclick = function() {
            loanOffer(offers.indexOf(offer));
        };
        div.appendChild(loanButton);

        offerList.appendChild(div);
    });
}

// Event listeners for filter inputs
document.getElementById("instrumentFilter").addEventListener("change", function() {
    var selectedInstrument = this.value;
    if (selectedInstrument === "All") {
        displayFilteredOffers(offers);
    } else {
        filterByInstrument(selectedInstrument);
    }
});

document.getElementById("applyFiltersBtn").addEventListener("click", applyFilters);

function toggleFilters() {
    var searchFilters = document.querySelector('.search-filters');
    if (searchFilters.style.display === 'none' || !searchFilters.style.display) {
        searchFilters.style.display = 'flex'; // Show the search filters
    } else {
        searchFilters.style.display = 'none'; // Hide the search filters
    }
}