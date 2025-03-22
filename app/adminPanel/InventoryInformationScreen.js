import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Card, TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../context/AppProvider";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useNavigation } from "expo-router";

const InventoryInformationScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { products } = useContext(AppContext);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = products.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory</Text>
      </View>

      {/* Inventory Information Header */}
      <Card style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>📦 Inventory Information</Text>
      </Card>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons
            name="search"
            size={24}
            color="#10857F"
            style={styles.searchIcon}
          />
          <TextInput
            label="Search Inventory"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Inventory List */}
      <ScrollView>
        <ImageBackground
          source={{ uri: "https://www.example.com/medical-inventory-bg.jpg" }}
          style={styles.backgroundImage}
        >
          <FlatList
            data={filteredData.length > 0 ? filteredData : products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.productCard}>
                <MaterialIcons
                  name="medical-services"
                  size={28}
                  color="#10857F"
                />
                <View style={styles.textContainer}>
                  <Text style={styles.productTitle}>{item.name}</Text>
                  <FlatList
                    data={item.productInventoryList}
                    keyExtractor={(inventory) => inventory.id.toString()}
                    renderItem={({ item: inventory }) => (
                      <View style={styles.inventoryItem}>
                        <Text style={styles.productText}>
                          Batch: {inventory.batchNumber}
                        </Text>
                        <Text style={styles.productText}>
                          Quantity: {inventory.inventoryCount}
                        </Text>
                        <Text style={styles.productText}>
                          MRP: ₹{inventory.mrp}
                        </Text>
                        <Text style={styles.productText}>
                          Sale Rate: ₹{inventory.saleRate}
                        </Text>
                        <Text style={styles.productText}>
                          Expiry:{" "}
                          {new Date(inventory.expiryDate).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </Card>
            )}
          />
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F9",
  },
  headerWrapStyle: {
    backgroundColor: "#10857F",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    elevation: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoHeader: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    margin: 15,
    elevation: 4,
    alignItems: "center",
  },
  infoHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#10857F",
  },
  searchContainer: {
    padding: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#10857F",
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    color: "#10857F",
  },
  backgroundImage: {
    flex: 1,
    padding: 15,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productText: {
    fontSize: 14,
    color: "#666",
  },
  inventoryItem: {
    marginTop: 5,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 5,
  },
});

export default InventoryInformationScreen;
