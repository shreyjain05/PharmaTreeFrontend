import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Colors, Fonts, Sizes } from "../../../constant/styles";
import { Card } from "react-native-paper";
import {
  User,
  ChevronRight,
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
  const { loggedInUser, isAdmin } = useContext(AppContext);

  const [logoutVisible, setLogoutVisible] = useState(false);

  // ✅ Proper useFocusEffect with useCallback
  useFocusEffect(
    useCallback(() => {
      console.log("AccountScreen Loaded");
      if (loggedInUser) console.log("User:", loggedInUser);
      if (isAdmin !== undefined) console.log("Is Admin:", isAdmin);

      return () => {
        console.log("AccountScreen Unloaded"); // Clean-up when screen loses focus
      };
    }, [loggedInUser, isAdmin])
  );

  const menuItems = [
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
      title: "Create Order",
      icon: <PlusCircle size={24} color="#10857F" />,
      screen: "adminPanel/CreateOrderAdminScreen",
    },
    {
      title: "Upload All Stock",
      icon: <Upload size={24} color="#10857F" />,
      screen: "adminPanel/UploadAllStockScreen",
    },
    {
      title: "Payments Information",
      icon: <CreditCard size={24} color="#10857F" />,
      screen: "adminPanel/PaymentsInformationScreen",
    },
    {
      title: "Invoice Information",
      icon: <FileText size={24} color="#10857F" />,
      screen: "adminPanel/InvoiceInformationScreen",
    },
    {
      title: "Inventory Information",
      icon: <Package size={24} color="#10857F" />,
      screen: "adminPanel/InventoryInformationScreen",
    },
    {
      title: "Chemist Discount Config",
      icon: <Percent size={24} color="#10857F" />,
      screen: "adminPanel/ChemistDiscountConfigScreen",
    },
    {
      title: "Chemist Payment Option",
      icon: <CreditCardIcon size={24} color="#10857F" />,
      screen: "adminPanel/ChemistPaymentOptionScreen",
    },
    {
      title: "Order Information",
      icon: <Info size={24} color="#10857F" />,
      screen: "adminPanel/OrderInformationScreen",
    },
    {
      title: "Grace Period Setting",
      icon: <Clock size={24} color="#10857F" />,
      screen: "adminPanel/GracePeriodSettingScreen",
    },
    {
      title: "Targets Setting",
      icon: <Target size={24} color="#10857F" />,
      screen: "adminPanel/TargetsSettingScreen",
    },
    {
      title: "License Approval",
      icon: <Target size={24} color="#10857F" />,
      screen: "adminPanel/DrugLicenseApprovalScreen",
    },
    {
      title: "Admin Product",
      icon: <Target size={24} color="#10857F" />,
      screen: "adminPanel/AdminProductScreen",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
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
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileSection}>
            {/* <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.profileImage}
            /> */}
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>johndoe@example.com</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>📞 +1 234 567 890</Text>
            <Text style={styles.infoText}>🏠 123 Main St, City, Country</Text>
          </View>
        </Card>

        {/* Admin Menu List */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuIcon}>{item.icon}</View>
            <Text style={styles.menuText}>{item.title}</Text>
            <ChevronRight size={24} color="#10857F" />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutVisible(true)}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={logoutVisible}
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => navigation.push("auth/signinScreen")}
              >
                <Text style={styles.confirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Updated Styles
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 4,
  },
  profileSection: { alignItems: "center" },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  email: { fontSize: 14, color: "#777" },
  infoSection: { marginTop: 10 },
  infoText: { fontSize: 14, color: "#555", marginVertical: 2 },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: "#000",
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  menuText: { flex: 1, fontSize: 16, color: "#333" },

  logoutButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default AccountScreen;
