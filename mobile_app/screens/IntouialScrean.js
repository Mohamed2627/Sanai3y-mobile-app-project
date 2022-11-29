import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Animated } from "react-native";

function IntuoialScreen() {
  const progress = useRef(new Animated.Value(0.5)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation()
  useEffect(()=>{
    setTimeout(() => {

      AsyncStorage.getItem('token').then((res)=>{
        if(res == null){
          navigation.navigate('login')
        }
        else{
          navigation.navigate('Home')
        }
      })

    }, 2000);
  },[])

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.spring(progress, { toValue: 0, useNativeDriver: true }),
          Animated.spring(progress, { toValue: 5, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(scale, { toValue: 0, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 2, useNativeDriver: true }),
        ]),
      ]),
      { iterations: 1}
    ).start();
  }, []);
  return (
    <View style={styles.container}>
      <Animated.Image
        style={[
          styles.logo,
          {
            borderRadius: progress.interpolate({
              inputRange: [1, 1],
              outputRange: [Size / 2, Size / 2],
            }),
            opacity: progress.interpolate({
              inputRange:[0.5,2],
              outputRange:[0.5,1]
            }),
            transform: [
              { scale },
              {
                // rotate: progress.interpolate({
                //   inputRange: [0.5, 1],
                //   outputRange: [Math.PI, 2 * Math.PI],
                // }),
                "rotateX":"5deg"
              },
            ],
          },
        ]}
        source={require("../assets/logo.png")}
      />


{/* <Animated.Text
        style={[
          styles.logo,
          {
            borderRadius: progress.interpolate({
              inputRange: [1, 1],
              outputRange: [Size / 2, Size / 2],
            }),
            // opacity: progress.interpolate({
            //   inputRange:[0.5,2],
            //   outputRange:[0.5,1]
            // }),
            transform: [
              { scale },
              {
                 rotate: progress.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: ['180deg', '360deg'],
                }),
              },
            ],
          },
        ]}

        // source={require("../assets/photo_2022-11-03_19-55-55.jpg")}
      >wellcome</Animated.Text>
      <Text style={styles.pragraph}></Text>
      <StatusBar style="auto" /> */}
    </View>
  );
}
const Size=100
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: Size,
    height: Size,
    resizeMode:"contain"
  },
  pragraph: {
    fontSize: 30,
    color: "whaite",
  },
});
export default IntuoialScreen;
