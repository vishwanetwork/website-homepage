// Company contact email; all contact/demo entry points across the site point here
export const CONTACT_EMAIL = 'official@vishwalab.com';

// "Talk to us" form URL
export const TYPEFORM_URL = 'https://form.typeform.com/to/IjCOn4nY';

// Build a mailto link, optionally with a subject
export function mailto(subject) {
  return subject
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${CONTACT_EMAIL}`;
}
