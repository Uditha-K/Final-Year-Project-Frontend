import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Form, Input, Button, Card, Typography, message, Row, Col } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      await updateProfile(userCredential.user, {
        displayName: `${values.firstName} ${values.lastName}`,
      });

      message.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: 450,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <img
            src={logo}
            alt="App Logo"
            style={{
              width: 140,
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
              backgroundColor: "#f0f2f5",
            }}
          />
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
          Create Account
        </Title>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="First Name"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Last Name" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email Address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            block
            size="large"
            htmlType="submit"
            loading={loading}
          >
            Register
          </Button>
        </Form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Text type="secondary">
            Already have an account? <Link to="/login">Login</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;
