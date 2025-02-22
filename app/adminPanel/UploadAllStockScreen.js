import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { Card, Button } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome } from "@expo/vector-icons";

const UploadAllStockScreen = () => {
    const [file, setFile] = useState(null);

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: "text/csv",
        });

        if (result.type === "success") {
            setFile(result);
        }
    };

    const handleUpload = () => {
        if (!file) {
            Alert.alert("No file selected", "Please select a CSV file to upload.");
            return;
        }
        Alert.alert("Success", "Stock data uploaded successfully!");
        setFile(null);
    };

    return (
        <ImageBackground
            source={{ uri: "https://www.example.com/medical-stock-bg.jpg" }}
            style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
        >
            <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", marginBottom: 15, textAlign: "center" }}>📦 Upload All Stock</Text>

                <TouchableOpacity onPress={pickDocument} style={{ alignItems: "center", padding: 20, borderWidth: 2, borderColor: "#10857F", borderRadius: 10, borderStyle: "dashed", marginBottom: 20 }}>
                    <FontAwesome name="upload" size={40} color="#10857F" />
                    <Text style={{ marginTop: 10, fontSize: 16, color: "#10857F" }}>Tap to upload CSV file</Text>
                </TouchableOpacity>

                {file && (
                    <View style={{ marginBottom: 20, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>Selected File:</Text>
                        <Text style={{ fontSize: 14, color: "#666" }}>{file.name}</Text>
                    </View>
                )}

                <Button mode="contained" onPress={handleUpload} style={{ borderRadius: 10, backgroundColor: "#10857F", padding: 8 }}>
                    Submit
                </Button>
            </Card>
        </ImageBackground>
    );
};

export default UploadAllStockScreen;