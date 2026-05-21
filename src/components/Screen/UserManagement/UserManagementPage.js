import React, { useMemo, useState } from "react";
import Modal from "../../Modal/Modal";
import StatusBadge from "../../Modal/StatusBadge";
import { mockUsers } from "../../data/mockData";
import "./UserManagementPage.scss";
import { useLanguage } from "../../Lang/LanguageProvider";
import { useIntl } from "react-intl";
const emptyUser = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "Viewer",
  status: "Active",
};

export default function UserManagementPage() {
  const lang = useIntl();

  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [form, setForm] = useState(emptyUser);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        if (role !== "All" && user.role !== role) return false;
        if (status !== "All" && user.status !== status) return false;
        if (search) {
          const keyword = search.toLowerCase();
          return (
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword)
          );
        }
        return true;
      }),
    [role, status, search, users],
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyUser);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({ ...emptyUser, ...user, password: "", confirmPassword: "" });
    setShowModal(true);
  };

  const saveUser = () => {
    if (!form.name || !form.email) return;

    if (editing) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editing.id
            ? {
              ...user,
              name: form.name,
              email: form.email,
              role: form.role,
              status: form.status,
            }
            : user,
        ),
      );
    } else {
      setUsers((prev) => [
        {
          id: prev.length + 1,
          name: form.name,
          email: form.email,
          password: form.password || "changeme123",
          role: form.role,
          status: form.status,
          lastLogin: null,
          created: "2026-05-19",
          ip: "192.168.1.40",
        },
        ...prev,
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="page animate-fadeIn">
      <div className="card">
        <div className="page-toolbar">
          <div>
            <div className="card-title">{lang.formatMessage({ id: "use_management" })}</div>
            <div className="card-subtitle">
              {lang.formatMessage({ id: "description_settings" })}
            </div>
          </div>
          <div className="page-toolbar-actions">
            <input
              className="form-input"
              style={{ width: 220 }}
              placeholder={lang.formatMessage({ id: "search_user" })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-select"
              style={{ width: 140 }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="All">{lang.formatMessage({ id: "all_roles" })}</option>
              <option value="Viewer">{lang.formatMessage({ id: "viewer" })}</option>
              <option value="Operator">{lang.formatMessage({ id: "operator" })}</option>
              <option value="Admin">{lang.formatMessage({ id: "admin" })}</option>
              <option value="Engineer">{lang.formatMessage({ id: "engineer" })}</option>
            </select>
            <select
              className="form-select"
              style={{ width: 140 }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">{lang.formatMessage({ id: "all_status" })}</option>
              <option value="Active">{lang.formatMessage({ id: "active" })}</option>
              <option value="Inactive">{lang.formatMessage({ id: "inactive" })}</option>
              <option value="Locked">{lang.formatMessage({ id: "locked" })}</option>
            </select>
            <button className="btn btn-primary" onClick={openNew}>
              {lang.formatMessage({ id: "add_user" })}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{lang.formatMessage({ id: "user_id" })}</th>
                <th>{lang.formatMessage({ id: "fullname" })}</th>
                <th>Email</th>
                <th>{lang.formatMessage({ id: "role" })}</th>
                <th>{lang.formatMessage({ id: "status" })}</th>
                <th>{lang.formatMessage({ id: "last_login" })}</th>
                <th>{lang.formatMessage({ id: "date_user" })}</th>
                <th>{lang.formatMessage({ id: "action" })}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>USR-{String(user.id).padStart(3, "0")}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td>{user.lastLogin || "-"}</td>
                  <td>{user.created}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(user)}
                      >
                        {lang.formatMessage({ id: "edit" })}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          setUsers((prev) =>
                            prev.map((item) =>
                              item.id === user.id
                                ? {
                                  ...item,
                                  status:
                                    item.status === "Locked"
                                      ? "Active"
                                      : "Locked",
                                }
                                : item,
                            ),
                          )
                        }
                      >
                        {user.status === "Locked" ? lang.formatMessage({ id: "unlock" }) : lang.formatMessage({ id: "lock" })}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit User" : "Add User"}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveUser}>
              Save User
            </button>
          </>
        }
      >
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Viewer</option>
              <option>Operator</option>
              <option>Admin</option>
              <option>Engineer</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Locked</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
