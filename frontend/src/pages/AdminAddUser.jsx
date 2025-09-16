import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../services/api";

const UserSchema = Yup.object().shape({
  name: Yup.string().min(20).max(60).required("Name required"),
  email: Yup.string().email().required("Email required"),
  password: Yup.string()
    .min(8)
    .max(16)
    .matches(/[A-Z]/, "Must include uppercase")
    .matches(/[!@#$%^&*]/, "Must include special character")
    .required(),
  address: Yup.string().max(400).required("Address required"),
  role: Yup.string().oneOf(["user", "admin", "store_owner"]).required(),
});

function AdminAddUser() {
  return (
    <div className="card">
      <h2>Add User</h2>
      <Formik
        initialValues={{ name: "", email: "", password: "", address: "", role: "user" }}
        validationSchema={UserSchema}
        onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
          try {
            await api.post("/admin/users", values);
            setStatus({ success: "User created!" });
            resetForm();
          } catch (err) {
            setStatus({ error: err.response?.data?.message || "Failed" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, status }) => (
          <Form className="form-grid">
            <Field name="name" placeholder="Name" className="input" />
            {errors.name && touched.name && <div className="error">{errors.name}</div>}

            <Field name="email" placeholder="Email" className="input" />
            {errors.email && touched.email && <div className="error">{errors.email}</div>}

            <Field type="password" name="password" placeholder="Password" className="input" />
            {errors.password && touched.password && <div className="error">{errors.password}</div>}

            <Field as="textarea" name="address" placeholder="Address" className="input" />
            {errors.address && touched.address && <div className="error">{errors.address}</div>}

            <Field as="select" name="role" className="input">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </Field>

            {status?.success && <div style={{ color: "green" }}>{status.success}</div>}
            {status?.error && <div className="error">{status.error}</div>}

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add User"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AdminAddUser;
