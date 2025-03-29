import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { Card, TextInput, Dialog } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../context/AppProvider";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { useNavigation } from "expo-router";
import BASE_URL from "../../constant/variable";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("screen");

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { products } = useContext(AppContext);

  const [state, setState] = useState({
    showSuccessDialog: false,
  });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { showSuccessDialog } = state;

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = products.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };

  const isCustomerAdmin = () => {
    return (
      loggedInUser?.isAdmin === "ADMIN" ||
      loggedInUser?.isAdmin === "SUPERADMIN"
    );
  };

  useEffect(() => {
    const fetchApplicationConfig = async () => {
      console.log("inside grace period use effect");

      try {
        const response = await fetch(`${BASE_URL}/api/v1/feedback`);
        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks");
        }
        const data = await response.json();
        console.log("data from feedback api is ", data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching Configurations:", error);
      }
    };

    fetchApplicationConfig();
  }, []);

  const submitFeedback = async () => {
    try {
      const feedbackData = {
        subject: feedbackSubject,
        feedbackText: feedbackText,
        name: loggedInUser.firstName + " " + loggedInUser.lastName,
      };
      console.log("Updated Config Data", feedbackData);
      const response = await fetch(`${BASE_URL}/api/v1/feedback`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });
      if (!response.ok) {
        throw new Error("Failed to add feedback");
      } else {
        setModalVisible(false);
        updateState({ showSuccessDialog: true });
        setTimeout(() => {
          updateState({ showSuccessDialog: false });
          navigation.push("adminPanel/FeedbackScreen");
          setModalVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  function successDialog() {
    return (
      <Dialog visible={showSuccessDialog} style={styles.dialogWrapStyle}>
        <View
          style={{ backgroundColor: Colors.whiteColor, alignItems: "center" }}
        >
          <View style={styles.successIconWrapStyle}>
            <MaterialIcons name="done" size={40} color={Colors.primaryColor} />
          </View>
          <Text
            style={{
              ...Fonts.grayColor18Medium,
              marginTop: Sizes.fixPadding + 10.0,
            }}
          >
            Feedback has been sent!
          </Text>
        </View>
      </Dialog>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
      </View>

      {/* Inventory Information Header */}
      <Card style={styles.infoHeader}>
        <Text style={styles.infoHeaderText}>Customer Feedbacks</Text>
      </Card>

      <ScrollView>
        <ImageBackground
          source={{ uri: "https://www.example.com/medical-inventory-bg.jpg" }}
          style={styles.backgroundImage}
        >
          <FlatList
            style={styles.flatList}
            data={(isCustomerAdmin()
              ? filteredData
              : filteredData.filter(
                  (feedback) =>
                    feedback.name ===
                    loggedInUser.firstName + " " + loggedInUser.lastName
                )
            ).filter((item) =>
              item.subject.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.touchableContainer}>
                <Card style={styles.card}>
                  {" "}
                  {/* Changed View to Card */}
                  <View style={styles.detailsContainer}>
                    {/* Subject and Feedback */}
                    <View style={styles.rowContainer}>
                      <Text style={styles.subject}>
                        Subject: {item.subject}
                      </Text>
                    </View>
                    {/* Name Field */}
                    <View style={styles.rowContainer}>
                      <Text style={styles.name}>Customer: {item.name}</Text>
                    </View>

                    <View style={styles.rowContainer}>
                      <Text style={styles.feedback}>{item.feedbackText}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Give Feedback</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Feedback</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              //value={feedbackName}
              editable={false}
              defaultValue={
                loggedInUser.firstName + " " + loggedInUser.lastName
              }
              onChangeText={setFeedbackName}
            />
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={feedbackSubject}
              onChangeText={setFeedbackSubject}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your Feedback"
              multiline
              numberOfLines={2}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <View style={styles.buttonModalContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitFeedback}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {successDialog()}
    </View>
  );
};

const styles = StyleSheet.create({
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 100,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding * 3.0,
    paddingTop: Sizes.fixPadding - 5.0,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7F9",
  },
  headerWrapStyle: {
    backgroundColor: "#10857F",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    elevation: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoHeader: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    margin: 15,
    elevation: 4,
    alignItems: "center",
  },
  infoHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#10857F",
  },
  searchContainer: {
    padding: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#10857F",
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    color: "#10857F",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  flatList: {
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    backgroundColor: "#FFFFFF",
    margin: 10,
  },
  touchableContainer: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 10,
  },
  detailsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  feedback: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  feedbackButton: {
    backgroundColor: "#10857F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10857F",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#10857F",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F4F7F9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonModalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#10857F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#D9534F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FeedbackScreen;
