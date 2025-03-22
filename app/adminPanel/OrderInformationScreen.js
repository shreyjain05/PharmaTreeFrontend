import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import {
  Card,
  Button,
  TextInput,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation } from "expo-router";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import { AppContext } from "../context/AppProvider";
import BASE_URL from "../../constant/variable";
import { Colors, Fonts, Sizes } from "../../constant/styles";

const { width } = Dimensions.get("screen");

const OrderInformationScreen = () => {
  const navigation = useNavigation();
  const { isAdmin } = useContext(AppContext);
  const [orderApiData, setOrderApiData] = useState([]);
  const [loading, setLoading] = useState(true);

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
            Order Information
          </Text>
        </Card>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {orderApiData.length > 0 ? (
            orderApiData.map((order) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.orderTitle}>
                    <MaterialIcons name="receipt" size={20} color="#007bff" />{" "}
                    Order Number: {order.orderID}
                  </Text>
                  <Divider style={styles.divider} />

                  {/* Order Details */}
                  <View style={styles.infoContainer}>
                    <View style={styles.row}>
                      <FontAwesome5 name="user" size={18} color="#555" />
                      <Text style={styles.orderText}>
                        Customer: {order.customerID}
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
                      <Text style={[styles.orderText, styles.status]}>
                        Status: {order.status}
                      </Text>
                    </View>

                    <View style={styles.row}>
                      <FontAwesome5
                        name="rupee-sign"
                        size={16}
                        color="#28a745"
                      />
                      <Text style={styles.orderText}>
                        Total Bill: ₹{order.totalBill}
                      </Text>
                    </View>

                    <View style={styles.row}>
                      <FontAwesome5
                        name="check-circle"
                        size={18}
                        color="green"
                      />
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
                      <FontAwesome5
                        name="calendar-alt"
                        size={18}
                        color="#555"
                      />
                      <Text style={styles.orderText}>
                        Created At: {order.createdAt.split("T")[0]}
                      </Text>
                    </View>
                  </View>

                  {/* Open PDF Button */}
                  <Button
                    mode="contained"
                    onPress={() => Linking.openURL(order.invoicePDFLink)}
                    style={styles.pdfButton}
                    icon="file-pdf-box"
                  >
                    Open Invoice
                  </Button>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.noDataText}>No orders found</Text>
          )}
        </ScrollView>
      </View>
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
  container: {
    flex: 1,
    backgroundColor: "#fff", // Optional: Ensures a clean background
    // paddingHorizontal: 20,
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
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  divider: {
    marginVertical: 8,
  },
  infoContainer: {
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  orderText: {
    fontSize: 16,
    color: "#444",
    marginLeft: 8,
  },
  status: {
    fontWeight: "bold",
    color: "#007bff",
  },
  pending: {
    fontWeight: "bold",
    color: "red",
  },
  pdfButton: {
    marginTop: 12,
    backgroundColor: "#10857F",
  },
});

export default OrderInformationScreen;
