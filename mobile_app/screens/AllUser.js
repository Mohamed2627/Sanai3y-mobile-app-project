import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { pathUrl } from "../Config/env";
import axios from "axios";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import Moment from "moment";
// import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import Loader from "../components/Loder";


export default function AllSanai3y() {
  const [data, setData] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation()
  const [ loader , setLoader] = useState(true)
  useEffect(() => {
    axios.get(`${pathUrl}/sanai3y/all`).then((res) => {
      setData([...res.data.Data]);
      if(res.status == 200){
        setTimeout(() => {
          setLoader(false)
        }, 1100);
      }
      setFilteredDataSource([...res.data.Data]);
    });
    // console.log("object");
  }, []);
  // console.log(data.length);
  const searchFilterFunction = (text) => {
    if (text) {
      const newData = data.filter(function (item) {
        const itemfirstName = item.firstName?.toUpperCase()
        const itemlastName = item.lastName?.toUpperCase()
        const itemaddress = item.address?.toUpperCase()
        const itemskills = item.skills?.toUpperCase()
        const textData = text.toUpperCase();
        return itemfirstName.indexOf(textData) >= 0 || itemlastName.indexOf(textData) >= 0 || itemaddress.indexOf(textData) >= 0 || itemskills.indexOf(textData) >= 0
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(data);
      setSearch(text);
    }
  };

  return (
    <>
    
      {!loader &&<View style={styles.cont}>
        <Searchbar
          onChangeText={(text) => searchFilterFunction(text)}
          style={styles.search}
          value={search}
          iconColor="#ffb200"
          keyboardType="default"
          placeholderTextColor="#8b9cb5"
          placeholder=" بحث عن صنايعية"
        />
        <FlatList
          data={filteredDataSource}
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }, index) => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {navigation.navigate("Sanai3yShow", { data: item }); }}
            >
              <View key={index} style={styles.card}>
                <View style={{ height: 150,justifyContent: "center", marginStart:5 }}>
                  <Image
                    source={{
                      uri: `${pathUrl}${item.img?.slice(21)}`
                    }}
                    style={{ width: 120, height: "90%", resizeMode: "stretch" ,borderRadius:10 }}
                  />
                </View>

                <View style={{ flexDirection: "column", marginLeft: 30, alignItems: "flex-start" }}>
                  <Text
                    style={styles.job}
                  >{`${item.firstName} ${item.lastName}`}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        styles.description,
                        styles.skills,
                        { marginRight: 20 }
                      ]}
                    >
                      {item.skills}
                    </Text>
                  </View>

                  <View>

                    <Text style={styles.description}>{`عدد الوظائف :  ${item.jobs.length == 0 ? "لايوجد":item.jobs.length}`} </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Entypo
                      name="location-pin"
                      style={{ color: "#ffb200", margin: -6 }}
                      size={26}
                      color="black"
                    />
                    <Text style={styles.description}> {item.address} </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>

                    <AntDesign
                      name="clockcircle"
                      style={{ color: "#ffb200", fontSize: 16 }}
                    />
                    <Text style={styles.description}>
                      {Moment(item.joinedDate).format("D MMM YYYY")}
                    </Text>
                  </View>


                </View>
              </View>
            </TouchableOpacity>
          )}
          />
      </View>}
      {loader && <Loader/>}
    </>
  );
}
const styles = StyleSheet.create({
  cont: {
    color: "black",
    //   justifyContent:'center',
    // alignItems: "center",
    flexDirection: "column",
    marginRight: 20,
    marginLeft: 20,
  },
  search: {
    // flex: 1,
    color: "#000",
    marginTop: 10,
    // padding:10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    // borderRadius: 5,
    borderColor: "#ffb200",
    elevation: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "black",
    borderColor: "#dadae8",
    borderWidth: 1,
    alignContent: "space-between",
    flexDirection: "row",
    elevation: 2,
    marginTop: 15,
    // marginBottom: 15,
    paddingRight: 15,
    // padding: 5,
  },
  description: {
    margin: 5,
    fontSize: 14,
    color: "#000",
  },
  skills: {
    // borderWidth: 1,
    borderRadius: 5,
    padding: 2,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    backgroundColor: "#ffb200",
    marginLeft: 0,
  }
  ,
  job: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    // color: "#ffb200",
    // borderTopWidth:1,
  },
});
