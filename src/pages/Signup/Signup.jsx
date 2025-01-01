import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { BASE_URL } from "../../../constant";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();
  const [signUpData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const validationConfig = {
    fullname: [
      { required: true, message: "Please enter Full name" },
      {
        minLength: 2,
        pattern: /^[A-Za-z\s]+$/,
        message:
          "Full name must be at least 2 characters long and should not contain special characters ",
      },
    ],
    email: [
      { required: true, message: "Please enter an email" },
      {
        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: "Please enter a valid email",
      },
    ],
    mobile: [
      { required: true, message: "Please enter Mobile number" },
      {
        length: 10,
        message: "Mobile number should be exactly 10 characters long",
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
  //   const errorsData = {};

  //   Object.entries(formData).forEach(([key, value]) => {
  //     validationConfig[key].some((rule) => {
  //       if (rule.required && !value) {
  //         errorsData[key] = rule.message;
  //         return true;
  //       }

  //       if (rule.minLength && value.length < rule.minLength) {
  //         errorsData[key] = rule.message;
  //         return true;
  //       }

  //       if (rule.length && value.length != 10) {
  //         errorsData[key] = rule.message;
  //         return true;
  //       }

  //       if (rule.pattern && !rule.pattern.test(value)) {
  //         errorsData[key] = rule.message;
  //         return true;
  //       }
  //     });
  //   });

  //   setErrors(errorsData);
  //   return errorsData;
  // };

  const validate = (formData) => {
    const errorsData = {};

    Object.entries(formData).forEach(([key, value]) => {
      // Remove spaces for validation if the field is fullname or password
      const sanitizedValue =
        key === "fullname" || key === "password"
          ? value.replace(/\s+/g, "")
          : value;

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

  const filterInput = (value) => {
    // Regular expression to match emojis and non-printable characters
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    return value.replace(emojiRegex, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateResult = validate(signUpData);
    if (Object.keys(validateResult).length) return;

    if (!isChecked) {
      toast.error("Please agree to our Terms and conditions");
      return;
    }

    try {
      // Adding user with email
      const emailResponse = await axios.post(
        `${BASE_URL}/users/addNewUserEmail?name=${signUpData.fullname}&emailId=${signUpData.email}&password=${signUpData.password}&mobile=${signUpData.mobile}`
      );

      const { errorMessage } = emailResponse.data;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      } else {
        toast.success("User added successfully!");
        navigate("/sign-in");
      }
    } catch (error) {
      console.error(error.response);
      toast.error("Something went wrong!");
      return;
    }

    setSignupData({
      fullname: "",
      email: "",
      password: "",
      mobile: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = filterInput(value);
    let errorsData = {};

    if (name === "mobile") {
      // Remove any non-digit characters
      sanitizedValue = value.replace(/\D/g, "");

      // Check for non-digit characters and show error message if needed
      if (value !== sanitizedValue) {
        errorsData.mobile = "Only digits are allowed.";
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...errorsData,
        }));

        // Remove the error message after 1 second
        setTimeout(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            mobile: "",
          }));
        }, 1000); // Adjust time as needed (1000ms = 1 second)
      }
    } else if (name === "password") {
      // If space is detected, show an error message
      if (value.includes(" ")) {
        errorsData.password = "Spaces are not allowed in the password.";

        // Set a timeout to clear the error message after 1 second
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...errorsData,
        }));

        setTimeout(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "",
          }));
        }, 1000); // Adjust time as needed (1000ms = 1 second)

        // Remove white spaces from the password field for validation
        sanitizedValue = value.replace(/\s+/g, "");
      }
    }

    setSignupData((prevState) => ({
      ...prevState,
      [name]: sanitizedValue,
    }));

    // Revalidate the field after clearing the space error message
    if (!errorsData[name]) {
      const validateResult = validate({ [name]: sanitizedValue });
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...validateResult,
      }));
    }
  };

  return (
    <div className="bg-gray-400 py-1 px-3">
      <div className={styles.signuppage_container}>
        <img
          src={
            "https://neeljewels-mediabucket.s3.ap-south-1.amazonaws.com/signup.jpg"
          }
          className={styles.img}
        />

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/*<select className={styles.select}>
            <option>India</option>
            <option>USA</option>
            <option>Nepal</option>
          </select>*/}
          <h1 className="mt-3">Create Account</h1>
          <div>
            <input
              type="text"
              value={signUpData.fullname}
              onChange={handleChange}
              id="fullname"
              name="fullname"
              required
            />
            <label htmlFor="fullname">Full Name</label>
            <p className="absolute top-[100%] text-[12px] text-[red]">
              {errors.fullname}
            </p>
          </div>
          <div>
            <input
              type="text"
              value={signUpData.email}
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
              type="text"
              inputmode="numeric"
              value={signUpData.mobile}
              onChange={handleChange}
              id="mobile"
              name="mobile"
              maxLength="10"
              // onKeyDown={(e) => {
              //   // Allow backspace, tab, delete, arrows, and numbers
              //   if (
              //     e.key !== "Backspace" &&
              //     e.key !== "Tab" &&
              //     e.key !== "Delete" &&
              //     e.key !== "ArrowLeft" &&
              //     e.key !== "ArrowRight" &&
              //     !/^[0-9]$/.test(e.key)
              //   ) {
              //     e.preventDefault();
              //   }
              // }}
              required
            />
            <label htmlFor="mobile">Mobile Number</label>
            <p
              className="absolute top-[100%] text-[12px] text-[red]"
              style={{ lineHeight: "14px" }}
            >
              {errors.mobile}
            </p>
          </div>
          <div>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={signUpData.password}
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
            {/* <p className="absolute top-[100%] text-[12px] text-[red]">
              {errors.password}
            </p> */}
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
          <button>Sign Up</button>
          <p className="text-[15px] text-center">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-blue-600 cursor-pointer underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
