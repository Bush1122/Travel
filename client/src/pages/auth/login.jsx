import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Commonform from "../../components/common/form";
import { loginFormControl } from "../../config/index";
import { loginUser } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

function AuthLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Fake API login
    const response = { user: { name: "Bushra" }, token: "your-jwt-token" };

    dispatch(loginSuccess(response));
    navigate("/admin/createuser");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));
    console.log(resultAction);

    if (resultAction?.payload?.success) {
      setAlert({
        message: "Login successful! Redirecting to your account...",
        type: "success",
      });

      setTimeout(() => {
        setAlert({ message: "", type: "" });
        navigate("/");
      }, 5000);
    } else {
      setAlert({
        message:
          resultAction?.payload?.message || "Login failed. Please try again.",
        type: "error",
      });
      console.log("Login failed:", resultAction.payload);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 sm:px-6 lg:px-8">
      <motion.div
        className="p-8 bg-white rounded-lg w-96"
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="mt-2 text-gray-950">
            Don't have an account?
            <Link
              className="ml-2 font-medium text-cyan-900 hover:underline"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Tailwind Alert Box */}
        {alert.message && (
          <div
            className={`${
              alert.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } p-3 rounded-md mt-2 text-center`}
            role="alert"
          >
            {alert.message}
          </div>
        )}

        <Commonform
          formControls={loginFormControl}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText="Sign in"
          onClick={handleLogin}
        />
      </motion.div>
    </div>
  );
}

export default AuthLogin;
