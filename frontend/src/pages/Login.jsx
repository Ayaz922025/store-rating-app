// frontend/src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { login } from "../services/auth";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

function Login() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2>Login</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            const user = await login(values);
            if (user.role === "admin") navigate("/admin");
            else if (user.role === "store_owner") navigate("/owner");
            else navigate("/stores");
          } catch (err) {
            const msg = err.response?.data?.message || "Invalid email or password";
            setFieldError("email", msg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="form-grid">
            <div>
              <Field name="email" className="input" placeholder="Email" />
              {errors.email && touched.email && <div className="error">{errors.email}</div>}
            </div>
            <div>
              <Field name="password" type="password" className="input" placeholder="Password" />
              {errors.password && touched.password && <div className="error">{errors.password}</div>}
            </div>
            <div className="row">
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <button type="button" className="btn" style={{ background: "#718096" }} onClick={() => navigate("/signup")}>
                Sign up
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
