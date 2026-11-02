export function openContactForm(dialog, form, title, nameInput, positionInput, phoneInput, contact = null) {
    form.reset();
    form.querySelectorAll('input').forEach((input) => input.setCustomValidity(''));
    title.textContent = contact ? 'Edit contact' : 'Add contact';

    if (contact) {
        nameInput.value = contact.name;
        positionInput.value = contact.position;
        phoneInput.value = contact.phone;
    }

    dialog.showModal();
    nameInput.focus();
}

export function readContactForm(form, nameInput, positionInput, phoneInput) {
    const name = nameInput.value.trim();
    const position = positionInput.value.trim();
    const phone = phoneInput.value.trim();

    nameInput.setCustomValidity(isNameValid(name) ? '' : 'Enter a valid name.');
    positionInput.setCustomValidity(isPositionValid(position) ? '' : 'Enter a valid position.');
    phoneInput.setCustomValidity(isPhoneValid(phone) ? '' : 'Enter a valid phone number.');

    if (!form.reportValidity()) return null;
    return { name, position, phone };
}

function isNameValid(name) {
    if (typeof name !== 'string') return false;
    if (name.length < 2) return false;
    if (!/^[a-zA-Zа-яА-ЯёЁ '-.]+$/.test(name)) return false;
    return /[a-zA-Zа-яА-ЯёЁ]/.test(name);
}

function isPhoneValid(phone) {
    if (typeof phone !== 'string') return false;
    if (!/^[0-9+()\-. ]+$/.test(phone)) return false;
    const digits = phone.replace(/\D/g, '').length;
    return digits >= 7 && digits <= 15;
}

function isPositionValid(position) {
    return position.length >= 2;
}