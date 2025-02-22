import React, { useState, useEffect } from "react";
import { View, Text, Button, ImageBackground, TextInput, Alert } from "react-native";
import { Card } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

const ChemistDiscountConfigScreen = () => {
    const [chemist, setChemist] = useState(null);
    const [discount, setDiscount] = useState("");
    const [openChemist, setOpenChemist] = useState(false);
    const [chemistList, setChemistList] = useState([]);
    const [fullCustomerData, setFullCustomerData] = useState([]); // Stores full customer data

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch("https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/customer");
                if (!response.ok) throw new Error("Failed to fetch customers");

                const data = await response.json();
                setFullCustomerData(data); // Save full data for lookup
                console.log("FullCustomerData", fullCustomerData);

                // Transform data for dropdown
                const formattedChemists = data.map(customer => ({
                    label: customer.businessName,
                    value: customer.id.toString()
                }));

                setChemistList(formattedChemists);
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        };

        fetchCustomers();
    }, []);


    const handleSaveDiscount = async () => {
        if (!chemist || !discount) {
            Alert.alert("Error", "Please select a chemist and enter a discount value.");
            return;
        }

        // Find the full customer object for the selected chemist
        const selectedCustomer = fullCustomerData.find(c => c.id.toString() === chemist);
        if (!selectedCustomer) {
            Alert.alert("Error", "Selected chemist data not found.");
            return;
        }

        // Parse existing metaData or create a new one
        let metaData = {};
        try {
            metaData = selectedCustomer.metaData ? JSON.parse(selectedCustomer.metaData) : {};
        } catch (error) {
            console.error("Error parsing metaData:", error);
            metaData = {};
        }

        // Update metaData with customerDiscount
        metaData.customerDiscount = discount;

        // Prepare the updated customer object
        const updatedCustomer = {
            ...selectedCustomer,
            metaData: JSON.stringify(metaData) // Convert metaData back to a JSON string
        };

        console.log("Saving updated customer:", updatedCustomer);

        try {
            const response = await fetch("https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedCustomer)
            });

            if (!response.ok) {
                throw new Error("Failed to update customer discount");
            }

            Alert.alert("Success", "Discount updated successfully!");
            setChemist(null);
            setDiscount("");
        } catch (error) {
            console.error("Error saving discount:", error);
            Alert.alert("Error", "Failed to save discount. Please try again.");
        }
    };
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            {/* Heading with Background */}
            <ImageBackground
                source={require("./../../assets/images/backgroundImg.png")}
                style={styles.headingBackground}
            >
                <Text style={styles.heading}>💰 Configure Chemist Discount</Text>
            </ImageBackground>

            <ImageBackground
                source={{ uri: "https://www.example.com/medical-discount-bg.jpg" }}
                style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
            >
                <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
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
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#10857F",
                            borderRadius: 15,
                            padding: 10,
                            marginBottom: 15,
                            fontSize: 16
                        }}
                        placeholder="Enter Discount (%)"
                        keyboardType="numeric"
                        value={discount}
                        onChangeText={setDiscount}
                    />
                    <Button title="Save" color="#10857F" onPress={handleSaveDiscount} disabled={!chemist || !discount} />
                </Card>
            </ImageBackground>
        </ScrollView>
    );
};

const styles = {
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
};

export default ChemistDiscountConfigScreen;


//     return (
//         <ImageBackground
//             source={{ uri: "https://www.example.com/medical-discount-bg.jpg" }}
//             style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
//         >
//             <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
//                 <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", marginBottom: 15, textAlign: "center" }}>
//                     💰 Configure Chemist Discount
//                 </Text>

//                 <View style={{ zIndex: 2 }}>
//                     <DropDownPicker
//                         open={openChemist}
//                         value={chemist}
//                         items={chemistList}
//                         setOpen={setOpenChemist}
//                         setValue={setChemist}
//                         setItems={setChemistList}
//                         placeholder="Select Chemist"
//                         style={{ borderColor: "#10857F", borderRadius: 15, marginBottom: 15 }}
//                         dropDownContainerStyle={{ borderColor: "#10857F" }}
//                     />
//                 </View>

//                 <TextInput
//                     style={{
//                         borderWidth: 1,
//                         borderColor: "#10857F",
//                         borderRadius: 15,
//                         padding: 10,
//                         marginBottom: 15,
//                         fontSize: 16
//                     }}
//                     placeholder="Enter Discount (%)"
//                     keyboardType="numeric"
//                     value={discount}
//                     onChangeText={setDiscount}
//                 />

//                 <Button title="Save" color="#10857F" onPress={handleSaveDiscount} disabled={!chemist || !discount} />
//             </Card>
//         </ImageBackground>
//     );
// };

// export default ChemistDiscountConfigScreen;

