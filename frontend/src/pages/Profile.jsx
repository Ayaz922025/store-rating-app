import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { validatePassword } from "../utils/validators";

const Schema = Yup.object().shape({
  password: Yup.string()
    .test(
      "pwd",
      "Password must be 8-16 chars, include uppercase and special char",
      (val) => validatePassword(val || "")
    )
    .required("Required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

function Profile() {
  return (
    <div>
      <h2>Change Password</h2>
      <div className="card">
        <Formik
          initialValues={{ password: "", confirm: "" }}
          validationSchema={Schema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await api.put("/me/password", { password: values.password });
              alert("Password updated!");
              resetForm();
            } catch {
              alert("Error updating password");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="form-grid">
              <div>
                <Field
                  name="password"
                  type="password"
                  className="input"
                  placeholder="New password"
                />
                {errors.password && touched.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>
              <div>
                <Field
                  name="confirm"
                  type="password"
                  className="input"
                  placeholder="Confirm password"
                />
                {errors.confirm && touched.confirm && (
                  <div className="error">{errors.confirm}</div>
                )}
              </div>
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Profile;
