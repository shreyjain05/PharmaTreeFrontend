        import React, { useState, useContext, useEffect } from "react";
        import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView,
            ImageBackground,
            Alert,
            Image,
            Button,
        } from "react-native";
        import { Colors, Fonts, Sizes } from "../../constant/styles";
        import { TextInput } from 'react-native-paper';
        import { useNavigation } from "expo-router";
        import { User, ChevronRight, ListChecks, PlusCircle, Upload, CreditCard, FileText, Package, Percent, CreditCardIcon, Info, Clock, Target } from "lucide-react-native";
        import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
        import { AppContext } from "../context/AppProvider";
        import BASE_URL from "../../constant/variable";
        import { Picker } from '@react-native-picker/picker';
        import DateTimePickerModal from "react-native-modal-datetime-picker";
        import { FontAwesome } from '@expo/vector-icons';
        import { Card } from "react-native-paper";


        const { width } = Dimensions.get('screen');

        const OrderInformationScreen = () => {

            const navigation = useNavigation();
            const { isAdmin } = useContext(AppContext);

            console.log("Is user Admin :" , isAdmin);

            const [fromDate, setFromDate] = useState(null);
            const [toDate, setToDate] = useState(null);
            const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
            const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

            const showFromDatePicker = () => setFromDatePickerVisibility(true);
            const hideFromDatePicker = () => setFromDatePickerVisibility(false);

            const showToDatePicker = () => setToDatePickerVisibility(true);
            const hideToDatePicker = () => setToDatePickerVisibility(false);

            const [orderApiData, setOrderApiData] = useState([]);
            const [filteredOrders, setFilteredOrders] = useState([]);

            const handleConfirmFromDate = (date) => {
                setFromDate(date.toISOString().split('T')[0]);
                hideFromDatePicker();
            };

            const handleConfirmToDate = (date) => {
                setToDate(date.toISOString().split('T')[0]);
                hideToDatePicker();
            };


            useEffect(() => {
                const fetchOrders = async () => {
                    try {
                        
                        const response = await fetch(`${BASE_URL}/api/v1/orders`); // Use the correct API endpoint
                        if (!response.ok) {
                            throw new Error('Failed to fetch products');
                        }
                        const data = await response.json();
                        console.log("setOrderApiData", data);

                        setOrderApiData(data);
                    } catch (error) {
                        console.error('Error fetching products:', error);
                    } finally {

                    }
                };

                fetchOrders(); // Call the function inside useEffect, not outside

            }, []);

            const filterOrders = () => {
                // if (!fromDate || !toDate) return;
            //  const filtered = orderApiData.filter(order => {
                //     const orderDate = order.createdAt.split("T")[0];
                //     return orderDate >= fromDate && orderDate <= toDate;
                // });
                setFilteredOrders(orderApiData);// this should be as per the date range putting hack
                console.log("filteredOrders", filteredOrders);
        
            };

            const [state, setState] = useState({
                mobileNumber: '123456789',
                name: '',
                logout: false,
                showSuccessDialog: false,
            })

            //const updateState = (data) => setState((state) => ({ ...state, ...data }))

            const {
                mobileNumber,
                name,
                logout,
                showSuccessDialog,
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
                        <Card style={{ padding: 5, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF", margin: 15 }}>
                        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", margin: 5, textAlign: "center" }}>📅 Order Information</Text>

                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                            <TouchableOpacity onPress={showFromDatePicker} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#10857F', borderRadius: 10, padding: 10 }}>
                                <FontAwesome name="calendar" size={20} color="#10857F" style={{ marginRight: 10 }} />
                                <Text>{fromDate ? fromDate : "From Date"}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={showToDatePicker} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#10857F', borderRadius: 10, padding: 10 }}>
                                <FontAwesome name="calendar" size={20} color="#10857F" style={{ marginRight: 10 }} />
                                <Text>{toDate ? toDate : "To Date"}</Text>
                            </TouchableOpacity> 
                        </View> */}

                        {/* <DateTimePickerModal
                            isVisible={isFromDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmFromDate}
                            onCancel={hideFromDatePicker}
                        />

                        <DateTimePickerModal
                            isVisible={isToDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmToDate}
                            onCancel={hideToDatePicker}
                        /> */}

                        {/* <Button title="Search Orders" color="#10857F" onPress={filterOrders} /> */}
                    </Card>
                        <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false} style={styles.container}>
                            {/* {nameAndMobileNumberInfo()}
                            {activeOrderButton()}
                            {logoutButton()} */}
                            {/* <Text style={styles.heading}>Admin Panel</Text> */}
                            {orderApiData.length > 0 ? (
                        orderApiData.map((order) => (
                            <Card key={order.id} style={{ padding: 15, margin: 10, borderRadius: 10, backgroundColor: "#FFF", elevation: 3 }}>
                                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>🧾 Order Number: {order.orderID}</Text>
                                <Text style={{ marginBottom: 5 }}>📌 Invoice : {order.invoiceNumber}</Text>
                                <Text style={{ marginBottom: 5 }}>📌 Status: {order.status}</Text>
                                <Text style={{ marginBottom: 5 }}>💰 Total Bill: ₹{order.totalBill}</Text>
                                <Text style={{ marginBottom: 5 }}>✅ Paid Amount: ₹{order.paidAmount}</Text>
                                <Text style={{ marginBottom: 5 }}>⚠️ Pending Amount: ₹{order.pendingAmount}</Text>
                                <Text style={{ marginBottom: 5 }}>📅 Created At: {order.createdAt.split("T")[0]}</Text>
                            </Card>
                        ))
                    ) : (
                        <Text style={{ textAlign: "center", fontSize: 16, color: "#999", marginTop: 20 }}>No data found</Text>
                    )}

                            
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
                Orders
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

        const ApprovalCard = ({ imageUri, onAccept, onReject }) => {
        const [status, setStatus] = useState(null);
        const [modalVisible, setModalVisible] = useState(false);

        const handleAccept = () => {
            Alert.alert(
            "Confirmation",
            "Are you sure you want to accept the license?",
            [
                { text: "Cancel", style: "cancel" },
                {
                text: "Confirm",
                onPress: () => {
                    onAccept();
                    setStatus("accepted");
                },
                },
            ]
            );
        };

        const handleReject = () => {
            Alert.alert(
            "Confirmation",
            "Are you sure you want to reject the license?",
            [
                { text: "Cancel", style: "cancel" },
                {
                text: "Confirm",
                onPress: () => {
                    onReject();
                    setStatus("rejected");
                },
                },
            ]
            );
        };

        return (
            <View style={styles.cardContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.description}>Click to show full image</Text>
            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
                animationType="fade"
            >
                <TouchableOpacity
                style={styles.modalBackground}
                onPress={() => setModalVisible(false)}
                >
                <View style={styles.modalContainer}>
                    <Image source={{ uri: imageUri }} style={styles.largeImage} />
                </View>
                </TouchableOpacity>
            </Modal>
            {status === null ? (
                <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAccept}>
                    <Text style={styles.buttonText}>✔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleReject}>
                    <Text style={styles.buttonText}>✖</Text>
                </TouchableOpacity>
                </View>
            ) : (
                <Text style={styles.statusText}>
                {status === "accepted" ? "Accepted License" : "Rejected License"}
                </Text>
            )}
            </View>
        );
        };

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

        export default OrderInformationScreen;