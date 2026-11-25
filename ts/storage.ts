export interface Contact {
    id: string;
    name: string;
    position: string;
    phone: string;
}

const STORAGE_KEY = "contact-list";

export function loadContacts(): Contact[] {
    const contacts = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Contact[];
    return Array.isArray(contacts) ? contacts : [];
}

export function saveContacts(contacts: Contact[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}
