import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  headerText: string;
  cancelText: string;
  submitText: string;
  onSubmit: () => void;
  children: ReactNode;
}

export const CustomDialog = ({
  open,
  onOpenChange,
  isLoading,
  headerText,
  cancelText,
  submitText,
  onSubmit,
  children,
}: CustomDialogProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      modal
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{headerText}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>{children}</Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{cancelText}</Button>
              </Dialog.ActionTrigger>
              <Button colorScheme="blue" loading={isLoading} onClick={onSubmit}>
                {submitText}
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton position="absolute" right="3" top="3" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
