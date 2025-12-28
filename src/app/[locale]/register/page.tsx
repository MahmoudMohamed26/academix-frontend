import bgImg from "@/assets/loginImg.jpeg"
import RegisterForm from "./registerForm"

export default function LoginPage() {
  return (
    <div className="bg-(--main-bg)">
      <div className="min-h-screen flex justify-center gap-10 lg:justify-between">
        <div className="flex flex-col justify-center items-center grow md:ms-10">
          <RegisterForm />
        </div>

        <div
          className="h-screen w-full max-w-4xl hidden lg:block bg-gray-100 sticky top-0 
          before:absolute before:top-0 before:left-0 before:w-full before:h-full 
          before:bg-(--main-color) before:opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImg.src})` }}
        ></div>
      </div>
    </div>
  )
}
