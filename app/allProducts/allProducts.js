import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { AppContext } from "../context/AppProvider";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useNavigation } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("screen");

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
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No Products Available
      </Text>
    );
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.whiteColor}
            onPress={() => navigation.pop()}
          />
          <Text
            style={{
              // width: width / 1.7,
              marginLeft: Sizes.fixPadding + 5.0,
              ...Fonts.whiteColor19Medium,
            }}
          >
            All Products
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          {/* Cart Icon */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.push("cart/cartScreen")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="cart" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "white" }}>
              Cart
            </Text>
          </View>

          {/* Wallet Icon */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.push("wallet/WalletScreen")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="wallet" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "white" }}>
              Wallet
            </Text>
          </View>
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
        <MaterialIcons name="search" size={24} color={Colors.grayColor} />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const inventory = item.productInventoryList?.[0] || {};
    const { saleRate, mrp, discount } = inventory;

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.7}
        onPress={() => onProductClick(item)}
        style={styles.cardContainer}
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              item.image
                ? { uri: item.image }
                : require("../../assets/images/defaultProduct.png")
            }
            style={styles.productImage}
          />
          {discount && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "#FF5733",
                paddingVertical: 4,
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

        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>
          {item.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{`₹${saleRate}`}</Text>
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
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.companyPrimary,
    height: 56.0,
    paddingLeft: Sizes.fixPadding * 2.0,
    paddingRight: Sizes.fixPadding,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // Light gray background
    borderRadius: 20, // Rounded edges
    marginHorizontal: 16,
    marginVertical: 12, // Increased margin for better spacing
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 3, // Subtle shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd", // Light gray border
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.blackColor,
    paddingLeft: 8, // Space between icon and text
  },
  searchButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 1.0,
    marginTop: Sizes.fixPadding + 5.0,
  },
  headerInfoWrapStyle: {
    flexDirection: "row",
    paddingLeft: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "48%",
    marginBottom: 15,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 230, // Ensuring uniform height for all cards
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    marginLeft: 10, // Added left padding for spacing
    marginTop: 6,
    color: Colors.companyPrimaryDark,
    width: "100%",
    minHeight: 40, // Ensuring consistent height for text
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10, // Added left padding for spacing
    marginTop: 4,
    width: "100%",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5733",
  },
});

export default AllProducts;
