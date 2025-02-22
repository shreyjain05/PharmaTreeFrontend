import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";

const AddAddressScreen = () => {

    const navigation = useNavigation();

    const [currentAddressType, setcurrentAddressType] = useState('');

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 7.0 }}
                >
                    {title({ title: 'Deliver To' })}
                    {deliverToTextField()}
                    {description({ description: 'The bill will be prepared against this name' })}
                    {title({ title: 'Mobile Number' })}
                    {mobileNumberTextField()}
                    {description({ description: 'For all delivery related communication' })}
                    {title({ title: 'Pincode' })}
                    {pinCodeTextField()}
                    {title({ title: 'House Number and Building' })}
                    {houseNumberAndBuildingTextField()}
                    {title({ title: 'Street Name' })}
                    {streetNameTextField()}
                    {addressTypeInfo()}
                </ScrollView>
            </View>
            {addButton()}
        </View>
    )

    function addButton() {
        return (
            <View style={styles.addButtonWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.push('(tabs)')}
                    style={styles.addButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor19Medium }}>
                        Add
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function addressTypeInfo() {
        return (
            <View>
                <Text style={{
                    ...Fonts.primaryColor19Medium,
                    marginVertical: Sizes.fixPadding,
                    marginHorizontal: Sizes.fixPadding * 2.0
                }}>
                    Address Type
                </Text>
                <View style={styles.addressTypeWrapStyle}>
                    {addressType(
                        {
                            type: 'Home',
                            icon: require('../../assets/images/icons/icon_9.png'),
                        }
                    )}
                    {addressType(
                        {
                            type: 'Work',
                            icon: require('../../assets/images/icons/icon_10.png'),
                        }
                    )}
                    {addressType(
                        {
                            type: 'Other',
                            icon: require('../../assets/images/icons/icon_11.png'),
                        }
                    )}

                </View>
            </View>
        )
    }

    function addressType({ type, icon, index }) {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setcurrentAddressType(type)}
                style={{
                    marginRight: type == 'Home' || type == 'Work' ? Sizes.fixPadding + 5.0 : 0.0,
                    backgroundColor: currentAddressType == type ? '#BEBEBE' : Colors.whiteColor,
                    ...styles.addressTypeStyle,
                }}>
                <Image
                    source={icon}
                    style={{ width: 25.0, height: 25.0 }}
                />
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.primaryColor18Medium }}>
                    {type}
                </Text>
            </TouchableOpacity>
        )
    }

    function streetNameTextField() {
        return (
            <TextInput
                placeholder="e.g. Back Street"
                placeholderTextColor={Colors.primaryColor}
                style={styles.textFieldStyle}
                selectionColor={Colors.primaryColor}
                numberOfLines={1}
            />
        )
    }

    function houseNumberAndBuildingTextField() {
        return (
            <TextInput
                placeholder="e.g. Oberoi Heights"
                placeholderTextColor={Colors.primaryColor}
                style={styles.textFieldStyle}
                selectionColor={Colors.primaryColor}
                numberOfLines={1}
            />
        )
    }

    function pinCodeTextField() {
        return (
            <TextInput
                placeholder="e.g. 10001"
                selectionColor={Colors.primaryColor}
                keyboardType="numeric"
                placeholderTextColor={Colors.primaryColor}
                style={styles.textFieldStyle}
                numberOfLines={1}
            />
        )
    }

    function mobileNumberTextField() {
        return (
            <TextInput
                placeholder="e.g. +1 123456"
                selectionColor={Colors.primaryColor}
                keyboardType="numeric"
                placeholderTextColor={Colors.primaryColor}
                style={styles.textFieldStyle}
                numberOfLines={1}
            />
        )
    }

    function deliverToTextField() {
        return (
            <TextInput
                placeholder="e.g. John Doe"
                selectionColor={Colors.primaryColor}
                placeholderTextColor={Colors.primaryColor}
                style={styles.textFieldStyle}
                numberOfLines={1}
            />
        )
    }

    function description({ description }) {
        return (
            <Text style={{ ...Fonts.primaryColor17Regular, marginVertical: Sizes.fixPadding - 5.0, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                {description}
            </Text>
        )
    }

    function title({ title }) {
        return (
            <Text style={{ ...Fonts.primaryColor19Medium, marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                {title}
            </Text>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color={Colors.whiteColor}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ ...Fonts.whiteColor19Medium, marginLeft: Sizes.fixPadding }}>
                    Add Address
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        backgroundColor: Colors.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        height: 56.0,
        paddingHorizontal: Sizes.fixPadding * 2.0
    },
    textFieldStyle: {
        ...Fonts.primaryColor17Regular,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        height: 50.0,
        paddingHorizontal: Sizes.fixPadding
    },
    addButtonWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 2.0,
    },
    addButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0
    },
    addressTypeWrapStyle: {
        backgroundColor: '#ECECEC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Sizes.fixPadding + 10.0,
        paddingHorizontal: Sizes.fixPadding
    },
    addressTypeStyle: {
        flexDirection: 'row',
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding - 3.0,
        paddingHorizontal: Sizes.fixPadding + 5.0
    }
});

export default AddAddressScreen;