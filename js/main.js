import { loadContacts, saveContacts } from './storage.js';
import { openContactForm, readContactForm } from './form.js';
import { getLetter, renderBook, renderSearch } from './render.js';

let contacts = loadContacts();
let selectedLetter = '';
let editingId = '';

const alphabet = document.querySelector('.alphabet-index');
const contactsList = document.querySelector('.contacts-list');
const selectedSection = document.querySelector('.selected-letter-section');
const selectedTitle = document.querySelector('.selected-letter-title');
const emptyState = document.querySelector('.empty-state');
const letterEmptyState = document.querySelector('.letter-empty-state');
const contactDialog = document.querySelector('.contact-dialog');
const contactForm = document.querySelector('.contact-form');
const contactTitle = document.querySelector('.contact-dialog-title');
const nameInput = document.querySelector('.contact-name');
const positionInput = document.querySelector('.contact-position');
const phoneInput = document.querySelector('.contact-phone');
const searchDialog = document.querySelector('.search-dialog');
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results');
const searchEmptyState = document.querySelector('.search-empty-state');

function updatePage() {
    const bookElements = { alphabet, contactsList, selectedSection, selectedTitle, emptyState, letterEmptyState };
    renderBook(contacts, selectedLetter, bookElements);
    renderSearch(contacts, searchInput.value, searchResults, searchEmptyState);
}

function openForm(contact = null) {
    editingId = contact ? contact.id : '';
    openContactForm(contactDialog, contactForm, contactTitle, nameInput, positionInput, phoneInput, contact);
}

function handleContactButton(event) {
    const button = event.target.closest('button[data-id]');
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

document.querySelector('.add-contact-button').addEventListener('click', () => openForm());
document.querySelector('.cancel-contact-button').addEventListener('click', () => contactDialog.close());

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
    const button = event.target.closest('.alphabet-letter');
    if (!button) return;
    selectedLetter = button.dataset.letter;
    updatePage();
});

document.querySelector('.open-search-button').addEventListener('click', () => {
    searchInput.value = '';
    updatePage();
    searchDialog.showModal();
    searchInput.focus();
});
document.querySelector('.close-search-button').addEventListener('click', () => searchDialog.close());
searchInput.addEventListener('input', updatePage);

document.querySelector('.delete-all-button').addEventListener('click', () => {
    if (!contacts.length || !confirm('Delete all contacts? This cannot be undone.')) return;
    contacts = [];
    selectedLetter = '';
    saveContacts(contacts);
    updatePage();
});

contactsList.addEventListener('click', handleContactButton);
searchResults.addEventListener('click', handleContactButton);

updatePage();
