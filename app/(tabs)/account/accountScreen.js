import React, { useState, useContext, useCallback } from "react";
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
import { AppContext } from "../../context/AppProvider";

const { width } = Dimensions.get("screen");

const AccountScreen = () => {
  const navigation = useNavigation();
  const { loggedInUser } = useContext(AppContext);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useFocusEffect(
    useCallback(() => {
      console.log("AccountScreen Loaded");
      return () => console.log("AccountScreen Unloaded");
    }, [])
  );

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
      title: "Finance & Payments",
      items: [
        {
          title: "Payments Information",
          icon: <CreditCard size={24} color="#10857F" />,
          screen: "adminPanel/PaymentsInformationScreen",
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Admin Panel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.profileCard}>
          <Text style={styles.name}>
            {loggedInUser.firstName} {loggedInUser.lastName}
          </Text>
          <Text style={styles.email}>{loggedInUser.businessName}</Text>
        </Card>

        {groupedMenuItems.map((section, index) => (
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
                  onPress={() => navigation.navigate(item.screen)}
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
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    margin: 15,
  },
  name: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  email: { fontSize: 14, textAlign: "center", color: "#777" },
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
