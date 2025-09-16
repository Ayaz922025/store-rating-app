// frontend/src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { signup } from "../services/auth";
import { validatePassword } from "../utils/validators";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must be at most 60 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  address: Yup.string().max(400, "Max 400 characters"),
  password: Yup.string()
    .test("pwd", "Password must be 8-16 chars, include uppercase and special char", (val) => validatePassword(val || ""))
    .required("Required"),
});

function Signup() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  return (
    <div className="card">
      <h2>Sign up</h2>
      <Formik
        initialValues={{ name: "", email: "", address: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setServerError("");
          try {
            await signup(values); // signup will auto-login
            navigate("/stores");
          } catch (err) {
            const msg = err.response?.data?.message || (err.response?.data?.errors ? err.response.data.errors.map(e => e.msg).join(", ") : "Registration failed");
            setServerError(msg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="form-grid">
            <div>
              <Field name="name" className="input" placeholder="Full Name" />
              {errors.name && touched.name && <div className="error">{errors.name}</div>}
            </div>
            <div>
              <Field name="email" className="input" placeholder="Email" />
              {errors.email && touched.email && <div className="error">{errors.email}</div>}
            </div>
            <div>
              <Field name="address" as="textarea" className="input" placeholder="Address" />
              {errors.address && touched.address && <div className="error">{errors.address}</div>}
            </div>
            <div>
              <Field name="password" type="password" className="input" placeholder="Password" />
              {errors.password && touched.password && <div className="error">{errors.password}</div>}
            </div>

            {serverError && <div className="error">{serverError}</div>}

            <div className="row">
              <button type="submit" className="btn" disabled={isSubmitting}>{isSubmitting ? "Signing up..." : "Sign up"}</button>
              <button type="button" className="btn" style={{ background: "#718096" }} onClick={() => navigate("/login")}>Login</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
