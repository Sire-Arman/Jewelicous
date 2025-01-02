import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { BASE_URL } from "../../../constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const validationConfig = {
    email: [
      { required: true, message: "Please enter an email" },
      {
        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: "Please enter a valid email",
      },
    ],
    password: [
      { required: true, message: "Please enter password" },
      {
        minLength: 5,
        message: "Password should be at least 5 characters long",
      },
    ],
  };

  const validate = (formData) => {
    const errorsData = {};

    Object.entries(formData).forEach(([key, value]) => {
      // Remove spaces for validation if the field is fullname or password
      const sanitizedValue = value;

      validationConfig[key].some((rule) => {
        if (rule.required && !sanitizedValue) {
          errorsData[key] = rule.message;
          return true;
        }

        if (rule.minLength && sanitizedValue.length < rule.minLength) {
          errorsData[key] = rule.message;
          return true;
        }

        if (rule.length && sanitizedValue.length != 10) {
          errorsData[key] = rule.message;
          return true;
        }

        if (rule.pattern && !rule.pattern.test(sanitizedValue)) {
          errorsData[key] = rule.message;
          return true;
        }
      });
    });

    setErrors(errorsData);
    return errorsData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateResult = validate(loginData);
    if (Object.keys(validateResult).length) return;

    if (!isChecked) {
      toast.error("Please agree to our Terms and conditions");
      return;
    }

    try {
      const userType = "USER";
      // Adding user with email
      const response = await axios.post(
        `${BASE_URL}/users/loginUser?emailId=${loginData.email}&password=${loginData.password}&userType=${userType}`
      );
      // console.log(response);

      const { userId } = response.data;

      if (!userId) {
        toast.error(
          "User not found. Please check your credentials or sign up."
        );
        return;
      }
      localStorage.setItem("userId", userId);
      toast.success("Login successful!");
      navigate("/");
      navigate("/");
    } catch (error) {
      console.error(error.response);
      toast.error("Login failed. Please check your credentials.");
      return;
    }

    setloginData({
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setloginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gray-400 py-1 px-3">
      <div className={styles.loginpage_container}>
        <div className={styles.imgcontainer}>
          <h1 className="mb-4">
            Sparkle Starts Here –<br /> Sign In for Exclusive Jewellery
            Collections!
          </h1>
          <img
            src={
              "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/login.jpg"
            }
            className={styles.img}
            style={{ borderRadius: "15px", borderTopRightRadius: "15px" }}
          />
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className="mt-3">Sign in</h1>
          <div>
            <input
              type="text"
              value={loginData.email}
              onChange={handleChange}
              id="email"
              name="email"
              required
            />
            <label htmlFor="email">Email Address</label>
            <p className="absolute top-[100%] text-[12px] text-[red]">
              {errors.email}
            </p>
          </div>
          <div>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={loginData.password}
              onChange={handleChange}
              id="password"
              name="password"
              required
            />
            <label htmlFor="password">Password</label>
            <strong
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-2 top-[15%] cursor-pointer"
            >
              {isPasswordVisible ? (
                <IoMdEye size={20} />
              ) : (
                <IoMdEyeOff size={20} />
              )}
            </strong>
            {errors.password && (
              <p className="absolute top-[100%] text-[12px] text-[red]">
                {errors.password}
              </p>
            )}
          </div>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            className="relative top-[2px] mr-1"
          />
          <span>
            I agree to the{" "}
            <strong className="text-blue-600 cursor-pointer underline">
              <Link to="/terms&conditions">terms of service</Link>{" "}
            </strong>{" "}
            and{" "}
            <strong className="text-blue-600 cursor-pointer underline">
              <Link to="/privacy-policy">privacy policy</Link>
            </strong>
          </span>
          <button>Sign in</button>

          <p className="text-[15px] text-center">
            <Link
              to="/forgot-password"
              className="text-blue-600 cursor-pointer underline"
            >
              Forgot Password?
            </Link>
          </p>
          <p className="text-[15px] text-center">
            Don't have an account?
            <Link
              to="/signup"
              className="text-blue-600 cursor-pointer underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
