import {Button, Form, Modal, Spinner} from "@heroui/react";

export default function ModalForm({
                                      id,
                                      isOpen,
                                      setIsOpen,
                                      sendButton,
                                      handleSubmit,
                                      isSubmitting,
                                      title,
                                      trigger,
                                      icon = null,
                                      enctype = 'application/x-www-form-urlencoded',
                                      children,
                                  }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <Modal.Trigger>{trigger}</Modal.Trigger>

            <Modal.Backdrop>
                <Modal.Container placement="center">
                    <Modal.Dialog className="w-full max-w-xl">
                        <Modal.CloseTrigger/>

                        <Modal.Header>
                            {icon && <Modal.Icon className="bg-default">{icon}</Modal.Icon>}

                            <Modal.Heading>{title}</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="p-3">
                            <Form
                                id={id}
                                className="flex flex-col gap-4"
                                onSubmit={handleSubmit}
                                encType={enctype}
                                noValidate
                            >
                                {children}
                            </Form>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="outline" slot="close">
                                Отмена
                            </Button>

                            <Button
                                form={id}
                                type="submit"
                                isDisabled={isSubmitting}
                            >
                                {isSubmitting ? <Spinner color="current"/> : sendButton}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
