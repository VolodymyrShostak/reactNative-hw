import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { authSignUpUser } from "../../redux/auth/authOperations";
import { storage } from "../../firebase/config";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

export default function RegistrationScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [hidePass, setHidePass] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [focus, setFocus] = useState({
    login: false,
    email: false,
    password: false,
  });
  const dispatch = useDispatch();
  const handleSetLogin = (text) => setLogin(text);
  const handleSetEmail = (text) => setEmail(text);
  const handleSetPassword = (text) => setPassword(text);
  const formReset = () => {
    setLogin("");
    setAvatar(null);
    setEmail("");
    setPassword("");
  };

  const uploadPhotoToServer = async (avatarId) => {
    try {
      const response = await fetch(avatar);
      const file = await response.blob();
      await uploadBytes(ref(storage, `avatars/${file._data.blobId}`), file);
      const photoUrl = await getDownloadURL(
        ref(storage, `avatars/${file._data.blobId}`)
      );
      return photoUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (email === "" || password === "" || login === "")
      return console.log("Неможливо зареєструватися");

    const avatar = await uploadPhotoToServer();
    dispatch(authSignUpUser({ email, password, login, avatar }));
    formReset();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ImageBackground
          style={styles.image}
          source={require("../../assets/background.jpg")}
        >
          <View style={styles.imageWrap}>
            <Image style={styles.imageSpace} source={{ uri: avatar }} />
            <TouchableOpacity style={styles.icon} onPress={pickImage}>
              <Image source={require("../../assets/iconAddPhoto.png")} />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={{
                ...styles.form,
                paddingBottom: isShowKeyboard ? 70 : 129,
              }}
            >
              <Text style={styles.title}>Реєстрація</Text>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: focus.login ? "#FF6C00" : "#E8E8E8",
                }}
                placeholder="Логін"
                value={login}
                onFocus={() => {
                  setIsShowKeyboard(true);
                  setFocus((focus) => ({ ...focus, login: true }));
                }}
                onBlur={() => {
                  setIsShowKeyboard(false);
                  setFocus((focus) => ({ ...focus, login: false }));
                }}
                onChangeText={handleSetLogin}
              />
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: focus.email ? "#FF6C00" : "#E8E8E8",
                }}
                placeholder="Адреса електронної пошти"
                value={email}
                onFocus={() => {
                  setIsShowKeyboard(true);
                  setFocus((focus) => ({ ...focus, email: true }));
                }}
                onBlur={() => {
                  setIsShowKeyboard(false);
                  setFocus((focus) => ({ ...focus, email: false }));
                }}
                onChangeText={handleSetEmail}
              />
              <View style={styles.passwordWrap}>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: focus.password ? "#FF6C00" : "#E8E8E8",
                  }}
                  placeholder="Пароль"
                  secureTextEntry={hidePass ? true : false}
                  value={password}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                    setFocus((focus) => ({ ...focus, password: true }));
                  }}
                  onBlur={() => {
                    setIsShowKeyboard(false);
                    setFocus((focus) => ({ ...focus, password: false }));
                  }}
                  onChangeText={handleSetPassword}
                />
                <Text
                  style={styles.show}
                  onPress={() => setHidePass(!hidePass)}
                >
                  {!hidePass ? "Сховати" : "Показати"}
                </Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.btnTitle}>Зареєструватись</Text>
              </TouchableOpacity>

              <View style={styles.wrapperCustom}>
                <Text style={styles.text}>Вже маєте акаунт?</Text>
                <Text
                  style={styles.text}
                  onPress={() => navigation.navigate("Login")}
                >
                  {" "}
                  Увійти
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  imageWrap: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  icon: {
    width: 25,
    height: 25,
    position: "absolute",
   transform: [{translateY: 90}, {translateX: 60}],
  },

  input: {
    height: 54,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    padding: 15,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  form: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 16,
  },
  title: {
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    fontFamily: "Roboto-Medium",
    lineHeight: 35,
    color: "#212121",
    marginTop: 92,
    marginBottom: 32,
  },
  passwordWrap: {
    position: "relative",
  },
  show: {
    position: "absolute",
    right: 16,
    top: "20%",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
  },
  button: {
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#FF6C00",
    borderRadius: 100,
    height: 54,
    marginBottom: 16,
    marginTop: 27,
  },
  btnTitle: {
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#FFFFFF",
    padding: 15,
  },
  wrapperCustom: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
  },

  imageSpace: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    transform: [{ translateY: 60 }],
  },

  option: {
    textAlign: "right",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
    transform: [{ translateY: -55 }],
    marginRight: 16,
  },
});
