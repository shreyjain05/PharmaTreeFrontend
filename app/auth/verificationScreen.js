import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Sizes, Fonts } from "../../constant/styles";
import { CircleFade } from "react-native-animated-spinkit";
import { OtpInput } from "react-native-otp-entry";
import MyStatusBar from "../../component/myStatusBar";
import { Modal } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { AppContext } from "../context/AppProvider";
import { useRouter } from "expo-router";
import BASE_URL from "../../constant/variable";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../../redux/authSlice"; // ✅ Correct import

const { width } = Dimensions.get("screen");

const VerificationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const router = useRouter();

  const { mobile } = route.params || {};

  const {
    products,
    setProducts,
    setFrequentItems,
    setWishlistItems,
    setMetaData,
    setAdmin,
  } = useContext(AppContext);

  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("use effect App context screen");

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/products`); // Use the correct API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        console.log("after fetch call");

        const data = await response.json();
        console.log("data from app context products api call", data);

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); // Call the function inside useEffect, not outside
  }, []);

  async function handleVerification() {
    if (otpInput.length !== 4) {
      console.log.console.log("Error", "Please enter a valid 4-digit OTP.");
      return;
    }

    setIsLoading(true);

    const payload = {
      mobile: mobile, // Dynamic mobile number
      otp: otpInput,
      validate: true,
    };

    console.log("verification page payload is ", payload);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Login failed
        if (data.status === "FAILED") {
          console.log("Login Failed:", data.message || "Something went wrong.");
          setIsLoading(false); // ✅ Stop loading if login fails
          return;
        }

        console.log("data from login API:", data);
        dispatch(setLoggedInUser(data.customer)); // ✅ Store user in Redux

        console.log("Is Customer Admin:", data.customer.isAdmin);
        setAdmin(data.customer.admin);

        const frequentProducts = data.customer.frequentProducts || [];
        console.log("Frequent Products:", frequentProducts);

        if (frequentProducts.length > 0 && products.length > 0) {
          // ✅ Corrected from `frequent.includes(...)` to `frequentProducts.includes(...)`
          const matchingItems = products.filter((product) =>
            frequentProducts.includes(product.id.toString())
          );
          console.log("Matching Products:", matchingItems);
          setFrequentItems(matchingItems);
        }

        const metaData = JSON.parse(data.customer?.metaData || "{}");
        setMetaData(metaData);

        const wishedProducts = metaData.wishedProducts || [];
        console.log("Wished Products:", wishedProducts);

        if (wishedProducts.length > 0 && products.length > 0) {
          const matchingItems = products.filter((product) =>
            wishedProducts.includes(product.id.toString())
          );
          console.log("Matching Products:", matchingItems);
          setWishlistItems(matchingItems);
        }

        setIsLoading(false); // ✅ Stop loading on successful login
        navigation.push("(tabs)");
      } else {
        throw new Error("API call failed.");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(
        "Error:",
        error.message || "Network request failed. Please try again."
      );
    }
  }

  function appLogo() {
    return (
      <Image
        source={require("../../assets/images/transparent-icon.png")}
        style={styles.appLogoStyle}
        resizeMode="contain"
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
        {backArrow()}
        {verificationInfo()}
        {otpFields()}
        {resendInfo()}
        {continueButton()}
      </ScrollView>
      {loading()}
    </View>
  );

  function backArrow() {
    return (
      <MaterialIcons
        name="arrow-back"
        size={24}
        color={Colors.blackColor}
        style={{
          marginTop: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
          alignSelf: "flex-start",
        }}
        onPress={() => navigation.pop()}
      />
    );
  }

  function loading() {
    return (
      <Modal visible={isLoading}>
        <View style={{ ...styles.dialogContainerStyle }}>
          <CircleFade size={45} color={Colors.primaryColor} />
          <Text
            style={{
              ...Fonts.grayColor18Medium,
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            Please wait..
          </Text>
        </View>
      </Modal>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleVerification}
        style={styles.continueButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor19Medium }}>Login</Text>
      </TouchableOpacity>
    );
  }

  function resendInfo() {
    return (
      <View style={styles.resendInfoWrapStyle}>
        <Text style={{ ...Fonts.grayColor18Medium }}>
          Didn’t receive otp code!
        </Text>
        <Text
          style={{
            ...Fonts.grayColor18Medium,
            marginLeft: Sizes.fixPadding - 5.0,
          }}
        >
          Resend
        </Text>
      </View>
    );
  }

  function otpFields() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <OtpInput
          numberOfDigits={4}
          focusColor={Colors.primaryColor}
          onTextChange={(text) => {
            setOtpInput(text);
            // if (text.length == 4) {
            //     Keyboard.dismiss();
            //     setIsLoading(true)
            //     setTimeout(() => {
            //         setIsLoading(false)
            //         navigation.push('(tabs)')
            //     }, 2000);
            // }
          }}
          theme={{
            inputsContainerStyle: {
              justifyContent: "space-between",
            },
            pinCodeContainerStyle: { ...styles.textFieldStyle },
            pinCodeTextStyle: { ...Fonts.primaryColor18Medium },
          }}
        />
      </View>
    );
  }

  function verificationInfo() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 2.5,
          marginBottom: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          style={{
            paddingBottom: Sizes.fixPadding,
            ...Fonts.primaryColor25Medium,
          }}
        >
          Verification
        </Text>
        <Text
          style={{
            ...Fonts.grayColor18Medium,
            lineHeight: 22.0,
          }}
        >
          Enter the OTP code from the phone we just sent you.
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  continueButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding * 3.0,
  },
  dialogContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    padding: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    width: "85%",
    alignSelf: "center",
    borderRadius: Sizes.fixPadding,
  },
  resendInfoWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.fixPadding * 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  textFieldStyle: {
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.whiteColor,
    elevation: 2.0,
    margin: 10.0,
    width: width / 8.0,
    height: width / 8.0,
    borderWidth: 1.5,
  },
});

export default VerificationScreen;
