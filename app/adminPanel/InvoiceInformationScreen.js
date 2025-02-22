// import React, { useState, useEffect } from "react";
// import { View, Text, ImageBackground, FlatList, TouchableOpacity, Button, ScrollView } from "react-native";
// import { Card, TextInput } from "react-native-paper";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { FontAwesome } from "@expo/vector-icons";
// import { format } from 'date-fns';
// import DateTimePickerModal from "react-native-modal-datetime-picker";


// const InvoiceInformationScreen = () => {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);
//     const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
//     const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

//     const showFromDatePicker = () => setFromDatePickerVisibility(true);
//     const hideFromDatePicker = () => setFromDatePickerVisibility(false);

//     const showToDatePicker = () => setToDatePickerVisibility(true);
//     const hideToDatePicker = () => setToDatePickerVisibility(false);



//     const [invoiceApiData, setInvoicApiData] = useState([])
//     const [filteredInvoices, setFilteredInvoices] = useState([]);


//     const [invoiceData, setInvoiceData] = useState([
//         { id: "1", invoiceNumber: "INV12345", date: "2025-02-01", amount: "$200" },
//         { id: "2", invoiceNumber: "INV12346", date: "2025-02-05", amount: "$350" }
//     ]);

//     const handleConfirmFromDate = (date) => {
//         setFromDate(date.toISOString().split('T')[0]);
//         hideFromDatePicker();
//     };

//     const handleConfirmToDate = (date) => {
//         setToDate(date.toISOString().split('T')[0]);
//         hideToDatePicker();
//     };

//     useEffect(() => {
//         const fetchInvoice = async () => {
//             try {
//                 const response = await fetch('https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/orders'); // Use the correct API endpoint
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch products');
//                 }
//                 const data = await response.json();
//                 console.log("setInvoicApieData", data);

//                 setInvoicApiData(data);
//                 setFilteredInvoices(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             } finally {

//             }
//         };

//         fetchInvoice(); // Call the function inside useEffect, not outside

//     }, []);


//     useEffect(() => {
//         let updatedInvoices = invoiceApiData;

//         // Date Filtering
//         if (fromDate && toDate) {
//             updatedInvoices = updatedInvoices.filter(invoice => {
//                 const invoiceDate = new Date(invoice.createdAt).toISOString().split("T")[0];
//                 return invoiceDate >= fromDate && invoiceDate <= toDate;
//             });
//         }

//         // Search Filtering (Invoice Number or Amount)
//         if (searchQuery) {
//             updatedInvoices = updatedInvoices.filter(invoice =>
//                 invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 invoice.totalBill.toString().includes(searchQuery)
//             );
//         }

//         setFilteredInvoices(updatedInvoices);
//     }, [searchQuery, fromDate, toDate, invoiceApiData]);

//     const filterInvoices = () => {
//         if (!fromDate || !toDate) return;

//         const filtered = invoiceApiData.filter(invoice => {
//             const invoiceDate = new Date(invoice.createdAt).toISOString().split("T")[0]; // Ensure correct formatting
//             return invoiceDate >= fromDate && invoiceDate <= toDate;
//         });

//         setFilteredInvoices(filtered);
//     };

//     useEffect(() => {
//         console.log("Updated filteredInvoices", filteredInvoices);
//     }, [filteredInvoices]);


//     return (
//         <ImageBackground
//             source={{ uri: "https://www.example.com/medical-invoice-bg.jpg" }}
//             style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
//         >
//             <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
//                 <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", marginBottom: 15, textAlign: "center" }}> Invoice Information</Text>

//                 <TextInput
//                     label="Search by Invoice Number"
//                     value={searchQuery}
//                     onChangeText={setSearchQuery}
//                     style={{ borderRadius: 10, marginBottom: 15 }}
//                 />
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
//                     <TouchableOpacity onPress={showFromDatePicker} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#10857F', borderRadius: 10, padding: 10 }}>
//                         <FontAwesome name="calendar" size={20} color="#10857F" style={{ marginRight: 10 }} />
//                         <Text>{fromDate ? fromDate : "From Date"}</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={showToDatePicker} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#10857F', borderRadius: 10, padding: 10 }}>
//                         <FontAwesome name="calendar" size={20} color="#10857F" style={{ marginRight: 10 }} />
//                         <Text>{toDate ? toDate : "To Date"}</Text>
//                     </TouchableOpacity>
//                 </View>


//                 <DateTimePickerModal
//                     isVisible={isFromDatePickerVisible}
//                     mode="date"
//                     onConfirm={handleConfirmFromDate}
//                     onCancel={hideFromDatePicker}
//                 />

//                 <DateTimePickerModal
//                     isVisible={isToDatePickerVisible}
//                     mode="date"
//                     onConfirm={handleConfirmToDate}
//                     onCancel={hideToDatePicker}
//                 />


//                 <Button title="Search Invoices" color="#10857F" onPress={filterInvoices} />

//                 <ScrollView style={{ marginTop: 20 }}>
//                     {filteredInvoices.length > 0 ? (
//                         invoiceApiData.map((item) => (
//                             <View key={item.id} style={{ padding: 15, borderRadius: 10, backgroundColor: "#E8F5E9", marginBottom: 10, flexDirection: "row", alignItems: "center" }}>
//                                 <FontAwesome name="file-text" size={24} color="#388E3C" style={{ marginRight: 15 }} />
//                                 <View>
//                                     <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>Invoice: {item.invoiceNumber}</Text>
//                                     <Text style={{ fontSize: 16, color: "#666", marginBottom: 5 }}>📅 Date: {item?.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a") : "N/A"}</Text>
//                                     <Text style={{ fontSize: 16, color: "#666", marginBottom: 5 }}>📦 Total Items: {item.totalItems}</Text>
//                                     <Text style={{ fontSize: 16, color: "#666", marginBottom: 5 }}>💰 Amount: {item.totalBill}</Text>
//                                 </View>
//                             </View>
//                         ))
//                     ) : (
//                         <Text style={{ textAlign: "center", fontSize: 16, color: "#999", marginTop: 20 }}>No invoice found</Text>
//                     )}
//                 </ScrollView>
//             </Card>
//         </ImageBackground>
//     );
// };

// export default InvoiceInformationScreen





import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Button } from "react-native";
import { Card, TextInput } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { format } from 'date-fns';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const InvoiceInformationScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
    const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);

    const showFromDatePicker = () => setFromDatePickerVisibility(true);
    const hideFromDatePicker = () => setFromDatePickerVisibility(false);

    const showToDatePicker = () => setToDatePickerVisibility(true);
    const hideToDatePicker = () => setToDatePickerVisibility(false);

    const [invoiceApiData, setInvoiceApiData] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch('https://d90c-2405-201-4025-9105-c8fd-6228-b972-1d8d.ngrok-free.app/api/v1/orders');
                if (!response.ok) {
                    throw new Error('Failed to fetch invoices');
                }
                const data = await response.json();
                setInvoiceApiData(data);
                setFilteredInvoices(data);  // Show all invoices initially
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoice();
    }, []);

    const handleConfirmFromDate = (date) => {
        setFromDate(date.toISOString().split('T')[0]);
        hideFromDatePicker();
    };

    const handleConfirmToDate = (date) => {
        setToDate(date.toISOString().split('T')[0]);
        hideToDatePicker();
    };

    useEffect(() => {
        let updatedInvoices = invoiceApiData;

        // Date Filtering
        if (fromDate && toDate) {
            updatedInvoices = updatedInvoices.filter(invoice => {
                const invoiceDate = new Date(invoice.createdAt).toISOString().split("T")[0];
                return invoiceDate >= fromDate && invoiceDate <= toDate;
            });
        }

        // Search Filtering (Invoice Number or Amount)
        if (searchQuery) {
            updatedInvoices = updatedInvoices.filter(invoice =>
                invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice.totalBill.toString().includes(searchQuery)
            );
        }

        setFilteredInvoices(updatedInvoices);
    }, [searchQuery, fromDate, toDate, invoiceApiData]);

    return (
        <ImageBackground
            source={{ uri: "https://www.example.com/medical-invoice-bg.jpg" }}
            style={{ flex: 1, padding: 20, backgroundColor: "#F4F7F9", minHeight: "100%" }}
        >
            <Card style={{ padding: 25, borderRadius: 20, elevation: 5, backgroundColor: "#FFFFFF" }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#10857F", marginBottom: 15, textAlign: "center" }}>
                    Invoice Information
                </Text>

                {/* Live Search */}
                <TextInput
                    label="Search by Invoice Number or Amount"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={{ borderRadius: 10, marginBottom: 15 }}
                />

                {/* Date Pickers */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                    <TouchableOpacity onPress={showFromDatePicker} style={styles.datePicker}>
                        <FontAwesome name="calendar" size={20} color="#10857F" style={{ marginRight: 10 }} />
                        <Text>{fromDate || "From Date"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showToDatePicker} style={styles.datePicker}>
                        <FontAwesome name="calendar" size={20} color="#10857F" style={{ marginRight: 10 }} />
                        <Text>{toDate || "To Date"}</Text>
                    </TouchableOpacity>
                </View>

                <DateTimePickerModal
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
                />

                {/* Invoice List */}
                <ScrollView style={{ marginTop: 20 }}>
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((item) => (
                            <View key={item.id} style={styles.invoiceCard}>
                                <FontAwesome name="file-text" size={24} color="#388E3C" style={{ marginRight: 15 }} />
                                <View>
                                    <Text style={styles.invoiceText}>Invoice: {item.invoiceNumber}</Text>
                                    <Text style={styles.detailsText}>📅 Date: {item?.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a") : "N/A"}</Text>
                                    <Text style={styles.detailsText}>📦 Total Items: {item.totalItems}</Text>
                                    <Text style={styles.detailsText}>💰 Amount: {item.totalBill}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ textAlign: "center", fontSize: 16, color: "#999", marginTop: 20 }}>
                            No invoice found
                        </Text>
                    )}
                </ScrollView>
            </Card>
        </ImageBackground>
    );
};

const styles = {
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#10857F',
        borderRadius: 10,
        padding: 10
    },
    invoiceCard: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#E8F5E9",
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    invoiceText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5
    },
    detailsText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5
    }
};

export default InvoiceInformationScreen;
