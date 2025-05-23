import { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyUser } from "../../store/auth-slice";
import { useNavigate } from "react-router-dom";
import Commonform from "../../components/common/form";
import { verifyCodeHere } from "../../config/index";

const VerifyCode = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    emailCode: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(verifyUser(formData));

      if (resultAction?.payload?.message === "Email verified. Password set!") {
        setAlert({
          message: "Congratulations! Your email is verified 🎉",
          type: "success",
        });

        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        setAlert({
          message:
            resultAction?.payload?.message || "Your email is not verified.",
          type: "error",
        });

        // ❌ Reset only the email code field on error
        setFormData((prev) => ({ ...prev, emailCode: "" }));
      }
    } catch (error) {
      setAlert({
        message: "An error occurred. Please try again.",
        type: "error",
      });
      console.error("Verification error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 sm:px-6 lg:px-8">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
          Verify Your Account
        </h2>

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

        {/* ✅ Ensure Commonform properly handles formData */}
        <Commonform
          formControls={verifyCodeHere}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText="Verify"
        />
      </div>
    </div>
  );
};

export default VerifyCode;
