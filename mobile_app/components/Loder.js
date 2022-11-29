import React, {useState, useEffect} from 'react';
import { StyleSheet, Text} from 'react-native';
import { DotIndicator, BallIndicator ,MaterialIndicator,SkypeIndicator} from 'react-native-indicators';
export default function Loader() {
  const [animating, setanimating] = useState(true);
  useEffect(() => {
    
  }, []);

  return (
    <MaterialIndicator color='#fbb200' size={60}/>
  );
}
