import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../component/myStatusBar";
import { useNavigation } from "expo-router";

const OfferDetailScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {offerDetails()}
                </ScrollView>
            </View>
        </View>
    )

    function offerDetails() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding + 2.0, marginVertical: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.primaryColor18Medium, lineHeight: 23.0, }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever siwhen an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Text>
                <Text style={{ ...Fonts.primaryColor18Medium, lineHeight: 23.0, marginTop: Sizes.fixPadding + 5.0 }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever siwhen an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Text>
                <Text style={{ ...Fonts.primaryColor18Medium, lineHeight: 23.0, marginTop: Sizes.fixPadding + 5.0 }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever siwhen an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </Text>
            </View>
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
                <Text style={{ ...Fonts.whiteColor19Medium, marginLeft: Sizes.fixPadding + 5.0 }}>
                    Offer Detail
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.primaryColor,
    }

});

export default OfferDetailScreen;