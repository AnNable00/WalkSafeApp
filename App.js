import React, {Component, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal, PermissionsAndroid, ScrollView, BackHandler, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Dropdown} from 'react-native-element-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AutoGrowTextInput } from 'react-native-auto-grow-textinput';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import styles from './styles';


//Main
const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    //Different screens of the app
    <NavigationContainer>
      <Stack.Navigator headerMode='screen'>
        <Stack.Screen name='SplashScreen' component={SplashScreenPage} options={{headerShown: false}}/>
        <Stack.Screen name='Start' component={StartPage} options={{headerShown: false}}/>
        <Stack.Screen name='Login' component={LoginPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='Signup' component={SignupPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='Home' component={HomePage} options={{headerShown: false}}/>
        <Stack.Screen name='Report' component={ReportPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='SubmitReport' component={SubmitReportPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='Profile' component={ProfilePage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
        <Stack.Screen name='RecentReports' component={RecentReportsPage} options={{headerTransparent: true, headerTitle: '', headerTintColor: 'white'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}


//Logo
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


//Screen that appears when user launches the app
const SplashScreenPage = ({navigation}) => {
  //Disappears after a sec (1000ms) - Navigates to start page
  setTimeout(() => {
    navigation.replace('Start'); 
  }, 1000);

  return (
      <View style={[styles.container, {backgroundColor:'#9975AE'}]}>
        {/* Resized Logo */}
        <View style={{width:170,height:110, alignSelf:'center', top:'40%'}}>
          <Image
            source={require("./icons/steps.png")}
            resizeMode="contain"
            style={[styles.image, {width:70, height:70}]}
          ></Image>
          <Text style={[styles.walk, {fontSize:28, left:10}]}>Walk</Text>
          <Text style={[styles.safe, {fontSize:35, left:65}]}>Safe</Text>
        </View>
      </View>
  );
};


//This page appears only when user hasn't signed in. After they sign-up they stay signed-in, unless they sign-out.
const StartPage = ({navigation}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <Logo />
        <View style={styles.frontCircles1}></View>
        <View style={styles.frontCircles2}></View>
        {/* Welcoming text*/}
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.start_title}>Περπατήστε με ασφάλεια!</Text>
          <Text style={styles.start_text}>Ενημερωθείτε ανά πάσα στιγμή για επικίνδυνα
          περιστατικά που συνέβησαν κοντά σας ή αναφέρετε κι εσείς οι ίδιοι κάποιο περιστατικό.
          </Text>
          <Text style={styles.start_text}>Σχεδιάστε και πλοηγηθείτε στην πιο ασφαλή για εσάς διαδρομή!</Text>
        </View>
        {/* Sign-in button */}
        <View style={{top:310 , alignSelf: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Login') }>
            <Text style={styles.login}>Είσοδος</Text>
          </TouchableOpacity>
        </View>
        {/* Sign-up button */}
        <View style={{top:330 , alignSelf: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signup}>Δημιουργία Λογαριασμού</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};


//Login
const LoginPage = ({navigation}) => {
  return(
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={styles.frontCircles1}></View>
        <View style={styles.frontCircles2}></View>
        <Text style={styles.loginTitle}>Είσοδος</Text>
        <View style={styles.circle}></View>
        {/* Registered user's email address */}
        <View>
          <Text style={styles.emailTitle}>Email</Text>
          <TextInput style={styles.email} inputMode='email' placeholder='e.g. abc@gmail.com' placeholderTextColor={'#878787'} onSubmitEditing={() => { this.secondTextInput.focus(); }}/>
        </View>
        {/* Registered user's password for app login */}
        <View>
          <Text style={styles.passwordTitle}>Password</Text>
          <TextInput ref={(input) => { this.secondTextInput = input; }} style={styles.password} secureTextEntry={true} placeholder='must be at least 5 characters' placeholderTextColor={'#878787'} />
        </View>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
        {/* Login button */}
        <View style={styles.loginButton}>
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


//Sign up
const SignupPage = () => {
  return(
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={styles.frontCircles1}></View>
        <View style={styles.frontCircles2}></View>
        <Text style={styles.signupTitle}>Δημιουργία Λογαριασμού</Text>
        <View style={styles.circle}></View>
        {/* User sets username */}
        <View>
          <Text style={styles.usernameTitle}>Username</Text>
          <TextInput style={styles.username} placeholder='e.g. AnnaP.' placeholderTextColor={'#878787'} onSubmitEditing={() => { this.secondTextInput.focus(); }}/>
        </View>
        {/* User sets email address */}
        <View>
          <Text style={styles.signupEmailTitle}>Email</Text>
          <TextInput ref={(input) => { this.secondTextInput = input; }} style={styles.email} inputMode='email' placeholder='e.g. abc@gmail.com' placeholderTextColor={'#878787'} onSubmitEditing={() => { this.thirdTextInput.focus(); }}/>
        </View>
        {/* User sets password */}
        <View>
          <Text style={styles.signupPasswordTitle}>Password</Text>
          <TextInput ref={(input) => { this.thirdTextInput = input; }} style={styles.password} secureTextEntry={true} placeholder='must be at least 5 characters' placeholderTextColor={'#878787'} />
        </View>
        {/* Create account button */}
        <View style={styles.createAccountButton}>
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


//First page that appears when user is already signed-in
const HomePage = ({navigation}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <Logo />
        {/* Profile button */}
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
        {/* Report an incident button */}
        <View style={{top:310 , alignSelf: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Report')}>
            <Text style={styles.reportIncidentButton}>Αναφορά περιστατικού</Text>
          </TouchableOpacity>
        </View>
        {/* Show recent incidents/reports button */}
        <View style={{top:340 , alignSelf: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('RecentReports')}>
            <Text style={styles.recentReportsButton}>Πρόσφατα περιστατικά</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  
};


//Function called when user opens map and requests current location - Checks if permissions are granted to access user's location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted === 'granted') {
      // console.log('Granted permission');
      return true;
    } else {
      // console.log('Permission denied');
      return false;
    }
  } catch (err) {
    return false;
  }
};


//User reports an incident by filling in a form
const ReportPage = ({navigation}) => {
  const [value, setValue] = useState(null);

  //DateTimePicker - User sets date & time of incident
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showDateTime, setShowDateTime] = useState(false)

  //Function called when user selects date & time in the popup calendar
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
  //Customized format of date & time selected by user
  const formatDate = (date, time) => {
    let hour = time.getHours();
    let minute = time.getMinutes();
    if(hour<10) {hour= '0'+ hour};
    if(minute<10) {minute = '0' + minute};
    return `${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()} ${hour}:${minute}`;
  };
  //////////////////////
  

  //Map configurations - User selects on map where the incident took place
  const [mapVisible, setMapVisible] = useState(false);
  //intial latitude-longitude where map is focused
  const [focusLatitude, setFocusLatitude] = useState(38.125664);
  const [focusLongitude, setFocusLongitude] = useState(23.148006);
  //map zoom level 
  const [latDelta, setLatDelta] = useState(7);
  const [renderMarker, setRenderMarker] = useState(false);
  const [MarkerCoords, setMarkerCoords] = useState({"latitude":0, "longitude": 0});
  const [showAddress, setShowAddress] = useState(false)

  //User's Location
  //Function to check permissions and get user's current location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            //Focus map on user's location
            setFocusLatitude(position.coords.latitude)
            setFocusLongitude(position.coords.longitude)
          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  }

  //
  const [addressMarked, setAddressMarked] = useState('') 
  const [renderMarkerbySearch, setRenderMarkerbySearch] = useState(false);


  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        {/* Scrollview of screen is visible only when the input fields expand enough to not fit in the screen (when user writes more lines of text than the height of the text box) */}
        <KeyboardAwareScrollView contentContainerStyle={{paddingBottom:200}} enableOnAndroid extraScrollHeight={100} keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
          <View style={styles.headersTitle}>
            <Text style={styles.reportIncidentHeader}>Αναφορά περιστατικού</Text>
          </View>
          <Text style={styles.fillInFields}>Συμπληρώστε τα παρακάτω πεδία:</Text>
          {/* User selects type of incident from a dropdown list */}
          <Text style={styles.incidentType}>Είδος περιστατικού</Text>
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

          {/* User selects date & time of incident from a popup calendar */}
          <Text style={styles.dateTimeTitle}>Ημερομηνία & Ώρα</Text>
          <View style={styles.dateTimeField}>
            {/* Show placeholder when date & time not selected by user yet */}
            {!showDateTime && (<Text style={styles.fieldPlaceholder}>Ορίστε πότε συνέβη</Text>)}
            {/* Show formatted date & time that user selected */}
            {showDateTime && (<Text style={[styles.fieldPlaceholder, {color:'#3E3D3D'}]}>{formatDate(date,time)}</Text>)}
            {/* Show-calendar button */}
            <TouchableOpacity onPress={showDatepicker}>
              <Image
                    source={require("./icons/date.jpg")}
                    resizeMode="contain"
                    style={styles.icon}
              ></Image>
            </TouchableOpacity>
            {/* Show popup calendar */}
            {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={+3*60} //utc+3
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
              />
            )}
          </View>

          {/* User selects on map where incident took place */}
          <Text style={styles.incidentLocationTitle}>Τοποθεσία περιστατικού</Text>
          <View style={styles.incidentLocationField}>
            {/* Show placeholder when incident location not selected by user yet */}
            {!showAddress && (<Text style={styles.fieldPlaceholder}>Επιλέξτε στον χάρτη πού συνέβη</Text>)}
            {/* Show the address that user marked on map */}
            {showAddress && (<ScrollView style={{height:32, top:5}}><Text style={styles.selectedAddress}>{addressMarked}</Text></ScrollView>)}
            {/* popup map window */}
            <Modal  animationType="fade" transparent={true} visible={mapVisible}>
              <View style={styles.blurBackground}></View>
              <View style={styles.mapModal}>
                <View style={styles.mapWindow}>
                  {/* map configurations */}
                  <MapView style={{width:350, height:600}}
                    provider={MapView.PROVIDER_GOOGLE}
                    ref={(ref) => (this.mapRef = ref)}
                    minZoomLevel={5}
                    rotateEnabled={true}
                    //region where map is centered
                    region={{
                      latitude: focusLatitude,
                      longitude: focusLongitude,
                      latitudeDelta: latDelta,
                      longitudeDelta: 0,
                    }} 
                    
                    //when user presses somewhere on map, a red marker appears and the coords of that spot are converted into an address
                    //which is shown in the respective text field of the form
                    onPress={ (event) => {setRenderMarker(true); setMarkerCoords(event.nativeEvent.coordinate); 
                                          {mapRef.addressForCoordinate(event.nativeEvent.coordinate).then((address) => {
                                            setAddressMarked(address.thoroughfare + ' ' + address.name + ', ' + address.locality);
                                            // console.log(addressMarked); 
                                            }).catch((err) => {
                                              console.log('err', err); 
                                            })}
                                            setShowAddress(true)
                    } }
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                  >
                    {/* render a marker where user pressed on map */}
                    {renderMarker && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                    {/* render a marker for the selected-by-user search result */}
                    {renderMarkerbySearch && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                  </MapView>
                </View>

                {/* close map button */}
                <View style={styles.closeMapButton}>
                  <TouchableOpacity onPress={() => setMapVisible(!mapVisible)}>
                    <Text style={styles.closeMapButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>

                {/* find user's current location button */}
                <View style={styles.currentLocationButton}>
                  {/* LatDelta is set to 0.02 for applying more zoom on user's location */}
                  <TouchableOpacity onPress={() => {getLocation(); setLatDelta(0.02)}}> 
                    <Image
                      source={require("./icons/current-location-icon.jpg")}
                      resizeMode="contain"
                      style={{width:25, height:25, opacity:0.5, alignSelf:'center'}}
                    ></Image>
                  </TouchableOpacity>
                </View>

                {/* Places search bar configuration */}
                <View style={styles.mapSearchBar}>
                  <GooglePlacesAutocomplete
                    placeholder="Αναζήτηση"
                    query={{key: 'AIzaSyATSLZhx7JSLaiSmqviVGRII7i_cjzJwpM', components: 'country:gr'}}
                    GooglePlacesDetailsQuery={{
                      fields: 'geometry',
                    }}
                    // ref={ref => {
                    //   ref?.setAddressText('123 myDefault Street, mycity')
                    // }}
                    fetchDetails={true}

                    //when user searches for a place via the map's search bar, a list of results appears
                    //by selecting a result, a red marker appears, map focuses on that and the address 
                    //is also shown in the respective text field of the form 
                    onPress={(data, details = null) => {setRenderMarkerbySearch(true); 
                                                        setMarkerCoords({'latitude':details.geometry.location.lat, 'longitude':details.geometry.location.lng});
                                                        setFocusLatitude(details.geometry.location.lat); 
                                                        setFocusLongitude(details.geometry.location.lng); 
                                                        setLatDelta(0.02);
                                                        setShowAddress(true);
                                                        setAddressMarked(data.description);
                                                      }}
                    textInputProps={{placeholderTextColor:'grey'}}
                    styles={{textInput:{color:'black'}, description:{color:'black'}}}
                  />
                </View>
              </View>
            </Modal>
            
            {/* Open map button */}
            {/* When map opens , user is asked to grant permission for access to their location */}
            <TouchableOpacity onPress={() => {setMapVisible(true); getLocation(); setLatDelta(0.02)}}>
              <Image
                    source={require("./icons/map.png")}
                    resizeMode="contain"
                    style={styles.icon}
              ></Image>
            </TouchableOpacity>
          </View>

          {/* User's description of the perpetrator */}
          <Text style={styles.descriptionTitle}>Περιγραφή θύτη</Text>
          <View style={styles.descriptionField}>
            <TextInput multiline={true} numberOfLines={3} blurOnSubmit={true} style={{fontFamily:'serif', fontSize:16, left:5, verticalAlign: 'top', width: 330, color:'#3E3D3D'}} placeholder='Δώστε μία σύντομη περιγραφή του θύτη' placeholderTextColor={'#878787'}></TextInput>
          </View>
          {/* User's further details & comments about the incident */}
          <Text style={styles.detailsTitle}>Λεπτομέρειες & Σχόλια (προαιρετικά)</Text>
          <View style={styles.detailsField}>
            <TextInput multiline={true} numberOfLines={4} blurOnSubmit={true} style={{fontFamily:'serif', fontSize:16, left:5, verticalAlign: 'top', width: 330, color:'#3E3D3D'}} placeholder='Δώστε επιπλέον λεπτομέρειες σχετικά με το περιστατικό' placeholderTextColor={'#878787'} ></TextInput>
          </View>
        
          {/* Proceed submit button */}
          <View style={styles.proceedSubmitButton}>
            <TouchableOpacity onPress={() => navigation.navigate('SubmitReport')}>
              <View style={[styles.rect, {width: 150}]}>
                <Text style={styles.proceedSubmitButtonText}>Συνέχεια</Text>
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


//User confirms the report submission 
const SubmitReportPage = ({navigation}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={styles.headersTitle}>
          <Text style={styles.reportIncidentHeader}>Αναφορά περιστατικού</Text>
        </View>
        <Text style={styles.continueText}>(Συνέχεια)</Text>
        <View style={styles.circle}></View>
        <Text style={styles.infoText1}>Πατήστε υποβολή για να δημοσιεύσετε το περιστατικό στην εφαρμογή.</Text>
        <Text style={styles.infoText2}>Μετά την δημοσίευση, το περιστατικό θα εμφανίζεται στο χάρτη με τα πρόσφατα περιστατικά.</Text>
        <View style={styles.submitButton}>
          <TouchableOpacity>
              <View style={[styles.rect]}>
                <Text style={styles.submitButtonText}>Υποβολή</Text>
              </View>
          </TouchableOpacity>   
        </View>
      </View>
    </LinearGradient>
  );
};


//Profile
const ProfilePage = ({navigation}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={[styles.headersTitle, {width:80}]}>
          <Text style={styles.profileHeader}>Προφίλ</Text>
        </View>
        <View style={styles.backCircle}></View>
        <Text style={styles.user}>Χρήστης</Text>
        <View style={styles.underLine1}></View>

        {/* modify username */}
        <Text style={styles.userName}>Username</Text>
        <View style={styles.userNameField}>
          <Text style={styles.fieldText}>AnnaP.</Text>
          <TouchableOpacity>
              <Image
                source={require("./icons/mod.png")}
                resizeMode="contain"
                style={styles.modIcon}
              ></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.underLine2}></View>

        {/* modify email */}
        <Text style={styles.emailTitle2}>Email</Text>
        <View style={styles.emailField}>
          <Text style={styles.fieldText}>annpour@hotmail.gr</Text>
          <TouchableOpacity>
              <Image
                source={require("./icons/mod.png")}
                resizeMode="contain"
                style={styles.modIcon}
              ></Image>
          </TouchableOpacity>
        </View>
        <View style={[styles.underLine2, {top:175}]}></View>

        {/* modify password */}
        <Text style={styles.passwordTitle2}>Password</Text>
        <View style={styles.passwordField}>
          <Text style={styles.fieldText}>*********</Text>
          <TouchableOpacity>
              <Image
                source={require("./icons/mod.png")}
                resizeMode="contain"
                style={styles.modIcon}
              ></Image>
          </TouchableOpacity>
        </View>
        <View style={[styles.underLine2, {top:195}]}></View>

        {/* Settings */}
        <Text style={styles.settingsTitle}>Ρυθμίσεις</Text>
        <View style={[styles.underLine1, {top:235}]}></View>
        {/* Notification settings button */}
        <View style={{top:245}}>
          <TouchableOpacity>
            <Text style={styles.settings}>Ειδοποιήσεις</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.underLine1, {top:255}]}></View>
        {/* Location settings button */}
        <View style={{top:265}}>
          <TouchableOpacity>
          <Text style={styles.settings}>Τοποθεσία & Χάρτης</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.underLine1, {top:275}]}></View>

        {/* Logout button */}
        <View style={styles.logoutButton}>
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

        {/* Delete account button */}
        <View style={styles.deleteAccountButton}>
          <TouchableOpacity>
            <Text style={styles.deleteAccount}>Διαγραφή Λογαριασμού</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </LinearGradient>
  );
};


//User can find recent reports with details on a map
const RecentReportsPage = ({navigation}) => {
  const [value, setValue] = useState('1');

  const [focusLatitude, setFocusLatitude] = useState(38.125664);
  const [focusLongitude, setFocusLongitude] = useState(23.148006);
  const [latDelta, setLatDelta] = useState(7);

  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <View style={[styles.headersTitle, {width:244}]}>
          <Text style={styles.recentReportsHeader}>Πρόσφατα περιστατικά</Text>
        </View>
        {/* User can select how recent the reports on map should be (1day-1month old)  */}
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.until}>Έως:</Text>
          <View>
            <Dropdown 
              style={styles.dropDown}
              placeholderStyle={{fontSize:18}}
              containerStyle={{backgroundColor:'white', borderWidth:1, borderRadius:5}}
              iconColor='white'
              itemTextStyle= {{color:'black', height:20, bottom:10}}
              itemContainerStyle={{borderRadius:5, borderBottomWidth:0.2, height:40}}
              activeColor='#DBD9D9'
              data={[{label: '1 μήνα πριν', value:'1'}, {label: '2 εβδομάδες πριν', value:'2'}, {label: '1 εβδομάδα πριν', value:'3'}, {label: '1 ημέρα πριν', value:'4'}]}
              maxHeight={140}
              labelField="label"
              valueField="value"
              placeholder="Επιλέξτε"
              fontFamily='serif'
              value={value}
              onChange={item => {
                setValue(item.value);
              }}
              />
          </View>  
        </View>

        {/* Recent reports map */}
        <View style={styles.reportsMap}>
          <MapView style={{width:360, height:600}}
            provider={MapView.PROVIDER_GOOGLE}
            ref={(ref) => (this.mapRef = ref)}
            minZoomLevel={5}
            rotateEnabled={true}
            region={{
              latitude: focusLatitude,
              longitude: focusLongitude,
              latitudeDelta: latDelta,
              longitudeDelta: 0,
            }} 
          >
          </MapView>
        </View>
      </View>
    </LinearGradient>
  );
};



export default App;