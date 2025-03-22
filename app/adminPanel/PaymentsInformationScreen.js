import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Card, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import { format } from "date-fns";
import { useNavigation } from "expo-router";

const PaymentsInformationScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [paymentData, setPaymentData] = useState([
    {
      id: "1",
      customer: "John Doe",
      date: "2025-02-01",
      amount: "$200",
      status: "Paid",
    },
    {
      id: "2",
      customer: "Jane Smith",
      date: "2025-02-05",
      amount: "$350",
      status: "Pending",
    },
  ]);

  const [paymentApiData, SetPaymentApiData] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredPayments(
      paymentApiData.filter((payment) =>
        payment.customer.toLowerCase().includes(query.toLowerCase())
      )
    );
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/products`); // Use the correct API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log("SetPaymentApiData", data);

        SetPaymentApiData(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
      }
    };

    fetchProducts(); // Call the function inside useEffect, not outside
  }, []);

  return (
    <ImageBackground
      source={{ uri: "https://www.example.com/medical-payments-bg.jpg" }}
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#F4F7F9",
        minHeight: "100%",
      }}
    >
      <Card
        style={{
          padding: 25,
          borderRadius: 20,
          elevation: 5,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#10857F",
            marginBottom: 15,
            textAlign: "center",
          }}
        >
          💳 Payments Information
        </Text>

        <TextInput
          label="Search by Customer"
          value={searchQuery}
          onChangeText={handleSearch}
          style={{ borderRadius: 10, marginBottom: 15 }}
          left={<TextInput.Icon name="magnify" />}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
            <FontAwesome name="calendar" size={24} color="#10857F" />
            <Text>From: {fromDate.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowToDatePicker(true)}>
            <FontAwesome name="calendar" size={24} color="#10857F" />
            <Text>To: {toDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showFromDatePicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFromDatePicker(false);
              if (selectedDate) setFromDate(selectedDate);
            }}
          />
        )}

        {showToDatePicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowToDatePicker(false);
              if (selectedDate) setToDate(selectedDate);
            }}
          />
        )}

        <FlatList
          data={filteredPayments.length > 0 ? filteredPayments : paymentApiData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
              }}
            >
              <FontAwesome
                name="user"
                size={24}
                color="#10857F"
                style={{ marginRight: 10 }}
              />
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
                >
                  Customer: {item?.createdBy}
                </Text>
                <Text style={{ fontSize: 16, color: "#666" }}>
                  Date:{" "}
                  {item?.createdAt
                    ? format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")
                    : "N/A"}
                </Text>
                <Text style={{ fontSize: 16, color: "#666" }}>
                  Amount: {item.amount}
                </Text>
                {/* <Text style={{ fontSize: 16, color: item.status === "Paid" ? "green" : "red" }}>Status: {item.status}</Text> */}
              </View>
            </View>
          )}
        />
      </Card>
    </ImageBackground>
  );
};

export default PaymentsInformationScreen;
