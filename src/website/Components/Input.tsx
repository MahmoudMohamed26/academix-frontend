import type { useFormik } from "formik";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type Input = {
  label: string;
  name: keyof ReturnType<(typeof useFormik)>["initialValues"];
  disabled?: boolean;
  formik: ReturnType<(typeof useFormik)>;
  placeholder?: string;
  password?: boolean;
  emailExist?: boolean;
}

export default function Input({ label, name, disabled, formik, placeholder, password, emailExist }: Input) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = password || false;

  return (
    <div className="flex-1 mb-1">
      <label className="text-sm text-gray-700 font-[501]">{label}</label>
      <div className="relative">
        <input
          autoComplete="true"
          disabled={disabled}
          type={!isPassword ? "text" : showPass ? "text" : "password"}
          className={`w-full border focus:border-[var(--main-color)] text-gray-700 duration-300 text-sm py-2 border-[#e2e6f1] rounded-sm outline-none p-2 my-2 ${(formik.errors[name] && formik.touched[name]) || emailExist ? "!border-red-500" : "special_shadow"}`}
          placeholder={placeholder}
          name={name as string}
          value={formik.values[name] as string}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}/>
        {isPassword && (
        <span
          onClick={() => setShowPass(!showPass)}
          className="absolute p-1 rounded-md text-[#939393] top-1/2 end-2.5 transform translate-y-half cursor-pointer">
          {showPass ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
        </span>
        )}
      </div>
      {formik.errors[name] && formik.touched[name] && (
        <p className="text-xs text-red-500">{formik.errors[name] as string}</p>
      )}
    </div>
  );
}