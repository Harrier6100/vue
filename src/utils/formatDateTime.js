import moment from 'moment';

const format = (timestamp, formatStyle) => {
    if (!timestamp) return '';
    return moment.utc(timestamp).format(formatStyle);
    // return moment(timestamp).format(formatStyle);
};

export const formatDate = (timestamp) => {
    return format(timestamp, 'YYYY-MM-DD');
};

export const formatTime = (timestamp) => {
    return format(timestamp, 'HH:mm:ss');
};

export const formatAt = (timestamp) => {
    return format(timestamp, 'YYYY-MM-DD HH:mm:ss');
};