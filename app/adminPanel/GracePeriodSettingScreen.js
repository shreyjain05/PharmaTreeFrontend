import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, Button, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Card } from "react-native-paper";

const GracePeriodSettingScreen = () => {
    const [chemist, setChemist] = useState(null);
    const [gracePeriod, setGracePeriod] = useState(null);
    const [openChemist, setOpenChemist] = useState(false);
    const [openGrace, setOpenGrace] = useState(false);
    const [chemistList, setChemistList] = useState([]);
    const [gracePeriods, setGracePeriods] = useState([
        { label: "30 Days", value: "30" },
        { label: "45 Days", value: "45" }
    ]);

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

    const handleSaveGracePeriod = async () => {
        if (!chemist || !gracePeriod) {
            console.warn("Please select both a chemist and a grace period before saving.");
            return;
        }

        const payload = {
            name: "GracePeriod",
            value: gracePeriod,
            type: "Application"
        };

        console.log("Saving Grace Period:", payload);

        try {
            const response = await fetch("https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/applicationConfig", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to save grace period: ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log("Successfully saved Grace Period:", responseData);
            Alert.alert("Success", "Grace Period saved successfully!", [{ text: "OK" }]);

            // Clear selected values
            setChemist(null);
            setGracePeriod(null);
        } catch (error) {
            console.error("Error saving Grace Period:", error);
        }
    };

    return (
        <ImageBackground
            source={{ uri: "https://www.example.com/medical-settings-bg.jpg" }}
            style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
        >
            <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", marginBottom: 15, textAlign: "center" }}>
                    ⏳ Set Grace Period for Chemist
                </Text>

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

                <View style={{ zIndex: 1 }}>
                    <DropDownPicker
                        open={openGrace}
                        value={gracePeriod}
                        items={gracePeriods}
                        setOpen={setOpenGrace}
                        setValue={setGracePeriod}
                        setItems={setGracePeriods}
                        placeholder="Select Grace Period"
                        style={{ borderColor: "#10857F", borderRadius: 15, marginBottom: 15 }}
                        dropDownContainerStyle={{ borderColor: "#10857F" }}
                    />
                </View>

                <Button title="Save" color="#10857F" onPress={handleSaveGracePeriod} disabled={!gracePeriod || !chemist} />
            </Card>
        </ImageBackground>
    );
};

export default GracePeriodSettingScreen;