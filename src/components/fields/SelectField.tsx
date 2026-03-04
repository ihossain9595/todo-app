import { Control, FieldValues, Path, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  options: SelectOption[];
};

type SelectFieldProps<T extends FieldValues> = SelectFieldConfig<T> & {
  control: Control<T, unknown>;
};

const SelectField = <T extends FieldValues>({ control, name, label, placeholder, disabled = false, options }: SelectFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Field>
          <Label>{label}</Label>
          <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
        </Field>
      )}
    />
  );
};

export default SelectField;
