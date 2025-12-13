import { useState } from "react";
import type { useFormik, FormikValues } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type DotNestedKeys<T> = (
  T extends object
    ? { [K in keyof T & string]:
        T[K] extends object
          ? `${K}` | `${K}.${DotNestedKeys<T[K]>}`
          : `${K}`
      }[keyof T & string]
    : never
);

type InputProps<FormValues extends FormikValues> = {
  label: string;
  name: DotNestedKeys<FormValues>;
  disabled?: boolean;
  formik: ReturnType<typeof useFormik<FormValues>>;
  placeholder?: string;
  password?: boolean;
  emailExist?: boolean;
  lecture?: boolean;
  quiz?: boolean;
  type?: string;
  number?: boolean;
};

export default function Input<FormValues extends FormikValues>({
  label,
  name,
  disabled,
  formik,
  placeholder,
  password,
  emailExist,
  lecture,
  quiz,
  number,
  type,
}: InputProps<FormValues>) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = password || false;

  return (
    <div className="flex-1 mb-1">
      <label className="text-sm text-gray-700 font-[501]">{label}</label>
      <div className="relative">
        <input
          autoComplete="true"
          disabled={disabled}
          type={number ? "number" : (!isPassword ? "text" : showPass ? "text" : "password")}
          className={`w-full border ${lecture ? `focus:border-blue-500` : quiz ? `focus:border-green-500` : `focus:border-(--main-color)`} text-gray-700 duration-300 text-sm py-2 border-[#e2e6f1] ${type && "text-[#9AA0A8]! font-semibold"} rounded-sm outline-none disabled:cursor-not-allowed p-2 my-2 ${(formik.getFieldMeta(name).touched && formik.getFieldMeta(name).error) || emailExist ? "border-red-500!" : "special_shadow"}`}
          placeholder={placeholder}
          name={name}
          value={type ? type : formik.getFieldProps(name).value as string}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {isPassword && (
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute p-1 rounded-md text-[#939393] top-1/2 end-2.5 transform translate-y-half cursor-pointer"
          >
            {showPass ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
          </span>
        )}
      </div>
      {formik.getFieldMeta(name).touched && formik.getFieldMeta(name).error && (
        <p className="text-xs text-red-500">{formik.getFieldMeta(name).error as string}</p>
      )}
    </div>
  );
}
