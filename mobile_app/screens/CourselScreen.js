import { View, StyleSheet, FlatList, Text, Animated, ScrollView, Image, TouchableOpacity } from "react-native";
import DumyDatat from "./DumyData";
import { useState, useRef } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CuorselItem() {
  const [courentIndex, setCuorentIndex] = useState(0);
  const scrolX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation()
  return (
    <View style={styles.container}>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator
        pagingEnabled
        bounces={false}
        style={{ flex: 1, marginHorizontal: 10, paddingHorizontal: 10 }}
        contentContainerStyle={
          {
            justifyContent: "center",
            alignItems: "center",

          }
        }
      >
        {DumyDatat.map((item) =>
          <View key={item.id} style={{ flex: 1 }}>
            <View style={
              {
                marginHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: 350,
                height: 250,
                marginBottom: 30
              }}>
              <Image
                source={item.img}
                style={[styles.img, { resizeMode: "stretch" }]}
              />

            </View>
            <View style={styles.Content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.Discraption}>{item.Discraption}</Text>
            </View>
            <View style={styles.parent}>

              {item.id !=1 && <TouchableOpacity
                style={styles.Click}
              onPress={()=>{navigation.navigate("registerChoose")}}
              >
                {<Text style={{fontSize:22 }}>{item.id == 4? "سجل الآن " : "تخطي"}</Text> }
                {item.id != 4  &&<MaterialCommunityIcons style={{marginStart:5}} size={20} name="skip-backward" />}
                {item.id == 4 && <AntDesign style={{transform:[{rotate:"180deg"}]}} size={20} name="login"/>}
              </TouchableOpacity>}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",

  },
  img: {
    // flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    alignItems: "center"
  },
  Content: {
    // flex: 2,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    marginTop: 0,
    marginBottom: 10,
    fontWeight: "800",
    textAlign: "center",
    color: "#404258",
  },
  Discraption: {
    fontSize: 20,
    width: 360,
    color: "#182747",
    marginBottom: 30,
    fontWeight: "300",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  parent: {
    alignItems: "center",
    justifyContent:"center",
  },
  Click: {
    borderRadius: 5,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 20,
    height: 43,
    padding: 10,
    paddingHorizontal:20,
    backgroundColor: "#ffb200",
    textAlign: "center",
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"row"
  },
});
