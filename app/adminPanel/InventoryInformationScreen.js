import React, { useState } from "react";
import { View, Text, ImageBackground, FlatList } from "react-native";
import { Card, TextInput } from "react-native-paper";
import { MaterialIcons } from '@expo/vector-icons';

const InventoryInformationScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const inventoryData = [
        { id: "1", name: "Paracetamol", stock: "150" },
        { id: "2", name: "Ibuprofen", stock: "200" },
        { id: "3", name: "Aspirin", stock: "100" },
        { id: "4", name: "Cetirizine", stock: "80" },
        { id: "5", name: "Amoxicillin", stock: "120" }
    ];

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = inventoryData.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    };

    return (
        <ImageBackground
            source={{ uri: "https://www.example.com/medical-inventory-bg.jpg" }}
            style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
        >
            <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", marginBottom: 15, textAlign: "center" }}>📦 Inventory Information</Text>

                <TextInput
                    label="Search Inventory"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    style={{ marginBottom: 15, backgroundColor: "#FFFFFF", borderRadius: 10 }}
                    left={<TextInput.Icon name="magnify" />}
                />

                <FlatList
                    data={filteredData.length > 0 ? filteredData : inventoryData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
                            <MaterialIcons name="medical-services" size={24} color="#10857F" style={{ marginRight: 10 }} />
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{item.name}</Text>
                                <Text style={{ fontSize: 16, color: "#666" }}>Stock: {item.stock}</Text>
                            </View>
                        </View>
                    )}
                />
            </Card>
        </ImageBackground>
    );
};

export default InventoryInformationScreen;