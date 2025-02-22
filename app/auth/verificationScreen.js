import React, { useState, useContext } from "react";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    Image
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Sizes, Fonts } from "../../constant/styles";
import { CircleFade } from 'react-native-animated-spinkit';
import { OtpInput } from "react-native-otp-entry";
import MyStatusBar from "../../component/myStatusBar";
import { Modal } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useRoute } from '@react-navigation/native';
import { AppContext } from "../context/AppProvider"
import { useRouter } from 'expo-router';
import BASE_URL from "../../constant/variable";
const { width } = Dimensions.get('screen');


const VerificationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const router = useRouter();

    const { mobile } = route.params || {};

    const { products, setLoggedInUser, loggedInUser, frequentItems, setFrequentItems, wishlistItems, setWishlistItems, metadata, setMetaData, isAdmin, setAdmin } = useContext(AppContext);
    const [otpInput, setotpInput] = useState('');
    const [isLoading, setisLoading] = useState(false);
    async function handleVerification() {
        if (otpInput.length !== 4) {
            Alert.alert("Error", "Please enter a valid 4-digit OTP.");
            return;
        }

        setisLoading(true);

        const payload = {
            mobile: mobile, // Dynamic mobile number
            otp: otpInput,
            validate: true
        };
        console.log("veritificaiton page paylaod is ", payload);
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
                console.log("data from login api, ", data)
                setLoggedInUser(data.customer);
                setAdmin(data.customer.admin);

                console.log("data from Products:",products)
                console.log("Is Customer Admin:",data.customer.admin)
                const frequentProducts = data.customer.frequentProducts;
                console.log("Frequent Products:", frequentProducts);

                if(frequentProducts != undefined && products != undefined) {
                    // Find matching items from listOne
                    const matchingItems = products.filter(product => frequent.includes(product.id.toString()));
                    console.log("Matching Products:", matchingItems);
                    setFrequentItems(matchingItems);
                }

                const metaData = JSON.parse(data.customer?.metaData || "{}");
                setMetaData(metaData);
                const wishedProducts = metaData.wishedProducts;
                console.log("Wished Products:", wishedProducts);
                if(wishedProducts != undefined && products != undefined){
                    // Find matching items from listOne
                    const matchingItems = products.filter(product => wishedProducts.includes(product.id.toString()));
                    console.log("Matching Products:", matchingItems);
                    setWishlistItems(matchingItems);
                }

                navigation.push('(tabs)')
                // navigation.push("auth/verificationScreen")

                //navigation.push("auth/verificationScreen", { mobile: phoneNumber }); // Pass phoneNumber
                //navigation.push("auth/verificationScreen", { mobile: phoneNumber });
            }
        }

        catch (error) {
            setisLoading(false);
            Alert.alert("Error", "Network request failed. Please try again.");
            // navigation.push('(tabs)')
            // navigation.push("(tabs)");
        }
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

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                {backArrow()}
                {verificationInfo()}
                {otpFields()}
                {resendInfo()}
                {continueButton()}
            </ScrollView>
            {loading()}
        </View>

    )

    function backArrow() {
        return (
            <MaterialIcons
                name="arrow-back"
                size={24}
                color={Colors.blackColor}
                style={{
                    marginTop: Sizes.fixPadding * 2.0,
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    alignSelf: 'flex-start'
                }}
                onPress={() => navigation.pop()}
            />
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

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleVerification}
                style={styles.continueButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor19Medium }}>
                    Login
                </Text>
            </TouchableOpacity>
        );
    }

    function resendInfo() {
        return (
            <View style={styles.resendInfoWrapStyle}>
                <Text style={{ ...Fonts.grayColor18Medium }}>
                    Didn’t receive otp code!
                </Text>
                <Text style={{ ...Fonts.grayColor18Medium, marginLeft: Sizes.fixPadding - 5.0 }}>
                    Resend
                </Text>
            </View>
        )
    }

    function otpFields() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <OtpInput
                    numberOfDigits={4}
                    focusColor={Colors.primaryColor}
                    onTextChange={text => {
                        setotpInput(text)
                        // if (text.length == 4) {
                        //     Keyboard.dismiss();
                        //     setisLoading(true)
                        //     setTimeout(() => {
                        //         setisLoading(false)
                        //         navigation.push('(tabs)')
                        //     }, 2000);
                        // }
                    }}
                    theme={{
                        inputsContainerStyle: {
                            justifyContent: 'space-between',
                        },
                        pinCodeContainerStyle: { ...styles.textFieldStyle },
                        pinCodeTextStyle: { ...Fonts.primaryColor18Medium },
                    }}
                />
            </View>
        )
    }

    function verificationInfo() {
        return (
            <View style={{
                marginTop: Sizes.fixPadding * 2.5,
                marginBottom: Sizes.fixPadding * 2.0,
                marginHorizontal: Sizes.fixPadding * 2.0,
            }}>
                <Text style={{ paddingBottom: Sizes.fixPadding, ...Fonts.primaryColor25Medium }}>
                    Verification
                </Text>
                <Text style={{
                    ...Fonts.grayColor18Medium,
                    lineHeight: 22.0,
                }}>
                    Enter the OTP code from the phone we just sent you.
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    continueButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginTop: Sizes.fixPadding * 3.0,
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
    resendInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
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
})

export default VerificationScreen;