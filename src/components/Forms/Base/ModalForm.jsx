import BorderButton from "../../Button/BorderButton.jsx";
import PrimaryButton from "../../Button/PrimaryButton.jsx";
import {AnimatePresence, motion} from "framer-motion";
import Loader from "../../Loader.jsx";
import {useLockBodyScroll} from "../../../hooks/useLockBodyScroll.js";

export default function ModalForm({
                                      title,
                                      button,
                                      isOpen,
                                      setIsOpen,
                                      onSubmit,
                                      loading,
                                      icon = null,
                                      isFile = false,
                                      children,
                                  }) {
    const backdropVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {duration: .5, ease: 'easeOut'},
        },
        exit: {
            opacity: 0,
            transition: {duration: 1, ease: 'easeIn'},
        },
    };

    const modalVariants = {
        hidden: {y: '100%'},
        visible: {
            y: 0,
            transition: {duration: 1, ease: 'easeOut'}
        },
        exit: {
            y: '100%',
            transition: {duration: 1, ease: 'easeIn'}
        }
    };

    useLockBodyScroll(isOpen);

    const handleClose = () => setIsOpen(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50">
                    <motion.div
                        className="absolute inset-0 bg-black/50"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    />

                    <motion.div
                        className="relative h-dvh flex justify-center items-center"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <form
                            className="bg-main flex flex-col items-center gap-8 w-full h-full sm:w-1/3 sm:h-fit sm:max-h-[90vh] sm:border sm:border-my-border sm:rounded-lg"
                            onSubmit={onSubmit}
                            encType={isFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}
                        >
                            <div className="flex flex-col items-center gap-3 p-5 pb-0">
                                {icon && (
                                    <div className="w-16 h-16 rounded-full bg-secondary p-4">
                                        <img src={icon} alt=""/>
                                    </div>
                                )}

                                <h4 className="text-white font-medium text-2xl">{title}</h4>
                            </div>

                            <div className="flex flex-col gap-4 w-full overflow-y-auto p-5">
                                {children}
                            </div>

                            <div
                                className="p-5 pt-0 flex flex-col gap-4 flex-1 justify-end w-full sm:flex-row-reverse sm:items-end"
                            >
                                <PrimaryButton type="submit" disabled={loading} className="sm:w-full">
                                    {loading ? <Loader/> : button}
                                </PrimaryButton>

                                <BorderButton onClick={handleClose}>Отмена</BorderButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
