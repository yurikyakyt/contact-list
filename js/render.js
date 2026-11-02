const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";

export function getLetter(contact) {
    const firstLetter = contact.name.trim().charAt(0).toUpperCase();
    return LETTERS.includes(firstLetter) && firstLetter !== "#" ? firstLetter : "#";
}

function makeContactCard(contact) {
    const card = document.createElement("article");
    card.className = "contact-card";
    card.innerHTML = `
        <h4></h4>
        <p></p>
        <p></p>
        <div class="contact-actions">
            <button class="edit-contact-button" type="button">Edit</button>
            <button class="delete-contact-button" type="button">Delete</button>
        </div>
    `;
    card.querySelector("h4").textContent = contact.name;
    card.querySelectorAll("p")[0].textContent = contact.position;
    card.querySelectorAll("p")[1].textContent = contact.phone;
    card.querySelector(".edit-contact-button").dataset.id = contact.id;
    card.querySelector(".delete-contact-button").dataset.id = contact.id;
    return card;
}

export function renderBook(contacts, selectedLetter, elements) {
    const { alphabet, contactsList, selectedSection, selectedTitle, emptyState, letterEmptyState } = elements;
    emptyState.hidden = contacts.length > 0;
    alphabet.replaceChildren();

    for (const letter of LETTERS) {
        const count = contacts.filter((contact) => getLetter(contact) === letter).length;
        const button = document.createElement("button");
        button.className = "alphabet-letter";
        button.type = "button";
        button.dataset.letter = letter;
        button.setAttribute("aria-pressed", String(selectedLetter === letter));
        button.innerHTML = `<span class="alphabet-letter-label">${letter}</span><span class="alphabet-letter-count">${count}</span>`;
        alphabet.append(button);
    }

    contactsList.replaceChildren();
    selectedSection.hidden = !selectedLetter;
    if (!selectedLetter) return;

    const matchingContacts = contacts
        .filter((contact) => getLetter(contact) === selectedLetter)
        .sort((first, second) => first.name.localeCompare(second.name));
    selectedTitle.textContent = `${selectedLetter} (${matchingContacts.length})`;
    letterEmptyState.hidden = matchingContacts.length > 0;
    matchingContacts.forEach((contact) => contactsList.append(makeContactCard(contact)));
}

export function renderSearch(contacts, query, results, emptyState) {
    results.replaceChildren();
    query = query.trim().toLowerCase();

    if (!query) {
        emptyState.hidden = false;
        emptyState.textContent = "Enter a search term.";
        return;
    }

    const matches = contacts.filter((contact) =>
        `${contact.name} ${contact.position} ${contact.phone}`.toLowerCase().includes(query)
    );
    emptyState.hidden = matches.length > 0;
    emptyState.textContent = matches.length ? "" : "No contacts found.";
    matches.forEach((contact) => results.append(makeContactCard(contact)));
}
