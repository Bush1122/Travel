import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { motion } from "framer-motion";
import Commonform from "../../components/common/form";
import { createPost } from "../../store/post-slice";
import { createUserPost } from "../../config/index";

const UserDataCreate = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [alert, setAlert] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPost(formData))
      .unwrap()
      .then(() =>
        setAlert({ type: "success", message: "User created successfully!" })
      )
      .catch((err) =>
        setAlert({ type: "error", message: err || "User creation failed!" })
      );
  };

  return (
    <div className="items-center justify-center mt-5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <motion.div
        className="p-8 bg-white rounded-lg w-96"
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dear {user.name} Book Your Ticket
          </h1>
        </div>

        {alert && (
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
          formControls={createUserPost}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          buttonText="BOOK USER"
        />
      </motion.div>
    </div>
  );
};

export default UserDataCreate;
