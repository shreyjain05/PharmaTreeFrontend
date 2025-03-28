import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Modal,
} from "react-native";
import { Card, Button, TextInput, Divider, Dialog } from "react-native-paper";
import { useNavigation } from "expo-router";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { AppContext } from "../context/AppProvider";
import BASE_URL from "../../constant/variable";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("screen");

const OrderInformationScreen = () => {
  const navigation = useNavigation();
  const { isAdmin } = useContext(AppContext);
  const [orderApiData, setOrderApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerApiData, setCustomerApiData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [state, setState] = useState({
    showSuccessDialog: false,
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { showSuccessDialog } = state;
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/orders`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setOrderApiData(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("LoggedInUser in OrderScreen:", loggedInUser);
  }, [loggedInUser]);

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

  const openModal = (order) => {
    setSelectedOrder(order);
    setOrderStatus("Delivered");
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    console.log("Submitting order status update...");

    const updatedOrder = await handleStatusChange(
      selectedOrder.orderID,
      orderStatus
    );

    if (updatedOrder) {
      await updateOrder(updatedOrder); // Pass updated order directly
    }

    console.log("Order submission completed.");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log(`Changing status for Order ID: ${orderId} to "${newStatus}"`);

    // Ensure state update happens and return the updated order
    return new Promise((resolve) => {
      setOrderApiData((prevOrders) => {
        const updatedOrders = prevOrders.map((order) => {
          if (order.orderID === orderId) {
            const updatedOrder = { ...order, status: newStatus };
            console.log("Updated Order:", updatedOrder);
            resolve(updatedOrder); // Resolve with updated order
            return updatedOrder;
          }
          return order;
        });

        return updatedOrders;
      });
    });
  };

  function getOrders() {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/orders`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setOrderApiData(data); // Update the state with the fetched orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }

  const updateOrder = async (updatedOrder) => {
    try {
      console.log("Updating order:", updatedOrder);

      const response = await fetch(`${BASE_URL}/api/v1/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(
        `Order ${updatedOrder.orderID} status updated successfully to "${updatedOrder.status}"`
      );

      setModalVisible(false);
      updateState({ showSuccessDialog: true });

      setTimeout(() => {
        updateState({ showSuccessDialog: false });
        navigation.push("adminPanel/OrderInformationScreen");
      }, 2000);

      getOrders(); // Refresh data
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Query:", query);
    console.log("Order Data:", orderApiData);
    if (query) {
      const filtered = orderApiData.filter((item) =>
        item?.orderID?.toString().toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const getCustomerName = (customerID) => {
    const customer = customerApiData.find((c) => c.customerID === customerID);
    //if (customer) return customer.firstName + " " + customer.lastName;
    if (customer) {
      console.log("getCustomerName", customer);
      return customer.businessName;
    }
    return "Unknown Customer";
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
            Orders
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
            Order has been updated!
          </Text>
        </View>
      </Dialog>
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
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      {/* Inventory Information Header */}
      <Card style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>Order Information</Text>
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
            placeholder="Search Orders" // Use placeholder instead of label
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
        {(filteredData.length > 0 ? filteredData : orderApiData).map(
          (order) => (
            <Card key={order.orderID} style={styles.card}>
              <Card.Content>
                <Text style={styles.orderTitle}>
                  <MaterialIcons name="receipt" size={20} color="#007bff" />{" "}
                  Order Number: {order.orderID}
                </Text>
                <Divider style={styles.divider} />

                <View style={styles.infoContainer}>
                  <View style={styles.row}>
                    <FontAwesome5 name="user" size={18} color="#555" />
                    <Text style={styles.orderText}>
                      Customer: {getCustomerName(order.customerID)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Entypo name="text-document" size={18} color="#555" />
                    <Text style={styles.orderText}>
                      Invoice: {order.invoiceNumber}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Ionicons
                      name="information-circle"
                      size={18}
                      color="#555"
                    />
                    <Text style={[styles.orderText]}>
                      Status: {order.status}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <FontAwesome5 name="rupee-sign" size={16} color="#28a745" />
                    <Text style={styles.orderText}>
                      Total Bill: ₹{order.totalBill}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <FontAwesome5 name="check-circle" size={18} color="green" />
                    <Text style={styles.orderText}>
                      Paid Amount: ₹{order.paidAmount}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <MaterialIcons name="warning" size={18} color="orange" />
                    <Text style={[styles.orderText, styles.pending]}>
                      Pending Amount: ₹{order.pendingAmount}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <FontAwesome5 name="calendar-alt" size={18} color="#555" />
                    <Text style={styles.orderText}>
                      Created At: {order.createdAt.split("T")[0]}
                    </Text>
                  </View>
                </View>

                <Button
                  mode="contained"
                  onPress={() => Linking.openURL(order.invoicePDFLink)}
                  style={styles.pdfButton}
                  icon="file-pdf-box"
                >
                  Open Invoice
                </Button>
                <Button
                  mode="contained"
                  onPress={() => openModal(order)}
                  style={styles.updateButton}
                >
                  Update Order Status
                </Button>
              </Card.Content>
            </Card>
          )
        )}

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Order Status</Text>
              <Text style={styles.modalText}>
                Order ID: {selectedOrder?.orderID}
              </Text>
              <Picker
                selectedValue={orderStatus}
                onValueChange={(itemValue) => setOrderStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Dispatched" value="Dispatched" />
                <Picker.Item label="Delivered" value="Delivered" />
              </Picker>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setModalVisible(false)}
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

const styles = StyleSheet.create({
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 100,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 3.0,
    paddingTop: Sizes.fixPadding - 5.0,
    alignSelf: "center",
  },
  headerWrapStyle: {
    backgroundColor: Colors.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
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
  header: {
    backgroundColor: "#0B678C",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 15,
  },
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
  },
  orderTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  divider: { marginVertical: 10 },
  infoContainer: { marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  orderText: { marginLeft: 10, fontSize: 16 },
  pdfButton: { marginTop: 10, backgroundColor: "#10857F" },
  updateButton: { marginTop: 10, backgroundColor: "#10857F" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalText: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  picker: { width: "100%", height: 50, fontSize: 18 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButtonContainer: {
    marginTop: 20,
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
});

export default OrderInformationScreen;
