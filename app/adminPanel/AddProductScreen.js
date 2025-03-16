import React, { useState, updateState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Button,
  Platform,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Divider,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Card } from "react-native-paper";
import {
  Upload,
  Package,
  FileText,
  Tag,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import BASE_URL from "../../constant/variable";
import { Dialog } from "react-native-paper";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("screen");

const AddProductScreen = () => {
  const navigation = useNavigation();
  const [productData, setProductData] = useState({
    name: "",
    companyName: "",
    packingName: "",
    composition: "",
    description: "",
    productCode: "",
    image: "",
    productInventoryList: [
      {
        batchNumber: "",
        mrp: "",
        purchaseRate: "",
        saleRate: "",
        basicRate: "",
        expiryDate: "",
        hsncode: "",
        inventoryCount: "",
      },
    ],
  });
  const fieldLabels = {
    companyName: "Company Name",
    composition: "Composition",
    description: "Description",
    image: "Product Image",
    name: "Product Name",
    packingName: "Packing Name",
    productCode: "Product Code",
    "productInventoryList.batchNumber": "Batch Number",
    "productInventoryList.mrp": "MRP",
    "productInventoryList.purchaseRate": "Purchase Rate",
    "productInventoryList.saleRate": "Sale Rate",
    "productInventoryList.basicRate": "Basic Rate",
    "productInventoryList.expiryDate": "Expiry Date",
    "productInventoryList.hsncode": "HSN Code",
    "productInventoryList.inventoryCount": "Inventory Count",
  };

  const [csvFile, setCsvFile] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleInputChange = (key, value) => {
    setProductData({ ...productData, [key]: value });
  };
  // Handle Expiry Date Change
  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    setProductData((prev) => ({
      ...prev,
      productInventoryList: prev.productInventoryList.map((item, index) =>
        index === 0 ? { ...item, expiryDate: formattedDate } : item
      ),
    }));
    setDatePickerVisible(false);
  };

  // Open Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProductData({ ...productData, image: result.assets[0].uri });
    }
  };

  const handleInventoryChange = (index, key, value) => {
    const updatedInventory = [...productData.productInventoryList];
    updatedInventory[index][key] = value;
    setProductData({ ...productData, productInventoryList: updatedInventory });
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
            Add Products
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

  const addInventory = () => {
    setProductData({
      ...productData,
      productInventoryList: [
        ...productData.productInventoryList,
        {
          basicRate: "",
          discount: "",
          expiryDate: "",
          hsncode: "",
          inventoryCount: "",
          mrp: "",
          purchaseRate: "",
          saleRate: "",
        },
      ],
    });
  };

  const removeInventory = (index) => {
    if (productData.productInventoryList.length > 1) {
      const updatedInventory = productData.productInventoryList.filter(
        (_, i) => i !== index
      );
      setProductData({
        ...productData,
        productInventoryList: updatedInventory,
      });
    }
  };

  const [state, setState] = useState({
    showSuccessDialog: false,
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { showSuccessDialog } = state;

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "text/csv" });
    if (!result.canceled) {
      setCsvFile(result.uri);
      console.log("CSV File Selected: ", result.uri);
    }
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
            Product has been added!
          </Text>
        </View>
      </Dialog>
    );
  }

  const handleSubmit = async () => {
    try {
      const updatedData = JSON.stringify(productData, null, 2);
      console.log("Final Product Data:", updatedData);
      const response = await fetch(`${BASE_URL}/api/v1/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: updatedData,
      });
      if (!response.ok) {
        throw new Error("Failed to add Product: " + response.statusText);
      } else {
        updateState({ showSuccessDialog: true });
        setTimeout(() => {
          updateState({ showSuccessDialog: false });
          navigation.push("adminPanel/AddProductScreen");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding a product:", error);
    }
  };

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
            Add New Product
          </Text>
        </Card>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {/* Product Input Fields */}
          <View
            style={{
              padding: 15,
              marginVertical: 10,
              borderRadius: 10,
              backgroundColor: "white",
            }}
          >
            {/* Product Input Fields */}
            {Object.keys(productData)
              .filter((key) => key !== "productInventoryList")
              .map((key, index) => (
                <View key={index} style={{ marginVertical: 10 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: Colors.primaryColor,
                    }}
                  >
                    {" "}
                    {fieldLabels[key] || key} {/* Use the mapping */}
                  </Text>
                  {key === "expiryDate" ? (
                    <TouchableOpacity
                      onPress={() => setDatePickerVisible(true)}
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.primaryColor,
                        borderRadius: 10,
                        padding: 10,
                        backgroundColor: "#FAFAFA",
                      }}
                    >
                      <Text>
                        {productData.productInventoryList[0].expiryDate ||
                          "Select Expiry Date"}
                      </Text>
                    </TouchableOpacity>
                  ) : key === "image" ? (
                    <TouchableOpacity
                      onPress={pickImage}
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.primaryColor,
                        borderRadius: 10,
                        padding: 10,
                        backgroundColor: "#FAFAFA",
                        alignItems: "center",
                      }}
                    >
                      {productData.image ? (
                        <Image
                          source={{ uri: productData.image }}
                          style={{ width: 100, height: 100, borderRadius: 10 }}
                        />
                      ) : (
                        <Text>Select Image</Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.primaryColor,
                        borderRadius: 10,
                        padding: 10,
                        backgroundColor: "#FAFAFA",
                        paddingVertical: 15,
                      }}
                      placeholder={`Enter ${fieldLabels[key] || key}`}
                      value={productData[key]}
                      onChangeText={(text) => handleInputChange(key, text)}
                    />
                  )}
                </View>
              ))}

            {/* Date Picker Modal */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={() => setDatePickerVisible(false)}
            />
          </View>
          {/* Inventory List Section */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              color: "#10857F",
            }}
          >
            Batch Details
          </Text>
          {productData.productInventoryList.map((inventory, index) => (
            <View
              key={index}
              style={{
                padding: 15,
                marginVertical: 10,
                borderRadius: 10,
                backgroundColor: "white",
              }}
            >
              {Object.keys(inventory).map((key, idx) => (
                <View key={idx} style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginBottom: 5,
                      color: Colors.primaryColor,
                    }}
                  >
                    {fieldLabels[`productInventoryList.${key}`] || key}
                  </Text>
                  {key === "expiryDate" ? (
                    <TouchableOpacity
                      onPress={() => setDatePickerVisible(true)}
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.primaryColor,
                        borderRadius: 10,
                        padding: 10,
                        backgroundColor: "#FAFAFA",
                      }}
                    >
                      <Text>
                        {inventory.expiryDate || "Select Expiry Date"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.primaryColor,
                        borderRadius: 10,
                        padding: 10,
                        backgroundColor: "#FAFAFA",
                        paddingVertical: 15,
                      }}
                      placeholder={`Enter ${
                        fieldLabels[`productInventoryList.${key}`] || key
                      }`}
                      value={inventory[key]}
                      onChangeText={(text) =>
                        handleInventoryChange(index, key, text)
                      }
                    />
                  )}
                </View>
              ))}
              {productData.productInventoryList.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeInventory(index)}
                  style={{ alignSelf: "flex-end", marginTop: 10 }}
                >
                  <Trash2 size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Submit Button */}
          <View
            style={{
              marginVertical: 10,
              margin: 10,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <Button title="Submit" color="#10857F" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </View>
      {successDialog()}
    </View>
  );
};

const styles = StyleSheet.create({
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
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 100,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 3.0,
    paddingTop: Sizes.fixPadding - 5.0,
    alignSelf: "center",
  },
  headingBackground: {
    width: "100%",
    paddingVertical: 40,
    marginBottom: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primaryColor,
    backgroundColor: "transparent",
    paddingHorizontal: 30,
    paddingVertical: 20,
    textAlign: "center",
  },
});
export default AddProductScreen;
