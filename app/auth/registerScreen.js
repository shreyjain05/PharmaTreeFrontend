
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Image, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";
// import { Picker } from '@react-native-picker/picker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from "@expo/vector-icons";
import { FileText, FileCheck, ImageIcon, Building, Building2, MapPin, CalendarDays, Phone, PhoneCall, Mail, UserCheck, User, User2, Home, CreditCard } from 'lucide-react-native';
import BASE_URL from "../../constant/variable";
import { Dialog } from "react-native-paper";

const { width } = Dimensions.get('screen');


const RegisterScreen = () => {

    const navigation = useNavigation();
    const [currentStage, setCurrentStage] = useState(1);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const [showSuccessDialog, setShowSuccessDialog] = useState(false);


    // State variables at the top
    const [isFoodLicensePickerVisible, setFoodLicensePickerVisibility] = useState(false);
    const [isDrugLicensePickerVisible, setDrugLicensePickerVisibility] = useState(false);



    const showFoodLicensePicker = () => setFoodLicensePickerVisibility(true);
    const hideFoodLicensePicker = () => setFoodLicensePickerVisibility(false);

    const showDrugLicensePicker = () => setDrugLicensePickerVisibility(true);
    const hideDrugLicensePicker = () => setDrugLicensePickerVisibility(false);

    const handleConfirm = (date) => {
        const timestamp = date.toISOString().replace("Z", "+00:00"); // Convert date to timestamp (milliseconds)
        updateState({ dateOfInauguration: timestamp }); // Store timestamp instead of date string
        hideDatePicker();
    };


    const handleFoodLicenseConfirm = (date) => {
        const formattedDate = date.toISOString().replace("Z", "+00:00"); // Convert to ISO format with timezone
        updateState({ foodLicenseExpiry: formattedDate });
        hideFoodLicensePicker();
    };

    const handleDrugLicenseConfirm = (date) => {
        const formattedDate = date.toISOString().replace("Z", "+00:00"); // Convert to ISO format with timezone
        updateState({ drugLicense20BExpiry: formattedDate });
        hideDrugLicensePicker();
    };
    const handleDrugLicense21Confirm = (date) => {
        const formattedDate = date.toISOString().replace("Z", "+00:00"); // Convert to ISO format with timezone
        updateState({ drugLicense20BExpiry: formattedDate });
        hideDrugLicensePicker();
    };


    const [state, setState] = useState({
        gstNumber: "",
        businessName: "",
        businessAddress: "",
        drugLicense20B: "",
        drugLicense20BExpiry: "",
        drugLicense20BImage: null,
        drugLicense21B: "",
        drugLicense21BExpiry: "",
        drugLicense21BImage: null,
        phoneNumber: "",
        secondaryPhoneNumber: "",
        email: "",
        constitution: "",
        ownerFirstName: "",
        ownerLastName: "",
        residentialAddress: "",
        panNumber: "",
        dateOfInauguration: "",
        foodLicenseNumber: "",
        foodLicenseImage: null,
        foodLicenseExpiry: "",
        shopImage: "",
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        gstNumber,
        businessName,
        businessAddress,
        drugLicense20B,
        drugLicense20BExpiry,
        drugLicense20BImage,
        drugLicense21B,
        drugLicense21BExpiry,
        drugLicense21BImage,
        phoneNumber,
        secondaryPhoneNumber,
        email,
        constitution,
        ownerFirstName,
        ownerLastName,
        residentialAddress,
        panNumber,
        dateOfInauguration,
        foodLicenseNumber,
        foodLicenseImage,
        foodLicenseExpiry,
        shopImage,
    } = state;

    const handleNext = () => {
        const missingFields = validateFields();
        if (missingFields.length > 0) {
            Alert.alert(
                "Incomplete Form",
                `Please fill the following mandatory fields:\n\n${missingFields.join("\n")}`
            );
            return;
        }
        setCurrentStage(currentStage + 1);
        // if (currentStage < 4) {
        //     setCurrentStage(currentStage + 1);
        // }
    };
    const validateFields = () => {
        let missingFields = [];

        switch (currentStage) {
            case 1:
                if (!gstNumber) missingFields.push("GST Number");
                if (!businessName) missingFields.push("Business Name");
                if (!businessAddress) missingFields.push("Business Address");
                break;
            case 2:
                //if (!drugLicense20B) missingFields.push("Drug License 20B");
                //if (!drugLicense20BExpiry) missingFields.push("Drug License 20B Expiry Date");

                //if (!drugLicense21B) missingFields.push("Drug License 21B");

                break;
            case 3:
                if (!phoneNumber) missingFields.push("Phone Number");
                if (!email) missingFields.push("Email");
                if (!constitution) missingFields.push("Constitution");
                break;
            case 4:
                if (!ownerFirstName) missingFields.push("Owner First Name");
                if (!ownerLastName) missingFields.push("Owner Last Name");
                if (!residentialAddress) missingFields.push("Residential Address");
                if (!panNumber) missingFields.push("PAN Number");
                //if (!dateOfInauguration) missingFields.push("Date of Inauguration");
                //if (!foodLicenseNumber) missingFields.push("Food License Number");

                //if (!foodLicenseExpiry) missingFields.push("Food License Expiry Date");
                break;
            default:
                break;
        }

        return missingFields;
    };

    const handleBack = () => {
        if (currentStage > 1) {
            setCurrentStage(currentStage - 1);
        }
    };

    const handleSubmit = async () => {

        const metaData = JSON.stringify({
            customerTargets: [
                {
                    targetType: "Year",
                    targetValue: null,
                    achievedValue: null,
                    targetEndDate: null,
                    targetStartDate: null
                },
                {
                    targetType: "Monthly",
                    targetValue: null,
                    achievedValue: null,
                    targetEndDate: null,
                    targetStartDate: null
                },
                {
                    targetType: "Quarter",
                    targetValue: null,
                    achievedValue: null,
                    targetEndDate: null,
                    targetStartDate: null
                }
            ],
            customerDiscount: ""
        });
        const payload = {
            firstName: ownerFirstName || "",
            lastName: ownerLastName || "",
            businessName: businessName || "",
            dateOfBirth: "", // Not available in UI
            email: email || "",
            phoneNumber: secondaryPhoneNumber || "",
            mobNumber: phoneNumber || "",
            pan: panNumber || "",
            constitution: constitution || "",
            inagurationDate: dateOfInauguration || "",
            drugExpirationDate20B: drugLicense20BExpiry || "",
            drugExpirationDate21B: drugLicense21BExpiry || "",
            drugLicenseNumber20B: drugLicense20B || "",
            drugLicenseNumber20BImage: drugLicense20BImage || "",
            drugExpirationDate21B: "", // Not available in UI
            drugLicenseNumber21B: drugLicense21B || "",
            drugLicenseNumber21BImage: drugLicense21BImage || "",
            foodLicenseExpirationDate: foodLicenseExpiry || "",
            foodLicenseNumber: foodLicenseNumber || "",
            metaData: metaData, // Not available in UI
            shopImage: shopImage, // Not available in UI
            addresses: [
                {
                    type: "business", // Business address
                    addressLine1: businessAddress || "",
                    addressLine2: "", // Not available in UI
                    state: "", // Not available in UI
                    city: "", // Not available in UI
                    pinCode: "", // Not available in UI
                    country: "", // Not available in UI
                },
                {
                    type: "residential", // Residential address
                    addressLine1: residentialAddress || "",
                    addressLine2: "", // Not available in UI
                    state: "", // Not available in UI
                    city: "", // Not available in UI
                    pinCode: "", // Not available in UI
                    country: "", // Not available in UI
                },
            ],
            gstInformation: {
                GSTNumber: gstNumber || "",
                GSTStateCode: "", // Not available in UI
            },
            royaltyPoints: {
                updatedPoints: "", // Not available in UI
                currentBalance: "", // Not available in UI
            },
        };

        console.log("Payload:", JSON.stringify(payload, null, 2));
        try {
            const response = await fetch(`${BASE_URL}/api/v1/customer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data);
                setShowSuccessDialog(true)
                        setTimeout(() => {
                            setShowSuccessDialog(false)
                            navigation.push("auth/signinScreen");
                        }, 2000);
            } else {
                Alert.alert("Error", data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Network Error", "Please check your internet connection.");
        } finally {
            // navigation.push("(tabs)");
        }
    };
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {backArrow()}
                <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
  {appLogo()}
  {registerText()}
  <View
    style={{
      backgroundColor: "white",
      paddingTop: 30,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      height: "100%",
      elevation: 20,
      paddingBottom: 50,
    }}
  >
    {currentStage === 1 && (
      <>
        {gstNumberTextField()}
        {businessNameTextField()}
        {businessAddressTextField()}
      </>
    )}

    {currentStage === 2 && (
      <>
        {drugLicense20BTextField()}
        {drugLicense20BExpiryTextField()}
        {drugLicense20BImageTextField()}
        {drugLicense21BTextField()}
        {drugLicense21BExpiryTextField()}
        {drugLicense21BImageTextField()}
      </>
    )}

    {currentStage === 3 && (
      <>
        {phoneNumberTextField()}
        {secondaryPhoneNumberTextField()}
        {emailTextField()}
        {constitutionTextField()}
      </>
    )}

    {currentStage === 4 && (
      <>
        {ownerFirstNameTextField()}
        {ownerLastNameTextField()}
        {residentialAddressTextField()}
        {panNumberTextField()}
        {dateOfInaugurationTextField()}
        {foodLicenseNumberTextField()}
        {foodLicenseImageTextField()}
        {foodLicenseExpiryTextField()}
        {shopImageField()}
      </>
    )}

    {/* Navigation Buttons - Now in a Single Row */}
    <View style={styles.navigationButtonsContainer}>
      {currentStage > 1 && (
        <TouchableOpacity activeOpacity={0.6} onPress={handleBack} style={styles.navigationButton}>
          <Text style={{ ...Fonts.whiteColor19Medium, color: Colors.companyPrimary, fontWeight: "bold" }}>Back</Text>
        </TouchableOpacity>
      )}
      
      {currentStage < 4 ? (
        <TouchableOpacity activeOpacity={0.6} onPress={handleNext} style={styles.navigationButton}>
          <Text style={{ ...Fonts.whiteColor19Medium, color: Colors.companyPrimary, fontWeight: "bold" }}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.6} onPress={handleSubmit} style={styles.navigationButton}>
          <Text style={{ ...Fonts.whiteColor19Medium, color: Colors.companyPrimary, fontWeight: "bold" }}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
</ScrollView>

            </View>
            {successDialog()}
        </View>
    )

    function backArrow() {
        return (
            <MaterialIcons
                name="arrow-back"
                size={24}
                color="black"
                style={{
                    margin: Sizes.fixPadding * 2.0,
                    alignSelf: 'flex-start'
                }}
                onPress={() => navigation.pop()}
            />
        )
    }



    function gstNumberTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>GST Number</Text>
                <View style={styles.inputWrapper}>
                    <FileText size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Enter GST Number"
                        placeholderTextColor={Colors.companyPrimary}
                        value={gstNumber}
                        onChangeText={(text) => updateState({ gstNumber: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    
    function successDialog() {
        return (
            <Dialog
                visible={showSuccessDialog}
                style={styles.dialogWrapStyle}
            >
                <View style={{ backgroundColor: Colors.whiteColor, alignItems: 'center' }}>
                    <View style={styles.successIconWrapStyle}>
                        <MaterialIcons name="done" size={40} color={Colors.primaryColor} />
                    </View>
                    <Text style={{ ...Fonts.grayColor18Medium, marginTop: Sizes.fixPadding + 10.0 }}>
                        Customer has been registered !
                    </Text>
                </View>
            </Dialog>
        )
    }

    function businessNameTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Name</Text>
                <View style={styles.inputWrapper}>
                    <Building2 size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Business Name"
                        placeholderTextColor={Colors.companyPrimary}
                        value={businessName}
                        onChangeText={(text) => updateState({ businessName: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>

        );
    }

    function businessAddressTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Address</Text>
                <View style={styles.inputWrapper}>
                    <MapPin size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Business Address"
                        placeholderTextColor={Colors.companyPrimary}
                        value={businessAddress}
                        onChangeText={(text) => updateState({ businessAddress: text })}
                        selectionColor={Colors.companyPrimary}
                        style={[styles.textFieldStyle]}
                        multiline={true}
                        numberOfLines={2}
                    />
                </View>
            </View>
        );
    }

    function drugLicense20BTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Drug License 20B</Text>
                <View style={styles.inputWrapper}>
                    <FileText size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Drug License 20B"
                        placeholderTextColor={Colors.companyPrimary}
                        value={drugLicense20B}
                        onChangeText={(text) => updateState({ drugLicense20B: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function drugLicense20BExpiryTextField() {

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Drug License 20B Expiry</Text>
                <TouchableOpacity onPress={showDrugLicensePicker} style={styles.inputWrapper}>
                    <CalendarDays size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Text style={[styles.textFieldStyle, { color: Colors.companyPrimary }]}>
                        {drugLicense20BExpiry ? new Date(drugLicense20BExpiry).toLocaleDateString() : "Select Expiry Date"}
                    </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDrugLicensePickerVisible}
                    mode="date"
                    onConfirm={handleDrugLicenseConfirm}
                    onCancel={hideDrugLicensePicker}
                />
            </View>
        );
    }
    function drugLicense21BExpiryTextField() {

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Drug License 21B Expiry</Text>
                <TouchableOpacity onPress={showDrugLicensePicker} style={styles.inputWrapper}>
                    <CalendarDays size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Text style={[styles.textFieldStyle, { color: Colors.companyPrimary }]}>
                        {drugLicense20BExpiry ? new Date(drugLicense20BExpiry).toLocaleDateString() : "Select Expiry Date"}
                    </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDrugLicensePickerVisible}
                    mode="date"
                    onConfirm={handleDrugLicenseConfirm}
                    onCancel={hideDrugLicensePicker}
                />
            </View>
        );
    }

    function drugLicense20BImageTextField() {

        const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                updateState({ drugLicense20BImage: result.assets[0].uri });
            }
        };

        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Drug License 20B Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.inputWrapper}>
                    <ImageIcon size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Text style={{ color: Colors.companyPrimary }}>
                        {drugLicense20BImage ? "Image Selected" : "Select Drug License 20B Image"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function drugLicense21BTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Drug License 21B</Text>
                <View style={styles.inputWrapper}>
                    <FileText size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Drug License 21B"
                        placeholderTextColor={Colors.companyPrimary}
                        value={drugLicense21B}
                        onChangeText={(text) => updateState({ drugLicense21B: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function drugLicense21BImageTextField() {

        const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                updateState({ drugLicense21BImage: result.assets[0].uri });
            }
        };
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Drug License 21B Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.inputWrapper}>
                    <ImageIcon size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Text style={{ color: Colors.companyPrimary }}>
                        {drugLicense21BImage ? "Image Selected" : "Select Drug License 21B Image"}
                    </Text>
                </TouchableOpacity>
            </View>
            // <TextInput
            //     placeholder="Drug License 21B Image"
            //     placeholderTextColor={Colors.companyPrimary}
            //     value={drugLicense21BImage}
            //     onChangeText={(text) => updateState({ drugLicense21BImage: text })}
            //     selectionColor={Colors.companyPrimary}
            //     style={styles.textFieldStyle}
            // />
        );
    }

    function phoneNumberTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                    <Phone size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor={Colors.companyPrimary}
                        value={phoneNumber}
                        onChangeText={(text) => updateState({ phoneNumber: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function secondaryPhoneNumberTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}> Secondary Phone Number</Text>
                <View style={styles.inputWrapper}>
                    <PhoneCall size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Secondary Phone Number"
                        placeholderTextColor={Colors.companyPrimary}
                        value={secondaryPhoneNumber}
                        onChangeText={(text) => updateState({ secondaryPhoneNumber: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function emailTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                    <Mail size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={Colors.companyPrimary}
                        value={email}
                        onChangeText={(text) => updateState({ email: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function constitutionTextField() {
        // return (
        //     <View style={styles.dropdownContainer}>
        //         <Picker
        //             selectedValue={constitution}
        //             onValueChange={(itemValue) => updateState({ constitution: itemValue })}
        //             style={styles.dropdownStyle}
        //         >
        //             <Picker.Item label="Select Constitution" value="" />
        //             <Picker.Item label="Propwriter" value="Propwriter" />
        //             <Picker.Item label="Partner" value="Partner" />
        //             <Picker.Item label="Company" value="Company" />
        //         </Picker>
        //     </View>
        // ); 
        return (
            <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Constitution</Text>
                <View style={[styles.inputWrapper, { paddingHorizontal: Sizes.fixPadding, }]}>
                    <UserCheck size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Picker
                        selectedValue={constitution}
                        onValueChange={(itemValue) => updateState({ constitution: itemValue })}
                        style={[styles.dropdownStyle, { flex: 1 }]} // Ensure Picker takes full space
                        mode="dropdown" // Ensures proper dropdown behavior
                    >
                        <Picker.Item label="Select Constitution" value="" />
                        <Picker.Item label="Proprietor" value="Proprietor" />
                        <Picker.Item label="Partner" value="Partner" />
                        <Picker.Item label="Company" value="Company" />
                    </Picker>
                </View>
            </View>
        );
    }

    function ownerFirstNameTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Owner First Name</Text>
                <View style={styles.inputWrapper}>
                    <User2 size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Owner First Name"
                        placeholderTextColor={Colors.companyPrimary}
                        value={ownerFirstName}
                        onChangeText={(text) => updateState({ ownerFirstName: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function ownerLastNameTextField() {
        return (<View style={styles.inputContainer}>
            <Text style={styles.label}>Owner last Name</Text>
            <View style={styles.inputWrapper}>
                <User2 size={20} color={Colors.companyPrimary} style={styles.icon} />

                <TextInput
                    placeholder="Owner Last Name"
                    placeholderTextColor={Colors.companyPrimary}
                    value={ownerLastName}
                    onChangeText={(text) => updateState({ ownerLastName: text })}
                    selectionColor={Colors.companyPrimary}
                    style={styles.textFieldStyle}
                />
            </View>
        </View>
        );
    }

    function residentialAddressTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Residential Address</Text>
                <View style={styles.inputWrapper}>
                    <Home size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Residential Address"
                        placeholderTextColor={Colors.companyPrimary}
                        value={residentialAddress}
                        onChangeText={(text) => updateState({ residentialAddress: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function panNumberTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pan Number</Text>
                <View style={styles.inputWrapper}>
                    <CreditCard size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="PAN Number"
                        placeholderTextColor={Colors.companyPrimary}
                        value={panNumber}
                        onChangeText={(text) => updateState({ panNumber: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function dateOfInaugurationTextField() {


        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Inauguration</Text>
                <TouchableOpacity onPress={showDatePicker} style={styles.inputWrapper}>
                    <FontAwesome name="calendar" size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Text style={{ color: Colors.companyPrimary }}>
                        {dateOfInauguration ? new Date(dateOfInauguration).toLocaleDateString() : "Select Date of Inauguration"}
                    </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
            </View>
        );
    }

    function foodLicenseNumberTextField() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Food License Number</Text>
                <View style={styles.inputWrapper}>
                    <FileText size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <TextInput
                        placeholder="Food License Number"
                        placeholderTextColor={Colors.companyPrimary}
                        value={foodLicenseNumber}
                        onChangeText={(text) => updateState({ foodLicenseNumber: text })}
                        selectionColor={Colors.companyPrimary}
                        style={styles.textFieldStyle}
                    />
                </View>
            </View>
        );
    }

    function foodLicenseImageTextField() {
        const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                updateState({ foodLicenseImage: result.assets[0].uri });
            }
        };
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Food License Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.inputWrapper}>
                    <ImageIcon size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Text style={{ color: Colors.companyPrimary }}>
                        {foodLicenseImage ? "Image Selected" : "Select Food License Image"}
                    </Text>
                </TouchableOpacity>
            </View>

            // <TextInput
            //     placeholder="Food License Image"
            //     placeholderTextColor={Colors.companyPrimary}
            //     value={foodLicenseImage}
            //     onChangeText={(text) => updateState({ foodLicenseImage: text })}
            //     selectionColor={Colors.companyPrimary}
            //     style={styles.textFieldStyle}
            // />
        );
    }

    function shopImageField() {
        const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                updateState({ shopImage: result.assets[0].uri });
            }
        };
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Shop Image</Text>
                <TouchableOpacity onPress={pickImage} style={styles.inputWrapper}>
                    <ImageIcon size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Text style={{ color: Colors.companyPrimary }}>
                        {shopImage ? "Image Selected" : "Select Shop Image"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function foodLicenseExpiryTextField() {
       
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Food License Expiry</Text>
                <TouchableOpacity onPress={showFoodLicensePicker} style={styles.inputWrapper}>
                    <FontAwesome name="calendar" size={20} color={Colors.companyPrimary} style={styles.icon} />
                    <Text style={{ color: Colors.companyPrimary }}>
                        {foodLicenseExpiry ? new Date(foodLicenseExpiry).toLocaleDateString() : "Select Food License Expiry"}
                    </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isFoodLicensePickerVisible}
                    mode="date"
                    onConfirm={handleFoodLicenseConfirm}
                    onCancel={hideFoodLicensePicker}
                />
            </View>
        );
    }

    function registerText() {
        return (
            <Text style={{ marginBottom: Sizes.fixPadding + 10.0, ...Fonts.companyPrimary18Medium, textAlign: 'center', color: Colors.companyPrimary, fontSize: 24, fontWeight: 'bold' }}>
                Register your account
            </Text>
        )
    }

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleSubmit}
                style={styles.continueButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor19Medium, color: Colors.companyPrimary }}>
                    Submit
                </Text>
            </TouchableOpacity>
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
    inputContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: Colors.companyPrimary,
        marginBottom: 5,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white",
        borderColor: Colors.companyPrimary,
        borderWidth: 1,
        borderRadius: Sizes.fixPadding - 5,
        paddingHorizontal: Sizes.fixPadding,
        height: 55,
    },
    icon: {
        marginRight: 10,
    },
    textFieldStyle: {
        flex: 1,
        color: Colors.companyPrimary,
        fontSize: 16,

    },

    continueButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.companyPrimary,
        paddingVertical: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        marginTop: Sizes.fixPadding * 4.0,
        marginBottom: Sizes.fixPadding * 2.0
    },
    appLogoStyle: {
        width: 200.0,
        height: 200.0,
        alignSelf: 'center',
        marginBottom: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 3.0
    },
    navigationButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between", // Evenly distributes buttons
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 20, // Adjust spacing
      },
      navigationButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1, // Ensures equal spacing
        alignItems: "center",
        marginHorizontal: 5, // Space between buttons
      },
      submitButton: {
        backgroundColor: "#10857F",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        alignItems: "center",
        marginHorizontal: 5,
      },
    // phoneNumberTextFieldStyle: {
    //     borderColor: 'rgba(0, 150, 136, 0.3)',
    //     borderWidth: 1.0,
    //     borderRadius: Sizes.fixPadding - 5.0,
    //     marginHorizontal: Sizes.fixPadding
    // },
    // textFieldStyle: {
    //     borderColor: 'rgba(0, 150, 136, 0.3)',
    //     borderWidth: 1.0,
    //     borderRadius: Sizes.fixPadding - 5.0,
    //     paddingHorizontal: Sizes.fixPadding * 2.0,
    //     height: 55.0,
    //     ...Fonts.companyPrimary18Medium,
    //     marginHorizontal: Sizes.fixPadding,
    //     marginBottom: Sizes.fixPadding,
    //     backgroundColor: Colors.whiteColor,
    // },
    navigationButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2,
        marginTop: Sizes.fixPadding * 2,
    },
    navigationButton: {
        backgroundColor: Colors.companyLight,
        color: Colors.companyPrimary,
        padding: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
        flex: 1,
        marginHorizontal: Sizes.fixPadding,
        alignItems: 'center',
        borderColor: Colors.companyPrimary, // Added border color
        borderWidth: 2,
    },
    dropdownContainer: {


        // borderRadius: Sizes.fixPadding,
        // marginHorizontal: Sizes.fixPadding * 2,
        // marginBottom: Sizes.fixPadding * 2,
        marginHorizontal: 20,
        marginBottom: 20,

    },
    dropdownStyle: {
        color: Colors.companyPrimary,
    },
    dialogWrapStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 100,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding * 3.0,
        paddingTop: Sizes.fixPadding - 5.0,
        alignSelf: 'center',
    },
})

export default RegisterScreen;