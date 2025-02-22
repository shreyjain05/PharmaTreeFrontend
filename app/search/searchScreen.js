import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Image } from "react-native";
import { Colors } from "../../constant/styles";
import { AppContext } from "../context/AppProvider"

const SearchScreen = () => {
    const { products } = useContext(AppContext);
    const [searchText, setSearchText] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Filter products based on search text
    useEffect(() => {
        if (searchText.length > 0) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [searchText]);

    // Function to render popular items
    const renderPopularItems = () => {
        return (
            <View style={{ marginVertical: 10 }}>

                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Popular Items</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {products.slice(0, 6).map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.pill}
                            onPress={() => console.log("Selected Product:", item)} // ✅ Logs full product data
                        >
                            <Text style={styles.pillText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    // Function to render dropdown search
    const renderSearchDropdown = () => {
        return (
            <View style={{ position: "relative", marginBottom: 15 }}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {filteredProducts.length > 0 && (
                    <View style={styles.dropdown}>
                        <FlatList
                            data={filteredProducts}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.dropdownItem} onPress={() => setSearchText(item.name)}>
                                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
            {renderSearchDropdown()}
            <ScrollView>
                {renderPopularItems()}

                {/* ✅ Show image when searchText is empty */}
                {searchText.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Image source={require("../../assets/images/emptySearch.png")} style={styles.emptyImage} />
                        <Text style={styles.emptyText}>
                            Search for any drugs by simply typing the name in the search box.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = {
    searchInput: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    dropdown: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderColor: "#ddd",
        borderWidth: 1,
        maxHeight: 200,
        zIndex: 1,
        elevation: 3,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    pill: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: Colors.companyLight,
        borderColor: "#bbb",
        borderWidth: 1,
        marginRight: 10,
        marginBottom: 10,
    },
    pillText: {
        fontSize: 14,
        color: "#555",
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    emptyImage: {
        width: 200,
        height: 200,
        resizeMode: "contain",
    },
    emptyText: {
        fontSize: 16,
        color: "#777",
        marginTop: 10,
        textAlign: "center",
        paddingHorizontal: 20,
    },
};

export default SearchScreen;
