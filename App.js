import React, {Component, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button, FlatList, Animated, Modal, PermissionsAndroid, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Dropdown} from 'react-native-element-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AutoGrowTextInput } from 'react-native-auto-grow-textinput';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode='screen'>
        <Stack.Screen name='Start' component={StartPage} options={{headerShown: false}}/>
        <Stack.Screen name='Login' component={LoginPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='Signup' component={SignupPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='Home' component={HomePage} options={{headerShown: false}}/>
        <Stack.Screen name='Report' component={ReportPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='SubmitReport' component={SubmitReportPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='Profile' component={ProfilePage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const Logo = () => {
  return (
    <View>
      <Image
        source={require("./icons/steps.png")}
        resizeMode="contain"
        style={styles.image}
      ></Image>
      <Text style={styles.walk}>Walk</Text>
      <Text style={styles.safe}>Safe</Text>
    </View>
  );
};

const StartPage = ({navigation}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <Logo />
        <View style={styles.frontCircles1}></View>
        <View style={styles.frontCircles2}></View>
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.start_title}>Περπατήστε με ασφάλεια!</Text>
          <Text style={styles.start_text}>Ενημερωθείτε ανά πάσα στιγμή για επικίνδυνα
          περιστατικά που συνέβησαν κοντά σας ή αναφέρετε κι εσείς οι ίδιοι κάποιο περιστατικό.
          </Text>
          <Text style={styles.start_text}>Σχεδιάστε και πλοηγηθείτε στην πιο ασφαλή για εσάς διαδρομή!</Text>
        </View>
        <View style={{top:310 , alignSelf: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Login') }>
            <Text style={styles.login}>Είσοδος</Text>
          </TouchableOpacity>
        </View>
        <View style={{top:330 , alignSelf: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signup}>Δημιουργία Λογαριασμού</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const LoginPage = ({navigation}) => {
  return(
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={styles.frontCircles1}></View>
        <View style={styles.frontCircles2}></View>
        <Text style={{fontFamily: 'serif', fontSize:23, fontWeight: 'bold', color: 'white', left: 30, top: 75}}>Είσοδος</Text>
        <View style={styles.circle}></View>
        <View>
          <Text style={{fontSize:20, color: '#5C5C5C', left: 30, top: 215}}>Email</Text>
          <TextInput style={styles.email} inputMode='email' placeholder='e.g. abc@gmail.com' placeholderTextColor={'#878787'} onSubmitEditing={() => { this.secondTextInput.focus(); }}/>
        </View>
        <View>
          <Text style={{fontSize:20, color: '#5C5C5C', left: 30, top: 245}}>Password</Text>
          <TextInput ref={(input) => { this.secondTextInput = input; }} style={styles.password} secureTextEntry={true} placeholder='must be at least 5 characters' placeholderTextColor={'#878787'} />
        </View>
        <Text style={{fontSize:12, color:'black', alignSelf: 'flex-end', right:30, top: 250, opacity: 0.7}}>Forgot your password?</Text>
        <View style={{top: 400, right: 30, alignSelf: 'flex-end'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Home') }>
            <View style={styles.rect}>
              <Text style={styles.logIn}>Είσοδος</Text>
              <Image
                source={require("./icons/arrow.png")}
                resizeMode="contain"
                style={styles.icon}
              ></Image>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};


const SignupPage = () => {
  return(
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={styles.frontCircles1}></View>
        <View style={styles.frontCircles2}></View>
        <Text style={{fontFamily: 'serif', fontSize:23, fontWeight: 'bold', color: 'white', left: 30, top: 75}}>Δημιουργία Λογαριασμού</Text>
        <View style={styles.circle}></View>
        <View>
          <Text style={{fontSize:20, color: '#5C5C5C', left: 30, top: 185}}>Username</Text>
          <TextInput style={styles.username} placeholder='e.g. AnnaP.' placeholderTextColor={'#878787'} onSubmitEditing={() => { this.secondTextInput.focus(); }}/>
        </View>
        <View>
          <Text style={{fontSize:20, color: '#5C5C5C', left: 30, top: 215}}>Email</Text>
          <TextInput ref={(input) => { this.secondTextInput = input; }} style={styles.email} inputMode='email' placeholder='e.g. abc@gmail.com' placeholderTextColor={'#878787'} onSubmitEditing={() => { this.thirdTextInput.focus(); }}/>
        </View>
        <View>
          <Text style={{fontSize:20, color: '#5C5C5C', left: 30, top: 245}}>Password</Text>
          <TextInput ref={(input) => { this.thirdTextInput = input; }} style={styles.password} secureTextEntry={true} placeholder='must be at least 5 characters' placeholderTextColor={'#878787'} />
        </View>
        <View style={{top: 330, right: 30, alignSelf: 'flex-end'}}>
          <TouchableOpacity>
            <View style={styles.rect2}>
              <Text style={styles.create}>Δημιουργία</Text>
              <Image
                source={require("./icons/arrow.png")}
                resizeMode="contain"
                style={styles.icon}
              ></Image>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};



const HomePage = ({navigation}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <Logo />
        <View style={{top: 25, right: 25}}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image 
              source={require("./icons/profile.png")} 
              resizeMode='contain' 
              style={styles.profileImage}>
            </Image>
          </TouchableOpacity>
        </View>
        <View style={styles.frontCircles1}></View>
        <View style={styles.frontCircles2}></View>
        <View style={{top:310 , alignSelf: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Report')}>
            <Text style={styles.login}>Αναφορά περιστατικού</Text>
          </TouchableOpacity>
        </View>
        <View style={{top:340 , alignSelf: 'center'}}>
          <TouchableOpacity>
            <Text style={styles.signup}>Πρόσφατα περιστατικά</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  
};


const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted === 'granted') {
      console.log('Granted permission');
      return true;
    } else {
      console.log('Permission denied');
      return false;
    }
  } catch (err) {
    return false;
  }
};


const ReportPage = ({navigation}) => {
  const [value, setValue] = useState(null);

  //DateTimePicker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showDateTime, setShowDateTime] = useState(false)

  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios'); // to show the picker again in time mode
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      setShow(Platform.OS === 'ios');
      setMode('date');
    }
    setShowDateTime(true);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const formatDate = (date, time) => {
    let hour = time.getHours();
    let minute = time.getMinutes();
    if(hour<10) {hour= '0'+ hour};
    if(minute<10) {minute = '0' + minute};
    return `${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()} ${hour}:${minute}`;
  };
  //////////////////////
  
  const [mapVisible, setMapVisible] = useState(false);
  const [focusLatitude, setFocusLatitude] = useState(38.250700);
  const [focusLongitude, setFocusLongitude] = useState(21.744681);
  const [renderMarker, setRenderMarker] = useState(false);
  const [MarkerCoords, setMarkerCoords] = useState({"latitude":0, "longitude": 0});
  const [showAddress, setShowAddress] = useState(false)

  //Use Current Location
  const [location, setLocation] = useState(false);
  // function to check permissions and get Location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            // console.log('Latitude:' +position.coords.latitude);
            setFocusLatitude(position.coords.latitude)
            // console.log('Longitude:' +position.coords.longitude);
            setFocusLongitude(position.coords.longitude)
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  }

  const [addressMarked, setAddressMarked] = useState('') 

  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={{paddingBottom:200}} enableOnAndroid extraScrollHeight={100} keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false}>
          <View style={styles.headersTitle}>
            <Text style={{fontFamily: 'serif',fontSize: 22}}>Αναφορά περιστατικού</Text>
          </View>
          <Text style={{top: 40, left: 25, fontFamily: 'serif'}}>Συμπληρώστε τα παρακάτω πεδία:</Text>
          <Text style={{fontFamily: 'serif', fontSize: 18, left: 25, top: 55}}>Είδος περιστατικού</Text>
          <View>
            <Dropdown 
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              containerStyle={styles.containerStyle}
              itemTextStyle= {{color:'#3E3D3D'}}
              itemContainerStyle={{borderRadius:5, borderBottomWidth:0.2}}
              data={[{label: 'Κλοπή / Απόπειρα κλοπής', value:'1'}, {label: 'Παρενόχληση', value:'2'}, {label: 'Ύποπτος τύπος', value:'3'}, {label: 'Άλλο', value:'4'}]}
              maxHeight={180}
              labelField="label"
              valueField="value"
              placeholder="Επιλέξτε είδος περιστατικού"
              fontFamily='serif'
              value={value}
              onChange={item => {
                setValue(item.value);
              }}
              />
          </View>

          <Text style={{fontFamily: 'serif', fontSize: 18, left: 25, top: 75}}>Ημερομηνία & Ώρα</Text>
          <View style={{backgroundColor:'#D2C8D8', width: 340, height: 40, borderRadius: 5, left: 25, top: 80, flexDirection:'row'}}>
            {!showDateTime && (<Text style={[styles.placeholderStyle, {fontFamily:'serif', top:8, width:340}]}>Ορίστε πότε συνέβη</Text>)}
            {showDateTime && (<Text style={[styles.placeholderStyle, {fontFamily:'serif', top:8, width:340, color:'#3E3D3D'}]}>{formatDate(date,time)}</Text>)}
            <TouchableOpacity onPress={showDatepicker}>
              <Image
                    source={require("./icons/date.jpg")}
                    resizeMode="contain"
                    style={styles.icon}
              ></Image>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={+3*60}
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
              />
            )}
          </View>

          <Text style={{fontFamily: 'serif', fontSize: 18, left: 25, top: 95}}>Τοποθεσία περιστατικού</Text>
          <View style={{backgroundColor:'#D2C8D8', width: 340, height: 40, borderRadius: 5, left: 25, top: 100, flexDirection:'row'}}>
            {!showAddress && (<Text style={[styles.placeholderStyle, {fontFamily:'serif', top:8, width:340}]}>Επιλέξτε στον χάρτη πού συνέβη</Text>)}
            {showAddress && (<ScrollView style={{height:32, top:5}}><Text style={[styles.placeholderStyle, {fontFamily:'serif', width:290, color:'#3E3D3D'}]}>{addressMarked}</Text></ScrollView>)}
            <Modal  animationType="fade" transparent={true} visible={mapVisible}>
              <View style={{width:'100%', height:'100%', backgroundColor:'grey', opacity:0.5}}></View>
              <View style={{width: 350, height:600, backgroundColor:'white', alignSelf:'center', top: 95, borderRadius:10, position:'absolute'}}>
                <View style={{width:350, height:600, overflow:'hidden', borderRadius:10}}>
                  <MapView style={{width:350, height:600}}
                    provider={MapView.PROVIDER_GOOGLE}
                    ref={(ref) => (this.mapRef = ref)}
                    minZoomLevel={8}
                    rotateEnabled={true}
                    region={{
                      latitude: focusLatitude,
                      longitude: focusLongitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }} 
                    
                    onPress={ (event) => {/*console.log(event.nativeEvent.coordinate);*/ setRenderMarker(true); setMarkerCoords(event.nativeEvent.coordinate); 
                                          {mapRef.addressForCoordinate(event.nativeEvent.coordinate).then((address) => {
                                            setAddressMarked(address.thoroughfare + ' ' + address.name + ', ' + address.locality);
                                            // console.log(addressMarked); 
                                            }).catch((err) => {
                                              console.log('err', err); 
                                            })}
                                            setShowAddress(true)
                    } }
                    showsUserLocation={true}
                    // showsMyLocationButton={true}
                  >
                    {renderMarker && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                  </MapView>
                </View>

                <View style={{alignSelf:'flex-end', position:'absolute', backgroundColor:'white', width:50, borderTopRightRadius:10, borderBottomLeftRadius:10}}>
                  <TouchableOpacity onPress={() => setMapVisible(!mapVisible)}>
                    <Text style={{color:'grey',fontSize:16, alignSelf:'center'}}>Close</Text>
                  </TouchableOpacity>
                </View>

                <View style={{alignSelf: 'flex-end', position:'absolute', top:40, right:10, backgroundColor:'white', width:30, height:30, justifyContent:'center', borderRadius:5}}>
                  <TouchableOpacity onPress={() => getLocation()}>
                    <Image
                      source={require("./icons/current-location-icon.jpg")}
                      resizeMode="contain"
                      style={{width:25, height:25, opacity:0.5, alignSelf:'center'}}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            
            <TouchableOpacity onPress={() => setMapVisible(true)}>
              <Image
                    source={require("./icons/map.png")}
                    resizeMode="contain"
                    style={styles.icon}
              ></Image>
            </TouchableOpacity>
          </View>

          
          
          <Text style={{fontFamily: 'serif', fontSize: 18, left: 25, top: 115}}>Περιγραφή θύτη</Text>
          <View style={{backgroundColor:'#D2C8D8', width: 340, borderRadius: 5, left: 25, top: 120}}>
            <TextInput multiline={true} numberOfLines={3} blurOnSubmit={true} style={{fontFamily:'serif', fontSize:16, left:5, verticalAlign: 'top', width: 330, color:'#3E3D3D'}} placeholder='Δώστε μία σύντομη περιγραφή του θύτη' placeholderTextColor={'#878787'}></TextInput>
          </View>
          <Text style={{fontFamily: 'serif', fontSize: 18, left: 25, top: 135}}>Λεπτομέρειες & Σχόλια (προαιρετικά)</Text>
          <View style={{backgroundColor:'#D2C8D8', width: 340, borderRadius: 5, left: 25, top: 140}}>
            <TextInput multiline={true} numberOfLines={4} blurOnSubmit={true} style={{fontFamily:'serif', fontSize:16, left:5, verticalAlign: 'top', width: 330, color:'#3E3D3D'}} placeholder='Δώστε επιπλέον λεπτομέρειες σχετικά με το περιστατικό' placeholderTextColor={'#878787'} ></TextInput>
          </View>
        
          <View style={{top: 180, right: 30, alignSelf: 'flex-end'}}>
            <TouchableOpacity onPress={() => navigation.navigate('SubmitReport')}>
              <View style={[styles.rect, {width: 150}]}>
                <Text style={styles.logIn}>Συνέχεια</Text>
                <Image
                  source={require("./icons/arrow.png")}
                  resizeMode="contain"
                  style={styles.icon}
                ></Image>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView> 
      </View>
      
    </LinearGradient>
  );
};




const SubmitReportPage = ({navigation}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={styles.headersTitle}>
          <Text style={{fontFamily: 'serif',fontSize: 22}}>Αναφορά περιστατικού</Text>
        </View>
        <Text style={{top: 60, left: 25, fontFamily: 'serif', fontSize: 18}}>(Συνέχεια)</Text>
        <View style={styles.circle}></View>
        <Text style={{fontFamily: 'serif', fontSize: 20, top: 200, width:300, alignSelf:'center', color:'#5C5C5C', fontWeight:'bold'}}>Πατήστε υποβολή για να δημοσιεύσετε το περιστατικό στην εφαρμογή.</Text>
        <Text style={{fontFamily: 'serif', fontSize: 16, top: 230, width:300, alignSelf:'center', color:'#5C5C5C'}}>Μετά την δημοσίευση, το περιστατικό θα εμφανίζεται στο χάρτη με τα πρόσφατα περιστατικά.</Text>
        <View style={{top: 350, alignSelf:'center'}}>
          <TouchableOpacity>
              <View style={[styles.rect]}>
                <Text style={[styles.login, {width:140, fontWeight:'bold'}]}>Υποβολή</Text>
              </View>
          </TouchableOpacity>   
        </View>
      </View>
    </LinearGradient>
  );
};



const ProfilePage = ({navigation}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={[styles.headersTitle, {width:80}]}>
          <Text style={{fontFamily: 'serif',fontSize: 22}}>Προφίλ</Text>
        </View>
        <View style={[styles.circle, {backgroundColor: "black", top:100}]}></View>
        <Text style={styles.user}>Χρήστης</Text>
        <View style={{borderBottomWidth: 1, borderColor: '#C9C4C9', width: '100%', top:135, opacity:0.5}}></View>

        <Text style={styles.userName}>Username</Text>
        <View style={{flexDirection: 'row', top: 155, height:25}}>
          <Text style={[styles.userName, {color:'white', top:0, width:360}]}>AnnaP.</Text>
          <TouchableOpacity>
              <Image
                source={require("./icons/mod.png")}
                resizeMode="contain"
                style={{alignSelf: 'flex-end', width: 30, height: 30, position:'absolute', opacity: 0.6, bottom:0}}
              ></Image>
          </TouchableOpacity>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: '#C9C4C9', width: '85%', top:155, opacity:0.5, alignSelf:'center'}}></View>

        <Text style={[styles.userName, {top:170}]}>Email</Text>
        <View style={{flexDirection: 'row', top: 175, height:25}}>
        <Text style={[styles.userName, {color:'white', top:0, width: 360}]}>annpour@hotmail.gr</Text>
          <TouchableOpacity>
              <Image
                source={require("./icons/mod.png")}
                resizeMode="contain"
                style={{alignSelf: 'flex-end', width: 30, height: 30, position:'absolute', opacity: 0.6, bottom:0}}
              ></Image>
          </TouchableOpacity>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: '#C9C4C9', width: '85%', top:175, opacity:0.5, alignSelf:'center'}}></View>

        <Text style={[styles.userName, {top:190}]}>Password</Text>
        <View style={{flexDirection: 'row', top: 195, height:25}}>
          <Text style={[styles.userName, {color:'white', top: 0, width:360}]}>*********</Text>
          <TouchableOpacity>
              <Image
                source={require("./icons/mod.png")}
                resizeMode="contain"
                style={{alignSelf: 'flex-end', width: 30, height: 30, position:'absolute', opacity: 0.6, bottom:0}}
              ></Image>
          </TouchableOpacity>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: '#C9C4C9', width: '85%', top:195, opacity:0.5, alignSelf:'center'}}></View>

        <Text style={[styles.user, {top:230}]}>Ρυθμίσεις</Text>
        <View style={{borderBottomWidth: 1, borderColor: '#C9C4C9', width: '100%', top:235, opacity:0.5}}></View>
        <View style={{top:245}}>
          <TouchableOpacity>
            <Text style={[styles.user, {fontSize:17, fontWeight:'100', top:0}]}>Ειδοποιήσεις</Text>
          </TouchableOpacity>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: '#C9C4C9', width: '100%', top:255, opacity:0.5}}></View>

        <View style={{top:265}}>
          <TouchableOpacity>
          <Text style={[styles.user, {top:0, fontSize:17, fontWeight:'100'}]}>Τοποθεσία & Χάρτης</Text>
          </TouchableOpacity>
        </View>
        <View style={{borderBottomWidth: 1, borderColor: '#C9C4C9', width: '100%', top:275, opacity:0.5}}></View>

        <View style={{top: 350, alignSelf:'center'}}>
          <TouchableOpacity>
            <View style={styles.rect3}>
              <Text style={styles.logout}>Αποσύνδεση</Text>
              <Image
                source={require("./icons/sign-out.png")}
                resizeMode="contain"
                style={[styles.icon, {right:5, top:5}]}
              ></Image>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{alignSelf: 'flex-end', right: 30, top: 420}}>
          <TouchableOpacity>
            <Text style={styles.delete}>Διαγραφή Λογαριασμού</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </LinearGradient>
  );
};



const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  //StartPage
  walk: {
    top: 27,
    left: 20,
    position: "absolute",
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontStyle: "italic",
    color: "black",
    textShadowColor: 'grey',
    textShadowOffset: { width: 1, height: 1},
    textShadowRadius: 1,
    fontSize: 20
  },

  safe: {
    top: 27,
    left: 60,
    position: "absolute",
    fontFamily: "serif",
    fontWeight: "bold",
    fontStyle: "italic",
    color: "black",
    textShadowColor: 'grey',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontSize: 25
  },

  image: {
    top: 20,
    left: 45,
    width: 50,
    height: 50,
    position: "absolute",
    transform: [
      {
        rotate: "50.00deg"
      }
    ],
    opacity: 0.3,
    borderWidth: 0.5,
    borderColor: "#000000"
  },

  frontCircles1: {
    width:280,
    height:280, 
    borderRadius:140,
    backgroundColor: "#9975AE", 
    opacity: 0.1,
    position: 'absolute',
    top: 110,
    right: 220
  },

  frontCircles2: {
    width:280,
    height:280, 
    borderRadius:140,
    backgroundColor: "#9975AE", 
    opacity: 0.2,
    position: 'absolute',
    top: 420,
    left: 220
  },

  start_title: {
    color: '#C9C4C9',
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: 'bold',
    top: 180
  },

  start_text: {
    color: '#C9C4C9',
    fontSize: 16,
    fontFamily: 'serif',
    textAlign: 'justify',
    width: 305,
    top: 183
  },

  login: {
    fontFamily: 'serif',
    fontSize: 20,
    color: '#C9C4C9',
    width: 270,
    height: 45,
    backgroundColor: '#765988',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: 'white'
  },
  
  signup: {
    fontFamily: 'serif',
    fontSize: 20,
    color: '#C9C4C9',
    width: 270,
    height: 45,
    backgroundColor: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: 'white'
  },

  //LoginPage
  circle: {
    width:800,
    height:800, 
    borderRadius:400,
    backgroundColor: "#B0A8B5",
    position: 'absolute',
    top: 170,
    alignSelf: 'center'
  },

  email: {
    color: '#3E3D3D',
    top: 210,
    left: 30,
    fontSize: 18,
    borderBottomWidth: 1,
    width: 330, 
    borderBottomColor: '#4E4E4E',
  },

  password: {
    color: '#3E3D3D',
    top: 240,
    left: 30,
    fontSize: 18,
    borderBottomWidth: 1,
    width: 330, 
    borderBottomColor: '#4E4E4E'
  },

  rect: {
    width: 140,
    height: 45,
    backgroundColor: '#765988',
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: 'white'
  },

  logIn: {
    fontFamily: 'serif',
    fontSize: 20,
    color: '#C9C4C9', 
    top: 6, 
    left: 15
  },

  icon: {
    top: 3,
    right: 10,
    alignSelf: 'flex-end',
    width: 35,
    height: 35,
    position: "absolute",
    opacity: 0.6
  },

  //SignupPage
  create: {
    fontFamily: 'serif',
    fontSize: 20,
    color: '#C9C4C9', 
    top: 6, 
    left: 15
  },

  rect2: {
    width: 180,
    height: 45,
    backgroundColor: '#765988',
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: 'white'
  },

  username: {
    color: '#3E3D3D',
    top: 180,
    left: 30,
    fontSize: 18,
    borderBottomWidth: 1,
    width: 330, 
    borderBottomColor: '#4E4E4E',
  },


  //HomePage
  profileImage: {
    width: 35,
    height: 35,
    position: "absolute",
    alignSelf: 'flex-end'
  },


  //ReportPage
  headersTitle: {
    borderBottomWidth: 2,
    borderRadius: 5, 
    borderColor: '#AB8FBC', 
    top: 12, 
    width: 243, 
    alignSelf: 'flex-start',
    left: 70
  },

  dropdown: {
    backgroundColor:'#D2C8D8',
    width: 340,
    height: 40,
    borderRadius: 5,
    left: 25,
    top: 60
  },

  placeholderStyle: {
    color: '#878787',
    left: 10,
    fontSize: 16,
  },

  selectedTextStyle: {
    left: 10,
    fontSize: 16,
    color: '#3E3D3D'
  },

  iconStyle: {
    width: 20,
    height: 20,
    right: 5
  },

  containerStyle: {
    backgroundColor: '#D2C8D8', 
    borderRadius: 5
  },



//ProfilePage
user: {
  fontFamily: 'serif',
  fontSize: 18, 
  fontWeight: 'bold',
  top:130,
  left: 30,
  color: 'white'
},

userName: {
  fontFamily: 'serif',
  fontSize: 15,
  fontWeight: 'bold',
  top:150,
  left: 30, 
  color: '#C9C4C9'
},

logout: {
  fontFamily: 'serif',
  fontSize: 20,
  color: 'white',
  fontWeight: 'bold', 
  top: 6, 
  left: 10
},

rect3: {
  width: 190,
  height: 45,
  backgroundColor: '#161616',
  borderRadius: 5
},

delete: {
  fontFamily: 'serif',
  fontSize: 14,
  color: '#950303',
}

});


export default App;