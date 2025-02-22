import React, { useContext, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import { AppContext } from "../context/AppProvider";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('screen');

const AllProducts = () => {
    const { products } = useContext(AppContext);
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filteredProducts, setFilteredProducts] = useState(products); // State for filtered products

    const onProductClick = (item) => {
        console.log("Clicked on:", item);

        navigation.push("productDescription/productDescriptionScreen", {
            openedProduct: JSON.stringify(item),
        });
    };
    // Ensure products exist
    if (!products || products.length === 0) {
        return <Text style={{ textAlign: "center", marginTop: 20 }}>No Products Available</Text>;
    }

    // Function to handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = products.filter((item) => {
                const lowerCaseQuery = query.toLowerCase();
                return (
                    item.name.toLowerCase().includes(lowerCaseQuery) || // Search by product name
                    item.companyName?.toLowerCase().includes(lowerCaseQuery) || // Search by company name
                    item.composition?.toLowerCase().includes(lowerCaseQuery) // Search by composition
                );
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products); // Reset to all products if search query is empty
        }
    };

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={Colors.whiteColor}
                        onPress={() => navigation.pop()}
                    />
                    <Text style={{
                        // width: width / 1.7,
                        marginLeft: Sizes.fixPadding + 5.0,
                        ...Fonts.whiteColor19Medium
                    }}>
                        All Products
                    </Text>
                </View>
            </View>
        );
    }

    // Search Bar Component
    function searchBar() {
        return (
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, company, or composition..."
                    placeholderTextColor={Colors.grayColor}
                    value={searchQuery}
                    onChangeText={handleSearch} // Update search query and filter products
                />
                <MaterialIcons
                    name="search"
                    size={24}
                    color={Colors.grayColor}
                />
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const inventory = item.productInventoryList?.[0] || {};
        const { saleRate, mrp, discount } = inventory;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onProductClick(item)}
                style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    width: "45%",
                    //flex: 1, // Makes sure two items fit in a row
                    margin: 8, // Spacing between items
                    padding: 10,
                    alignSelf: "center",
                    // backgroundColor: "red",
                    justifyContent: "space-between"

                }}
            >
                {/* Product Image and Discount */}
                <View style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: Colors.companyPrimaryDark,
                    overflow: "hidden",
                    padding: 20,
                    alignItems: "center",
                    position: "relative"
                }}>
                    {/* Product Image */}
                    <Image
                        source={item.image ? { uri: item.image } : require("../../assets/images/defaultProduct.png")}
                        style={{ width: 140, height: 140 }}
                        resizeMode="contain"
                    />

                    {/* Discount Badge */}
                    {discount && (
                        <View
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                backgroundColor: "#FF5733",
                                paddingVertical: 5,
                                paddingHorizontal: 8,
                                borderBottomRightRadius: 8,
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                                {discount}% OFF
                            </Text>
                        </View>
                    )}
                </View>

                {/* Product Name */}
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                        fontSize: 18,
                        textAlign: "left",
                        marginTop: 5,
                        color: Colors.companyPrimaryDark,
                        width: "100%"
                    }}
                >
                    {item.name}
                </Text>

                {/* Price & Discount */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF5733" }}>
                        ₹{saleRate || "N/A"}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.companyLight }}>
            {header()}
            {searchBar()}
            <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} // Ensures two products per row
                contentContainerStyle={{ padding: 10 }}
                columnWrapperStyle={{ justifyContent: "space-between" }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.companyPrimary,
        height: 56.0,
        paddingLeft: Sizes.fixPadding * 2.0,
        paddingRight: Sizes.fixPadding,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: 10,
        marginHorizontal: 16,
        marginVertical: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: Colors.blackColor,
    },
});

export default AllProducts;
