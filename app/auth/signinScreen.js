import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import IntlPhoneInput from "react-native-intl-phone-input";
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation, useRouter } from "expo-router";
import { Modal } from "react-native-paper";
import { CircleFade } from "react-native-animated-spinkit";
import BASE_URL from "../../constant/variable";

const SigninScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const [backClickCount, setBackClickCount] = useState(0);
  const [phoneNumber, setphoneNumber] = useState(null);

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const handleContinue = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }
    setisLoading(true);
    const payload = {
      mobile: phoneNumber,
      otp: "",
      validate: false,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setisLoading(false);

      if (response.ok) {
        if (data.status === "FAILED") {
          Alert.alert("Login Failed", data.message || "Something went wrong.");
          return;
        }
        navigation.push("auth/verificationScreen", { mobile: phoneNumber });
      }
    } catch (error) {
      setisLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
        >
          {appLogo()}
          {signinText()}
          {phoneNumberTextField()}
          {continueButton()}
          {otpInfo()}
        </ScrollView>
        {loading()}
      </View>
      {backClickCount == 1 && (
        <View style={styles.animatedView}>
          <Text style={{ ...Fonts.whiteColor15Regular }}>
            Press back once again to exit
          </Text>
        </View>
      )}
    </View>
  );

  function signinText() {
    return (
      <Text
        style={{
          marginBottom: Sizes.fixPadding + 5.0,
          ...Fonts.grayColor18Medium,
          textAlign: "center",
        }}
      >
        Sign in with Phone Number
      </Text>
    );
  }

  function loading() {
    return (
      <Modal visible={isLoading}>
        <View style={styles.dialogContainerStyle}>
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

  function otpInfo() {
    return (
      <Text
        style={{
          marginTop: Sizes.fixPadding,
          ...Fonts.grayColor18Medium,
          textAlign: "center",
        }}
        onPress={() => navigation.push("auth/registerScreen")}
      >
        Not Joined yet?{" "}
        <Text style={{ color: Colors.primaryColor, fontWeight: "bold" }}>
          Register Now
        </Text>
      </Text>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleContinue}
        style={styles.continueButtonStyle}
      >
        <Text style={{ color: "white", ...Fonts.whiteColor19Medium }}>
          Login
        </Text>
      </TouchableOpacity>
    );
  }

  function phoneNumberTextField() {
    return (
      <IntlPhoneInput
        onChangeText={({ phoneNumber }) => {
          setphoneNumber(phoneNumber.replace(/\s/g, ""));
        }}
        defaultCountry="IN"
        containerStyle={styles.phoneNumberTextFieldStyle}
        flagStyle={{
          width: 30,
          height: 20,
          marginRight: 10,
          alignSelf: "center",
        }} // Align flag properly
        dialCodeTextStyle={{
          ...Fonts.blackColor17Medium,
          marginLeft: 5,
          alignSelf: "center", // Align the country code
        }}
        phoneInputStyle={{
          flex: 1,
          marginLeft: 5,
          alignSelf: "center", // Align phone number input
          ...Fonts.blackColor17Medium,
        }}
        placeholder="Phone Number"
        placeholderTextColor={Colors.grayColor}
        filterInputStyle={{ ...Fonts.blackColor17Medium }}
        modalCountryItemCountryNameStyle={{ ...Fonts.blackColor17Medium }}
        inputProps={{ selectionColor: Colors.primaryColor }}
      />
    );
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
};

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
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
  continueButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10857F",
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding * 4.0,
  },
  appLogoStyle: {
    width: 275, // Adjust width as needed
    height: 275, // Adjust height as needed
    alignSelf: "center",
    marginVertical: Sizes.fixPadding * 2.0,
  },
  phoneNumberTextFieldStyle: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    height: 50, // Ensures consistent height
    marginHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginTop: Sizes.fixPadding * 2.0,
  },
});

export default SigninScreen;
