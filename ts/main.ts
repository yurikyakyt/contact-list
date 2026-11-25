import type { Contact } from './storage';
import { loadContacts, saveContacts } from './storage';
import { openContactForm, readContactForm } from './form';
import { getLetter, renderBook, renderSearch } from './render';

let contacts = loadContacts();
let selectedLetter = '';
let editingId = '';

const alphabet = document.querySelector<HTMLElement>('.alphabet-index')!;
const contactsList = document.querySelector<HTMLElement>('.contacts-list')!;
const selectedSection = document.querySelector<HTMLElement>('.selected-letter-section')!;
const selectedTitle = document.querySelector<HTMLElement>('.selected-letter-title')!;
const emptyState = document.querySelector<HTMLElement>('.empty-state')!;
const letterEmptyState = document.querySelector<HTMLElement>('.letter-empty-state')!;
const contactDialog = document.querySelector<HTMLDialogElement>('.contact-dialog')!;
const contactForm = document.querySelector<HTMLFormElement>('.contact-form')!;
const contactTitle = document.querySelector<HTMLElement>('.contact-dialog-title')!;
const nameInput = document.querySelector<HTMLInputElement>('.contact-name')!;
const positionInput = document.querySelector<HTMLInputElement>('.contact-position')!;
const phoneInput = document.querySelector<HTMLInputElement>('.contact-phone')!;
const searchDialog = document.querySelector<HTMLDialogElement>('.search-dialog')!;
const searchInput = document.querySelector<HTMLInputElement>('.search-input')!;
const searchResults = document.querySelector<HTMLElement>('.search-results')!;
const searchEmptyState = document.querySelector<HTMLElement>('.search-empty-state')!;

function updatePage() {
    const bookElements = { alphabet, contactsList, selectedSection, selectedTitle, emptyState, letterEmptyState };
    renderBook(contacts, selectedLetter, bookElements);
    renderSearch(contacts, searchInput.value, searchResults, searchEmptyState);
}

function openForm(contact: Contact | null = null) {
    editingId = contact ? contact.id : '';
    openContactForm(contactDialog, contactForm, contactTitle, nameInput, positionInput, phoneInput, contact);
}

function handleContactButton(event: MouseEvent) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('button[data-id]');
    if (!button) return;

    const contact = contacts.find((item) => item.id === button.dataset.id);
    if (!contact) return;

    if (button.classList.contains('edit-contact-button')) {
        openForm(contact);
    } else {
        contacts = contacts.filter((item) => item.id !== contact.id);
        saveContacts(contacts);
        updatePage();
    }
}

document.querySelector<HTMLButtonElement>('.add-contact-button')!.addEventListener('click', () => openForm());
document.querySelector<HTMLButtonElement>('.cancel-contact-button')!.addEventListener('click', () => contactDialog.close());

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = readContactForm(contactForm, nameInput, positionInput, phoneInput);
    if (!values) return;

    if (editingId) {
        contacts = contacts.map((contact) => contact.id === editingId ? { ...contact, ...values } : contact);
    } else {
        contacts.push({ id: crypto.randomUUID(), ...values });
    }

    selectedLetter = getLetter(values);
    saveContacts(contacts);
    updatePage();
    contactDialog.close();
});

for (const input of [nameInput, positionInput, phoneInput]) {
    input.addEventListener('input', () => input.setCustomValidity(''));
}

alphabet.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('.alphabet-letter');
    if (!button) return;
    selectedLetter = button.dataset.letter ?? '';
    updatePage();
});

document.querySelector<HTMLButtonElement>('.open-search-button')!.addEventListener('click', () => {
    searchInput.value = '';
    updatePage();
    searchDialog.showModal();
    searchInput.focus();
});
document.querySelector<HTMLButtonElement>('.close-search-button')!.addEventListener('click', () => searchDialog.close());
searchInput.addEventListener('input', updatePage);

document.querySelector<HTMLButtonElement>('.delete-all-button')!.addEventListener('click', () => {
    if (!contacts.length || !confirm('Delete all contacts? This cannot be undone.')) return;
    contacts = [];
    selectedLetter = '';
    saveContacts(contacts);
    updatePage();
});

contactsList.addEventListener('click', handleContactButton);
searchResults.addEventListener('click', handleContactButton);

updatePage();
