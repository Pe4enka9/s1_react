export default function preparePhoneValue(appended, masked) {
    if ((appended === '8' || appended.startsWith('8')) && masked.value === '') {
        return '' + appended.substring(1);
    }

    return appended;
}