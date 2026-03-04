import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Control, FieldValues } from "react-hook-form";
import InputField, { InputFieldConfig } from "@/components/fields/InputField";
import SelectField, { SelectFieldConfig } from "@/components/fields/SelectField";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export type FormFieldConfig<T extends FieldValues> =
  | ({ fieldType: "input" } & InputFieldConfig<T>)
  | ({ fieldType: "select" } & SelectFieldConfig<T>);

type FormDialogProps<T extends FieldValues> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FormFieldConfig<T>[];
  control: Control<T, unknown>;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
};

const FormDialog = <T extends FieldValues>({
  open,
  onOpenChange,
  title,
  description = "Fill in the details below.",
  fields,
  control,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting = false,
}: FormDialogProps<T>) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {fields.map((fieldConfig) =>
              fieldConfig.fieldType === "select" ? (
                <SelectField key={fieldConfig.name} control={control} {...fieldConfig} />
              ) : (
                <InputField key={fieldConfig.name} control={control} {...fieldConfig} />
              ),
            )}
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="ghost" className="cursor-pointer" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
