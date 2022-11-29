import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { pathUrl } from '../Config/env';
import axios from "axios";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import NotFind from "../components/NotFind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { set } from "lodash";
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


export default function Works() {
  const navigation = useNavigation();
  const [data, setData] = useState([])
  const [token, setToken] = useState('')
  // console.log(data);
  // console.log(token);
  useEffect(() => {
    AsyncStorage.getItem('token').then((res) => {
      axios.get(`${pathUrl}/sanai3y/workstores`, { headers: { authorization: res } }).then((res) => {
        // console.log(res.data);
        setData(res.data.Data)
      }).catch((erorr) => {
        // console.log("erorr");
        console.log(erorr);

      })
    }).catch((err)=> console.log(err))

  }, [])

  // console.log(data);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    AsyncStorage.getItem('token').then((res) => {
      axios.get(`${pathUrl}/sanai3y/workstores`, { headers: { authorization: res } }).then((res) => {
        // console.log(res.data);
        setData(res.data.Data)
      }).catch((erorr) => {
        console.log("erorr");
        console.log(erorr);

      })
    }).catch((err)=> console.log(err))
  }, []);
const deleted = (id) => {
  AsyncStorage.getItem('token').then((res) => {
  let filterData=  data.filter((item)=>item._id!==id)
  setData([...filterData])
   axios.delete(`${pathUrl}/sanai3y/deletestore/${id}`,{headers:{authorization:res}})
  .then((res)=>{
    console.log(res);
  }).catch((err) => {

    console.log(err)

  })
  }).catch((err)=> console.log(err))
}
  return (
      <View style={styles.cont}>
        <View style={{alignItems:"center",paddingVertical:10,backgroundColor:'#fff'}}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate('AddWorks')}>
            <Text style={styles.buttonTextStyle}
            >اضافة عمل للمعرض </Text>
            <Icon name="plus" style={{color:'#fff', paddingRight:5, paddingLeft:5}} size={16}  />
          </TouchableOpacity>

        </View>
        {data.length > 0 && <FlatList
         contentContainerStyle={{ paddingBottom: 200,marginLeft:20 ,backgroundColor:"#fff"}}
         refreshControl={
           <RefreshControl
             refreshing={refreshing}
             onRefresh={onRefresh}
           />
         }
          data={data}
          keyExtractor={( item ,index ) => index}
          renderItem={({ item }) => (

            <View  style={styles.card}>

              <Image
                source={{
                  uri: `${pathUrl}${item.img?.slice(21)}`,
                }}
                style={{ height: 200, borderTopRightRadius: 10, borderTopLeftRadius: 10}}
              />
              <Text style={styles.job}>{item.title}</Text>

              <Text style={styles.description}>{item.description} </Text>
              <TouchableOpacity style={styles.buttonDelete}
               activeOpacity={0.5}
               onPress={()=>deleted(item?._id)}
              >
                <Text style={styles.buttonDeleteStyle}> حذف</Text>
              </TouchableOpacity>
            </View>

          )}
        />}
        <ScrollView
          style={{backgroundColor:"#fff"}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >

          {data.length == 0 && <NotFind data={"لايوجد منشورات"} />}
        </ScrollView>
      </View>
  );
}
const styles = StyleSheet.create({
  cont: {
    flex:1,
    color: "black",
    backgroundColor:'#FFF',
    flexDirection: "column",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    
    // margin:'auto',
    borderRadius: 10,
    marginHorizontal:5,
    justifyContent:"center",
    justifyContent:"center",
    flexDirection: "column",
    elevation: 3,
    marginTop: 15,
    marginBottom: 15,

  },
  description: {
    margin: 20,
    fontSize: 16,
    color: "#222222",
    // backgroundColor:"#D4D4D4"

  },
  job: {
    borderBottomWidth:1,
    marginLeft: 15,
    marginRight: 15,
    paddingTop:15,
    paddingBottom:15,
    // borderBottomWidth:1,
    borderColor:"#99999982",
    // elevation:5,
  //  flex:2,
    fontSize: 20,
    color:"#000",
    // fontWeight:"bold",
    fontWeight: "700",
    // backgroundColor: "#FFC133",
    // borderBottomColor:"#ffb200",
    // borderBottomWidth:1,
    // width:,
    // borderTopWidth:1,
  },
  buttonStyle: {
    backgroundColor: "#ffb200",
    // borderWidth: 0,
    paddingHorizontal:7,
    color: "#FFFFFF",
    // borderColor: '#000',
    height: 40,
    flexDirection:'row',
    alignItems: "center",
    borderRadius: 5,
    // width: 120,
    // marginLeft: 35,
    // marginRight: 35,
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
  },
  buttonDelete: {
    backgroundColor: "#fff",
    // borderWidth: 0,
    color: "#FFFFFF",
    // borderColor: '#000',
    // alignItems: "center",
    borderRadius: 5,
    width: 70,
    marginLeft: 15,
    textAlign:"center",
    paddingVertical:4,
    borderRadius:7,
    borderColor:"#dc3545",
    borderWidth:1,
    marginBottom:10,
    // marginRight: 35,
    marginTop: 15,
    marginBottom: 20,
    elevation: 5,
  },
  buttonTextStyle: {
    color: "white",
    // width:150,
    paddingVertical: 10,
    marginLeft:7,
    fontSize: 16,
    fontWeight:"bold",
  },
  buttonDeleteStyle: {
    color: "#dc3545",
    
 
    width:70,
    marginLeft:15,
    fontSize: 16,
    fontWeight: "bold",
  },
});
