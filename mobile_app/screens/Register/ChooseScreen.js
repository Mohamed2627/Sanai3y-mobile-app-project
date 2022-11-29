import { StyleSheet, Text, View , Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const ChooseScreen = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.parent}>
      <View style={{justifyContent:"center"}}>
        <Text style={{fontSize:25,marginBottom:20}}>مرحباً بك أختر طريقة التسجيل التي تريدها</Text>
      </View>
      <View style={{height:200, justifyContent:"center",alignItems:"center"}}>
        <FontAwesome name="user-circle-o" style={{fontSize:200 ,color:"#fbb200"}} />
      </View>

      <View style={{height:200,alignItems:"center",justifyContent:"center"}}>
        <TouchableOpacity style={styles.buttonChoose}
          onPress={()=> navigation.navigate('registerClient')}
        >
            <Text style={styles.textChoose}>سجل كعميل</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonChoose}
          onPress={()=> navigation.navigate('registerSnai3y')}
        >
            <Text style={styles.textChoose}>سجل كحرفي</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection:"row-reverse"}}>
        <TouchableOpacity style={{marginLeft:8}}
          onPress={()=>navigation.navigate('login')}
        >
            <Text style={{fontSize:22,color:"#1d4ed8"}}>دخول</Text>
        </TouchableOpacity>
        <Text style={{fontSize:20}}>
            لدي حساب بالفعل!
        </Text>
      </View>
    </View>

  )
}

export default ChooseScreen

const styles = StyleSheet.create({
    parent:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    buttonChoose:{
        backgroundColor:"#fbb200",
        paddingVertical:10,
        width:220,
        marginTop:15,
        alignItems:"center",
        borderRadius:5,
        elevation:5
    },
    textChoose:{
        fontSize:28,
        color:"#fff"
    }
})