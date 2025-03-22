import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  TextInput,
  Picker,
  Dimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Card, Dialog } from "react-native-paper";
import BASE_URL from "../../constant/variable";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { AppContext } from "../context/AppProvider";

const { width } = Dimensions.get("screen");

const WalletScreen = () => {
  const navigation = useNavigation();
  const { loggedInUser } = useContext(AppContext);
  const [applicationConfig, setApplicationConfig] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [state, setState] = useState({
    showSuccessDialog: false,
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { showSuccessDialog } = state;

  useEffect(() => {
    const fetchApplicationConfig = async () => {
      console.log("inside grace period use effect");

      try {
        const response = await fetch(`${BASE_URL}/api/v1/royaltyHistory`);
        if (!response.ok) {
          throw new Error("Failed to Royalty History");
        }
        const responseData = await response.json();
        console.log("data from Royalty api is ", responseData);
        const loggedInUserId = loggedInUser.id; // Replace with actual logged-in user ID logic
        const data = responseData.filter(
          (item) => item.customerID === loggedInUserId
        );
        console.log("data from Royalty api is ", data);

        setSelectedData(data);
      } catch (error) {
        console.error("Error fetching Configurations:", error);
      }
    };

    fetchApplicationConfig();
  }, []);

  const updateConfig = async () => {
    try {
      const updatedData = JSON.stringify(editedData);
      console.log("Updated Config Data", updatedData);
      const response = await fetch(`${BASE_URL}/api/v1/applicationConfig`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: updatedData,
      });
      if (!response.ok) {
        throw new Error("Failed to update configuration");
      } else {
        setEditModalVisible(false);
        updateState({ showSuccessDialog: true });
        setTimeout(() => {
          updateState({ showSuccessDialog: false });
          navigation.push("wallet/WalletScreen");
          setEditModalVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
    }
  };

  const handleEdit = (config) => {
    setEditedData(config);
    setEditModalVisible(true);
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
            Configuration has been updated!
          </Text>
        </View>
      </Dialog>
    );
  }

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
            Wallet
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        {header()}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("home/homeScreen")}
        >
          <Text style={{ ...Fonts.whiteColor16Regular }}>Save</Text>
        </TouchableOpacity>
        <Card
          style={{
            padding: 5,
            borderRadius: 20,
            elevation: 5,
            backgroundColor: "#FFFFFF",
            margin: 10,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#10857F",
              marginBottom: 5,
              textAlign: "center",
            }}
          >
            Wallet Points
          </Text>
        </Card>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <View style={styles.container}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Date</Text>
              <Text style={styles.headerText}>Order ID</Text>
              <Text style={styles.headerText}>Received</Text>
              <Text style={styles.headerText}>Used</Text>
              <Text style={styles.headerText}>Net Balance</Text>
            </View>

            <FlatList
              data={selectedData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const overallBalance = selectedData
                  .slice(0, index + 1)
                  .reduce(
                    (sum, curr) =>
                      sum + (curr.pointsAdded - curr.pointsDeducted),
                    0
                  );

                return (
                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor:
                          index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      }, // Alternating row colors
                    ]}
                  >
                    <Text style={styles.rowText}>
                      {item.createdAt.split("T")[0]}
                    </Text>
                    <Text style={styles.rowText}>{item.orderID}</Text>
                    <Text
                      style={[
                        styles.rowText,
                        { color: "green", fontWeight: "bold" },
                      ]}
                    >
                      {item.pointsAdded}
                    </Text>
                    <Text
                      style={[
                        styles.rowText,
                        { color: "red", fontWeight: "bold" },
                      ]}
                    >
                      {item.pointsDeducted}
                    </Text>
                    <Text
                      style={[
                        styles.rowText,
                        { color: "#10857F", fontWeight: "bold" },
                      ]}
                    >
                      {overallBalance}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          <Modal visible={editModalVisible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Edit Configuration</Text>

                <TextInput
                  style={styles.input}
                  value={editedData.name}
                  editable={false}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, name: text })
                  }
                  placeholder="Name"
                />
                <TextInput
                  style={styles.input}
                  value={editedData.value}
                  onChangeText={(text) =>
                    setEditedData({
                      ...editedData,
                      value: text,
                    })
                  }
                  placeholder="Value"
                />

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => updateConfig()}
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
      </View>
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
    backgroundColor: "#fff", // Optional: Ensures a clean background
    // paddingHorizontal: 20,
  },
  headerWrapStyle: {
    backgroundColor: Colors.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
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
  container: {
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#10857F",
    padding: 10,
    borderRadius: 5,
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 2,
    borderRadius: 5,
  },
  rowText: {
    flex: 1,
    textAlign: "center",
  },
};
export default WalletScreen;
