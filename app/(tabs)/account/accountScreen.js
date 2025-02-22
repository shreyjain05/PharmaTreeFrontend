    import React, { useState, useContext } from "react";
    import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from "react-native";
    import { Colors, Fonts, Sizes } from "../../../constant/styles";
    import { TextInput } from 'react-native-paper';
    import { useNavigation } from "expo-router";
    import { User, ChevronRight, ListChecks, PlusCircle, Upload, CreditCard, FileText, Package, Percent, CreditCardIcon, Info, Clock, Target } from "lucide-react-native";
    import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
    import { AppContext } from "../../context/AppProvider"


    const { width } = Dimensions.get('screen');

    const AccountScreen = () => {

        const navigation = useNavigation();
        const { isAdmin } = useContext(AppContext);

        console.log("Is user Admin :" , isAdmin);

        const [state, setState] = useState({
            mobileNumber: '123456789',
            name: '',
            logout: false,
        })

        //const updateState = (data) => setState((state) => ({ ...state, ...data }))

        const {
            mobileNumber,
            name,
            logout,
        } = state;

        function adminPanelButton(title, icon, screenName) {
            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push(screenName)}
                    style={styles.adminPanelButtonStyle}>

                    {/* {icon}
                    <Text style={{ ...Fonts.primaryColor19Medium, marginLeft: 10 }}>
                        {title}
                    </Text>
                    */}
                    {/* Left Arrow Icon */}


                    {/* Icon inside Circle */}
                    <View style={styles.iconContainer}>{icon}</View>

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>
                    <ChevronRight size={24} color="#0B678C" style={styles.leftArrow} />

                    {/* Bottom Separator */}
                    <View style={styles.separator} />
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ flex: 1 }}>
                    {header()}
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => navigation.navigate('home/homeScreen')}
                    >
                        <Text style={{ ...Fonts.whiteColor16Regular }}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} style={styles.container}>
                        {/* {nameAndMobileNumberInfo()}
                        {activeOrderButton()}
                        {logoutButton()} */}
                        {/* <Text style={styles.heading}>Admin Panel</Text> */}

                        {adminPanelButton("Customer Information", <User size={24} color="#0B678C" />, "adminPanel/CustomerInformationScreen")}
                        {adminPanelButton("Order Status Change", <ListChecks size={24} color="#0B678C" />, "adminPanel/OrderStatusChangeScreen")}
                        {adminPanelButton("Create Order", <PlusCircle size={24} color="#0B678C" />, "adminPanel/CreateOrderAdminScreen")}
                        {adminPanelButton("Upload All Stock", <Upload size={24} color="#0B678C" />, "adminPanel/UploadAllStockScreen")}
                        {adminPanelButton("Payments Information", <CreditCard size={24} color="#0B678C" />, "adminPanel/PaymentsInformationScreen")}
                        {adminPanelButton("Invoice Information", <FileText size={24} color="#0B678C" />, "adminPanel/InvoiceInformationScreen")}
                        {adminPanelButton("Inventory Information", <Package size={24} color="#0B678C" />, "adminPanel/InventoryInformationScreen")}
                        {adminPanelButton("Chemist Discount Config", <Percent size={24} color="#0B678C" />, "adminPanel/ChemistDiscountConfigScreen")}
                        {adminPanelButton("Chemist Payment Option", <CreditCardIcon size={24} color="#0B678C" />, "adminPanel/ChemistPaymentOptionScreen")}
                        {adminPanelButton("Order Information", <Info size={24} color="#0B678C" />, "adminPanel/OrderInformationScreen")}
                        {adminPanelButton("Grace Period Setting", <Clock size={24} color="#0B678C" />, "adminPanel/GracePeriodSettingScreen")}
                        {adminPanelButton("Targets Setting", <Target size={24} color="#0B678C" />, "adminPanel/TargetsSettingScreen")}
                        {adminPanelButton("License Approval", <Target size={24} color="#0B678C" />, "adminPanel/DrugLicenseApprovalScreen")}
                        {adminPanelButton("Admin Product", <Target size={24} color="#0B678C" />, "adminPanel/AdminProductScreen")}
                    </ScrollView>

                    {logoutDialog()}
                </View>
            </View>
        )

        function logoutDialog() {
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={logout}
                    onRequestClose={() => {
                        updateState({ logout: false })
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            updateState({ logout: false })
                        }}
                        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { }}
                                style={{ ...styles.logoutDialogWrapStyle }}
                            >
                                <Text style={{
                                    ...Fonts.blackColor19Medium,
                                    paddingBottom: Sizes.fixPadding + 10.0
                                }}>
                                    Are You sure want to logout?
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: Sizes.fixPadding * 2.0,
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        onPress={() => updateState({ logout: false })}
                                        style={styles.cancelButtonStyle}>
                                        <Text style={{ ...Fonts.primaryColor18Medium }}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        onPress={() => {
                                            updateState({ logout: false })
                                            navigation.push('auth/signinScreen')
                                        }}
                                        style={styles.dialogLogoutButtonStyle}
                                    >
                                        <Text style={{ ...Fonts.whiteColor18Medium }}>
                                            Logout
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )
        }

        function logoutButton() {
            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => updateState({ logout: true })}
                    style={styles.logoutButtonStyle}>
                    <Text style={{ ...Fonts.primaryColor19Medium }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            )
        }

        function activeOrderButton() {
            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('activeOrders/activeOrdersScreen')}
                    style={styles.activeOrderButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor19Medium }}>
                        Active Orders
                    </Text>
                </TouchableOpacity>
            )
        }


        function nameAndMobileNumberInfo() {
            return (
                <View style={{
                    backgroundColor: Colors.whiteColor,
                    paddingVertical: Sizes.fixPadding * 2.0,
                }}>
                    {nameTextField()}
                    {mobileNumberTextField()}
                </View>
            )
        }

        function mobileNumberTextField() {
            return (
                <TextInput
                    label="Mobile Number"
                    value={mobileNumber}
                    onChangeText={(text) => updateState({ mobileNumber: text })}
                    mode="outlined"
                    style={{
                        height: 50.0,
                        ...Fonts.primaryColor17Medium,
                        backgroundColor: Colors.whiteColor,
                        marginHorizontal: Sizes.fixPadding * 2.0,
                    }}
                    outlineColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: '#C5C5C5', } }}
                    keyboardType="phone-pad"
                />
            )
        }

        function nameTextField() {
            return (
                <TextInput
                    label="Name"
                    mode="outlined"
                    value={name}
                    onChangeText={(text) => updateState({ name: text })}
                    style={{
                        height: 50.0,
                        ...Fonts.primaryColor17Medium,
                        backgroundColor: Colors.whiteColor,
                        marginHorizontal: Sizes.fixPadding * 2.0,
                        marginBottom: Sizes.fixPadding,
                    }}
                    outlineColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: '#C5C5C5', } }}
                />
            )
        }

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
                Admin Panel
            </Text>
            </View>
            {/* <MaterialIcons
            name="search"
            size={24}
            color={Colors.whiteColor}
            onPress={() => navigation.push("search/searchScreen")}
            /> */}
        </View>
            )
        }
    }

    const styles = StyleSheet.create({
        headerWrapStyle: {
            backgroundColor: Colors.primaryColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56.0,
            paddingHorizontal: Sizes.fixPadding * 2.0,
        },
        activeOrderButtonStyle: {
            backgroundColor: Colors.primaryColor,
            paddingVertical: Sizes.fixPadding,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: Sizes.fixPadding,
            margin: Sizes.fixPadding * 2.0,
        },
        logoutButtonStyle: {
            backgroundColor: Colors.whiteColor,
            borderColor: Colors.primaryColor,
            borderWidth: 1.0,
            borderRadius: Sizes.fixPadding,
            paddingVertical: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding * 2.0,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Sizes.fixPadding * 2.0,
        },
        cancelButtonStyle: {
            backgroundColor: '#E0E0E0',
            borderRadius: Sizes.fixPadding - 5.0,
            paddingVertical: Sizes.fixPadding - 5.0,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1.0,
            marginRight: Sizes.fixPadding,
        },
        dialogLogoutButtonStyle: {
            backgroundColor: Colors.primaryColor,
            borderRadius: Sizes.fixPadding - 5.0,
            paddingVertical: Sizes.fixPadding - 5.0,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1.0,
            marginLeft: Sizes.fixPadding,
        },
        logoutDialogWrapStyle: {
            width: width - 80.0,
            backgroundColor: Colors.whiteColor,
            borderRadius: Sizes.fixPadding,
            alignItems: 'center',
            padding: Sizes.fixPadding * 2.0,
            alignSelf: 'center'
        },
        animatedView: {
            backgroundColor: "#333333",
            position: "absolute",
            bottom: 0,
            alignSelf: 'center',
            borderRadius: Sizes.fixPadding + 5.0,
            paddingHorizontal: Sizes.fixPadding + 5.0,
            paddingVertical: Sizes.fixPadding,
            justifyContent: "center",
            alignItems: "center",
        },
        container: {
            flex: 1,
            backgroundColor: "#fff", // Optional: Ensures a clean background
            // paddingHorizontal: 20,
        },
        heading: {
            fontSize: 32,
            fontWeight: "bold",
            color: "#0B678C",
            textAlign: "left", // Change to "center" if needed
            // marginVertical: 30,
            backgroundColor: "#E0F4FF",
            paddingHorizontal: 30,
            paddingVertical: 40,
            marginBottom: 10

        },
        adminPanelButtonStyle: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 20,
            paddingHorizontal: 20,
            position: "relative",
        },
        leftArrow: {
            marginRight: 10, // Spacing between arrow and icon
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#E0F4FF", // Lighter shade of #0B678C
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            flex: 1,
            fontSize: 19,
            color: "#0B678C",
            marginLeft: 10,
        },
        separator: {
            height: 1,
            backgroundColor: "#ccc", // Light grey separator
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            marginHorizontal: 20,
        },
    });

    export default AccountScreen;