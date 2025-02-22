import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, ScrollView, TextInput, KeyboardAvoidingView, Button, SafeAreaView, Platform } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { Search } from "lucide-react-native";

const CustomerInformationScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [customers, setCustomers] = useState([
        { id: "1", name: "John Pharmacy", onboarded: "2025-01-15" },
        { id: "2", name: "MediCare Hub", onboarded: "2025-01-20" },
    ]);

    // const [customerApiData, setCustomerApiData] = useState([
    //     { id: "1", name: "John Doe", createdAt: "2024-01-10" },
    //     { id: "2", name: "Jane Smith", createdAt: "2024-01-12" },
    //     { id: "3", name: "Alice Brown", createdAt: "2024-02-01" },
    //     { id: "4", name: "Bob White", createdAt: "2024-02-05" },
    //     { id: "5", name: "Charlie Black", createdAt: "2024-02-08" },
    // ]);
    const [customerApiData, setCustomerApiData] = useState([]);

    useEffect(() => {
        console.log("inside useefect of costomer info setting");

        const fetchCustomers = async () => {
            try {
                const response = await fetch("https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/customer");
                if (!response.ok) throw new Error("Failed to fetch customers");
                const data = await response.json();
                setCustomerApiData(data);
                console.log("data", data);

            } catch (error) {
                console.error("Error fetching customers:", error);
            }
            finally {
                const sampleCustData = [
                    {
                        "id": "1",
                        "firstName": "Harish",
                        "lastName": "Minhas",
                        "businessName": "Harish Business",
                        "dateOfBirth": "2025-02-08T09:08:03.330+00:00",
                        "email": "email",
                        "phoneNumber": "9899500848",
                        "mobNumber": "9899500848",
                        "pan": "ABCZSEFR",
                        "constitution": "Cosnt",
                        "inagurationDate": "2025-02-08T09:08:03.330+00:00",
                        "drugExpirationDate20B": "2025-02-08T09:08:03.330+00:00",
                        "drugLicenseNumber20B": "456798",
                        "drugLicenseNumber20BImage": "image",
                        "drugExpirationDate21B": "2025-02-08T09:08:03.330+00:00",
                        "drugLicenseNumber21B": "1231654",
                        "drugLicenseNumber21BImage": "image",
                        "foodLicenseExpirationDate": "2025-02-08T09:08:03.330+00:00",
                        "foodLicenseNumber": "45646",
                        "status": "ACTIVE",
                        "createdAt": "2025-02-12T22:49:52.149115",
                        "modifiedAt": "2025-02-12T22:49:52.149115",
                        "createdBy": "ADMIN",
                        "metaData": "{\"customerTargets\": [{\"targetType\": \"Year\", \"targetValue\": \"3000\", \"achievedValue\": null, \"targetEndDate\": 1739097441389, \"targetStartDate\": 1739097441389}, {\"targetType\": \"Monthly\", \"targetValue\": \"1000\", \"achievedValue\": null, \"targetEndDate\": 1739097441389, \"targetStartDate\": 1739097441389}, {\"targetType\": \"Quarter\", \"targetValue\": \"1500\", \"achievedValue\": null, \"targetEndDate\": 1739097441389, \"targetStartDate\": 1739097441389}], \"customerDiscount\": \"5\"}",
                        "shopImage": "shopimage",
                        "addresses": [
                            {
                                "id": 1,
                                "type": "BUSINESS",
                                "addressLine1": "addressLine1",
                                "addressLine2": "addressLine2",
                                "state": "RAJ",
                                "city": "SGNR",
                                "pinCode": "335001",
                                "country": "India",
                                "createdAt": "2025-02-12T22:49:52.149115",
                                "modifiedAt": "2025-02-12T22:49:52.149115"
                            }
                        ],
                        "gstInformation": {
                            "id": 1,
                            "status": "ACTIVE",
                            "createdAt": "2025-02-12T22:49:52.15039",
                            "modifiedAt": "2025-02-12T22:49:52.15039",
                            "active": false,
                            "gststateCode": "STATE",
                            "gstnumber": "45646456987979"
                        },
                        "royaltyPoints": {
                            "id": 1,
                            "updatedPoints": null,
                            "currentBalance": "0",
                            "createdAt": "2025-02-12T22:49:52.151404",
                            "modifiedAt": "2025-02-12T22:49:52.151404"
                        },
                        "active": true
                    }, {
                        "id": "2",
                        "firstName": "Deepak",
                        "lastName": "Singh",
                        "businessName": "Deepak Corp",
                        "dateOfBirth": "2025-02-08T09:08:03.330+00:00",
                        "email": "email",
                        "phoneNumber": "9899500848",
                        "mobNumber": "9899500848",
                        "pan": "ABCZSEFR",
                        "constitution": "Cosnt",
                        "inagurationDate": "2025-02-08T09:08:03.330+00:00",
                        "drugExpirationDate20B": "2025-02-08T09:08:03.330+00:00",
                        "drugLicenseNumber20B": "456798",
                        "drugLicenseNumber20BImage": "image",
                        "drugExpirationDate21B": "2025-02-08T09:08:03.330+00:00",
                        "drugLicenseNumber21B": "1231654",
                        "drugLicenseNumber21BImage": "image",
                        "foodLicenseExpirationDate": "2025-02-08T09:08:03.330+00:00",
                        "foodLicenseNumber": "45646",
                        "status": "ACTIVE",
                        "createdAt": "2025-02-12T22:49:52.149115",
                        "modifiedAt": "2025-02-12T22:49:52.149115",
                        "createdBy": "ADMIN",
                        "metaData": "{\"customerTargets\": [{\"targetType\": \"Year\", \"targetValue\": \"3000\", \"achievedValue\": null, \"targetEndDate\": 1739097441389, \"targetStartDate\": 1739097441389}, {\"targetType\": \"Monthly\", \"targetValue\": \"1000\", \"achievedValue\": null, \"targetEndDate\": 1739097441389, \"targetStartDate\": 1739097441389}, {\"targetType\": \"Quarter\", \"targetValue\": \"1500\", \"achievedValue\": null, \"targetEndDate\": 1739097441389, \"targetStartDate\": 1739097441389}], \"customerDiscount\": \"5\"}",
                        "shopImage": "shopimage",
                        "addresses": [
                            {
                                "id": 1,
                                "type": "BUSINESS",
                                "addressLine1": "addressLine1",
                                "addressLine2": "addressLine2",
                                "state": "RAJ",
                                "city": "SGNR",
                                "pinCode": "335001",
                                "country": "India",
                                "createdAt": "2025-02-12T22:49:52.149115",
                                "modifiedAt": "2025-02-12T22:49:52.149115"
                            }
                        ],
                        "gstInformation": {
                            "id": 1,
                            "status": "ACTIVE",
                            "createdAt": "2025-02-12T22:49:52.15039",
                            "modifiedAt": "2025-02-12T22:49:52.15039",
                            "active": false,
                            "gststateCode": "STATE",
                            "gstnumber": "45646456987979"
                        },
                        "royaltyPoints": {
                            "id": 1,
                            "updatedPoints": null,
                            "currentBalance": "0",
                            "createdAt": "2025-02-12T22:49:52.151404",
                            "modifiedAt": "2025-02-12T22:49:52.151404"
                        },
                        "active": true
                    },]
                setCustomerApiData(sampleCustData);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* <Text style={styles.heading}>Customer Info</Text> */}
                <ImageBackground
                    source={require("./../../assets/images/backgroundImg.png")} // ✅ Replace with your image path
                    style={styles.headingBackground} // ✅ New style for background
                >
                    <Text style={styles.heading}>Customer Info</Text>
                </ImageBackground>
                <View style={{ flex: 1, padding: 16 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderRadius: 10,
                            marginBottom: 15,
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: "#0B678C",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Search size={20} color="#0B678C" style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Search Customer"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                fontSize: 16,
                                color: "#333",
                            }}
                            placeholderTextColor="#0B678C"
                        />
                    </View>

                    {/* Customer List */}
                    <FlatList
                        data={customerApiData.filter(customer =>
                            customer.firstName.toLowerCase().includes(searchQuery.toLowerCase())
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.avatarContainer}>
                                    <Text style={styles.avatarText}>
                                        {item.firstName.charAt(0)}{item.lastName.charAt(0)}
                                    </Text>
                                </View>

                                <View style={styles.detailsContainer}>
                                    <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                                    <Text style={styles.businessName}>{item.businessName}</Text>
                                    <Text style={styles.contact}>Phone: {item.phoneNumber}</Text>
                                    <Text style={styles.contact}>Email: {item.email}</Text>
                                    <Text style={styles.onboarded}>Onboarded: {new Date(item.createdAt).toLocaleDateString()}</Text>
                                </View>

                                <View style={styles.separator} />

                                {/* Additional Info */}
                                <View style={styles.additionalInfo}>
                                    <Text style={styles.infoText}>GST Number: {item.gstInformation?.gstnumber}</Text>
                                    <Text style={styles.infoText}>Status: {item.status}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* Fixed Bottom Button */}
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity style={styles.exportButton} onPress={() => alert("Exporting...")}>
                        <FontAwesome name="download" size={20} color="white" />
                        <Text style={styles.buttonText}> Export to Excel</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Styles
const styles = {
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
    },
    // heading: {
    //     fontSize: 32,
    //     fontWeight: "bold",
    //     color: "#0B678C",
    //     textAlign: "left", // Change to "center" if needed
    //     // marginVertical: 30,
    //     backgroundColor: "#E0F4FF",
    //     paddingHorizontal: 30,
    //     paddingVertical: 40,
    //     marginBottom: 10
    // },
    headingBackground: {
        width: "100%", // ✅ Ensures full width
        // justifyContent: "center", // ✅ Centers content
        // alignItems: "center", // ✅ Centers text horizontally
        // paddingHorizontal: 30,
        paddingVertical: 40,
        marginBottom: 10,
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#0B678C",
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
        marginLeft: 10
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
        backgroundColor: "#0B678C",
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
        borderColor: "#0B678C",
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
        backgroundColor: "#0B678C",
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
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
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

export default CustomerInformationScreen;