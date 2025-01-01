import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, message, Card, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../constant";

const PasswordReset = () => {
  const [form] = Form.useForm();
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setIsResetMode(true);
      form.setFieldsValue({ token });
    }
  }, [location, form]);

  const onFinish = async (values) => {
    if (!isResetMode) {
      try {
        setLoading(true);
        await axios.post(
          `${BASE_URL}/users/forgotPassword?email=${values.email}`
        );
        setTimeout(() => {
          setLoading(false);
          message.success("Password reset instructions sent to your email.");
        }, 4000);
      } catch (error) {
        setLoading(false);
        message.error("Failed to send reset instructions. Please try again.");
      }
    } else {
      try {
        setLoading(true);
        const response = await axios.post(
          `${BASE_URL}/users/resetPassword`,
          null,
          {
            params: {
              email: values.email,
              token: values.token,
              newPassword: values.newPassword,
            },
          }
        );
        setTimeout(() => {
          setLoading(false);
          message.success(response.data);
          navigate("/sign-in");
        }, 4000);
      } catch (error) {
        setLoading(false);
        message.error(
          "Failed to reset password. Please check your token and try again."
        );
      }
    }
  };

  return (
    <div
      style={{
        height: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        title={isResetMode ? "Reset Password" : "Forgot Password"}
        style={{
          width: 300,

          margin: "50px auto",
          marginTop: 50,
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        }}
      >
        <Form form={form} name="password_reset" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          {isResetMode && (
            <>
              <Form.Item
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long!",
                  },
                ]}
              >
                <Input.Password placeholder="New Password" />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? (
                <Spin />
              ) : isResetMode ? (
                "Reset Password"
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PasswordReset;
