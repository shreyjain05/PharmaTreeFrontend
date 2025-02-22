import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ImageBackground } from "react-native";
import { Card, TextInput, Button } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

const CreateOrderAdminScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [customers, setCustomers] = useState([
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
        { id: "3", name: "Michael Johnson" }
    ]);

    return (
        <ImageBackground
            source={{ uri: "https://www.example.com/medical-order-bg.jpg" }}
            style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
        >
            <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", marginBottom: 15, textAlign: "center" }}>📦 Create Order</Text>

                <TextInput
                    label="Search Customer"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={{ borderRadius: 10, marginBottom: 15 }}
                />

                <FlatList
                    data={customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                            <FontAwesome name="user" size={24} color="#10857F" style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />

                <Button mode="contained" style={{ marginTop: 15, borderRadius: 10, backgroundColor: "#10857F" }}>
                    Proceed to Order
                </Button>
            </Card>
        </ImageBackground>
    );
};

export default CreateOrderAdminScreen;