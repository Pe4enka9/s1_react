const pad = (n) => String(n).padStart(2, '0');

export const formatDate = (d) => `${d.year}-${pad(d.month)}-${pad(d.day)}`;

export const formatDateTimeHuman = (d, t) =>
    `${pad(d.day)}.${pad(d.month)}.${d.year} ${t}`;
