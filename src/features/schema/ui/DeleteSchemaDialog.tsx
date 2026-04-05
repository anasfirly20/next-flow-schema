import { Button } from "@/shared/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/Dialog";

type DeleteSchemaDialogProps = {
  schemaName: string;
  confirmDeleteSchema: () => void;
  onCloseDeleteDialog: () => void;
};

export const DeleteSchemaDialog = ({
  schemaName,
  confirmDeleteSchema,
  onCloseDeleteDialog,
}: DeleteSchemaDialogProps) => {
  return (
    <Dialog
      open={Boolean(schemaName)}
      onOpenChange={(open) => {
        if (!open) {
          onCloseDeleteDialog();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete schema?</DialogTitle>
          <DialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-text-primary">{schemaName}</span>.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onCloseDeleteDialog}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={confirmDeleteSchema}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
