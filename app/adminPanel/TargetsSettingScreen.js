// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, Button, TouchableOpacity, ImageBackground } from "react-native";
// import { Card } from "react-native-paper";
// import { Calendar, Search, Target } from "lucide-react-native";
// import DropDownPicker from "react-native-dropdown-picker";

// const TargetsSettingScreen = () => {
//     const [searchText, setSearchText] = useState("");
//     const [selectedChemist, setSelectedChemist] = useState(null);
//     const [targetValue, setTargetValue] = useState("");
//     const [targetPeriod, setTargetPeriod] = useState("monthly");

//     const [customerApiData, setCustomerApiData] = useState([]);

//     // const chemists = ["Chemist A", "Chemist B", "Chemist C", "Chemist D"];

//     useEffect(() => {
//         const fetchCustomers = async () => {
//             try {
//                 const response = await fetch('https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/api/v1/customer'); // Use the correct API endpoint
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch customers');
//                 }
//                 const data = await response.json();
//                 console.log("setCustomerApiData", data);

//                 setCustomerApiData(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             } finally {

//             }
//         };

//         fetchCustomers(); // Call the function inside useEffect, not outside

//     }, []);

//     const filteredChemists = customerApiData.filter(customer =>
//     (`${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
//         customer.businessName.toLowerCase().includes(searchText.toLowerCase()))
//     );

//     const handleSetTarget = () => {
//         console.log(`Setting ${targetPeriod} target of ${targetValue} for ${selectedChemist?.businessName || selectedChemist?.firstName}`);
//         // API call to save target
//     };

//     return (
//         <ImageBackground
//             source={{ uri: "https://www.example.com/medical-targets-bg.jpg" }}
//             style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
//         >
//             <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
//                 <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1565C0", marginBottom: 15, textAlign: "center" }}>🎯 Set Targets for Chemists</Text>

//                 {/* Chemist Search */}
//                 <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 12, borderRadius: 25, borderColor: "#1565C0", backgroundColor: "#FAFAFA" }}>
//                     <Search size={20} color="#1565C0" style={{ marginRight: 10 }} />
//                     <TextInput
//                         style={{ flex: 1, fontSize: 16 }}
//                         placeholder="Search Chemist..."
//                         value={searchText}
//                         onChangeText={setSearchText}
//                     />
//                 </View>

//                 {/* Suggested Chemists List */}
//                 {searchText !== "" && (
//                     <View style={{ backgroundColor: "#FFF", marginTop: 10, borderRadius: 10, padding: 10 }}>
//                         {filteredChemists.map(customer => {
//                             const displayName = customer.businessName || `${customer.firstName} ${customer.lastName}`;
//                             return (
//                                 <TouchableOpacity key={customer.id} onPress={() => { setSelectedChemist(customer); setSearchText(displayName); }}>
//                                     <Text style={{ padding: 10, fontSize: 16, borderBottomWidth: 1, borderBottomColor: "#EEE" }}>{displayName}</Text>
//                                 </TouchableOpacity>
//                             );
//                         })}
//                     </View>
//                 )}

//                 {/* Target Input */}
//                 {selectedChemist && (
//                     <>
//                         <TextInput
//                             style={{ borderWidth: 1, padding: 12, borderRadius: 15, marginTop: 20, borderColor: "#1565C0", backgroundColor: "#FFFFFF" }}
//                             placeholder="Enter Target Value"
//                             keyboardType="numeric"
//                             value={targetValue}
//                             onChangeText={setTargetValue}
//                         />

//                         {/* Target Period Dropdown */}
//                         <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
//                             <Calendar size={20} color="#1565C0" style={{ marginRight: 10 }} />
//                             <DropDownPicker
//                                 items={[{ label: "Monthly", value: "monthly" }, { label: "Quarterly", value: "quarterly" }, { label: "Yearly", value: "yearly" }]}
//                                 defaultValue={targetPeriod}
//                                 containerStyle={{ height: 40, flex: 1 }}
//                                 style={{ backgroundColor: "#FFF" }}
//                                 dropDownStyle={{ backgroundColor: "#FAFAFA" }}
//                                 onChangeItem={item => setTargetPeriod(item.value)}
//                             />
//                         </View>

//                         {/* Submit Button */}
//                         <TouchableOpacity
//                             onPress={handleSetTarget}
//                             style={{ marginTop: 20, backgroundColor: "#1565C0", padding: 15, borderRadius: 15, alignItems: "center", flexDirection: "row", justifyContent: "center" }}
//                         >
//                             <Target size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
//                             <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>Set Target</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}
//             </Card>
//         </ImageBackground>
//     );
// };

// export default TargetsSettingScreen;
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Search, Calendar, Target } from "lucide-react-native";

const TargetsSettingScreen = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedChemist, setSelectedChemist] = useState(null);
    const [targets, setTargets] = useState({
        Monthly: { target: "", startDate: null, endDate: null },
        Quarterly: { target: "", startDate: null, endDate: null },
        Yearly: { target: "", startDate: null, endDate: null },
    });
    const [customerApiData, setCustomerApiData] = useState([]);
    const [datePicker, setDatePicker] = useState({ type: "", period: "", visible: false });

    useEffect(() => {
        console.log("inside useefect of target setting");

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
        };
        fetchCustomers();
    }, []);

    const filteredChemists = customerApiData.filter(c =>
    (`${c.firstName} ${c.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
        (c.businessName && c.businessName.toLowerCase().includes(searchText.toLowerCase())))
    );


    const handleDateConfirm = (date) => {
        setTargets(prev => ({
            ...prev,
            [datePicker.period]: { ...prev[datePicker.period], [datePicker.type]: date.getTime() }
        }));
        setDatePicker({ type: "", period: "", visible: false });
    };

    const handleSetTarget = async () => {
        if (!selectedChemist) {
            console.error("No chemist selected!");
            return;
        }

        const metaData = {
            customerTargets: [
                { targetType: "Year", targetValue: targets.Yearly.target, achievedValue: null, targetStartDate: targets.Yearly.startDate, targetEndDate: targets.Yearly.endDate },
                { targetType: "Monthly", targetValue: targets.Monthly.target, achievedValue: null, targetStartDate: targets.Monthly.startDate, targetEndDate: targets.Monthly.endDate },
                { targetType: "Quarter", targetValue: targets.Quarterly.target, achievedValue: null, targetStartDate: targets.Quarterly.startDate, targetEndDate: targets.Quarterly.endDate }
            ]
        };

        const updatedCustomer = {
            ...selectedChemist,
            metaData: JSON.stringify(metaData) // Convert metaData back to a JSON string
        };

        console.log("set target paylaod", updatedCustomer);

        try {
            const updateResponse = await fetch("https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedCustomer)
            });

            if (!updateResponse.ok) throw new Error("Failed to update product metadata");

            const updateData = await updateResponse.json();
            console.log("Update Successful:", updateData);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <ImageBackground style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9" }}>
            <View style={{ padding: 25, borderRadius: 20, backgroundColor: "#FFFFFF", elevation: 5 }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1565C0", textAlign: "center", marginBottom: 15 }}>🎯 Set Targets for Chemists</Text>

                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 12, borderRadius: 25, borderColor: "#1565C0", backgroundColor: "#FAFAFA" }}>
                    <Search size={20} color="#1565C0" style={{ marginRight: 10 }} />
                    <TextInput style={{ flex: 1, fontSize: 16 }} placeholder="Search Chemist..." value={searchText} onChangeText={setSearchText} />
                </View>

                {/* Search Results */}
                {searchText.length > 0 && filteredChemists.length > 0 && (
                    <FlatList
                        data={filteredChemists}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#ddd",
                                    backgroundColor: "#f9f9f9"
                                }}
                                onPress={() => {
                                    setSelectedChemist(item);
                                    setSearchText(""); // Clear search after selection
                                }}
                            >
                                <Text style={{ fontSize: 16 }}>{`${item.firstName} ${item.lastName} (${item.businessName})`}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}

                {selectedChemist && Object.keys(targets).map(period => (
                    <View key={period} style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1565C0" }}>{period} Target</Text>
                        <TextInput
                            style={{ borderWidth: 1, padding: 12, borderRadius: 15, marginTop: 10, borderColor: "#1565C0", backgroundColor: "#FFFFFF" }}
                            placeholder={`Enter ${period} Target`}
                            keyboardType="numeric"
                            value={targets[period].target}
                            onChangeText={text => setTargets(prev => ({ ...prev, [period]: { ...prev[period], target: text } }))}
                        />
                        <TouchableOpacity onPress={() => setDatePicker({ type: "startDate", period, visible: true })} style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                            <Calendar size={20} color="#1565C0" style={{ marginRight: 10 }} />
                            <Text>{targets[period].startDate ? new Date(targets[period].startDate).toDateString() : "Select Start Date"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDatePicker({ type: "endDate", period, visible: true })} style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
                            <Calendar size={20} color="#1565C0" style={{ marginRight: 10 }} />
                            <Text>{targets[period].endDate ? new Date(targets[period].endDate).toDateString() : "Select End Date"}</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity onPress={handleSetTarget} style={{ marginTop: 20, backgroundColor: "#1565C0", padding: 15, borderRadius: 15, alignItems: "center" }}>
                    <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>Set Target</Text>
                </TouchableOpacity>
            </View>

            <DateTimePickerModal isVisible={datePicker.visible} mode="date" onConfirm={handleDateConfirm} onCancel={() => setDatePicker({ type: "", period: "", visible: false })} />
        </ImageBackground>
    );
};

export default TargetsSettingScreen;
