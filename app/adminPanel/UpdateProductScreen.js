import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import { Card } from "react-native-paper";
import { Search, Package, FileText } from "lucide-react-native";

const mockProducts = [
    { id: "1", name: "Paracetamol", description: "Pain reliever and fever reducer" },
    { id: "2", name: "Ibuprofen", description: "Anti-inflammatory and pain reliever" },
    { id: "3", name: "Aspirin", description: "Used to reduce pain and inflammation" },
];

const UpdateProductScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");

    const handleSearchProduct = (query) => {
        setSearchQuery(query);
        if (query.length > 0) {
            const results = mockProducts.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(results);
        } else {
            setFilteredProducts([]);
        }
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setProductName(product.name);
        setDescription(product.description);
        setFilteredProducts([]);
        setSearchQuery(product.name);
    };

    const handleUpdateProduct = () => {
        console.log("Updating Product:", productName, description);
        // API call to update product details
    };

    return (
        <ImageBackground
            source={{ uri: "https://www.example.com/modern-medical-bg.jpg" }}
            style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
        >
            <Card style={{ padding: 30, marginBottom: 25, borderRadius: 20, elevation: 8, backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2E7D32", marginBottom: 20, textAlign: "center" }}>🔍 Search Product</Text>
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 18, borderRadius: 25, borderColor: "#2E7D32", backgroundColor: "#FAFAFA" }}>
                    <Search size={24} color="#2E7D32" style={{ marginRight: 10 }} />
                    <TextInput
                        style={{ flex: 1, fontSize: 16 }}
                        placeholder="Enter Product Name or ID"
                        value={searchQuery}
                        onChangeText={handleSearchProduct}
                    />
                </View>
                {filteredProducts.length > 0 && (
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelectProduct(item)} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#DDD" }}>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </Card>

            {selectedProduct && (
                <Card style={{ padding: 30, borderRadius: 20, elevation: 8, backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2E7D32", marginBottom: 20, textAlign: "center" }}>✏️ Update Product Details</Text>
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
                        <FileText size={24} color="#2E7D32" style={{ marginRight: 10 }} />
                        <TextInput
                            style={{ flex: 1, fontSize: 16 }}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
                    <View style={{ marginTop: 20, borderRadius: 25, overflow: 'hidden' }}>
                        <Button title="Update Product" color="#1B5E20" onPress={handleUpdateProduct} />
                    </View>
                </Card>
            )}
        </ImageBackground>
    );
};

export default UpdateProductScreen;