import { FC } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Profile from "../Profile";

const AdminProfile: FC = () => {
  return (
    <AdminLayout>
      <Profile />
    </AdminLayout>
  );
};

export default AdminProfile;
