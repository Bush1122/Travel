import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import UserCreate from "./pages/user-view/userCreate";
import UserPost from "./pages/user-view/userPost";
import Home from "./pages/admin-view/Home";
import UnauthPage from "./pages/unauth-page";
import VerifyCode from "./pages/auth/VerifyCode";
import NotFound from "./pages/not-found";
import UpdatePostForm from "./components/user-view/updateuser";
import About from "./pages/admin-view/about";
import { setInitialized } from "./store/auth-slice/index";
import CheckAuth from "./components/common/check-auth";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInitialized()); // Mark auth as initialized
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth">
          <Route path="register" element={<AuthRegister />} />
          <Route path="verify" element={<VerifyCode />} />
          <Route path="login" element={<AuthLogin />} />
        </Route>

        <Route element={<CheckAuth />} path="/user">
          <Route path="UserCreate" element={<UserCreate />} />
          <Route path="UserPost" element={<UserPost />} />
        </Route>
        <Route path="/edit/:postId" element={<UpdatePostForm />} />
        <Route path="/about" element={<About />} />

        <Route path="*" element={<NotFound />} />
        <Route path="/unauth-page" element={<UnauthPage />} />
      </Routes>
    </>
  );
}

export default App;
