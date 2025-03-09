import React, { useState, useContext, useEffect, updateState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert,
  Image,
  Button,
  FlatList,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { TextInput } from "react-native-paper";
import { useNavigation } from "expo-router";
import {
  User,
  ChevronRight,
  ListChecks,
  PlusCircle,
  Upload,
  CreditCard,
  FileText,
  Package,
  Percent,
  CreditCardIcon,
  Info,
  Clock,
  Target,
} from "lucide-react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AppContext } from "../context/AppProvider";
import BASE_URL from "../../constant/variable";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from "@expo/vector-icons";
import { Card, Dialog } from "react-native-paper";
import { CheckCircle, XCircle, Search } from "lucide-react";

const { width } = Dimensions.get("screen");

const OrderStatusChangeScreen = () => {
  const navigation = useNavigation();
  const { isAdmin } = useContext(AppContext);

  console.log("Is user Admin :", isAdmin);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

  const showFromDatePicker = () => setFromDatePickerVisibility(true);
  const hideFromDatePicker = () => setFromDatePickerVisibility(false);

  const showToDatePicker = () => setToDatePickerVisibility(true);
  const hideToDatePicker = () => setToDatePickerVisibility(false);

  const [orderApiData, setOrderApiData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const handleConfirmFromDate = (date) => {
    setFromDate(date.toISOString().split("T")[0]);
    hideFromDatePicker();
  };

  const handleConfirmToDate = (date) => {
    setToDate(date.toISOString().split("T")[0]);
    hideToDatePicker();
  };

  const [orders, setOrders] = useState([]);

  const [state, setState] = useState({
    showSuccessDialog: false,
    logout: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { showSuccessDialog, logout } = state;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/orders`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data); // Update the state with the fetched orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []); // Runs only once

  function getOrders() {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/orders`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data); // Update the state with the fetched orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleSubmit = (orderId) => {
    const updatedOrder = orders.find((order) => order.id === orderId);

    // Here, you can send an API request to update the order status in the backend
    const fetchOrders = async () => {
      try {
        const updateResponse = await fetch(`${BASE_URL}/api/v1/orders`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder),
        });
        if (!updateResponse.ok) {
          throw new Error(`HTTP error! Status: ${updateResponse.status}`);
        }
        const data = await updateResponse.json();
        console.log(
          "Status Updated",
          `Order ${updatedOrder.orderID} is now ${updatedOrder.status}`
        );
        Alert.alert(
          "Status Updated",
          `Order ${updatedOrder.orderID} is now ${updatedOrder.status}`
        );
        updateState({ showSuccessDialog: true });
        setTimeout(() => {
          updateState({ showSuccessDialog: false });
          navigation.push("/DrugLicenseApprovalScreen");
        }, 2000);
        getOrders(); // Update the state with the fetched orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  };

  function adminPanelButton(title, icon, screenName) {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.push(screenName)}
        style={styles.adminPanelButtonStyle}
      >
        {/* {icon}
                <Text style={{ ...Fonts.primaryColor19Medium, marginLeft: 10 }}>
                    {title}
                </Text>
                */}
        {/* Left Arrow Icon */}

        {/* Icon inside Circle */}
        <View style={styles.iconContainer}>{icon}</View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        <ChevronRight size={24} color="#0B678C" style={styles.leftArrow} />

        {/* Bottom Separator */}
        <View style={styles.separator} />
      </TouchableOpacity>
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
            📅 Order Status Change
          </Text>
        </Card>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ddd",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  margin: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FontAwesome
                    name="list-alt"
                    size={24}
                    color="#4CAF50"
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Order: {item.orderID}
                    </Text>
                    <Text style={{ fontSize: 16, color: "#666" }}>
                      Current Status: {item.status}
                    </Text>
                  </View>
                </View>

                {/* Status Dropdown */}
                <Picker
                  selectedValue={item.status}
                  style={{
                    height: 40,
                    width: "100%",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                  onValueChange={(value) => handleStatusChange(item.id, value)}
                >
                  <Picker.Item label="Invoiced" value="Invoiced" />
                  <Picker.Item
                    label="Dispatched/Picked-up"
                    value="Dispatched/Picked-up"
                  />
                  <Picker.Item label="Delivered" value="Delivered" />
                </Picker>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={() => handleSubmit(item.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#10857F",
                    padding: 12,
                    borderRadius: 10,
                    flex: 1,
                    marginLeft: 5,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                    Update Order
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </ScrollView>
      </View>
      {successDialog()}
    </View>
  );

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
            Drug License Status has been updated!
          </Text>
        </View>
      </Dialog>
    );
  }

  function activeOrderButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.push("activeOrders/activeOrdersScreen")}
        style={styles.activeOrderButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor19Medium }}>Active Orders</Text>
      </TouchableOpacity>
    );
  }

  function nameAndMobileNumberInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingVertical: Sizes.fixPadding * 2.0,
        }}
      >
        {nameTextField()}
        {mobileNumberTextField()}
      </View>
    );
  }

  function mobileNumberTextField() {
    return (
      <TextInput
        label="Mobile Number"
        value={mobileNumber}
        onChangeText={(text) => updateState({ mobileNumber: text })}
        mode="outlined"
        style={{
          height: 50.0,
          ...Fonts.primaryColor17Medium,
          backgroundColor: Colors.whiteColor,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
        outlineColor={Colors.grayColor}
        selectionColor={Colors.primaryColor}
        theme={{
          colors: { primary: Colors.primaryColor, underlineColor: "#C5C5C5" },
        }}
        keyboardType="phone-pad"
      />
    );
  }

  function nameTextField() {
    return (
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={(text) => updateState({ name: text })}
        style={{
          height: 50.0,
          ...Fonts.primaryColor17Medium,
          backgroundColor: Colors.whiteColor,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding,
        }}
        outlineColor={Colors.grayColor}
        selectionColor={Colors.primaryColor}
        theme={{
          colors: { primary: Colors.primaryColor, underlineColor: "#C5C5C5" },
        }}
      />
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
            Order Status Change
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
};

const ApprovalCard = ({ imageUri, onAccept, onReject }) => {
  const [status, setStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAccept = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to accept the license?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            onAccept();
            setStatus("accepted");
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to reject the license?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            onReject();
            setStatus("rejected");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.description}>Click to show full image</Text>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: imageUri }} style={styles.largeImage} />
          </View>
        </TouchableOpacity>
      </Modal>
      {status === null ? (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleAccept}>
            <Text style={styles.buttonText}>✔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleReject}>
            <Text style={styles.buttonText}>✖</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.statusText}>
          {status === "accepted" ? "Accepted License" : "Rejected License"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    backgroundColor: Colors.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  activeOrderButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding,
    margin: Sizes.fixPadding * 2.0,
  },
  logoutButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Sizes.fixPadding * 2.0,
  },
  cancelButtonStyle: {
    backgroundColor: "#E0E0E0",
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1.0,
    marginRight: Sizes.fixPadding,
  },
  dialogLogoutButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1.0,
    marginLeft: Sizes.fixPadding,
  },
  logoutDialogWrapStyle: {
    width: width - 80.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    padding: Sizes.fixPadding * 2.0,
    alignSelf: "center",
  },
  animatedView: {
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff", // Optional: Ensures a clean background
    // paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0B678C",
    textAlign: "left", // Change to "center" if needed
    // marginVertical: 30,
    backgroundColor: "#E0F4FF",
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginBottom: 10,
  },
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 100,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 3.0,
    paddingTop: Sizes.fixPadding - 5.0,
    alignSelf: "center",
  },
  adminPanelButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  leftArrow: {
    marginRight: 10, // Spacing between arrow and icon
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F4FF", // Lighter shade of #0B678C
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 19,
    color: "#0B678C",
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc", // Light grey separator
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 20,
  },
});

export default OrderStatusChangeScreen;
