import { StyleSheet, Text, View , Image} from 'react-native'
import React from 'react'

const NotFind = ({data}) => {
  return (
    <View style={styles.parent}>
      <View style={styles.child}>
        <View>
            <Text style={{fontSize:22}}>{data}</Text>
        </View>
        <View style={{width:500}}>
            <Image source={require("../assets/NotFind.jpg")}
                style={{
                    width:"100%",
                    height:200,
                    resizeMode: "contain"
                }}
            />
        </View>
      </View>
    </View>
  )
}

export default NotFind

const styles = StyleSheet.create({
    parent:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        marginTop:50
    },
    child:{
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        width:"100%"
    }
})