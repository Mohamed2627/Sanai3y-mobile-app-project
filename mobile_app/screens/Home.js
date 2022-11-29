import { View, Text, StyleSheet, TextInput, Image, Button, FlatList, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import axios from 'axios';
import { pathUrl } from '../Config/env'
import { set } from "lodash";
import NotFind from "../components/NotFind";
import dateformat, { masks } from "dateformat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loder";
import { Searchbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getDataJops } from "../Redux/Slices/JobsReducer";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Home() {
  const navigation = useNavigation();
  const [flag, seTflag] = useState(false); // re render to component 
  const [loader, setLoader] = useState(true)
  // const [allJob, setAllJob] = useState([]) // All Jops
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [search, setSearch] = useState("");
  const allJob = useSelector(state => state.JobsReducer.dataJobs)
  const dispatch = useDispatch()
  useEffect(() => {
    seTflag(true);

    setFilteredDataSource(allJob)
    return () => {
      seTflag(false)
      setLoader(true)
    }

  }, [allJob])

  // console.log(val)
  const searchFilterFunction = (text) => {
    if (text) {
      const newData = allJob.filter(function (item) {
        const itemfirstName =item.clientData?.firstName.toUpperCase()
        const itemlastName = item.clientData?.lastName.toUpperCase()
        const itemTitle = item.title?.toUpperCase()
        const itemDscription = item.description?.toUpperCase()
        const itemCity = item.city?.toUpperCase()
        const itemCatogry = item.category?.toUpperCase()
        const textData = text.toUpperCase();
        return itemfirstName?.indexOf(textData) >= 0 || itemlastName?.indexOf(textData) >= 0 || itemTitle?.indexOf(textData) >= 0 || itemDscription?.indexOf(textData) >= 0 || itemCity?.indexOf(textData) >= 0 || itemCatogry?.indexOf(textData) >= 0
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(allJob);
      setSearch(text);
    }
  };



  function delet(id) {
    setFilteredDataSource((prev) => prev.filter((item) => item._id != id));
  }
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    dispatch(getDataJops())
  }, []);
  // Start JSX
  return (
    <>
      { <View style={styles.container}>
        {/* Start Search */}

        <Searchbar
          onChangeText={(text) => searchFilterFunction(text)}
          style={styles.search}
          value={search}
          iconColor="#ffb200"
          keyboardType="default"
          placeholderTextColor="#8b9cb5"
          placeholder="بحث"
        />


        {/* Start Box Posts */}

        {allJob.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={filteredDataSource}
            keyExtractor={(item, index) => index}
            refreshControl={
              <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
            }
            renderItem={({ item }) => (
              <View style={[styles.box, styles.shadowProp]}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ClientShow", { data: item })
                  }
                  style={{ width: "50%" }}
                >
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-start" }}
                  >
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: `${pathUrl}${item.clientData?.img.slice(21)}`,
                      }}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text
                        style={{
                          marginRight: 10,
                          paddingRight: 10,
                          borderRightWidth: 1,
                          borderRightColor: "#ffb200",
                          fontWeight: "bold",
                        }}
                      >
                        {item.clientData?.firstName +
                          " " +
                          item.clientData?.lastName}
                      </Text>

                      <Text
                        style={{ fontSize: 10, textAlign: "left", color: "#777" }}
                      >
                        {dateformat(item?.hiredDate, " h:MM  TT")}
                      </Text>

                      {/* <Text style={{ paddingRight: 10, color: "#999", fontSize: 10 }}>
                    {item.city}
                  </Text> */}
                    </View>
                  </View>
                </TouchableOpacity>

                <AntDesign
                  name="closecircle"
                  style={styles.test}
                  onPress={() => delet(item._id)}

                />

                <Text
                  style={{
                    paddingTop: 5,
                    paddingHorizontal: 10,
                    fontSize: 12,
                    color: "#444",
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  style={{
                    paddingRight: 10,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    marginBottom: 10,
                    borderBottomColor: "#EEE",
                  }}
                >
                  {item.description}
                </Text>

                <Text
                  style={{
                    paddingRight: 10,
                    paddingBottom: 5,
                    color: "#111",
                    fontSize: 12,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}> العنوان : </Text>
                  {item.city}
                </Text>

                <Text
                  style={{
                    paddingRight: 15,
                    paddingBottom: 10,
                    color: "#111",
                    fontSize: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#EEE",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    عدد الطلبات المقدمة :{" "}
                  </Text>

                  <Text style={{}}>{item?.proposals.length}</Text>
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      backgroundColor: "#EEE",
                      width: 80,
                      textAlign: "center",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  >
                    {item.category}
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{
                        backgroundColor: "#ffb200",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                      }}
                      onPress={() =>
                        navigation.navigate("SendTalp", { one: item })
                      }
                    >
                      التفاصيل
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
        {/* End Box Posts */}
        {allJob.length == 0 && <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >

          <NotFind data={"لاتوجد منشورات الان"} />
        </ScrollView>}
      </View>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
    color: "#000",
  },
  search: {
    // flex: 1,
    color: "#000",
    marginVertical: 10,
    // padding:10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    // borderRadius: 5,
    borderColor: "#ffb200",
    elevation: 2,

  },
  box: {

    position: "relative",
    marginTop: 20,
    padding: 15,
    elevation: 1,
    shadowColor: "#99999982",
    borderRadius: 5,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#ffb200",
    // color:'red',
    padding: 10,
    textAlign: "right",
    width: "88%",
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  test: {
    fontSize: 20,
    position: "absolute",
    top: 20,
    right: 20,
  },
});

