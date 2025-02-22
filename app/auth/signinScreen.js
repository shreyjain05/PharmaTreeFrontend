import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, BackHandler, Alert } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import IntlPhoneInput from 'react-native-intl-phone-input';
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation, useRouter } from "expo-router";
import { Modal } from "react-native-paper";
import { CircleFade } from 'react-native-animated-spinkit';
import BASE_URL from "../../constant/variable";





const SigninScreen = () => {

    const navigation = useNavigation();
    const [isLoading, setisLoading] = useState(false);
    const router = useRouter();
    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    };
    const handleContinue = async () => {
        console.log("continue clicked")
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
        console.log("payload is ", payload)

        // try {
        //     console.log("inside try");


        //     const response = await fetch("http://13.233.121.204:8080/FarmHub/api/v1/login", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(payload),
        //     });
        //     console.log("payload body", body);



        //     const data = await response.json();
        //     setisLoading(false);
        //     console.log("dta", data);

        //     if (response.ok) {
        //         if (data.status === "FAILED") {
        //             Alert.alert("Login Failed", data.message || "Something went wrong.");
        //             return;
        //         }
        //         navigation.push("auth/verificationScreen", { mobile: phoneNumber });
        //     } else {
        //         Alert.alert("Login Failed", data.message || "Something went wrong.");
        //     }
        // } 
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
                if (data.status === "FAILED") {
                    Alert.alert("Login Failed", data.message || "Something went wrong.");
                    return;
                }
                navigation.push("auth/verificationScreen", { mobile: phoneNumber });
                console.log("Success:", data);
                // Alert.alert("Successfully Number");
                //navigation.push("auth/verificationScreen", { mobile: phoneNumber }); // Pass phoneNumber
                //navigation.push("auth/verificationScreen", { mobile: phoneNumber });
            }
        }
        catch (error) {
            setisLoading(false);
            // Alert.alert("Error", "Network error. Please try again.");
            // navigation.push("auth/verificationScreen", { mobile: phoneNumber });
        }
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
            setBackClickCount(0)
        }, 1000)
    }

    const [backClickCount, setBackClickCount] = useState(0);
    const [phoneNumber, setphoneNumber] = useState(null)

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
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
            {
                backClickCount == 1
                    ?
                    <View style={styles.animatedView}>
                        <Text style={{ ...Fonts.whiteColor15Regular }}>
                            Press back once again to exit
                        </Text>
                    </View>
                    :
                    null
            }
        </View>
    )

    function signinText() {
        return (
            <Text style={{ marginBottom: Sizes.fixPadding + 5.0, ...Fonts.grayColor18Medium, textAlign: 'center' }}>
                Signin with Phone Number
            </Text>
        )
    }
    function loading() {
        return (
            <Modal visible={isLoading}>
                <View style={{ ...styles.dialogContainerStyle, }}>
                    <CircleFade size={45} color={Colors.primaryColor} />
                    <Text style={{ ...Fonts.grayColor18Medium, marginTop: Sizes.fixPadding * 2.0 }}>
                        Please wait..
                    </Text>
                </View>
            </Modal>
        );
    }

    // function otpInfo() {
    //     return (
    //         <Text style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor18Medium, textAlign: 'center' }}>
    //             We'll send OTP for Verification.
    //         </Text>
    //     )
    // }
    function otpInfo() {
        return (
            <Text
                style={{ marginTop: Sizes.fixPadding, ...Fonts.grayColor18Medium, textAlign: 'center' }}
                //onPress={() => router.push("/account/accountScreen")}
                onPress={() => navigation.push("auth/registerScreen")}
            // onPress={() => navigation.push("(tabs)")}
            >
                Not Joined yet? <Text style={{ color: Colors.primaryColor, fontWeight: 'bold' }}>Register Now</Text>
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
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Login
                </Text>
            </TouchableOpacity>
        )
    }


    function phoneNumberTextField() {
        return (
            <IntlPhoneInput
                onChangeText={({ phoneNumber }) => {
                    setphoneNumber(phoneNumber.replace(/\s/g, ''));
                }}
                defaultCountry="IN"
                containerStyle={styles.phoneNumberTextFieldStyle}
                dialCodeTextStyle={{ ...Fonts.blackColor17Medium, marginLeft: Sizes.fixPadding - 5.0, }}
                phoneInputStyle={{
                    flex: 1,
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.blackColor17Medium,
                }}
                placeholder="PhoneNumber"
                placeholderTextColor={Colors.grayColor}
                filterInputStyle={{ ...Fonts.blackColor17Medium }}
                modalCountryItemCountryNameStyle={{ ...Fonts.blackColor17Medium }}
                inputProps={{ selectionColor: Colors.primaryColor }}
            />
        )
    }

    function appLogo() {
        return (
            <Image
                source={require('../../assets/images/transparent-icon.png')}
                style={styles.appLogoStyle}
                resizeMode="contain"
            />
        )
    }
}

const styles = StyleSheet.create({
    animatedView: {
        backgroundColor: '#333333',
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
    dialogContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        width: '85%',
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding
    },
    continueButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: "#0B678C",
        backgroundColor: "#10857F",
        paddingVertical: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        marginTop: Sizes.fixPadding * 4.0,
    },
    appLogoStyle: {
        width: 200.0,
        height: 200.0,
        alignSelf: 'center',
        marginBottom: Sizes.fixPadding * 4.0,
        marginTop: Sizes.fixPadding * 8.0
    },
    phoneNumberTextFieldStyle: {
        borderColor: 'rgba(0, 150, 136, 0.3)',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding
    }
})

export default SigninScreen;