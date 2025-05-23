import UserDataCreate from "./userdatacreate";
import Postuser from "../../components/user-view/layout";
import { motion } from "framer-motion";

function AdminProduct() {
  return (
    <>
      <div className="flex h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        <motion.div
          className="flex items-center justify-center w-1/2 p-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <UserDataCreate />
        </motion.div>
        <motion.div
          className="flex items-center justify-center w-1/2 p-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Postuser />
        </motion.div>
      </div>
    </>
  );
}

export default AdminProduct;
