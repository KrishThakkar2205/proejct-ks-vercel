/**
 * Date/Time utilities for UTC ↔ IST (UTC+5:30) conversion.
 * All times from the backend are UTC. We display them in IST.
 */

const IST_OFFSET_MINUTES = 330; // UTC+5:30

/**
 * Converts a UTC date string + UTC time string (HH:mm or HH:mm:ss)
 * to an IST 12-hour formatted string, e.g. "10:00 AM".
 *
 * @param {string} utcDate  e.g. "2025-03-14"
 * @param {string} utcTime  e.g. "04:30" or "04:30:00"
 * @returns {string}        e.g. "10:00 AM"
 */
export const utcToIST = (utcDate, utcTime) => {
    if (!utcDate || !utcTime) return '';
    // Normalise time to HH:mm
    const timePart = utcTime.substring(0, 5);
    const d = new Date(`${utcDate}T${timePart}:00Z`);
    if (isNaN(d.getTime())) return utcTime;

    // Add IST offset
    const istMs = d.getTime() + IST_OFFSET_MINUTES * 60 * 1000;
    const ist = new Date(istMs);

    const hours = ist.getUTCHours();
    const minutes = ist.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const displayMinutes = String(minutes).padStart(2, '0');
    return `${displayHour}:${displayMinutes} ${ampm}`;
};

/**
 * Converts a UTC date string + UTC time string to a local IST date string
 * in YYYY-MM-DD format (needed so calendar day-matching is correct for IST).
 *
 * @param {string} utcDate  e.g. "2025-03-14"
 * @param {string} utcTime  e.g. "18:30" (= 00:00 IST next day)
 * @returns {string}        e.g. "2025-03-15"
 */
export const utcToISTDate = (utcDate, utcTime) => {
    if (!utcDate) return utcDate;
    const timePart = utcTime ? utcTime.substring(0, 5) : '00:00';
    const d = new Date(`${utcDate}T${timePart}:00Z`);
    if (isNaN(d.getTime())) return utcDate;

    const istMs = d.getTime() + IST_OFFSET_MINUTES * 60 * 1000;
    const ist = new Date(istMs);

    const y = ist.getUTCFullYear();
    const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
    const day = String(ist.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};
