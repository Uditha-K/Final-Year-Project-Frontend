import React from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Form, Input, Button, Card, Typography, Divider, message } from "antd";
import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const handleEmailLogin = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("Logged in successfully!");
      navigate("/landingPage");
    } catch (error) {
      message.error("Invalid credentials: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      message.success("Successfully Logged in!");
      navigate("/landingPage");
    } catch (error) {
      message.error("Google login failed: " + error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
              background: "#f0f2f5",
            }}
          />
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
          Welcome Back! Please Login
        </Title>
        <Form layout="vertical" onFinish={handleEmailLogin}>
          <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Button type="primary" block size="large" htmlType="submit">
            Login
          </Button>
        </Form>

        <Divider plain>OR</Divider>

        <Button
          icon={<GoogleOutlined />}
          block
          size="large"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Text>
            Don't have an account? <Link to="/register">Register</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
