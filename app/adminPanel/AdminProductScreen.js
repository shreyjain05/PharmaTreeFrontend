
import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, TextInput, Button, Platform, ImageBackground, TouchableOpacity, ScrollView, Divider, SafeAreaView, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { Upload, Package, FileText, Tag, Calendar, DollarSign, Plus, Trash2, } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";

const AdminProductScreen = () => {
    const [productData, setProductData] = useState({
        companyName: "",
        composition: "",
        createdBy: "ADMIN",
        description: "",
        image: "",
        name: "",
        packingName: "",
        productInventoryList: [{
            basicRate: "",
            discount: "",
            expiryDate: "",
            hsncode: "",
            inventoryCount: "",
            mrp: "",
            purchaseRate: "",
            saleRate: ""
        }]
    });
    const fieldLabels = {
        companyName: "Company Name",
        composition: "Composition",
        createdBy: "Created By",
        description: "Description",
        image: "Product Image",
        name: "Product Name",
        packingName: "Packing Name",
        "productInventoryList.basicRate": "Basic Rate",
        "productInventoryList.discount": "Discount",
        "productInventoryList.expiryDate": "Expiry Date",
        "productInventoryList.hsncode": "HSN Code",
        "productInventoryList.inventoryCount": "Inventory Count",
        "productInventoryList.mrp": "MRP",
        "productInventoryList.purchaseRate": "Purchase Rate",
        "productInventoryList.saleRate": "Sale Rate"
    };

    const [csvFile, setCsvFile] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const handleInputChange = (key, value) => {
        setProductData({ ...productData, [key]: value });
    };
    // Handle Expiry Date Change
    const handleConfirm = (date) => {
        const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        setProductData((prev) => ({
            ...prev,
            productInventoryList: prev.productInventoryList.map((item, index) =>
                index === 0 ? { ...item, expiryDate: formattedDate } : item
            ),
        }));
        setDatePickerVisible(false);
    };

    // Open Image Picker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProductData({ ...productData, image: result.assets[0].uri });
        }
    };

    const handleInventoryChange = (index, key, value) => {
        const updatedInventory = [...productData.productInventoryList];
        updatedInventory[index][key] = value;
        setProductData({ ...productData, productInventoryList: updatedInventory });
    };

    const addInventory = () => {
        setProductData({
            ...productData,
            productInventoryList: [...productData.productInventoryList, {
                basicRate: "",
                discount: "",
                expiryDate: "",
                hsncode: "",
                inventoryCount: "",
                mrp: "",
                purchaseRate: "",
                saleRate: ""
            }]
        });
    };


    const removeInventory = (index) => {
        if (productData.productInventoryList.length > 1) {
            const updatedInventory = productData.productInventoryList.filter((_, i) => i !== index);
            setProductData({ ...productData, productInventoryList: updatedInventory });
        }
    };

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: "text/csv" });
        if (!result.canceled) {
            setCsvFile(result.uri);
            console.log("CSV File Selected: ", result.uri);
        }
    };

    const handleSubmit = () => {
        console.log("Final Product Data:", JSON.stringify(productData, null, 2));
    };


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            {/* Heading with Background */}
            <ImageBackground
                source={require("./../../assets/images/backgroundImg.png")} // Replace with your image path
                style={styles.headingBackground}
            >
                <Text style={styles.heading}>➕ Add New Product</Text>
            </ImageBackground>

            <View style={{ padding: 20, borderRadius: 15, backgroundColor: "white" }}>
                {/* CSV Upload Section */}
                <TouchableOpacity onPress={pickDocument} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 15, backgroundColor: "#E0F4FF", borderRadius: 10, marginTop: 15 }}>
                    <Text style={{ fontSize: 16, color: "#0B678C", marginRight: 10 }}>{csvFile ? "✅ CSV Selected" : "📎 Upload CSV"}</Text>
                    <Upload size={24} color="#0B678C" />
                </TouchableOpacity>

                <Text style={{ textAlign: "center", marginVertical: 10, color: "#0B678C" }}>--- OR ---</Text>

                {/* Product Input Fields */}
                <View>
                    {/* Product Input Fields */}
                    {Object.keys(productData).filter(key => key !== "productInventoryList").map((key, index) => (
                        <View key={index} style={{ marginVertical: 10 }}>
                            <Text style={{ fontWeight: "bold", marginBottom: 5, color: "#0B678C" }}> {fieldLabels[key] || key} {/* Use the mapping */}</Text>
                            {key === "expiryDate" ? (
                                <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={{ borderWidth: 1, borderColor: "#0B678C", borderRadius: 10, padding: 10, backgroundColor: "#FAFAFA" }}>
                                    <Text>{productData.productInventoryList[0].expiryDate || "Select Expiry Date"}</Text>
                                </TouchableOpacity>
                            ) : key === "image" ? (
                                <TouchableOpacity onPress={pickImage} style={{ borderWidth: 1, borderColor: "#0B678C", borderRadius: 10, padding: 10, backgroundColor: "#FAFAFA", alignItems: "center" }}>
                                    {productData.image ? (
                                        <Image source={{ uri: productData.image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                                    ) : (
                                        <Text>Select Image</Text>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: "#0B678C", borderRadius: 10, padding: 10, backgroundColor: "#FAFAFA", paddingVertical: 15 }}
                                    placeholder={`Enter ${fieldLabels[key] || key}`}
                                    value={productData[key]}
                                    onChangeText={(text) => handleInputChange(key, text)}
                                />
                            )}
                        </View>
                    ))}

                    {/* Date Picker Modal */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={() => setDatePickerVisible(false)}
                    />
                </View>

                {/* Inventory List Section */}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10, textAlign: "center", color: "#0B678C" }}>Inventory List</Text>
                {productData.productInventoryList.map((inventory, index) => (
                    <View key={index} style={{ padding: 15, marginVertical: 10, borderRadius: 10, backgroundColor: "white" }}>
                        {Object.keys(inventory).map((key, idx) => (
                            <View key={idx} style={{ marginBottom: 10 }}>
                                <Text style={{ fontWeight: "bold", marginBottom: 5, color: "#0B678C" }}>{fieldLabels[`productInventoryList.${key}`] || key}</Text>
                                {key === "expiryDate" ? (
                                    <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={{ borderWidth: 1, borderColor: "#0B678C", borderRadius: 10, padding: 10, backgroundColor: "#FAFAFA" }}>
                                        <Text>{inventory.expiryDate || "Select Expiry Date"}</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TextInput
                                        style={{ borderWidth: 1, borderColor: "#0B678C", borderRadius: 10, padding: 10, backgroundColor: "#FAFAFA", paddingVertical: 15 }}
                                        placeholder={`Enter ${fieldLabels[`productInventoryList.${key}`] || key}`}
                                        value={inventory[key]}
                                        onChangeText={(text) => handleInventoryChange(inventoryIndex, key, text)}
                                    />
                                )}
                                {/* <TextInput
                                    style={{ borderWidth: 1, borderColor: "#0B678C", borderRadius: 10, padding: 10, backgroundColor: "#FAFAFA" }}
                                    placeholder={`Enter ${key}`}
                                    value={inventory[key]}
                                    onChangeText={(text) => handleInventoryChange(index, key, text)}
                                /> */}
                            </View>
                        ))}
                        {/* <TouchableOpacity onPress={() => removeInventory(index)} style={{ alignSelf: "flex-end", marginTop: 10 }}>
                            <Trash2 size={20} color="red" />
                        </TouchableOpacity> */}
                        {/* Show trash icon only if there's more than one inventory item */}
                        {productData.productInventoryList.length > 1 && (
                            <TouchableOpacity onPress={() => removeInventory(index)} style={{ alignSelf: "flex-end", marginTop: 10 }}>
                                <Trash2 size={20} color="red" />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                {/* Add Inventory Button */}
                <TouchableOpacity onPress={addInventory} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                    <Plus size={24} color="#0B678C" />
                    <Text style={{ fontSize: 16, color: "#0B678C", marginLeft: 5 }}>Add Inventory</Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <View style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden' }}>
                    <Button title="Submit" color="#0B678C" onPress={handleSubmit} />
                </View>
            </View>
        </ScrollView>
    );

};


const styles = StyleSheet.create({
    headingBackground: {
        width: "100%",
        paddingVertical: 40,
        marginBottom: 10,
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#0B678C",
        backgroundColor: "transparent",
        paddingHorizontal: 30,
        paddingVertical: 20,
        textAlign: "center",
    },
});
export default AdminProductScreen;