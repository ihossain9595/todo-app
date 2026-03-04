import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

export type InputFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: RegisterOptions<T>;
  type?: React.HTMLInputTypeAttribute;
};

type InputFieldProps<T extends FieldValues> = InputFieldConfig<T> & {
  control: Control<T>;
};

const InputField = <T extends FieldValues>({ control, name, label, placeholder, disabled = false, rules, type = "text" }: InputFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Field>
          <Label>{label}</Label>
          <Input {...field} type={type} placeholder={placeholder} disabled={disabled} />
          {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
        </Field>
      )}
    />
  );
};

export default InputField;
