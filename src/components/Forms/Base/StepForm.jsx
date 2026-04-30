import PrimaryButton from "../../Button/PrimaryButton.jsx";
import BorderButton from "../../Button/BorderButton.jsx";
import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";
import clsx from "clsx";
import Loader from "../../Loader.jsx";
import {useLockBodyScroll} from "../../../hooks/useLockBodyScroll.js";

export default function StepForm({
                                     stepLabels,
                                     icon,
                                     title,
                                     button,
                                     isOpen,
                                     setIsOpen,
                                     onSubmit,
                                     loading,
                                     validateStep,
                                     children,
                                 }) {
    const [currentStep, setCurrentStep] = useState(1);

    useLockBodyScroll(isOpen);

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
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            return;
        }

        setIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateStep) {
            const isValid = validateStep(currentStep);

            if (!isValid) return;
        }

        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
            return;
        }

        const step = await onSubmit();

        if (step) {
            setCurrentStep(step);
        } else {
            setCurrentStep(1);
        }
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
                            <div className="flex flex-col gap-3 w-full">
                                <div className="flex justify-between">
                                    {stepLabels.map((label, index) => (
                                        <div
                                            key={index}
                                            className={clsx(
                                                'text-sm transition-colors duration-500',
                                                currentStep >= index + 1 ? 'text-white' : 'text-my-border',
                                            )}
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-my-border rounded-full h-1">
                                    <div
                                        className={clsx(
                                            'bg-secondary rounded-full h-1 transition-all duration-1000',
                                            currentStep === 1 && 'w-1/5',
                                            currentStep === 2 && 'w-1/2',
                                            currentStep === 3 && 'w-full',
                                        )}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-secondary p-4">
                                    <img src={icon} alt=""/>
                                </div>

                                <h4 className="text-white font-medium text-2xl">{title}</h4>
                            </div>

                            <div className="w-screen relative h-full overflow-hidden sm:w-[33vw]">
                                <div
                                    className={clsx(
                                        'absolute inset-0 transition-transform duration-700 flex',
                                        currentStep === 2 && '-translate-x-full',
                                        currentStep === 3 && 'translate-x-[-200%]',
                                    )}
                                >
                                    {children}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full mt-auto sm:flex-row-reverse">
                                <PrimaryButton disabled={loading}>
                                    {loading ? <Loader/> : currentStep === 3 ? button : 'Продолжить'}
                                </PrimaryButton>

                                <BorderButton onClick={handleClose}>
                                    {currentStep === 1 ? 'Отмена' : 'Назад'}
                                </BorderButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
