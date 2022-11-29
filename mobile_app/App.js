import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";
import Index from "./screens/index";

export default function App() {

  return (
    <>
      <Provider store={Store}>

        <Index />
      </Provider>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
