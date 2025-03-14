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

const { width, height } = Dimensions.get("screen");

const CartScreen = () => {
  const navigation = useNavigation();
  const { loggedInUser } = useContext(AppContext);

  console.log("user information: " + JSON.stringify(loggedInUser));

  const { shoppingList, setShoppingList } = useContext(AppContext);

  useEffect(() => {
    console.log("shoppingList in description:", shoppingList);
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

  const [inputQty, setInputQty] = useState("1");

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
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 17.0 }}
          >
            {cartItemsInfo()}
            {addMoreItemsInfo()}
            <View style={{ marginBottom: Sizes.fixPadding * 10.0 }}>
              {amountInfo()}
            </View>
          </ScrollView>
          {/* Fixed at the bottom */}
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            {deliverdAddressAndPaymentInfo()}
          </View>
        </View>
      )}
      {/* {selectQuantityDialog()} */}
      {deleteItemDialog()}
    </View>
  );

  function emptyCartInfo() {
    return (
      <View>
        <Text style={styles.emptyCartTextStyle}>{"Your Cart is Empty"}</Text>
        <Image
          source={require("../../assets/images/empty_cart.png")}
          style={styles.emptyCartImageStyle}
          resizeMode="contain"
        />
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

  function deliverdAddressAndPaymentInfo() {
    return (
      <View style={styles.deliveryAndPaymentInfoWrapStyle}>
        {deliveredAddresInfo()}
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
                  ></Text>
                </View>
              </View>
              {/* <TouchableOpacity
                activeOpacity={0.6}
                onPress={() =>
                  navigation.push("selectAddress/selectAddressScreen")
                }
              >
                <Text style={{ ...Fonts.primaryColor20Medium }}>CHANGE</Text>
              </TouchableOpacity> */}
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
    const total = cartList.reduce((sum, i) => {
      return (sum += i.qty * i.price);
    }, 0);
    return total;
  }

  function handleProductDelete(id) {
    console.log("Handle Deleted Received id :", id);
    setDeleteDialog(true);
    setCartList(
      (prevCartList) => prevCartList.filter((item) => item.id !== id) // Removes the matching product
    );
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
            <Text style={{ ...Fonts.primaryColor19Medium }}>{total()}</Text>
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
            ₹{total() + (total() > 10 ? 0 : 5)}
          </Text>
        </View>
      </View>
    );
  }

  function addMoreItemsInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.push("allProducts/allProducts")}
        style={styles.addMoreItemsInfoWrapStyle}
      >
        <Text style={{ ...Fonts.primaryColor19Medium }}>Add More Items</Text>
        <View style={styles.addIconWrapStyle}>
          <MaterialCommunityIcons
            name="plus"
            size={24}
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
          <View key={`₹{item.id}`}>
            <View
              style={{
                backgroundColor: Colors.whiteColor,
                paddingHorizontal: Sizes.fixPadding * 2.0,
                paddingBottom: Sizes.fixPadding * 2.0,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 50,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={
                      item.image
                        ? { uri: item.image }
                        : require("../../assets/images/defaultProduct.png")
                    }
                    style={{ width: 50.0, height: 50.0 }}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      width: width - 150.0,
                      marginLeft: Sizes.fixPadding,
                    }}
                  >
                    <Text
                      style={{
                        ...Fonts.primaryColor19Medium,
                        lineHeight: 25.0,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        ...Fonts.primaryColor18Regular,
                        lineHeight: 23.0,
                      }}
                    >
                      BY {item.manufacturer}
                    </Text>
                    <Text style={{ ...Fonts.primaryColor19Medium }}>
                      {item.detail}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: Sizes.fixPadding,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ ...Fonts.primaryColor25Medium }}>
                        ₹{item.price}
                      </Text>
                    </View>
                    {/* <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() =>
                        updateState({
                          quantityDialog: true,
                          currentItemId: item.id,
                          currentQuantity: item.qty,
                        })
                      }
                      style={styles.quantityCountWrapStyle}
                    >
                      <Text
                        style={{
                          ...Fonts.primaryColor19Medium,
                          marginRight: Sizes.fixPadding - 7.0,
                        }}
                      >
                        Qty {item.qty}
                      </Text>
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color={Colors.primaryColor}
                      />
                    </TouchableOpacity> */}
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {/* <Text style={{ fontSize: 16, color: "#555", marginRight: 5 }}>Qty</Text> */}
                      <Text
                        style={{
                          ...Fonts.primaryColor19Medium,
                          marginRight: Sizes.fixPadding - 7.0,
                        }}
                      >
                        Qty
                      </Text>
                      <TextInput
                        style={{
                          ...Fonts.primaryColor19Medium,
                          backgroundColor: "#FFFFFF", // White background
                          borderWidth: 1,
                          borderColor: Colors.primaryColor,
                          borderRadius: 5,
                          paddingHorizontal: 8,
                          textAlign: "center", // Centers text horizontally
                          textAlignVertical: "center", // Centers text vertically (important for Android)
                          width: 50, // Compact width
                          height: 35, // Ensures vertical alignment
                          fontSize: 16, // Readable font size
                        }}
                        // keyboardType="numeric"
                        //value={inputQty}
                        value={item.qty}
                        onContentSizeChange={(event) => {
                          event.target.style.height = `${Math.min(
                            120,
                            event.nativeEvent.contentSize.height
                          )}px`; // Max height 120px
                        }}
                        onChangeText={(text) =>
                          handleQuantityChange(item.id, text)
                        }
                      />
                    </View>
                  </View>
                </View>
                <MaterialIcons
                  name="delete"
                  size={24}
                  color={Colors.primaryColor}
                  onPress={() => {
                    // handleProductDelete(item.id)
                  }}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  function removeItem() {}

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
});

export default CartScreen;
