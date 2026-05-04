export const handleImgChange = (e, setState, onChange) => {
    const file = e.target.files?.[0];

    if (file) {
        const objectUrl = URL.createObjectURL(file);
        setState(objectUrl);
    } else {
        setState(null);
    }

    onChange(e);
};
