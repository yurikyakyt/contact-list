const STORAGE_KEY = "contact-list";

export function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(contacts) ? contacts : [];
}

export function saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}
