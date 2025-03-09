import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import {
  Card,
  Button,
  TextInput,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
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
              <Card key={order.id} style={styles.orderCard}>
                <Card.Content>
                  <Text style={styles.orderTitle}>
                    🧾 Order Number: {order.orderID}
                  </Text>
                  <Divider style={styles.divider} />
                  <Text style={styles.orderText}>
                    📌 Invoice: {order.invoiceNumber}
                  </Text>
                  <Text style={[styles.orderText, styles.status]}>
                    📌 Status: {order.status}
                  </Text>
                  <Text style={styles.orderText}>
                    💰 Total Bill: ₹{order.totalBill}
                  </Text>
                  <Text style={styles.orderText}>
                    ✅ Paid Amount: ₹{order.paidAmount}
                  </Text>
                  <Text style={[styles.orderText, styles.pending]}>
                    ⚠️ Pending Amount: ₹{order.pendingAmount}
                  </Text>
                  <Text style={styles.orderText}>
                    📅 Created At: {order.createdAt.split("T")[0]}
                  </Text>
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
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#10857F",
    textAlign: "center",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  orderCard: {
    padding: 20,
    margin: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  orderText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 3,
  },
  status: {
    fontWeight: "bold",
    color: "#008000",
  },
  pending: {
    fontWeight: "bold",
    color: "#ff6347",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "#777",
    marginTop: 30,
  },
  loader: {
    marginTop: 30,
    alignSelf: "center",
  },
  divider: {
    marginVertical: 8,
    backgroundColor: "#ccc",
    height: 1,
  },
});

export default OrderInformationScreen;
