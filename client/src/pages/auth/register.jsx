import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Commonform from "../../components/common/form";
import { registerUser } from "../../store/auth-slice";
import { registerFormControl } from "../../config/index";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

function AuthRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [alert, setAlert] = useState({ message: "", type: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setAlert({ message: "All fields are required", type: "error" });
      return;
    }

    try {
      const resultAction = await dispatch(registerUser(formData));

      if (
        resultAction?.payload?.message === "Verification code sent to email"
      ) {
        setAlert({
          message: "Check your email for verification code!",
          type: "success",
        });

        setTimeout(() => {
          navigate("/auth/verify"); // Redirect to verification page
        }, 2000);
      } else {
        setAlert({
          message: resultAction?.payload?.message || "Registration failed.",
          type: "error",
        });
      }
    } catch (error) {
      setAlert({
        message: "An error occurred. Please try again.",
        type: "error",
      });
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 sm:px-6 lg:px-8">
      <motion.div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create New Account
          </h1>
          <p className="mt-2 text-gray-700">
            Already have an account?{" "}
            <Link
              className="ml-2 font-medium text-cyan-900 hover:underline"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
        </div>

        {alert.message && (
          <div
            className={`mt-2 p-3 rounded-md text-center ${
              alert.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
            role="alert"
          >
            {alert.message}
          </div>
        )}

        <Commonform
          formControls={registerFormControl}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText="Register"
        />
      </motion.div>
    </div>
  );
}

export default AuthRegister;
