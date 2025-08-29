export default function swipeClose(handleCancel) {
    let startTouchY = 0;
    let endTouchY = 0;

    const handleTouchStart = (event) => {
        startTouchY = event.changedTouches[0].pageY;
    };

    const handleTouchEnd = (event) => {
        endTouchY = event.changedTouches[0].pageY;

        if (startTouchY < endTouchY && Math.abs(endTouchY - startTouchY) > 100) {
            handleCancel();
        }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
    };
}