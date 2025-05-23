import { Outlet } from "react-router-dom";
import shopping from "../../asset/images/firstshop.png";
function AuthLayout() {
  return (
    <>
      <div className="flex w-full min-h-screen">
        <div className="justify-center hidden w-1/2 px-12 bg-black lg:flex item-center ">
          <div className="max-w-md space-y-6 text-center text-primary-forground">
            <h1 className="mt-40 text-4xl font-extrabold tracking-tight text-center text-white ">
              Welcome to e-store shopping
            </h1>
            <div className="flex p-5 space-x-3 text-center">
              <img className="img-fluid" src={shopping} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 px-12 mt-7">
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default AuthLayout;
