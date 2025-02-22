import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ImageBackground } from "react-native";
import { Card } from "react-native-paper";
import { Upload, Package, Layers } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";

const AddInventoryScreen = () => {
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [csvFile, setCsvFile] = useState(null);

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: "text/csv" });
        if (!result.canceled) {
            setCsvFile(result.uri);
        }
    };

    const handleAddInventory = () => {
        console.log("Adding Inventory:", productName, quantity);
        // Call API to add inventory
    };

    const handleUploadCSV = () => {
        if (csvFile) {
            console.log("Uploading Inventory CSV File:", csvFile);
            // Call API to upload CSV
        }
    };

    return (
        <ImageBackground
            source={{ uri: "https://www.example.com/medical-inventory-bg.jpg" }}
            style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
        >
            <Card style={{ padding: 30, marginBottom: 25, borderRadius: 20, elevation: 8, backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2E7D32", marginBottom: 20, textAlign: "center" }}>📦 Add Inventory</Text>
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 18, borderRadius: 25, borderColor: "#2E7D32", backgroundColor: "#FAFAFA" }}>
                    <Package size={24} color="#2E7D32" style={{ marginRight: 10 }} />
                    <TextInput
                        style={{ flex: 1, fontSize: 16 }}
                        placeholder="Product Name"
                        value={productName}
                        onChangeText={setProductName}
                    />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 18, borderRadius: 25, marginTop: 12, borderColor: "#2E7D32", backgroundColor: "#FAFAFA" }}>
                    <Layers size={24} color="#2E7D32" style={{ marginRight: 10 }} />
                    <TextInput
                        style={{ flex: 1, fontSize: 16 }}
                        placeholder="Quantity"
                        value={quantity}
                        keyboardType="numeric"
                        onChangeText={setQuantity}
                    />
                </View>
                <View style={{ marginTop: 20, borderRadius: 25, overflow: 'hidden' }}>
                    <Button title="Add Inventory" color="#1B5E20" onPress={handleAddInventory} />
                </View>
            </Card>

            <Card style={{ padding: 30, borderRadius: 20, elevation: 8, backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2E7D32", marginBottom: 20, textAlign: "center" }}>📄 Upload Inventory CSV</Text>
                <TouchableOpacity
                    onPress={pickDocument}
                    style={{ padding: 18, backgroundColor: "#C8E6C9", borderRadius: 25, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={{ color: "#2E7D32", fontSize: 16, marginRight: 8 }}>{csvFile ? "File Selected" : "Choose CSV File"}</Text>
                    <Upload size={24} color="#2E7D32" />
                </TouchableOpacity>
                <View style={{ marginTop: 20, borderRadius: 25, overflow: 'hidden' }}>
                    <Button title="Upload" color="#1B5E20" onPress={handleUploadCSV} disabled={!csvFile} />
                </View>
            </Card>
        </ImageBackground>
    );
};

export default AddInventoryScreen;