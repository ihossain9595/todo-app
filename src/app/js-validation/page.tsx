"use client";

import { useState } from "react";

type FormValues = {
  fullName: string;
  emailAddress: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!values.emailAddress.trim()) {
    errors.emailAddress = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailAddress)) {
    errors.emailAddress = "Invalid email address";
  }

  return errors;
};

const JsValidationPage = () => {
  const [values, setValues] = useState<FormValues>({ fullName: "", emailAddress: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValues = { ...values, [e.target.name]: e.target.value };
    setValues(updatedValues);

    if (Object.keys(errors).length > 0) {
      setErrors(validate(updatedValues));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert(`Submitted! Name: ${values.fullName}, Email: ${values.emailAddress}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4 border rounded-xl bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Validation Check</h2>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Full Name</label>
        <input
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
        />
        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Email Address</label>
        <input
          name="emailAddress"
          value={values.emailAddress}
          onChange={handleChange}
          placeholder="john@example.com"
          className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-slate-300"
        />
        {errors.emailAddress && <p className="text-xs text-red-500">{errors.emailAddress}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 cursor-pointer transition-colors"
      >
        Submit
      </button>
    </form>
  );
};

export default JsValidationPage;
