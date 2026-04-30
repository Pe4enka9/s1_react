import BorderButton from "../../Button/BorderButton.jsx";
import PrimaryButton from "../../Button/PrimaryButton.jsx";
import {AnimatePresence, motion} from "framer-motion";
import Loader from "../../Loader.jsx";

export default function ModalForm({
                                      title,
                                      button,
                                      icon = null,
                                      isOpen,
                                      setIsOpen,
                                      onSubmit,
                                      loading,
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

    const handleClose = () => {
        setIsOpen(false);
        document.body.style.overflow = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

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
                        className="relative h-screen flex justify-center items-center"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <form
                            className="bg-main flex flex-col items-center gap-8 p-5 w-full h-full sm:w-1/3 sm:h-2/3 sm:border sm:border-my-border sm:rounded-lg"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex flex-col items-center gap-3">
                                {icon && (
                                    <div className="w-16 h-16 rounded-full bg-secondary p-4">
                                        <img src={icon} alt=""/>
                                    </div>
                                )}

                                <h4 className="text-white font-medium text-2xl">{title}</h4>
                            </div>

                            <div className="w-screen relative h-full overflow-hidden sm:w-[33vw]">
                                <div className="absolute inset-0 flex">
                                    <div className="flex flex-col gap-4 w-full shrink-0 px-5">
                                        {children}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full mt-auto sm:flex-row-reverse">
                                <PrimaryButton disabled={loading}>
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
