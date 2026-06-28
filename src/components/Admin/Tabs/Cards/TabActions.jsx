import {AlertDialog, Button, Spinner} from "@heroui/react";
import {TrashBin} from "@gravity-ui/icons";

export default function TabActions({
                                       item,
                                       onEdit,
                                       onView,
                                       onDelete,
                                       deleteLoading,
                                   }) {
    const isDeleting = deleteLoading === item.id;

    return (
        <div
            className="flex flex-1 justify-end gap-2"
            role="toolbar"
            aria-label="Действия элемента"
        >
            {onView}

            {onEdit}

            {onDelete && (
                isDeleting ? (
                    <div
                        className="w-9 h-9 border border-my-border rounded-lg flex justify-center items-center"
                        role="status"
                        aria-live="polite"
                        aria-label="Удаление..."
                    >
                        <Spinner size="sm" color="current"/>
                    </div>
                ) : (
                    <AlertDialog>
                        <AlertDialog.Trigger>
                            <button
                                type="button"
                                className="w-9 h-9 text-white cursor-pointer border border-my-border rounded-lg p-2 hover:bg-primary/20 hover:text-secondary/70 hover:border-secondary/70 transition-colors duration-200 flex justify-center items-center"
                                aria-label="Удалить элемент"
                            >
                                <TrashBin
                                    className="w-full h-full object-contain"
                                    aria-hidden="true"
                                />
                            </button>
                        </AlertDialog.Trigger>

                        <AlertDialog.Backdrop>
                            <AlertDialog.Container>
                                <AlertDialog.Dialog>
                                    <AlertDialog.CloseTrigger/>

                                    <AlertDialog.Header>
                                        <AlertDialog.Icon status="danger"/>
                                        <AlertDialog.Heading>
                                            Вы уверены, что хотите удалить?
                                        </AlertDialog.Heading>
                                    </AlertDialog.Header>

                                    <AlertDialog.Body>
                                        <p>Это действие невозможно отменить.</p>
                                    </AlertDialog.Body>

                                    <AlertDialog.Footer>
                                        <Button slot="close" variant="tertiary">
                                            Отмена
                                        </Button>

                                        <Button
                                            slot="close"
                                            variant="danger"
                                            onPress={() => onDelete(item.id)}
                                        >
                                            Удалить
                                        </Button>
                                    </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                            </AlertDialog.Container>
                        </AlertDialog.Backdrop>
                    </AlertDialog>
                )
            )}
        </div>
    );
}