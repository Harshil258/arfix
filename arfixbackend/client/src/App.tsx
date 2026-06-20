import { Route, Routes } from "react-router-dom";
import "@/App.css";

import Login from "@/Pages/Auth/Login";
import AdminLogin from "@/Pages/Auth/AdminLogin";
import AuthRoutes from "@/routes/AuthRoutes";
import UserRoute from "@/routes/UserRoute";
import AdminOnlyRoute from "@/routes/AdminOnlyRoute";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProductPage from "./Pages/Product/Product";
import AddProduct from "./Pages/Product/AddProduct";
import EditProduct from "./Pages/Product/EditProduct";
import Users from "./Pages/User/Users";
import AddUser from "./Pages/User/AddUser";
import EditUser from "./Pages/User/EditUser";
import CouponSessions from "./Pages/Coupon/CouponSessions";
import CreateCouponSession from "./Pages/Coupon/CreateCouponSession";
import SupportInbox from "./Pages/Support/SupportInbox";
import SupportMessageDetail from "./Pages/Support/SupportMessageDetail";
import Profile from "./Pages/Profile/Profile";
import RazorpayWallet from "./Pages/Razorpay/RazorpayWallet";
import Withdrawals from "./Pages/Withdrawal/Withdrawals";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>
        <Route element={<UserRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="products">
            <Route index element={<ProductPage />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="edit/:productId" element={<EditProduct />} />
          </Route>
          <Route path="users" element={<AdminOnlyRoute />}>
            <Route index element={<Users />} />
            <Route path="add" element={<AddUser />} />
            <Route path="edit/:userId" element={<EditUser />} />
          </Route>
          <Route path="razorpay" element={<AdminOnlyRoute />}>
            <Route index element={<RazorpayWallet />} />
          </Route>
          <Route path="withdrawals" element={<AdminOnlyRoute />}>
            <Route index element={<Withdrawals />} />
          </Route>
          <Route path="coupons">
            <Route index element={<CouponSessions />} />
            <Route path="create" element={<CreateCouponSession />} />
          </Route>
          <Route path="support">
            <Route index element={<SupportInbox />} />
            <Route path=":messageId" element={<SupportMessageDetail />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
