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
  Card,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import DashedLine from "react-native-dashed-line";
import { TextInput } from "react-native-paper";
import MyStatusBar from "../../component/myStatusBar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { AppContext } from "../context/AppProvider";
import BASE_URL from "../../constant/variable";

const { width, height } = Dimensions.get("screen");

const CartScreen = () => {
  const navigation = useNavigation();
  const { loggedInUser } = useContext(AppContext);

  console.log("user information: " + JSON.stringify(loggedInUser));

  const { shoppingList, setShoppingList } = useContext(AppContext);

  useEffect(() => {
    console.log("shoppingList in cart screen:", shoppingList);
  }, [shoppingList]);

  // Assuming `openedProduct` is passed via navigation params
  var { selectedInventory } = useLocalSearchParams();
  selectedInventory = shoppingList;

  const [cartList, setCartList] = useState(shoppingList);
  const [deleteDialog, setDeleteDialog] = useState(false);
  console.log("Received the products as:" + JSON.stringify(selectedInventory));
  console.log(
    "Received the products as in cart List:" + JSON.stringify(cartList)
  );

  const [state, setState] = useState({
    quantityDialog: false,
    currentQuantity: null,
    //cartItems: cartList,
    //cartItems: selectedInventory,
    currentItemId: "",
    deliveryCharge: 5,
    showBootomSheet: false,
  });

  const [inputItem, setInputItem] = useState("");

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const {
    quantityDialog,
    currentQuantity,
    //cartItems,
    currentItemId,
    deliveryCharge,
    showBootomSheet,
  } = state;

  function handleQuantityChange(id, quantity) {
    console.log("Handle Received quantity :", quantity);
    console.log("Handle Received id :", id);
    setCartList((prevCartList) =>
      prevCartList.map((item) =>
        item.id === id ? { ...item, qty: quantity } : item
      )
    );

    setShoppingList((prevShoppingList) => {
      // Check if the product with the same ID & batch number already exists
      const existingProduct = prevShoppingList.find((p) => p.id === id);

      if (existingProduct) {
        // Product exists → Increase quantity
        const updatedList = prevShoppingList.map((p) =>
          p.id === id ? { ...p, qty: quantity } : p
        );
        console.log("Updated List:", updatedList);
        return updatedList;
      }
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      {header()}
      {cartList.length == 0 ? (
        <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
          <View
            style={{
              backgroundColor: Colors.primaryColor,
              paddingVertical: Sizes.fixPadding * 4.0,
              paddingHorizontal: Sizes.fixPadding,
            }}
          >
            {/* {offersProductsAndReturnsInfo()}
            {searchInfo()} */}
          </View>
          {emptyCartInfo()}
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollViewContent}
          >
            {cartItemsInfo()}
            {addMoreItemsInfo()}
            {amountInfo()}
            {deliveredAddressInfo()}
          </ScrollView>
          <View style={styles.bottomFixedContainer}>
            {deliveredAddressAndPaymentInfo()}
          </View>
        </View>
      )}
      {deleteItemDialog()}
    </View>
  );

  function emptyCartInfo() {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartText}>Your Cart is Empty</Text>
        <Image
          source={require("../../assets/images/empty_cart.png")}
          style={styles.emptyCartImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  function deleteItemDialog(id) {
    console.log("delete id", id);
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
                  onPress={() => {
                    removeItem(id, false);
                  }}
                  style={styles.noButtonStyle}
                >
                  <Text style={{ ...Fonts.primaryColor18Medium }}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    removeItem(id, true);
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

  function deliveredAddressAndPaymentInfo() {
    return (
      <View style={styles.deliveryAndPaymentInfoWrapStyle}>
        {totalAmountAndPaymentButton()}
      </View>
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
          onPress={() =>
            navigation.push("orderSummary/orderSummaryScreen", {
              selectedInventory: JSON.stringify(shoppingList),
            })
          }
          style={styles.proceedToPaymentButtonStyle}
        >
          <Text style={{ ...Fonts.whiteColor19Medium }}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function deliveredAddressInfo() {
    return (
      <View style={styles.deliveryCard}>
        <View style={styles.deliveryRow}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../assets/images/icons/icon_9.png")}
              style={styles.iconStyle}
            />
          </View>

          <View style={styles.addressContent}>
            <View style={styles.addressRow}>
              <Text style={styles.labelText}>Deliver to :</Text>
              <Text numberOfLines={1} style={styles.addressText}>
                {getAddress()}
              </Text>
            </View>

            <Text style={styles.addressText}>{getAddressState()}</Text>
          </View>
        </View>
      </View>
    );
  }

  function total() {
    const total = cartList.reduce((sum, i) => {
      return (sum += i.qty * i.price);
    }, 0);
    return total;
  }

  function handleProductDelete(id) {
    console.log("Handle Deleted Received id :", id);
    setInputItem(id);
    setDeleteDialog(true);
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
      <View style={styles.cartSummaryContainer}>
        <View style={styles.rowBetween}>
          <Text style={styles.labelText}>Cart Value</Text>
          <Text style={styles.valueText}>₹{total()}</Text>
        </View>

        <DashedLine
          dashLength={6}
          dashThickness={1.5}
          dashGap={4}
          dashColor="rgba(0, 150, 136, 0.4)"
          style={{ marginVertical: 8 }}
        />

        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>Amount to be paid</Text>
          <Text style={styles.totalValue}>
            ₹{total() + (total() > 10 ? 0 : 5)}
          </Text>
        </View>
      </View>
    );
  }

  function addMoreItemsInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.push("allProducts/allProducts")}
        style={styles.addMoreItemsButton}
      >
        <Text style={styles.addMoreItemsText}>Add More Items</Text>
        <View style={styles.addIconContainer}>
          <MaterialCommunityIcons
            name="plus"
            size={22}
            color={Colors.primaryColor}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function cartItemsInfo() {
    return (
      <View>
        {cartList.map((item) => (
          <View key={`₹{item.id}`} style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <View style={styles.row}>
                {/* Product Image */}
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("../../assets/images/defaultProduct.png")
                  }
                  style={styles.productImage}
                  resizeMode="contain"
                />

                {/* Product Details */}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.manufacturerText}>
                    BY {item.manufacturer}
                  </Text>
                  <Text style={styles.productDetail}>{item.detail}</Text>

                  {/* Price & Quantity */}
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>₹{item.price}</Text>
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>Qty</Text>
                      <View style={styles.quantityContainer}>
                        <TextInput
                          style={styles.quantityInput}
                          value={String(item.qty ?? "0")}
                          keyboardType="numeric"
                          editable={true}
                          selectTextOnFocus={false}
                          textAlign="center"
                          onChangeText={(text) =>
                            handleQuantityChange(item.id, text)
                          }
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Delete Icon */}
              <MaterialIcons
                name="delete"
                size={24}
                color={Colors.primaryColor}
                onPress={() => {
                  handleProductDelete(item.id);
                }}
                style={styles.deleteIcon}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }

  function removeItem(id, isDelete) {
    console.log("Removing item", inputItem, isDelete);
    if (isDelete) {
      setCartList(
        (prevCartList) => prevCartList.filter((item) => item.id !== inputItem) // Removes the matching product
      );
      setShoppingList(
        (prevShoppingList) =>
          prevShoppingList.filter((item) => item.id !== inputItem) // Removes the matching product from the shopping list
      );
    }
    setDeleteDialog(false);
  }

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
              ...Fonts.whiteColor19Medium,
              marginLeft: Sizes.fixPadding + 5.0,
            }}
          >
            {cartList.length} Item in Cart
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
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    minHeight: 40, // Initial height
    maxHeight: 120, // Prevents excessive growth
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
  deliveryCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 15, // Rounded edges
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5, // Added left & right spacing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // Android shadow effect
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconStyle: {
    height: 50,
    width: 50,
  },
  addressContent: {
    flex: 1,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  labelText: {
    ...Fonts.primaryColor17Regular,
  },
  addressText: {
    ...Fonts.primaryColor18Medium,
    flexShrink: 1, // Prevents overflow
  },
  deliveredAddresInfoWrapStyle: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 10,
  },
  deliveredAddressIconStye: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  addressContainer: {
    flex: 1,
    marginLeft: 10,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  deliverToText: {
    fontSize: 17,
    color: "#333",
    fontWeight: "400",
  },
  addressText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
    flexShrink: 1,
    marginLeft: 5,
  },
  changeButton: {
    fontSize: 20,
    color: "#ff6600",
    fontWeight: "500",
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
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Sizes.fixPadding * 2,
    paddingTop: Sizes.fixPadding,
  },
  scrollViewContent: {
    paddingBottom: Sizes.fixPadding * 17,
  },
  amountInfoContainer: {
    marginBottom: Sizes.fixPadding * 10,
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    padding: Sizes.fixPadding * 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomFixedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: Sizes.fixPadding * 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContainer: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12, // Rounded corners
    padding: Sizes.fixPadding * 2,
    marginBottom: 15, // Spacing between cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Ensures the layout stretches
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8, // Rounded image
  },
  productInfo: {
    marginLeft: Sizes.fixPadding,
    flex: 1,
  },
  productName: {
    ...Fonts.primaryColor19Medium,
    lineHeight: 24,
  },
  manufacturerText: {
    ...Fonts.primaryColor18Regular,
    color: "#777", // Subtle text color
  },
  productDetail: {
    ...Fonts.primaryColor19Medium,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  priceText: {
    ...Fonts.primaryColor25Medium,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    ...Fonts.primaryColor19Medium,
    marginRight: 5,
  },
  quantityInput: {
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 6,
    paddingHorizontal: 8,
    textAlign: "center",
    width: 50,
    height: 35,
    fontSize: 16,
  },
  deleteIcon: {
    marginLeft: 10, // Spacing from text
  },
  addMoreItemsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor, // Main button color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Fully rounded corners
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    marginTop: 15, // Add spacing
  },
  addMoreItemsText: {
    ...Fonts.whiteColor19Medium,
    marginRight: 10, // Space between text & icon
  },
  addIconContainer: {
    backgroundColor: "#F0F0F0", // Light grey background for contrast
    width: 28,
    height: 28,
    borderRadius: 14, // Perfect circle
    alignItems: "center",
    justifyContent: "center",
  },
  cartSummaryContainer: {
    backgroundColor: Colors.whiteColor,
    padding: Sizes.fixPadding * 2,
    borderRadius: 12, // Rounded corners for a card effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // Shadow for Android
    marginVertical: 10, // Spacing around the card
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelText: {
    ...Fonts.primaryColor18Regular,
    opacity: 0.8, // Lightened text for subtlety
  },
  valueText: {
    ...Fonts.primaryColor19Medium,
  },
  totalLabel: {
    ...Fonts.primaryColor19Medium,
    fontWeight: "bold", // Emphasizing total amount
  },
  totalValue: {
    ...Fonts.primaryColor19Medium,
    fontWeight: "bold",
    color: Colors.primaryColor, // Highlighting the final payable amount
  },
});

export default CartScreen;
