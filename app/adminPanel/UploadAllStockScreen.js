import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import { Card, Button } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome } from "@expo/vector-icons";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const UploadAllStockScreen = () => {
  const navigation = useNavigation();
  const [file, setFile] = useState(null);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "text/csv",
    });

    if (result.type === "success") {
      setFile(result);
    }
  };

  const handleUpload = () => {
    if (!file) {
      Alert.alert("No file selected", "Please select a CSV file to upload.");
      return;
    }
    Alert.alert("Success", "Stock data uploaded successfully!");
    setFile(null);
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
            Inventory
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
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <ImageBackground
            source={{ uri: "https://www.example.com/medical-stock-bg.jpg" }}
            style={{
              flex: 1,
              padding: 20,
              backgroundColor: "#F4F7F9",
              minHeight: "100%",
            }}
          >
            <Card
              style={{
                padding: 25,
                borderRadius: 20,
                elevation: 5,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#10857F",
                  marginBottom: 15,
                  textAlign: "center",
                }}
              >
                📦 Upload All Stock
              </Text>

              <TouchableOpacity
                onPress={pickDocument}
                style={{
                  alignItems: "center",
                  padding: 20,
                  borderWidth: 2,
                  borderColor: "#10857F",
                  borderRadius: 10,
                  borderStyle: "dashed",
                  marginBottom: 20,
                }}
              >
                <FontAwesome name="upload" size={40} color="#10857F" />
                <Text style={{ marginTop: 10, fontSize: 16, color: "#10857F" }}>
                  Tap to upload CSV file
                </Text>
              </TouchableOpacity>

              {file && (
                <View style={{ marginBottom: 20, alignItems: "center" }}>
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}
                  >
                    Selected File:
                  </Text>
                  <Text style={{ fontSize: 14, color: "#666" }}>
                    {file.name}
                  </Text>
                </View>
              )}

              <Button
                mode="contained"
                onPress={handleUpload}
                style={{
                  borderRadius: 10,
                  backgroundColor: "#10857F",
                  padding: 8,
                }}
              >
                Submit
              </Button>
            </Card>
          </ImageBackground>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = {
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
};

export default UploadAllStockScreen;
