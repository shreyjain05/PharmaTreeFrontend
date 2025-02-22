import React, { useState, useEffect } from "react";
import { View, Text, Button, ImageBackground, Switch, Alert, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

const ChemistPaymentOptionScreen = () => {
    const [chemist, setChemist] = useState(null);
    const [allowOrderWithoutPayment, setAllowOrderWithoutPayment] = useState(false);
    const [openChemist, setOpenChemist] = useState(false);
    // const [chemistList, setChemistList] = useState([
    //     { label: "Chemist A", value: "chemist_a" },
    //     { label: "Chemist B", value: "chemist_b" }
    // ]);d
    const [fullCustomerData, setFullCustomerData] = useState([]);

    const [chemistList, setChemistList] = useState([]);
    useEffect(() => {
        const fetchCustomers = async () => {
            console.log("inside grace eriod use effect");

            try {
                const response = await fetch('https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/customer');
                if (!response.ok) {
                    throw new Error('Failed to fetch customers');
                }
                const data = await response.json();
                console.log("data from graceperiod is ", data);
                setFullCustomerData(data);

                // Transform API response to match DropDownPicker format
                const formattedChemists = data.map(customer => ({
                    label: customer.businessName,
                    value: customer.id.toString()  // Ensure value is a string
                }));

                console.log("chemistList", chemistList);

                setChemistList(formattedChemists);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const handleSavePaymentOption = async () => {
        if (!chemist) {
            console.warn("Please select a chemist before saving.");
            return;
        }

        // Find the selected chemist object
        const selectedCustomer = fullCustomerData.find(c => c.id.toString() === chemist);

        if (!selectedCustomer) {
            console.error("Selected chemist not found in list.");
            return;
        }

        // Add the extra field `withoutPayment`
        const payload = {
            ...selectedCustomer, // Send the whole customer object
            withoutPayment: allowOrderWithoutPayment ? "Allowed" : "Not Allowed"
        };

        console.log("Saving Payment Option:", payload);

        try {
            const response = await fetch("https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to save payment option: ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log("Successfully saved payment option:", responseData);

            // Show success alert
            Alert.alert("Success", "Payment option saved successfully!", [{ text: "OK" }]);

            // Clear selected values
            setChemist(null);
            setAllowOrderWithoutPayment(false);
        } catch (error) {
            console.error("Error saving payment option:", error);
            Alert.alert("Error", "Failed to save payment option. Please try again.");
        }
    };

    return (
        <ImageBackground
            source={require("./../../assets/images/backgroundImg.png")}
            style={styles.headingBackground}
        >
            <Text style={styles.heading}>💳 Configure Chemist Payment Option</Text>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <View style={{ zIndex: 2 }}>
                        <DropDownPicker
                            open={openChemist}
                            value={chemist}
                            items={chemistList}
                            setOpen={setOpenChemist}
                            setValue={setChemist}
                            setItems={setChemistList}
                            placeholder="Select Chemist"
                            style={{ borderColor: "#10857F", borderRadius: 15, marginBottom: 15 }}
                            dropDownContainerStyle={{ borderColor: "#10857F" }}
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>Allow Order Without Payment</Text>
                        <Switch
                            value={allowOrderWithoutPayment}
                            onValueChange={setAllowOrderWithoutPayment}
                            trackColor={{ false: "#767577", true: "#10857F" }}
                            thumbColor={allowOrderWithoutPayment ? "#FFFFFF" : "#f4f3f4"}
                        />
                    </View>

                    <Button title="Save" color="#10857F" onPress={handleSavePaymentOption} disabled={!chemist} />
                </Card>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    headingBackground: {
        width: "100%",
        paddingVertical: 40,
        marginBottom: 10,
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#0B678C",
        backgroundColor: "transparent",
        paddingHorizontal: 30,
        paddingVertical: 20,
        textAlign: "center",
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F4F7F9",
        minHeight: "100%",
    },
    card: {
        padding: 25,
        borderRadius: 20,
        elevation: 5,
        backgroundColor: "#FFFFFF",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    switchText: {
        fontSize: 16,
        color: "#10857F",
        marginRight: 10,
    },
});

export default ChemistPaymentOptionScreen;

//     return (
//         <ImageBackground
//             source={{ uri: "https://www.example.com/medical-payment-bg.jpg" }}
//             style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
//         >
//             <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
//                 <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", marginBottom: 15, textAlign: "center" }}>💳 Configure Chemist Payment Option</Text>

//                 <View style={{ zIndex: 2 }}>
//                     <DropDownPicker
//                         open={openChemist}
//                         value={chemist}
//                         items={chemistList}
//                         setOpen={(open) => setOpenChemist(open)}
//                         setValue={setChemist}
//                         setItems={setChemistList}
//                         placeholder="Select Chemist"
//                         style={{ borderColor: "#10857F", borderRadius: 15, marginBottom: 15 }}
//                         dropDownContainerStyle={{ borderColor: "#10857F" }}
//                     />
//                 </View>

//                 <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
//                     <Text style={{ fontSize: 16, color: "#10857F", marginRight: 10 }}>Allow Order Without Payment</Text>
//                     <Switch
//                         value={allowOrderWithoutPayment}
//                         onValueChange={setAllowOrderWithoutPayment}
//                         trackColor={{ false: "#767577", true: "#10857F" }}
//                         thumbColor={allowOrderWithoutPayment ? "#FFFFFF" : "#f4f3f4"}
//                     />
//                 </View>

//                 <Button title="Save" color="#10857F" onPress={handleSavePaymentOption} disabled={!chemist} />
//             </Card>
//         </ImageBackground>
//     );
// };

// export default ChemistPaymentOptionScreen;