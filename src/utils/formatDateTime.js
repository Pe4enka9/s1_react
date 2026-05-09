const pad = (n) => String(n).padStart(2, '0');

export const formatDateTime = (d) =>
    `${d.year}-${pad(d.month)}-${pad(d.day)} ${pad(d.hour)}:${pad(d.minute)}`;

export const formatDateTimeHuman = (d) =>
    `${pad(d.day)}.${pad(d.month)}.${d.year} ${pad(d.hour)}:${pad(d.minute)}`;
