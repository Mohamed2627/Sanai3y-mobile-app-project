import {
  FlatList,
  useWindowDimensions,
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
export default function Coursel({ item }) {
  return (
    <View style={styles.conteiner}>
      <View style={{width:"100%",height:250}}>
        <Image
          source={item.img}
          style={[styles.img, { resizeMode: "contain" }]}
        />

      </View>
      <View style={styles.Content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.Discraption}>{item.Discraption}</Text>
        <TouchableOpacity
          style={styles.parent}
          // onPress={()=>{navicate.navigate("register")}}
        >
          {item.id == 4 ? <Text style={styles.Click}>سجل الآن </Text> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:"column",
    // width:"100%",
    height:"100%"
  },
  img: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height:"100%",
    alignItems:"center"
  },
  Content: {
    // flex: 2,
    // flexDirection: "column",
    // alignItems:'flex-end'
    // justifyContent:"center",
    // alignItems:"center"
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
  },
  Click: {
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    color: "#404258",
    fontWeight: "bold",
    width: 100,
    marginTop: 20,
    height: 43,
    padding: 10,
    borderColor: "#404258",
    backgroundColor: "#ffb200",
    textAlign: "center",
  },
});
