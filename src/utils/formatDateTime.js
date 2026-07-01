const pad = (n) => String(n).padStart(2, '0');

export const formatDate = (d) => `${d.year}-${pad(d.month)}-${pad(d.day)}`;

export const formatDateTimeCalendar = (d, t) =>
    `${pad(d.day)}.${pad(d.month)}.${d.year} ${t}`;

export const formatDateHuman = (isoString) =>
    new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    }).format(new Date(isoString));

export const formatTimeHuman = (isoString) =>
    new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(isoString));
