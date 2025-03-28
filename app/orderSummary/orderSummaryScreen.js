import React, { useState, createContext, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import DashedLine from "react-native-dashed-line";
import { TextInput } from "react-native-paper";
import MyStatusBar from "../../component/myStatusBar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { AppContext } from "../context/AppProvider";
import { Calendar } from "react-native-calendars";
import BASE_URL from "../../constant/variable";
import { Switch, RadioButton } from "react-native-paper";
import { Wallet } from "lucide-react-native";

const { width, height } = Dimensions.get("screen");

const someTermsAndConditionsList = [];

const cartList = [];

const orderSummaryScreen = () => {
  const navigation = useNavigation();
  const { loggedInUser } = useContext(AppContext);
  const [applicationConfig, setApplicationConfig] = useState([]);
  const [userRoyalty, setUserRoyalty] = useState("");
  const [applicationPromo, setApplicationPromo] = useState([]);

  console.log("user information: " + JSON.stringify(loggedInUser));

  const { shoppingList, setShoppingList } = useContext(AppContext);

  useEffect(() => {
    const fetchApplicationConfig = async () => {
      console.log("inside grace period use effect");

      try {
        const response = await fetch(`${BASE_URL}/api/v1/promotions`);
        if (!response.ok) {
          throw new Error("Failed to promotions");
        }
        const responseData = await response.json();
        console.log("data from promotions api is ", responseData);
        setApplicationPromo(responseData);
      } catch (error) {
        console.error("Error fetching Configurations:", error);
      }
    };

    fetchApplicationConfig();
  }, []);

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
        const overallBalance = data.reduce(
          (sum, item) =>
            sum +
            parseInt(item.pointsAdded, 10) -
            parseInt(item.pointsDeducted, 10),
          0
        );
        console.log("Overall Balance:", overallBalance);
        setUserRoyalty(overallBalance);
      } catch (error) {
        console.error("Error fetching Configurations:", error);
      }
    };

    fetchApplicationConfig();
  }, []);

  useEffect(() => {
    const fetchApplicationConfig = async () => {
      console.log("inside grace period use effect");

      try {
        const response = await fetch(`${BASE_URL}/api/v1/applicationConfig`);
        if (!response.ok) {
          throw new Error("Failed to fetch Configurations");
        }
        const data = await response.json();
        console.log("data from config api is ", data);

        // Transform API response to match DropDownPicker format
        const appConfig = data.map((config) => ({
          id: config.id,
          name: config.name,
          value: config.value, // Ensure value is a string
        }));

        console.log("Configs", appConfig);
        setApplicationConfig(appConfig);
      } catch (error) {
        console.error("Error fetching Configurations:", error);
      }
    };

    fetchApplicationConfig();
  }, []);

  useEffect(() => {
    console.log("shoppingList in description:", shoppingList);
  }, [shoppingList]);

  const getFreeQuantity = (item) => {
    console.log("Checking promo for:", item.name);
    for (const promo of applicationPromo) {
      if (promo.promotionDetails.productName === item.name) {
        console.log("Found promo for:", item.name);
        return parseInt(promo.promotionDetails.freeQuantity, 10) || null;
      }
    }
    return null;
  };

  const submitOrder = async () => {
    console.log("Sending order");
    try {
      let totalAmount = total() - discountAmount() - userRoyalty;
      const orderPayload = {
        customerID: loggedInUser?.id || "1",
        totalItems: cartItems.length.toString(),
        billAmount: totalAmount.toString(),
        totalCGST: "0", // Adjust as per actual calculation
        totalSGST: "0", // Adjust as per actual calculation
        totalBill: totalAmount.toString(), // Adjusting total calculation
        discount: "0", // Modify based on actual discounts
        paidAmount: "0",
        pendingAmount: totalAmount.toString(),
        onBehalf: "onBehalf",
        deliveryAddress:
          loggedInUser?.addresses[0]?.addressLine1 ||
          "deliveryAddress_5f4cae7cc705",
        orderItems: cartItems.map((item) => ({
          productName: item.name,
          productID: item.id.toString(),
          quantity: item.qty.toString(),
          billAmount: (item.qty * item.price).toString(),
          itemCGST: "0", // Adjust as per actual item CGST
          itemSGST: "0", // Adjust as per actual item SGST
          itemBill: (item.qty * item.price).toString(), // Adjust as needed
          discount: "0", // Modify based on actual discounts
          batch: item.batch,
        })),
      };

      console.log("Submitting order:", JSON.stringify(orderPayload, null, 2));

      const response = await fetch(`${BASE_URL}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(`Order submitted successfully!`);
      navigation.push("(tabs)");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  // Assuming `openedProduct` is passed via navigation params
  var { selectedInventory } = useLocalSearchParams();
  selectedInventory = shoppingList;
  //cartList = [...cartList, ...selectedInventory];
  console.log("Received the products as:" + JSON.stringify(selectedInventory));

  const [state, setState] = useState({
    quantityDialog: false,
    currentQuantity: null,
    //cartItems: cartList,
    cartItems: selectedInventory,
    currentItemId: "",
    deliveryCharge: 5,
    deleteDialog: false,
    showBootomSheet: false,
    discount: JSON.parse(loggedInUser.metaData).customerDiscount,
    isCreditAllowed: JSON.parse(loggedInUser.metaData).isCreditAllowed,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const {
    quantityDialog,
    currentQuantity,
    cartItems,
    currentItemId,
    deliveryCharge,
    deleteDialog,
    showBootomSheet,
    discount,
    isCreditAllowed,
  } = state;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      {header()}
      {cartItems.length == 0 ? (
        <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
          <View
            style={{
              backgroundColor: Colors.primaryColor,
              paddingVertical: Sizes.fixPadding * 4.0,
              paddingHorizontal: Sizes.fixPadding,
            }}
          >
            {offersProductsAndReturnsInfo()}
            {searchInfo()}
          </View>
          {emptyCartInfo()}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 17.0 }}
          >
            {cartItemsInfo()}
            {/* {addMoreItemsInfo()} */}
            {amountInfo()}
            {paymentCalendar()}

            <View style={{ marginTop: Sizes.fixPadding * 1.0 }}>
              {deliverdAddressAndPaymentInfo()}
            </View>
          </ScrollView>
        </View>
      )}
      {deleteItemDialog()}
    </View>
  );

  function emptyCartInfo() {
    return (
      <View>
        <Text style={styles.emptyCartTextStyle}>{"Your Cart is\n Empty"}</Text>
        <Image
          source={require("../../assets/images/empty_cart.png")}
          style={styles.emptyCartImageStyle}
          resizeMode="contain"
        />
      </View>
    );
  }

  function searchInfo() {
    return (
      <View>
        <Text style={{ ...Fonts.whiteColor16Medium }}>
          Search medicines/healthcare products
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.push("search/searchScreen")}
          style={styles.searchButtonStyle}
        >
          <MaterialIcons name="search" size={22} color={Colors.primaryColor} />
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.primaryColor18Medium,
              marginLeft: Sizes.fixPadding,
              flex: 1,
            }}
          >
            Search medicines/healthcare products
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function offersProductsAndReturnsInfo() {
    return (
      <View style={styles.offersProductsAndReturnsInfoWrapStyle}>
        {offersProductsAndReturns({
          icon: (
            <MaterialCommunityIcons
              name="tag"
              size={18}
              color={Colors.whiteColor}
            />
          ),
          description: "Flat \n15% Off",
        })}
        {offersProductsAndReturns({
          icon: (
            <MaterialIcons
              name="security"
              size={18}
              color={Colors.whiteColor}
            />
          ),
          description: "1 Lakh+\n Products",
        })}
        {offersProductsAndReturns({
          icon: (
            <MaterialCommunityIcons
              name="layers-outline"
              size={20}
              color={Colors.whiteColor}
            />
          ),
          description: "Easy \nReturns",
        })}
      </View>
    );
  }

  function offersProductsAndReturns({ icon, description }) {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={styles.offersProductsAndReturnsIconWrapStyle}>{icon}</View>
        <Text
          style={{
            lineHeight: 23.0,
            ...Fonts.whiteColor16Regular,
            marginLeft: Sizes.fixPadding,
          }}
        >
          {description}
        </Text>
      </View>
    );
  }

  function deleteItemDialog() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteDialog}
        onRequestClose={() => {
          updateState({ deleteDialog: false });
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            updateState({ deleteDialog: false });
          }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "center", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={styles.deleteDialogStyle}
            >
              <Text
                style={{
                  textAlign: "center",
                  ...Fonts.blackColor19Medium,
                  paddingBottom: Sizes.fixPadding + 10.0,
                }}
              >
                Delete cart item?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: Sizes.fixPadding * 2.0,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => updateState({ deleteDialog: false })}
                  style={styles.noButtonStyle}
                >
                  <Text style={{ ...Fonts.primaryColor18Medium }}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    removeItem();
                    updateState({ deleteDialog: false });
                  }}
                  style={styles.yesButtonStyle}
                >
                  <Text style={{ ...Fonts.whiteColor18Medium }}>Yes</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function getAmount() {}

  function getConfig() {
    const gracePeriodConfig = applicationConfig.find(
      (config) => config.name === "Grace Period"
    );
    return gracePeriodConfig ? gracePeriodConfig.value : "30";
  }

  function deliverdAddressAndPaymentInfo() {
    const [payNow, setPayNow] = useState(true);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState("full");
    console.log("Customer Credit is allowed: ", isCreditAllowed);

    const totalAmount = total() - discountAmount() - userRoyalty;
    const payableAmount =
      selectedPaymentOption === "50"
        ? Math.round(totalAmount * 0.5)
        : selectedPaymentOption === "70"
        ? Math.round(totalAmount * 0.7)
        : totalAmount; // Full amount by default

    // Determine if Pay Later is allowed
    const allowPayLater = isCreditAllowed === "Yes" && totalAmount > 4000;

    // Adjust payment options based on credit and amount constraints
    const availablePaymentOptions =
      totalAmount < 4000 || isCreditAllowed !== "Yes"
        ? ["cod", "full"]
        : ["cod", "50", "70", "full"];

    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Toggle for Pay Now / Pay Later */}
        {allowPayLater && (
          <View style={styles.paymentToggleContainer}>
            <Text style={{ ...Fonts.primaryColor18Medium }}>Pay Later</Text>
            <Switch
              value={payNow}
              onValueChange={() => setPayNow(!payNow)}
              thumbColor="#10857F"
              trackColor={{ true: "#10857F" }}
            />
            <Text style={{ ...Fonts.primaryColor18Medium }}>Pay Now</Text>
          </View>
        )}

        {/* Payment Options (Shown only when Pay Now is selected) */}
        {payNow && (
          <View style={styles.radioButtonContainer}>
            <Text style={{ ...Fonts.primaryColor18Medium }}>
              Select Payment Option
            </Text>
            <RadioButton.Group
              onValueChange={(newValue) => setSelectedPaymentOption(newValue)}
              value={selectedPaymentOption}
            >
              {availablePaymentOptions.includes("cod") && (
                <View style={styles.radioButton}>
                  <RadioButton value="cod" color="#10857F" />
                  <Text>Cash on Delivery</Text>
                </View>
              )}
              {availablePaymentOptions.includes("50") && (
                <View style={styles.radioButton}>
                  <RadioButton value="50" color="#10857F" />
                  <Text>50% (₹{Math.round(totalAmount * 0.5)})</Text>
                </View>
              )}
              {availablePaymentOptions.includes("70") && (
                <View style={styles.radioButton}>
                  <RadioButton value="70" color="#10857F" />
                  <Text>70% (₹{Math.round(totalAmount * 0.7)})</Text>
                </View>
              )}
              {availablePaymentOptions.includes("full") && (
                <View style={styles.radioButton}>
                  <RadioButton value="full" color="#10857F" />
                  <Text>Full Amount (₹{totalAmount})</Text>
                </View>
              )}
            </RadioButton.Group>
          </View>
        )}

        {/* Total Amount & Payment Buttons */}
        <View style={styles.totalAmountContainer}>
          <Text style={{ ...Fonts.primaryColor25Medium }}>
            ₹{payNow ? payableAmount : totalAmount}
          </Text>

          {/* Show only "Submit Order" if Pay Later is selected */}
          {!payNow ? (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.cashOnDeliveryButtonStyle}
              onPress={() => submitOrder()}
            >
              <Text style={{ ...Fonts.whiteColor19Medium }}>Submit Order</Text>
            </TouchableOpacity>
          ) : selectedPaymentOption === "cod" ? (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.cashOnDeliveryButtonStyle}
              onPress={() => submitOrder()}
            >
              <Text style={{ ...Fonts.whiteColor19Medium }}>Submit Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.proceedToPaymentButtonStyle}
              onPress={() => console.log("Proceeding to Payment")}
            >
              <Text style={{ ...Fonts.whiteColor19Medium }}>
                Proceed to Payment
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  function totalAmountAndPaymentButton() {
    return (
      <View style={styles.totalAmountAndPaymentButtonWrapStyle}>
        <Text
          style={{
            ...Fonts.primaryColor25Medium,
            paddingLeft: Sizes.fixPadding * 5.0,
            paddingRight: Sizes.fixPadding * 4.0,
          }}
        >
          ₹{total()}
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            //navigation.push("payment/paymentScreen", {
            //  selectedInventory: JSON.stringify(cartList),
            //})
          }}
          style={styles.proceedToPaymentButtonStyle}
        >
          <Text style={{ ...Fonts.whiteColor19Medium }}>
            Proceed to Payment
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function deliveredAddresInfo() {
    return (
      <View style={styles.deliveredAddresInfoWrapStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.deliveredAddressIconStye}>
            <Image
              source={require("../../assets/images/icons/icon_9.png")}
              style={{ height: 50.0, width: 50.0 }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  width: width - 190.0,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      ...Fonts.primaryColor17Regular,
                    }}
                  >
                    Deliver to
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: Sizes.fixPadding,
                      ...Fonts.primaryColor18Medium,
                    }}
                  >
                    Home (10001)
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() =>
                  navigation.push("selectAddress/selectAddressScreen")
                }
              >
                <Text style={{ ...Fonts.primaryColor20Medium }}>CHANGE</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ ...Fonts.primaryColor18Medium }}>
              {getAddress()}
            </Text>
            <Text style={{ ...Fonts.primaryColor18Medium }}>
              {getAddressState()}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function total() {
    const total = cartItems.reduce((sum, i) => {
      return (sum += i.qty * i.price);
    }, 0);
    return total;
  }

  function discountAmount() {
    const total = cartItems.reduce((sum, i) => {
      return (sum += i.qty * i.price);
    }, 0);
    return (total * discount) / 100;
  }

  function getAddress() {
    return (
      loggedInUser.addresses[0].addressLine1 +
      ",\n" +
      loggedInUser.addresses[0].addressLine2
    );
  }

  function getAddressState() {
    return (
      loggedInUser.addresses[0].city +
      "\n" +
      loggedInUser.addresses[0].state +
      " ," +
      loggedInUser.addresses[0].pinCode
    );
  }

  function amountInfo() {
    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ ...Fonts.primaryColor18Regular }}>Cart Value</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ ...Fonts.primaryColor19Medium }}>₹{total()}</Text>
          </View>
        </View>
        {discount > 0 && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ ...Fonts.primaryColor18Regular }}>
              Customer Discount ({discount}%)
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ ...Fonts.primaryColor19Medium }}>
                ₹{discountAmount()}
              </Text>
            </View>
          </View>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ ...Fonts.primaryColor18Regular }}>Wallet Amount</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ ...Fonts.primaryColor19Medium }}>
              ₹{userRoyalty}
            </Text>
          </View>
        </View>
        <DashedLine
          dashLength={5}
          dashThickness={2}
          dashGap={3}
          dashColor="rgba(0, 150, 136, 0.5)"
        />
        <View
          style={{
            flexDirection: "row",
            paddingVertical: Sizes.fixPadding - 5.0,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.primaryColor19Medium }}>
            Amount to be paid
          </Text>
          <Text style={{ ...Fonts.primaryColor19Medium }}>
            ₹{total() - discountAmount() - userRoyalty}
          </Text>
        </View>
      </View>
    );
  }

  function cartItemsInfo() {
    const styles = {
      cardContainer: {
        marginVertical: 10,
        marginHorizontal: 20,
      },
      card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        elevation: 5, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: "center",
      },
      productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
      },
      contentContainer: {
        flex: 1,
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      },
      label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#10857F",
      },
      value: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#10857F",
      },
    };

    return (
      <View>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cardContainer}>
            <View style={styles.card}>
              {/* Image Column: Spans all rows, aligns with content height */}
              <Image
                source={
                  item.image
                    ? { uri: item.image }
                    : require("../../assets/images/defaultProduct.png")
                }
                style={styles.productImage}
                resizeMode="contain"
              />

              {/* Content Section */}
              <View style={styles.contentContainer}>
                {/* Name and Price Row */}
                <View style={styles.row}>
                  <Text style={styles.label}>{item.name}</Text>
                  <Text style={styles.value}>₹{item.price}</Text>
                </View>
                {/* CGST Row */}
                <View style={styles.row}>
                  <Text style={styles.label}>CGST</Text>
                  <Text style={styles.value}>₹0</Text>
                </View>
                {/* SGST Row */}
                <View style={styles.row}>
                  <Text style={styles.label}>SGST</Text>
                  <Text style={styles.value}>₹0</Text>
                </View>
                {/* Quantity Row */}
                <View style={styles.row}>
                  <Text style={styles.label}>Qty</Text>
                  <Text style={styles.value}>{item.qty}</Text>
                </View>

                {getFreeQuantity(item) !== null && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Free Qty</Text>
                    <Text style={styles.value}>{getFreeQuantity(item)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  function removeItem() {
    let filterArray = cartItems.filter((val, i) => {
      if (val.id !== currentItemId) {
        return val;
      }
    });
    updateState({ cartItems: filterArray });
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
            Order Summary
          </Text>
        </View>
      </View>
    );
  }

  function paymentCalendar() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Generate dummy payment data for all days in February
    const getPayments = () => {
      let payments = {};
      //console.log("Todays date", today);

      var currentAmount = total() - discountAmount() - userRoyalty;
      var discount = currentAmount * 0.05;
      var graceDays = parseInt(getConfig());
      //console.log("Grace Days", graceDays);
      var increment = Math.round(discount / graceDays);

      for (let i = 0; i <= 45; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const day = date.toISOString().split("T")[0]; // Format single digits with 0
        //payments[ `2025-02-${day.toString().padStart(2, '0')}`] = Math.floor(Math.random() * 2000) + 500; // Random amounts from ₹500 to ₹2500
        if (i === 0) {
          payments[day] = currentAmount;
        } else {
          currentAmount = currentAmount + increment;
          payments[day] = currentAmount;
        } // Random amounts from ₹500 to ₹2500
      }
      return payments;
    };

    return (
      <View style={calenStyles.container}>
        <Calendar
          current={today} // Start from today's date
          disableAllTouchEventsForDisabledDays={true} // Disable all dates except today
          dayComponent={({ date }) => {
            const isToday = date.dateString === today;
            const amount = getPayments()[date.dateString];

            return (
              <TouchableOpacity
                disabled={!isToday} // Only allow clicking on today's date
                style={[
                  calenStyles.dayContainer,
                  isToday
                    ? calenStyles.todayContainer
                    : calenStyles.disabledContainer, // Highlight today & grey out others
                ]}
              >
                <Text
                  style={[
                    calenStyles.dateText,
                    !isToday && calenStyles.disabledText, // Grey out text for non-today dates
                  ]}
                >
                  {date.day}
                </Text>
                {amount && (
                  <Text style={calenStyles.paymentText}>₹{amount}</Text>
                )}
              </TouchableOpacity>
            );
          }}
          markedDates={{
            [today]: {
              selected: true,
              selectedColor: "blue",
              selectedTextColor: "white",
            },
          }}
        />
      </View>
    );
  }
};

const calenStyles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  dayContainer: { alignItems: "center", justifyContent: "center", padding: 5 },
  todayContainer: { backgroundColor: "#ADD8E6", borderRadius: 5, padding: 5 }, // Highlight today
  disabledContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 5,
  }, // Grey out others
  dateText: { fontSize: 16, fontWeight: "bold", color: "black" },
  disabledText: { color: "gray" }, // Grey out non-today dates
  paymentText: { fontSize: 12, color: "green", marginTop: 2 },
});

const styles = StyleSheet.create({
  headerWrapStyle: {
    backgroundColor: Colors.primaryColor,
    height: 56.0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: Sizes.fixPadding * 2.0,
    paddingRight: Sizes.fixPadding,
  },
  offerWrapStyle: {
    backgroundColor: Colors.redColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 6.0,
    paddingHorizontal: Sizes.fixPadding - 4.0,
  },
  quantityCountWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 8.0,
  },
  freeDeliveryInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 4.0,
  },
  freeDeliveryInfoStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.grayColor,
    borderStyle: "dashed",
    borderRadius: Sizes.fixPadding,
    borderWidth: 1.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding - 5.0,
  },
  selectedQuantityWrapStyle: {
    paddingVertical: Sizes.fixPadding - 5.0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding + 2.0,
  },
  doneIconWrapStyle: {
    width: 25.0,
    height: 25.0,
    borderRadius: 12.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.redColor,
  },
  selectQuantityTitleStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: Sizes.fixPadding * 2.0,
  },
  selectQuantityModelStyle: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.50)",
    alignItems: "center",
    justifyContent: "center",
  },
  addMoreItemsInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginTop: Sizes.fixPadding,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Sizes.fixPadding * 2.0,
  },
  addIconWrapStyle: {
    width: 30.0,
    height: 30.0,
    borderRadius: 15.0,
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  handPickedItemsInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: "rgba(0, 150, 136, 0.3)",
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    marginRight: Sizes.fixPadding * 2.0,
    width: 190.0,
    height: 180.0,
    alignItems: "center",
    justifyContent: "center",
  },
  percentageOffWrapStyle: {
    position: "absolute",
    left: -0.6,
    top: -0.5,
    backgroundColor: Colors.redColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding - 4.0,
  },
  applyCouponWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding + 2.0,
  },
  deliveryAndPaymentInfoWrapStyle: {
    position: "absolute",
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
  },
  totalAmountAndPaymentButtonWrapStyle: {
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    alignItems: "center",
  },
  proceedToPaymentButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  deliveredAddresInfoWrapStyle: {
    backgroundColor: "#EEEEEE",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding - 5.0,
  },
  deliveredAddressIconStye: {
    height: 80.0,
    backgroundColor: Colors.whiteColor,
    width: 80.0,
    borderRadius: 40.0,
    alignItems: "center",
    justifyContent: "center",
  },
  someTermsAndConditionsWrapStyle: {
    marginVertical: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    alignSelf: "flex-start",
    paddingVertical: Sizes.fixPadding * 2.0,
  },
  termsAndConditionBulletStyle: {
    marginTop: Sizes.fixPadding - 6.0,
    width: 8.0,
    alignSelf: "flex-start",
    height: 8.0,
    borderRadius: 4.0,
    backgroundColor: Colors.primaryColor,
  },
  additionalNotesInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginTop: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding + 5.0,
  },
  totalSavingInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingTop: Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  totalSavingInfoStyle: {
    backgroundColor: Colors.bodyBackColor,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderStyle: "dashed",
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
  },
  dollarIconWrapStyle: {
    width: 30.0,
    height: 30.0,
    borderRadius: 15.0,
    backgroundColor: Colors.orangeColor,
    alignItems: "center",
    justifyContent: "center",
  },
  noButtonStyle: {
    backgroundColor: "#E0E0E0",
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1.0,
    marginRight: Sizes.fixPadding,
  },
  yesButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1.0,
    marginLeft: Sizes.fixPadding,
  },
  deleteDialogWrapStyle: {
    width: width - 80.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  offersProductsAndReturnsIconWrapStyle: {
    width: 32.0,
    height: 32.0,
    borderRadius: 16.0,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.whiteColor,
    borderWidth: 1.0,
  },
  offersProductsAndReturnsInfoWrapStyle: {
    flexDirection: "row",
    borderColor: Colors.whiteColor,
    borderStyle: "dashed",
    borderRadius: Sizes.fixPadding,
    borderWidth: 1.0,
    justifyContent: "space-evenly",
    paddingVertical: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  searchButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 1.0,
    marginTop: Sizes.fixPadding,
  },
  emptyCartImageStyle: {
    alignSelf: "flex-end",
    marginRight: Sizes.fixPadding * 2.0,
    width: 140.0,
    height: 140.0,
    marginTop: Sizes.fixPadding - 30.0,
  },
  emptyCartTextStyle: {
    paddingTop: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    ...Fonts.primaryColor25Medium,
    lineHeight: 25.0,
  },
  bottomSheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    height: height / 1.8,
  },
  couponProviderImageWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.orangeColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
  },
  applyCouponAndCancelButtonWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    justifyContent: "space-between",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1.0,
  },
  deleteDialogStyle: {
    backgroundColor: Colors.whiteColor,
    width: "85%",
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 1.5,
    paddingBottom: Sizes.fixPadding * 2.0,
    alignSelf: "center",
  },
  paymentToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginBottom: 10,
  },
  radioButtonContainer: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  totalAmountContainer: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding * 2.0,
    marginTop: 10,
    alignItems: "center",
  },
  proceedToPaymentButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "90%",
  },
  cashOnDeliveryButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "90%",
  },
});

export default orderSummaryScreen;
