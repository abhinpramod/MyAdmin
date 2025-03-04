import { useState, useEffect } from "react";
import axiosInstance from "../lib/aixos";
import { toast } from "react-hot-toast";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { PlusIcon, Edit, Block, CheckCircle } from "lucide-react";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-all-admins");
        setAdmins(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (!formData.fullname.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    const uniqueId = uuid().slice(2, 8);
    const finalData = { ...formData, uniqueId };

    try {
      const res = await axiosInstance.post("/admin/addadmin", finalData);
      if (res.status === 201) {
        toast.success("Admin added successfully!");
        setAdmins([...admins, res.data]);
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error(error.response?.data?.msg || "Failed to add admin");
    }
  };

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;
    try {
      const res = await axiosInstance.patch(`/admin/edit-admin/${selectedAdmin._id}`, formData);
      if (res.status === 200) {
        toast.success("Admin details updated successfully!");
        setAdmins(
          admins.map((admin) =>
            admin._id === selectedAdmin._id ? { ...admin, ...formData } : admin
          )
        );
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Failed to update admin.");
    }
  };

  const handleBlockUnblockAdmin = async () => {
    if (!selectedAdmin) return;
    setLoading(true);
    try {
      const updatedStatus = !selectedAdmin.isBlocked;
      const endpoint = updatedStatus
        ? `/admin/block-admin/${selectedAdmin._id}`
        : `/admin/unblock-admin/${selectedAdmin._id}`;
      await axiosInstance.patch(endpoint, { adminId: selectedAdmin._id });
      toast.success(`Admin ${updatedStatus ? "blocked" : "unblocked"} successfully`);
      setAdmins(
        admins.map((admin) =>
          admin._id === selectedAdmin._id ? { ...admin, isBlocked: updatedStatus } : admin
        )
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update admin status.");
    } finally {
      setLoading(false);
      setSelectedAdmin(null);
      setConfirmAction(null);
    }
  };

  const resetForm = () => {
    setFormData({ fullname: "", email: "", password: "", confirmPassword: "", role: "" });
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.uniqueId.includes(searchTerm)
  );

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Admins</h2>
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by name..."
          value={searchTerm}
          onClear={() => setSearchTerm("")}
          onValueChange={(value) => setSearchTerm(value)}
        />
        <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
          Add Admin
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <Table
          isHeaderSticky
          aria-label="Example table with custom cells, pagination and sorting"
          classNames={{
            wrapper: "max-h-[382px]",
          }}
          selectionMode="none"
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin._id}>
                <TableCell>{admin.uniqueId}</TableCell>
                <TableCell>{admin.fullname}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <Edit className="text-default-300" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem key="edit" onClick={() => {
                          setSelectedAdmin(admin);
                          setFormData(admin);
                          onOpen();
                        }}>Edit</DropdownItem>
                        <DropdownItem key="toggle" onClick={() => {
                          setSelectedAdmin(admin);
                          setConfirmAction(admin.isBlocked ? "unblock" : "block");
                        }}>
                          {admin.isBlocked ? "Unblock" : "Block"}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedAdmin ? "Edit Admin" : "Add New Admin"}
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={selectedAdmin ? handleEditAdmin : handleAddAdmin}>
                  {selectedAdmin ? "Update Admin" : "Add Admin"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={Boolean(confirmAction)} onOpenChange={() => setConfirmAction(null)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Are you sure you want to {confirmAction === "block" ? "block" : "unblock"} {selectedAdmin?.fullname}?
          </ModalHeader>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleBlockUnblockAdmin}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManageAdmins;