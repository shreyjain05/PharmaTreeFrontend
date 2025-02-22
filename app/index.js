import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Colors, Sizes } from "../constant/styles";
import { CircleFade } from 'react-native-animated-spinkit';
import MyStatusBar from "../component/myStatusBar";
import { useNavigation } from "expo-router";

const SplashScreen = () => {

    const navigation = useNavigation();

    useEffect(() => {
        console.log("inside useeffect firstpage");

        const timer = setTimeout(() => {

            navigation.push('auth/signinScreen');
        }, 2000);
        return () => {
            clearTimeout(timer);
        }
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {appLogo()}
                <CircleFade
                    size={45}
                    color={Colors.primaryColor}
                    style={{ alignSelf: 'center' }}
                />
            </View>
        </View>
    )

    function appLogo() {
        return (
            <Image
                source={require('../assets/images/transparent-icon.png')}
                style={styles.appLogoStyle}
                resizeMode="contain"
            />
        )
    }
}

const styles = StyleSheet.create({
    appLogoStyle: {
        width: 200.0,
        height: 200.0,
        alignSelf: 'center',
        marginBottom: Sizes.fixPadding * 4.0,
    },
})

export default SplashScreen;