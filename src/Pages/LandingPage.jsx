import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  Layout,
  Typography,
  Input,
  Button,
  Card,
  Space,
  Tag,
  Row,
  Col,
  Modal,
  Select,
  message,
  Avatar,
  Dropdown,
  Upload,
  Tabs,
  Table,
} from "antd";

import {
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  LogoutOutlined,
  UserOutlined,
  InboxOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const { TabPane } = Tabs;

const BASE_API = "http://127.0.0.1:5000/predict";

const LandingPage = () => {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [model, setModel] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [batchResults, setBatchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success("Logged out successfully");
      navigate("/login");
    } catch {
      message.error("Error logging out");
    }
  };

  const resetPage = () => {
    setText("");
    setSentiment(null);
    setConfidence(null);
    setModel(null);
  };

  const clearBatchResults = () => {
    setBatchResults([]);
  };

  const handleAnalyzeClick = () => {
    if (!text.trim()) {
      message.warning("Please enter some text");
      return;
    }
    setOpen(true);
  };

  const runAnalysis = async () => {
    if (!model) {
      message.warning("Please select a model");
      return;
    }

    setLoading(true);

    const endpointMap = {
      svm: "/SVM",
      lr: "/LR",
      bilstm: "/BiLSTM",
      ensemble: "/Ensemble",
    };

    try {
      const response = await axios.post(
        `${BASE_API}${endpointMap[model]}`,
        { text },
        { headers: { "Content-Type": "application/json" } },
      );

      setSentiment(response.data.prediction);
      setConfidence(response.data.confidence);

      message.success("Sentiment analysis completed");

      setTimeout(() => {
        resetPage();
      }, 5000);
    } catch (error) {
      console.error(error);
      message.error("Failed to connect to sentiment service");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const renderSentiment = () => {
    if (!sentiment) return null;

    const colors = {
      positive: "green",
      neutral: "gold",
      negative: "red",
    };

    const icons = {
      positive: <SmileOutlined />,
      neutral: <MehOutlined />,
      negative: <FrownOutlined />,
    };

    return (
      <Tag color={colors[sentiment]} icon={icons[sentiment]}>
        {sentiment.toUpperCase()} ({(confidence * 100).toFixed(1)}%)
      </Tag>
    );
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx,.xls,.csv",

    customRequest: async ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/predict/batch",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        message.success("Excel file processed successfully");

        setBatchResults(response.data.results);

        onSuccess(response.data);
      } catch (error) {
        message.error("File upload failed");
        onError(error);
      }
    },
  };

  const columns = [
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Prediction",
      dataIndex: "prediction",
      key: "prediction",
      render: (value) => {
        const colors = {
          positive: "green",
          neutral: "gold",
          negative: "red",
        };

        return <Tag color={colors[value]}>{value.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Confidence",
      dataIndex: "confidence",
      key: "confidence",
      render: (value) => `${(value * 100).toFixed(1)}%`,
    },
  ];

  const sentimentStats = () => {
    const stats = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    batchResults.forEach((item) => {
      stats[item.prediction] += 1;
    });

    return [
      { name: "Positive", value: stats.positive },
      { name: "Neutral", value: stats.neutral },
      { name: "Negative", value: stats.negative },
    ];
  };

  const COLORS = ["#52c41a", "#faad14", "#ff4d4f"];

  const userMenuItems = [
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          TELCO SENTIMENT ANALYZER
        </Title>

        {user && (
          <Space>
            <Text strong hidden={window.innerWidth < 600}>
              {user.displayName || user.email}
            </Text>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                src={user.photoURL}
                icon={<UserOutlined />}
                style={{ cursor: "pointer", backgroundColor: "#1890ff" }}
              />
            </Dropdown>
          </Space>
        )}
      </Header>

      <Content style={{ padding: "60px 24px" }}>
        <Row justify="center">
          <Col xs={24} sm={22} md={18} lg={14}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Tabs defaultActiveKey="1">
                <TabPane tab="Text Analysis" key="1">
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Title level={2}>Analyze a Single Text</Title>
                      <Paragraph type="secondary">
                        Enter a sentence and select a model to analyze
                        sentiment.
                      </Paragraph>
                    </div>

                    <TextArea
                      rows={6}
                      placeholder="Enter text to analyze sentiment..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      style={{ borderRadius: 8 }}
                    />

                    <Space
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={handleAnalyzeClick}
                      >
                        Analyze Sentiment
                      </Button>

                      {renderSentiment()}
                    </Space>
                  </Space>
                </TabPane>

                <TabPane tab="Bulk File Upload" key="2">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div style={{ textAlign: "center" }}>
                      <Title level={2}>Batch Sentiment Analysis</Title>
                      <Paragraph type="secondary">
                        Upload an Excel or CSV file containing multiple texts.
                      </Paragraph>
                    </div>

                    <Dragger {...uploadProps} style={{ padding: 20 }}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>

                      <p className="ant-upload-text">
                        Drag and drop an Excel file here
                      </p>

                      <p className="ant-upload-hint">
                        or click to select a file from your computer
                      </p>

                      <p className="ant-upload-hint">
                        Supported formats: .xlsx, .csv
                      </p>
                    </Dragger>

                    {batchResults.length > 0 && (
                      <div style={{ marginTop: 30 }}>
                        <Space style={{ marginBottom: 16 }}>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={clearBatchResults}
                          >
                            Clear Results
                          </Button>
                        </Space>

                        <Title level={4}>Prediction Results</Title>

                        <Table
                          columns={columns}
                          dataSource={batchResults}
                          rowKey={(record, index) => index}
                          pagination={{ pageSize: 8 }}
                        />

                        <Title level={4} style={{ marginTop: 40 }}>
                          Sentiment Visualization
                        </Title>

                        <Row gutter={24}>
                          <Col span={12}>
                            <Card title="Sentiment Distribution">
                              <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Pie
                                    data={sentimentStats()}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    label
                                  >
                                    {sentimentStats().map((entry, index) => (
                                      <Cell key={index} fill={COLORS[index]} />
                                    ))}
                                  </Pie>

                                  <Tooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </Card>
                          </Col>

                          <Col span={12}>
                            <Card title="Sentiment Counts">
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={sentimentStats()}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />

                                  <Bar dataKey="value">
                                    {sentimentStats().map((entry, index) => (
                                      <Cell key={index} fill={COLORS[index]} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Space>
                </TabPane>
              </Tabs>

              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  display: "block",
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                AI based sentiment prediction may not be fully accurate. Results
                should be used as guidance only.
              </Text>
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: "center", background: "transparent" }}>
        © {new Date().getFullYear()} Sentiment Analysis System
      </Footer>

      <Modal
        title="Select Sentiment Model"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={runAnalysis}
        okButtonProps={{ disabled: !model, loading }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>Select the model you want to use for analysis.</Text>

          <Select
            placeholder="Choose a model"
            value={model}
            onChange={setModel}
            style={{ width: "100%" }}
          >
            <Select.Option value="svm">SVM</Select.Option>
            <Select.Option value="lr">Logistic Regression</Select.Option>
            <Select.Option value="bilstm">BiLSTM</Select.Option>
            <Select.Option value="ensemble">Ensemble Model</Select.Option>
          </Select>
        </Space>
      </Modal>
    </Layout>
  );
};

export default LandingPage;
