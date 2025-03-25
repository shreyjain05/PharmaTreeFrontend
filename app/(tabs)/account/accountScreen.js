import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import {
  User,
  ListChecks,
  PlusCircle,
  Upload,
  CreditCard,
  FileText,
  Package,
  Percent,
  CreditCardIcon,
  Info,
  Clock,
  Target,
} from "lucide-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../../context/AppProvider";

const { width } = Dimensions.get("screen");

console.log("Account Screen Rendered");

const AccountScreen = () => {
  const navigation = useNavigation();
  // Assuming `userRole` holds the current user's role

  const { loggedInUser } = useAppContext();
  const memoizedUser = useMemo(() => loggedInUser, [loggedInUser]);

  const [logoutVisible, setLogoutVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    console.log("LoggedInUser in AccountScreen:", loggedInUser);
  }, [loggedInUser]); // Log whenever loggedInUser changes

  const toggleSection = (section) => {
    setExpandedSections((prev) => (prev[section] ? {} : { [section]: true }));
  };

  const groupedMenuItems = [
    {
      title: "Customer Management",
      items: [
        {
          title: "Customer Information",
          icon: <User size={24} color="#10857F" />,
          screen: "adminPanel/CustomerInformationScreen",
        },
        {
          title: "Order Status Change",
          icon: <ListChecks size={24} color="#10857F" />,
          screen: "adminPanel/OrderStatusChangeScreen",
        },
        {
          title: "Orders",
          icon: <PlusCircle size={24} color="#10857F" />,
          screen: "adminPanel/OrderInformationScreen",
        },
        {
          title: "Feedback",
          icon: <PlusCircle size={24} color="#10857F" />,
          screen: "adminPanel/FeedbackScreen",
        },
      ],
    },
    {
      title: "Stock & Inventory",
      items: [
        {
          title: "Upload All Stock",
          icon: <Upload size={24} color="#10857F" />,
          screen: "adminPanel/UploadAllStockScreen",
        },
        {
          title: "Inventory Information",
          icon: <Package size={24} color="#10857F" />,
          screen: "adminPanel/InventoryInformationScreen",
        },
        {
          title: "Add Product",
          icon: <Target size={24} color="#10857F" />,
          screen: "adminPanel/AddProductScreen",
        },
      ],
    },
    {
      title: "Settings & Configurations",
      items: [
        {
          title: "Grace Period Setting",
          icon: <Clock size={24} color="#10857F" />,
          screen: "adminPanel/GracePeriodSettingScreen",
        },
        {
          title: "License Approval",
          icon: <Target size={24} color="#10857F" />,
          screen: "adminPanel/DrugLicenseApprovalScreen",
        },
      ],
    },
  ];

  const filterMenuItems = (menuItems, role) => {
    return menuItems
      .map((section) => {
        let filteredItems = section.items.filter((item) => {
          if (role === "SUPERADMIN") return true;
          if (role === "ADMIN")
            return section.title !== "Settings & Configurations";
          if (role === "CUSTOMER")
            return ["Orders", "Feedback", "Payments"].includes(item.title);
          return false; // Unknown role sees nothing
        });

        return filteredItems.length > 0
          ? { ...section, items: filteredItems }
          : null;
      })
      .filter(Boolean);
  };

  // Determine user role (Modify if needed)
  //const userRole = loggedInUser.isAdmin === "1" ? "SUPERADMIN" : "CUSTOMER";
  const userRole = "CUSTOMER";

  // Ensure `groupedMenuItems` exists before filtering
  const filteredMenuItems = filterMenuItems(groupedMenuItems, userRole);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.profileCard}>
          {/* Name in center */}
          <Text style={styles.name}>
            {memoizedUser.firstName} {memoizedUser.lastName}
          </Text>

          {/* Business Name below the Name */}
          <Text style={styles.business}>{loggedInUser.businessName}</Text>

          {/* Phone Number & Status in the same row */}
          <View style={styles.rowContainer}>
            <Text style={styles.phoneNumber}>
              📞 {loggedInUser.phoneNumber}
            </Text>
            <Text style={styles.status}>🟢 {loggedInUser.status}</Text>
          </View>

          {/* Comments in the last line */}
          <Text style={styles.comments}>💬 {loggedInUser.comments}</Text>
        </Card>

        {filteredMenuItems.map((section, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.title)}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </TouchableOpacity>
            {expandedSections[section.title] &&
              section.items.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.menuItem}
                  onPress={() => navigation.push(item.screen)}
                >
                  <View style={styles.menuIcon}>{item.icon}</View>
                  <Text style={styles.menuText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  header: {
    backgroundColor: "#10857F",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollContainer: { paddingBottom: 30 },
  profileCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: 10,
    alignItems: "center", // Centers the name and business name
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center", // Center text
  },
  business: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center", // Center text
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 14,
    color: "#007BFF",
    flex: 1,
    textAlign: "left", // Align left
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28a745",
    flex: 1,
    textAlign: "right", // Align right
  },
  comments: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center", // Center comments
  },
  sectionHeader: {
    backgroundColor: "#10857F",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "white" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginTop: 5,
    marginHorizontal: 15,
    borderRadius: 8,
  },
  menuIcon: { marginRight: 10 },
  menuText: { fontSize: 16, color: "#333" },
});

export default AccountScreen;
