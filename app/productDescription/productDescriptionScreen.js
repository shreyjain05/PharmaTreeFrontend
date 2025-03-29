import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel, { Pagination } from "react-native-snap-carousel-v4";
import MyStatusBar from "../../component/myStatusBar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Bold } from "lucide-react-native";
import { AppContext } from "../context/AppProvider";
import BASE_URL from "../../constant/variable";
import { Card, Dialog } from "react-native-paper";

const { width } = Dimensions.get("screen");

const ProductDescriptionScreen = () => {
  const navigation = useNavigation();

  // Assuming `openedProduct` is passed via navigation params
  var { openedProduct } = useLocalSearchParams();
  openedProduct = JSON.parse(openedProduct);

  const { loggedInUser } = useContext(AppContext);
  const { shoppingList, setShoppingList } = useContext(AppContext);

  useEffect(() => {
    console.log("loggedInUser in description:", loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    console.log("shoppingList in description:", shoppingList);
  }, [shoppingList]);

  console.log(
    "user information in description: " + JSON.stringify(loggedInUser)
  );

  const [items, setItems] = useState([]);

  const [state, setState] = useState({
    productImages: [
      { image: "../../assets/images/empty_cart.png" }, // Use the product image for the carousel
      { image: "../../assets/images/empty_cart.png" }, // Add more images if available
      { image: "../../assets/images/empty_cart.png" },
    ],
    activeSlide: 0,
    selectedInventory: null, // Track the selected inventory item
    showSuccessDialog: false,
    logout: false,
  });

  const onBuyItem = (item, product) => {
    console.log("Received to cart:", item);

    setShoppingList((prevShoppingList) => {
      // Check if the product with the same ID & batch number already exists
      const existingProduct = prevShoppingList.find(
        (p) => p.id === product.id && p.batch === item.batchNumber
      );

      if (existingProduct) {
        // Product exists → Increase quantity
        const updatedList = prevShoppingList.map((p) =>
          p.id === product.id && p.batch === item.batchNumber
            ? { ...p, qty: p.qty + 1 }
            : p
        );

        console.log(
          "Updated Quantity for:",
          product.id,
          "Batch:",
          item.batchNumber
        );
        console.log("Updated List:", updatedList);
        return updatedList;
      } else {
        // Product does not exist → Add new product
        const selectedProduct = {
          id: product.id,
          name: product.name,
          manufacturer: product.companyName,
          detail: product.description,
          price: item.mrp,
          batch: item.batchNumber,
          qty: 1, // Initial quantity
        };

        const updatedList = [...prevShoppingList, selectedProduct];

        console.log("Added New Product:", selectedProduct);
        console.log("Updated List:", updatedList);
        return updatedList;
      }
    });

    // Ensure navigation uses the updated shopping list AFTER state update
    setTimeout(() => {
      navigation.push("cart/cartScreen", {
        selectedInventory: JSON.stringify(shoppingList),
      });
    }, 100);
  };

  const onAddItem = (item, product) => {
    setShoppingList((prevShoppingList) => {
      // Check if the product with the same ID & batch number already exists
      const existingProduct = prevShoppingList.find(
        (p) => p.id === product.id && p.batch === item.batchNumber
      );

      if (existingProduct) {
        // Product exists → Increase quantity
        const updatedList = prevShoppingList.map((p) =>
          p.id === product.id && p.batch === item.batchNumber
            ? { ...p, qty: p.qty + 1 }
            : p
        );

        console.log(
          "Updated Quantity for:",
          product.id,
          "Batch:",
          item.batchNumber
        );
        console.log("Updated List:", updatedList);
        return updatedList;
      } else {
        // Product does not exist → Add new product
        const selectedProduct = {
          id: product.id,
          name: product.name,
          manufacturer: product.companyName,
          detail: product.description,
          price: item.mrp,
          batch: item.batchNumber,
          qty: 1, // Initial quantity
        };

        const updatedList = [...prevShoppingList, selectedProduct];

        console.log("Added New Product:", selectedProduct);
        console.log("Updated List:", updatedList);
        return updatedList;
      }
    });

    // Update items list correctly (avoiding direct mutation)
    setItems((prevItems) => [
      ...prevItems,
      { id: prevItems.length + 1, name: `Item ${prevItems.length + 1}` },
    ]);

    updateState({ showSuccessDialog: true });
    setTimeout(() => {
      updateState({ showSuccessDialog: false });
    }, 2000);
  };

  const onAddItemToWishList = async (userData, product) => {
    if (!userData.metaData) {
      console.error("metaData field is missing!");
      return userData;
    }

    // Parse the metaData JSON string
    let metaDataObj = JSON.parse(userData.metaData);

    // Ensure wishedProducts exists and is an array
    if (!metaDataObj.wishedProducts) {
      metaDataObj.wishedProducts = [];
    }

    // Convert productId to a string (since wishedProducts contains strings)
    let productIdStr = String(product.id.toString());

    console.log("Selected productId: " + productIdStr);

    // Check if the product ID is already in wishedProducts
    if (!metaDataObj.wishedProducts.includes(productIdStr)) {
      metaDataObj.wishedProducts.push(productIdStr); // Add new product ID
    }

    console.log("Wished Products: " + JSON.stringify(metaDataObj));

    // Convert back to a string and update the userData object
    const updatedUserData = {
      ...userData,
      metaData: JSON.stringify(metaDataObj),
    };

    console.log("set target payload", updatedUserData);
    try {
      const updateResponse = await fetch(`${BASE_URL}/api/v1/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!updateResponse.ok)
        throw new Error("Failed to update customer metadata");

      const updateData = await updateResponse.json();
      console.log("Update Successful:", updateData);
      updateState({ showSuccessDialog: true });
      setTimeout(() => {
        updateState({ showSuccessDialog: false });
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isCustomerActive = () => {
    return loggedInUser?.status === "ACTIVE";
  };

  const [isSelected, setIsSelected] = useState(false);

  const [isInventorySelected, setIsInventorySelected] = useState(null);
  const [quantity, setQuantity] = useState(0);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { productImages, activeSlide, showSuccessDialog, logout } = state;

  const [selectedInventory, setSelectedInventory] = useState(null); // Store the entire selected inventory object

  return (
    <View style={{ flex: 1, backgroundColor: Colors.companyLight }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {carousel()}
          {productDetails()}

          {/* {inventoryList2()} */}
          {InventoryList()}
        </ScrollView>
        {successDialog()}
      </View>

      {/* Sticky Bottom Bar */}
      <BottomBar
        quantity={quantity}
        setQuantity={setQuantity}
        isInventorySelected={isInventorySelected}
      />
    </View>
  );

  function carousel() {
    const _renderItem = ({ item }) => (
      <View style={styles.imageWrapStyle}>
        <Image
          resizeMode="contain"
          source="../../assets/images/defaultProduct.png"
          style={{ width: "100%", height: 200 }}
        />
      </View>
    );

    return (
      <View style={{ backgroundColor: Colors.companyLight }}>
        <Carousel
          data={productImages}
          sliderWidth={width} // Set sliderWidth to the screen width
          itemWidth={200 + Sizes.fixPadding * 2} // Adjust itemWidth to include margin
          renderItem={_renderItem}
          onSnapToItem={(index) => updateState({ activeSlide: index })}
          inactiveSlideOpacity={0.7} // Optional: Add opacity effect for inactive slides
          inactiveSlideScale={0.9} // Optional: Add scaling effect for inactive slides
          contentContainerCustomStyle={{ alignItems: "center" }} // Center the carousel items
        />
        {pagination()}
      </View>
    );
  }

  function productDetails() {
    if (!openedProduct) {
      return null; // or show a loader/message
    }

    const fieldIcons = {
      companyName: { icon: "building", lib: FontAwesome, label: "Company" },
      composition: { icon: "flask", lib: FontAwesome, label: "Composition" },
      packingName: { icon: "archive", lib: FontAwesome, label: "Packing" },
    };

    return (
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -30,
          padding: Sizes.fixPadding * 2.0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        {/* Product Title */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: Colors.companyPrimaryDark,
            textAlign: "center",
            textTransform: "uppercase",
            marginBottom: Sizes.fixPadding * 2,
          }}
        >
          {openedProduct.name}
        </Text>

        {/* Dynamic Fields - Stacked Layout */}
        <View style={{ marginBottom: Sizes.fixPadding * 2 }}>
          {Object.entries(fieldIcons).map(([key, field]) => {
            const value = openedProduct[key];
            if (!value) return null;

            return (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.lightGray,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10, // Spacing between items
                }}
              >
                {/* Icon on the Left */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: Colors.companyLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <FontAwesome
                    name={field.icon}
                    size={20}
                    color={Colors.companyPrimaryDark}
                  />
                </View>

                {/* Text Content */}
                <View>
                  <Text style={{ fontSize: 14, color: Colors.grayColor }}>
                    {field.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: Colors.black,
                    }}
                  >
                    {value}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Description */}
        <Text
          style={{
            fontSize: 16,
            lineHeight: 22,
            textAlign: "justify",
            color: Colors.grayColor,
            marginBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {openedProduct.description}
        </Text>
      </View>
    );
  }

  // Function to render pagination for the carousel

  function BottomBar({ quantity, setQuantity, isInventorySelected }) {
    const [selectedButton, setSelectedButton] = useState(null);
    const [pendingAction, setPendingAction] = useState(null); // Store the action to execute after state updates

    // Run the pending action once selectedButton updates
    useEffect(() => {
      if (pendingAction) {
        pendingAction(); // Execute the stored action
      }
    }, [selectedButton]);

    const handleButtonPress = (buttonType, action) => {
      setSelectedButton(buttonType); // Set the button selection first
      setPendingAction(() => action); // Store the action to execute later
    };

    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Colors.whiteColor,
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
        }}
      >
        {isCustomerActive() && isInventorySelected && (
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            {/* Buy Now Button */}
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedButton === "buy"
                    ? Colors.companyPrimaryDark
                    : Colors.lightGray,
                borderRadius: 10,
                paddingVertical: 12,
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: Colors.companyPrimaryDark,
              }}
              onPress={() =>
                handleButtonPress("buy", () =>
                  onBuyItem(selectedInventory, openedProduct)
                )
              }
            >
              <FontAwesome
                name="shopping-bag"
                size={20}
                color={
                  selectedButton === "buy" ? "white" : Colors.companyPrimaryDark
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color:
                    selectedButton === "buy"
                      ? "white"
                      : Colors.companyPrimaryDark,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Buy Now
              </Text>
            </TouchableOpacity>

            {/* Add to Cart Button */}
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedButton === "cart"
                    ? Colors.companyPrimaryDark
                    : Colors.lightGray,
                borderRadius: 10,
                paddingVertical: 12,
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: Colors.companyPrimaryDark,
              }}
              onPress={() =>
                handleButtonPress("cart", () =>
                  onAddItem(selectedInventory, openedProduct)
                )
              }
            >
              <FontAwesome
                name="shopping-cart"
                size={20}
                color={
                  selectedButton === "cart"
                    ? "white"
                    : Colors.companyPrimaryDark
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color:
                    selectedButton === "cart"
                      ? "white"
                      : Colors.companyPrimaryDark,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Add to Cart
              </Text>
            </TouchableOpacity>

            {/* Wishlist Button */}
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedButton === "wishlist"
                    ? Colors.companyPrimaryDark
                    : Colors.lightGray,
                borderRadius: 10,
                paddingVertical: 12,
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: Colors.companyPrimaryDark,
              }}
              onPress={() =>
                handleButtonPress("wishlist", () =>
                  onAddItemToWishList(loggedInUser, openedProduct)
                )
              }
            >
              <FontAwesome
                name="heart"
                size={20}
                color={
                  selectedButton === "wishlist"
                    ? "white"
                    : Colors.companyPrimaryDark
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color:
                    selectedButton === "wishlist"
                      ? "white"
                      : Colors.companyPrimaryDark,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Wishlist
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
            Product has been added!
          </Text>
        </View>
      </Dialog>
    );
  }

  function InventoryList() {
    const [selectedInventoryId, setSelectedInventoryId] = useState(null); // Track selected item

    const handleInventorySelection = (item) => {
      setSelectedInventoryId(item.id);
      setSelectedInventory(item); // Set the selected item's ID
      console.log("Selected Inventory:", item);
      setIsInventorySelected(true);
    };

    const renderItem = ({ item }) => {
      const isSelected = selectedInventoryId === item.id; // Check if this item is selected

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleInventorySelection(item)}
          style={{
            width: "48%",
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected
              ? Colors.companyPrimaryDark
              : Colors.lightGrayColor,
            borderRadius: 12,
            padding: 16,
            marginVertical: 8,
            backgroundColor: isSelected
              ? Colors.companyPrimaryDark
              : Colors.whiteColor, // Green when selected
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isSelected ? 0.2 : 0.1,
            shadowRadius: isSelected ? 6 : 4,
            elevation: isSelected ? 8 : 3,
            marginHorizontal: "1%",
          }}
        >
          {/* MRP */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: isSelected ? "white" : Colors.companyLight,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <FontAwesome5
                name="rupee-sign"
                size={16}
                color={isSelected ? "green" : Colors.companyPrimaryDark}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                color: isSelected ? "white" : Colors.companyPrimaryDark,
                fontWeight: "bold",
              }}
            >
              MRP: ₹{item.mrp}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          paddingTop: Sizes.fixPadding * 2.0,
          backgroundColor: Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          paddingVertical: 80,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: Colors.companyPrimaryDark,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Available Inventory
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: Colors.gray,
            fontWeight: "400",
            marginBottom: 12,
          }}
        >
          Select a batch to process with purchase
        </Text>

        <FlatList
          data={openedProduct?.productInventoryList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        />
      </View>
    );
  }

  function pagination() {
    return (
      <Pagination
        dotsLength={productImages.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.sliderPaginationWrapStyle}
        dotStyle={styles.sliderActiveDotStyle}
        inactiveDotStyle={styles.sliderInactiveDotStyle}
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
            onPress={() => navigation.pop()}
          />
          <Text
            style={{
              width: width / 1.7,
              marginLeft: Sizes.fixPadding + 5.0,
              ...Fonts.whiteColor19Medium,
            }}
          >
            Product Description
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          {/* Cart Icon */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.push("cart/cartScreen")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="cart" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "white" }}>
              Cart
            </Text>
          </View>

          {/* Wallet Icon */}
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.push("wallet/WalletScreen")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="wallet" size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: "white" }}>
              Wallet
            </Text>
          </View>
        </View>
      </View>
    );
  }
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.companyPrimary,
    height: 56.0,
    paddingLeft: Sizes.fixPadding * 2.0,
    paddingRight: Sizes.fixPadding,
  },
  cartItemCountWrapStyle: {
    position: "absolute",
    right: -8.0,
    height: 17.0,
    width: 17.0,
    borderRadius: 8.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.redColor,
    elevation: 10.0,
  },
  deliverToInfoWrapStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  imageWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.companyPrimaryDark,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    marginRight: Sizes.fixPadding * 2.0, // Add margin to the right
    width: 200.0, // Fixed width for the image container
    height: 190.0, // Fixed height for the image container
    alignItems: "center", // Center the image horizontally
    justifyContent: "center", // Center the image vertically
    marginTop: 20,
  },
  sliderActiveDotStyle: {
    width: 20,
    height: 7,
    borderRadius: 10.0,
    backgroundColor: Colors.primaryColor,
    marginHorizontal: Sizes.fixPadding - 17.0,
  },
  sliderInactiveDotStyle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#E0E0E0",
  },
  sliderPaginationWrapStyle: {
    marginTop: Sizes.fixPadding - 25.0,
  },
  offerWrapStyle: {
    backgroundColor: Colors.redColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 6.0,
    paddingHorizontal: Sizes.fixPadding - 4.0,
  },
  addButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizes.fixPadding * 4.0,
    paddingVertical: Sizes.fixPadding - 3.0,
  },
  itemCountAndViewCartButtonWrapStyle: {
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    alignItems: "center",
    borderTopColor: Colors.bodyBackColor,
    borderTopWidth: 1.0,
  },
  viewCartButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bulletStyle: {
    backgroundColor: Colors.blackColor,
    height: 8.0,
    width: 8.0,
    borderRadius: 4.0,
    marginTop: Sizes.fixPadding - 2.0,
    marginRight: Sizes.fixPadding,
  },
  dividerStyle: {
    backgroundColor: Colors.grayColor,
    height: 1.0,
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding + 5.0,
  },
  selectQuantityModelStyle: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.50)",
    alignItems: "center",
    justifyContent: "center",
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
  selectQuantityButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 3.0,
  },
  bottomSheetItemWrapStyle: {
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Sizes.fixPadding * 2.0,
  },
  flavourAndPackageSizeInfoWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding + 3.0,
  },
});

export default ProductDescriptionScreen;
