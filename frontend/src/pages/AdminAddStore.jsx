import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import api from "../services/api";

function AdminAddStore() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    api.get("/admin/users").then((res) => {
      setOwners(res.data.filter((u) => u.role === "store_owner"));
    });
  }, []);

  return (
    <div className="card">
      <h2>Add Store</h2>
      <Formik
        initialValues={{ name: "", address: "", ownerId: "" }}
        onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
          try {
            await api.post("/admin/stores", values);
            setStatus({ success: "Store created!" });
            resetForm();
          } catch (err) {
            setStatus({ error: err.response?.data?.message || "Failed" });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="form-grid">
            <Field name="name" placeholder="Store Name" className="input" />
            <Field name="address" placeholder="Store Address" className="input" />

            <Field as="select" name="ownerId" className="input">
              <option value="">-- Select Owner --</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </Field>

            {status?.success && <div style={{ color: "green" }}>{status.success}</div>}
            {status?.error && <div className="error">{status.error}</div>}

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Store"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AdminAddStore;
