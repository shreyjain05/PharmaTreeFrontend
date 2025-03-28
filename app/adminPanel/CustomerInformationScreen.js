import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { Card, Dialog } from "react-native-paper";
import BASE_URL from "../../constant/variable";
import { useNavigation } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("screen");

const CustomerInformationScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [customerApiData, setCustomerApiData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMetaData, setSelectedMetaData] = useState([
    {
      isCreditAllowed: "No", // Default value to avoid undefined
      customerDiscount: "",
      customerTargets: [],
    },
  ]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  const [state, setState] = useState({
    showSuccessDialog: false,
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { showSuccessDialog } = state;

  useEffect(() => {
    // Ensure the tab bar is visible when this screen is mounted
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });

    return () => {
      // Reset tab bar when leaving the screen
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    };
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/customer`);
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomerApiData(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditedData(customer);
    setEditModalVisible(true);
    setSelectedMetaData(JSON.parse(customer.metaData));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = customerApiData.filter((item) =>
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const handleTargetChange = async (index, text) => {
    const updatedTargets = selectedMetaData.customerTargets.map((target, i) =>
      i === index ? { ...target, targetValue: text } : target
    );

    setSelectedMetaData((prevMetaData) => ({
      ...prevMetaData,
      customerTargets: updatedTargets,
    }));

    console.log("Updated Metadata", updatedTargets);
  };

  function successDialog() {
    return (
      <Dialog visible={showSuccessDialog} style={styles.dialogWrapStyle}>
        <View
          style={{ backgroundColor: Colors.whiteColor, alignItems: "center" }}
        >
          <View style={styles.successIconWrapStyle}>
            <MaterialIcons name="done" size={40} color={Colors.primaryColor} />
          </View>
          <Text
            style={{
              ...Fonts.grayColor18Medium,
              marginTop: Sizes.fixPadding + 10.0,
            }}
          >
            Customer has been updated!
          </Text>
        </View>
      </Dialog>
    );
  }

  const updateCustomer = async () => {
    try {
      const updatedData = {
        ...editedData,
        metaData: JSON.stringify(selectedMetaData),
      };
      console.log("updated customer Data", updatedData);
      const response = await fetch(`${BASE_URL}/api/v1/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update customer");
      } else {
        setEditModalVisible(false);
        updateState({ showSuccessDialog: true });
        setTimeout(() => {
          updateState({ showSuccessDialog: false });
          const fetchCustomers = async () => {
            try {
              const response = await fetch(`${BASE_URL}/api/v1/customer`);
              if (!response.ok) throw new Error("Failed to fetch customers");
              const data = await response.json();
              setCustomerApiData(data);
            } catch (error) {
              console.error("Error fetching customers:", error);
            }
          };
          fetchCustomers();
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
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
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              ...Fonts.whiteColor19Medium,
              marginLeft: Sizes.fixPadding + 5.0,
            }}
          >
            Customers Information
          </Text>
        </View>
        {/* <MaterialIcons
          name="search"
          size={24}
          color={Colors.whiteColor}
          onPress={() => navigation.push("search/searchScreen")}
          /> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapStyle}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customers</Text>
      </View>

      {/* Inventory Information Header */}
      <Card style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>Customer Information</Text>
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
            placeholder="Search Customers" // Use placeholder instead of label
            placeholderTextColor="#888" // Light gray placeholder color
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <FlatList
          style={{
            padding: 5,
            borderRadius: 20,
            elevation: 5,
            backgroundColor: "#FFFFFF",
            margin: 10,
          }}
          data={filteredData.length > 0 ? filteredData : customerApiData}
          keyExtractor={(item) => item.id.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <View style={styles.card}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {item.firstName.charAt(0)}
                    {item.lastName.charAt(0)}
                  </Text>
                </View>

                <View style={styles.detailsContainer}>
                  <Text style={styles.name}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={styles.businessName}>{item.businessName}</Text>

                  {/* Phone Number and Status in one line */}
                  <View style={styles.rowContainer}>
                    <Text style={styles.contact}>
                      Phone: {item.phoneNumber}
                    </Text>
                    <Text style={styles.infoText}>Status: {item.status}</Text>
                  </View>

                  <View style={styles.rowContainer}>
                    <Text style={styles.contact}>
                      GST: {item.gstInformation?.gstnumber}
                    </Text>
                    <Text style={styles.contact}>
                      Onboarded: {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <Modal visible={editModalVisible} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Customer</Text>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={editedData.firstName}
                editable={false}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, firstName: text })
                }
                placeholder="First Name"
              />
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={editedData.lastName}
                editable={false}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, lastName: text })
                }
                placeholder="Last Name"
              />
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editedData.phoneNumber}
                editable={false}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, phoneNumber: text })
                }
                placeholder="Phone Number"
              />
              <Text style={styles.label}>Customer Discount (%)</Text>
              <TextInput
                style={styles.input}
                value={selectedMetaData.customerDiscount}
                onChangeText={(text) =>
                  setSelectedMetaData({
                    ...selectedMetaData,
                    customerDiscount: text,
                  })
                }
                placeholder="Customer Discount"
              />

              {/* Credit Allowed Dropdown */}
              <Text style={styles.label}>Credit Allowed</Text>
              <Picker
                selectedValue={selectedMetaData.isCreditAllowed ?? "No"} // Ensuring it never becomes undefined
                onValueChange={(itemValue) =>
                  setSelectedMetaData({
                    ...selectedMetaData,
                    isCreditAllowed: itemValue,
                  })
                }
                style={styles.picker}
              >
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>

              <Text style={styles.modalTitle}>Targets</Text>
              {(selectedMetaData?.customerTargets || []).map(
                (target, index) => (
                  <View key={index} style={styles.targetContainer}>
                    <Text style={styles.targetTitle}>
                      {target.targetType} Target
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={target.targetValue}
                      onChangeText={(text) => handleTargetChange(index, text)}
                      placeholder="Target Value"
                    />
                  </View>
                )
              )}

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => updateCustomer()}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {successDialog()}
    </View>
  );
};

const styles = {
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 100,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 3.0,
    paddingTop: Sizes.fixPadding - 5.0,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7F9",
  },
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10857F",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10, // Ensures spacing between icon & title
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%", // Ensures full width
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    margin: 10,
  },
  headingBackground: {
    width: "100%", // ✅ Ensures full width
    paddingVertical: 40,
    marginBottom: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primaryColor,
    //textAlign: "center", // ✅ Center text if needed
    backgroundColor: "transparent", // ✅ Remove solid background
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F4FF", // Lighter shade ofrgba(11, 103, 140, 0.55)
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  onboarded: {
    fontSize: 14,
    color: "gray",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 8,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.primaryColor,
    borderRadius: 10,
    alignItems: "center",
    padding: 15,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    backgroundColor: Colors.primaryColor,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    width: "100%",
  },
  businessName: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  contact: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  onboarded: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 10,
  },
  additionalInfo: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#777",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  businessName: {
    fontSize: 16,
    color: "#555",
  },
  contact: {
    fontSize: 14,
    color: "#777",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  targetContainer: {
    width: "100%", // Ensures the target inputs match the customer info width
    justifyContent: "center",
    alignItems: "center",
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%", // Updated to ensure consistent width across all inputs
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  picker: {
    width: "100%",
    height: 50,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  modalButtonCancel: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
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
    height: 60, // Increased height
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    fontSize: 18, // Slightly larger font for better visibility
    color: "#10857F",
  },
};

export default CustomerInformationScreen;
