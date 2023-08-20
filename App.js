import React, {Component, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal, PermissionsAndroid, ScrollView, BackHandler, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Dropdown} from 'react-native-element-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AutoGrowTextInput } from 'react-native-auto-grow-textinput';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, {PROVIDER_GOOGLE, Marker, Callout, Polyline, Circle} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import MapViewDirections from 'react-native-maps-directions';
import polyline from '@mapbox/polyline';
import { booleanPointOnLine} from '@turf/boolean-point-on-line';
import * as turf from '@turf/turf';
import * as Animatable from 'react-native-animatable';

//local IP of the PC where the server runs
const SERVER_IP = '192.168.1.125';


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
  //Disappears after a sec (1000ms)
  setTimeout(() => {
    //Get logged user's info stored in local memory
    AsyncStorage.multiGet(['user_id', 'user_name', 'user_email', 'user_password']).then((results)=>{
      //if there is nothing stored in local memory , then user hasn't logged in
      if(results[0][1]==null){
        //Navigate to start page to sign-in or sign-up
        navigation.replace('Start');
      }
      //if there is data in local memory, user has already logged in once (user stays logged in even after closing the app)
      else {
        // Since user is already logged in, the app navigates directly to home page, skipping the sign-in/sign-up stage
        // User's info are also sent to home page as parameters  
        navigation.replace('Home', {id: results[0][1], name: results[1][1], email: results[2][1], password: results[3][1]});
        
      }
    })
     
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  //Function called when user fills in fields in login form and presses the login button 
  const loginHandler = () =>{
    const parameters = {email,password};
    
    //Fetch data to client from server 
    //Send given user email and password to server
    fetch('http://'+SERVER_IP+':3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters)
    
    })
    //Get response from server
    .then(res =>res.json())
    .then(res =>{
      try {
        //if login fails, warns user
        if(res.status!==200){
          setIsError(true);
          setMessage(res.message);
        }
        //if login succeeds, navigates to home page and sends user's info 
        else{
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: {id: res.user_id, name: res.user_name, email: res.user_email, password: res.user_password}}],
            });
          //Store to local memory user's info - Will be used for persist login  
          AsyncStorage.setItem('user_id', res.user_id)
          AsyncStorage.setItem('user_name', res.user_name)
          AsyncStorage.setItem('user_email', res.user_email)
          AsyncStorage.setItem('user_password', res.user_password)
          setIsError(false);
          setMessage(res.message);
        }
      }
      catch (err) {
        console.log(err);
      };
    })
    .catch(err => {
      console.log(err);
    });
  }

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
          <TextInput style={styles.email} inputMode='email' placeholder='e.g. abc@gmail.com' placeholderTextColor={'#878787'} onChangeText={setEmail} onSubmitEditing={() => { this.secondTextInput.focus(); }}/>
        </View>
        {/* Registered user's password for app login */}
        <View>
          <Text style={styles.passwordTitle}>Password</Text>
          <TextInput ref={(input) => { this.secondTextInput = input; }} style={styles.password} secureTextEntry={true} placeholder='must be at least 5 characters' placeholderTextColor={'#878787'} onChangeText={setPassword}/>
        </View>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
        {/* Error message that appears only when there is an error while signing in (e.g. invalid password) */}
        {isError && <Text style={[{color: 'red', top:250, alignSelf:'center'}]}>{message}</Text>}
        {/* Login button */}
        <View style={styles.loginButton}>
          <TouchableOpacity onPress={() => loginHandler()}>
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
const SignupPage = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  //Function called when user fills in fields in signup form and presses the signup button 
  const createAccountHandler = () =>{
    const parameters = {email,username,password};

    //Fetch data to client from server 
    //Send given user email, username and password to server
    fetch('http://'+SERVER_IP+':3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters)
    
    })
    //Get response from server
    .then(res =>res.json())
    .then(res =>{
      try {
        //if signup fails, warns user
        if(res.status!==200){
          setIsError(true);
          setMessage(res.message);
        }
        //if signup succeeds, navigates to home page and sends user's info (user is now logged in)
        else{
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: {id: res.user_id, name: res.user_name, email: res.user_email, password: res.user_password}}],
            });
          //Store to local memory user's info - Will be used for persist login
          AsyncStorage.setItem('user_id', res.user_id)
          AsyncStorage.setItem('user_name', res.user_name)
          AsyncStorage.setItem('user_email', res.user_email)
          AsyncStorage.setItem('user_password', res.user_password)
          setIsError(false);
          setMessage(res.message);
        }
      }
      catch (err) {
        console.log(err);
      };
    })
    .catch(err => {
      console.log(err);
    });
  }

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
          <TextInput style={styles.username} placeholder='e.g. AnnaP.' placeholderTextColor={'#878787'} onChangeText={setName} onSubmitEditing={() => { this.secondTextInput.focus(); }}/>
        </View>
        {/* User sets email address */}
        <View>
          <Text style={styles.signupEmailTitle}>Email</Text>
          <TextInput ref={(input) => { this.secondTextInput = input; }} style={styles.email} inputMode='email' placeholder='e.g. abc@gmail.com' placeholderTextColor={'#878787'} onChangeText={setEmail} onSubmitEditing={() => { this.thirdTextInput.focus(); }}/>
        </View>
        {/* User sets password */}
        <View>
          <Text style={styles.signupPasswordTitle}>Password</Text>
          <TextInput ref={(input) => { this.thirdTextInput = input; }} style={styles.password} secureTextEntry={true} placeholder='must be at least 5 characters' placeholderTextColor={'#878787'} onChangeText={setPassword}/>
        </View>
        {/* Error message that appears only when there is an error while creating account (e.g. email already exists) */}
        {isError && <Text style={[{color: 'red', top:250, alignSelf:'center'}]}>{message}</Text>}
        {/* Create account button */}
        <View style={styles.createAccountButton}>
          <TouchableOpacity onPress={() => createAccountHandler()}>
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
const HomePage = ({navigation, route}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <Logo />
        {/* Profile button */}
        <View style={{top: 25, right: 25}}>
          {/* Navigates to profile page and sends user's info as parameters */}
          <TouchableOpacity onPress={() => navigation.navigate('Profile', {name: route.params.name, email: route.params.email, password: route.params.password})}>
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
          <TouchableOpacity onPress={() => navigation.navigate('Report', {id: route.params.id, name: route.params.name, email: route.params.email, password: route.params.password})}>
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
const ReportPage = ({navigation, route}) => {
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
      setDateTime(selectedValue);
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
  //initial latitude-longitude where map is focused
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
            setLatDelta(0.02)
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
  const [addressMarked, setAddressMarked] = useState(null) 
  const [renderMarkerbySearch, setRenderMarkerbySearch] = useState(false);


  //params to store in database
  const [typeOfIncident, setTypeOfIncident] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const incidentAddress = addressMarked;
  const [description, setDescription] = useState(null);
  const [detailsComments, setDetailsComments] = useState(null);
  const latitudeCoords = MarkerCoords.latitude;
  const longitudeCoords = MarkerCoords.longitude;
  const user_id = route.params.id;

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');


   //Function called when user fills in fields in report form and presses the proceed button 
  const proceedReportSubmissionHandler = () =>{
    
    // Check if all fields of the form are filled in (except the details field which is optional)
    if(!typeOfIncident || !dateTime || !incidentAddress || !description){
      setIsError(true);
      setMessage('Fill in all the required fields!')
    }
    else {
      //change date format since database requires specific format for date&time (yyyy-mm-dd hh:mm)
      var hours = dateTime.getHours() +3; //add 3 hours because when value is stored to database goes 3 hours back
      if (hours==24) hours='00'; //if 21.00 is selected, by adding 3 hours goes to 24.00 which is not valid for inserting in database (=>00.00)
      if(hours==25) hours='01'; //22.00 + 3 = 25 => 01.00
      if(hours==26) hours='02'; //23.00 + 3 = 26 => 02.00
      var formattedDate = `${dateTime.getFullYear()}-${dateTime.getMonth()+1}-${dateTime.getDate()} ${hours}:${dateTime.getMinutes()}`
      
      //Check if description is detailed enough
      if(description.length <40){
        setIsError(true);
        setMessage('Description should be more detailed!')
      }
      //if report is valid , navigates to submit report page and sends all the report parameters 
      else{
        setIsError(false);
        setMessage('Report is valid.')
        navigation.navigate('SubmitReport', {typeOfIncident:typeOfIncident, dateTime:formattedDate, incidentAddress:incidentAddress, description:description, detailsComments:detailsComments, latitudeCoords:latitudeCoords, longitudeCoords:longitudeCoords, id:user_id, name:route.params.name, email:route.params.email, password:route.params.password}) 
      }
      
    }
  }


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
                setTypeOfIncident(item.label);
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
            <TouchableOpacity onPress={() => {setMapVisible(true); getLocation();}}>
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
            <TextInput multiline={true} numberOfLines={3} blurOnSubmit={true} onChangeText={setDescription} style={{fontFamily:'serif', fontSize:16, left:5, verticalAlign: 'top', width: 330, color:'#3E3D3D'}} placeholder='Δώστε μία σύντομη περιγραφή του θύτη' placeholderTextColor={'#878787'}></TextInput>
          </View>
          {/* User's further details & comments about the incident */}
          <Text style={styles.detailsTitle}>Λεπτομέρειες & Σχόλια (προαιρετικά)</Text>
          <View style={styles.detailsField}>
            <TextInput multiline={true} numberOfLines={4} blurOnSubmit={true} onChangeText={setDetailsComments} style={{fontFamily:'serif', fontSize:16, left:5, verticalAlign: 'top', width: 330, color:'#3E3D3D'}} placeholder='Δώστε επιπλέον λεπτομέρειες σχετικά με το περιστατικό' placeholderTextColor={'#878787'} ></TextInput>
          </View>
          {/* Error message that appears only when there is an error while reporting an incident (e.g. all fields are required) */}
          {isError && <Text style={[{color: 'red', top:150, alignSelf:'center'}]}>{message}</Text>}
          {/* Proceed submit button */}
          <View style={styles.proceedSubmitButton}>
            <TouchableOpacity onPress={() => proceedReportSubmissionHandler()}>
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


//User confirms the report submission - Report info are stored into the database
const SubmitReportPage = ({navigation,route}) => {

  //Function called when user presses the submit button
  const reportSubmissionHandler = () => {
     
    //Send to server all the report info the user submitted in previous page
    fetch('http://'+SERVER_IP+':3000/submit_report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(route.params)
    
    })
    //Get response from server
    .then(res =>res.json())
    .then(res =>{
        //if report submission succeeds, navigates to home page
        if(res.status==200){
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home', params: {id: route.params.id, name: route.params.name, email: route.params.email, password: route.params.password}}],
          });
        }
      })
    .catch(err => {
      console.log(err);
    });
  }

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
          <TouchableOpacity onPress={() => reportSubmissionHandler()}>
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
const ProfilePage = ({navigation, route}) => {
  return (
    <LinearGradient colors={['#9975AE', 'black' ]} style={styles.container} locations={[0, 0.6]}>
      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={{paddingBottom:450}} enableOnAndroid extraScrollHeight={100} keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
          <View style={[styles.headersTitle, {width:80}]}>
            <Text style={styles.profileHeader}>Προφίλ</Text>
          </View>
          <View style={styles.backCircle}></View>
          <Text style={styles.user}>Χρήστης</Text>
          <View style={styles.underLine1}></View>

          {/* modify username */}
          <Text style={styles.userName}>Username</Text>
          <View style={styles.userNameField}>
            <Text style={styles.fieldText}>{route.params.name}</Text>
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
            <Text style={styles.fieldText}>{route.params.email}</Text>
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
            <Text style={styles.fieldText}>{route.params.password}</Text>
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
            {/* When pressing logout , logged user's info are deleted from local storage and app navigates to start page for login or singup */}
            <TouchableOpacity onPress={()=> {AsyncStorage.multiRemove(['user_id', 'user_name', 'user_email', 'user_password']); navigation.reset({index: 0, routes: [{ name: 'Start' }],});}}>
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
        </KeyboardAwareScrollView>
      </View>
    </LinearGradient>
  );
};



//User can find recent reports with details on a map
let i=0;
const RecentReportsPage = ({navigation}) => {

  //initial value of dropdown list
  const [value, setValue] = useState('31');

  //initial latitude-longitude where map is focused
  const [focusLatitude, setFocusLatitude] = useState(38.125664);
  const [focusLongitude, setFocusLongitude] = useState(23.148006);
  //map zoom level 
  const [latDelta, setLatDelta] = useState(7);

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
            //set map zoom level (applies more zoom)
            setLatDelta(0.03);
          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  }

  const [renderMarker, setRenderMarker] = useState(false)
  //object array for storing reports from database
  const [reports, setReports] = useState();

  //function that fetches reports from database
  const fetchReportsFromServer =  async() => {
    return fetch('http://'+SERVER_IP+':3000/reports', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    
    })
    //Get response from server
    .then(res => res.json())
    .then(res =>{ 
      // console.log(res)
      //store the reports from database to an array of objects
      setReports(res)
      //set markers on map visible
      setRenderMarker(true);
    })
    .catch(err => {
      console.log(err);
    });
  }

  //function called every time the recent reports screen loads
  useEffect(() => {
    //request user's current location
    getLocation();
    //fetch and render reports on map
    fetchReportsFromServer();
  }, [])
  
  //change format of date stored in database (yyyy-mm-ddThh:mm:ss.000Z) to a more user friendly one (dd-mm-yyyy hh:mm)
  const formatDateTime = (val) => {
    const date = val.split("T")[0].trim();
    const year = date.split("-")[0].trim();
    const month = date.split("-")[1].trim();
    const day = date.split("-")[2].trim();
    var time = val.split("T")[1].trim();
    const hour = time.split(":",2)[0];
    const minute = time.split(":",2)[1];
    dateTime = day + '-' + month + '-' + year + ' ' + hour + ':' + minute;
    return dateTime;
  }

  const [markerBubbleVisible, setMarkerBubbleVisible] = useState(false)
  const [reportIndex, setReportIndex] = useState()
  //array for storing each point (latitude,longitude) of a route returned by google directions api
  const [points, setPoints] = useState()
  const [renderRoute, setRenderRoute] = useState(false)
  //coords of a waypoint added to route when route passes through a report, in order to create a safest route
  const [waypointLatitude, setWaypointLatitude] = useState(null)
  const [waypointLongitude, setWaypointLongitude] = useState(null)
  //show loading screen when a route is created
  const [showLoading, setShowLoading] = useState(false)
  
  //coords of route start point selected by user
  const [startCoords, setStartCoords] = useState()
  //coords of route destination point selected by user
  const [destinationCoords, setDestinationCoords] = useState()
  //coords of route waypoint selected by user
  const [nodeCoords, setNodeCoords] = useState()
  
  const [createSafestRoute, setCreateSafestRoute] = useState (false)
  const [reFetch, setRefetch] = useState(0)
  const [recreateSafestRoute, setRecreateSafestRoute] = useState(false)
  const [retry, setRetry] = useState(false)

  //fetch a route from google directions api and check if it's safe
  const fetchRoutePoints = () => {
    //coords of start point of the route
    const start_latitude = startCoords.latitude
    const start_longitude = startCoords.longitude
    //coords of destination point of the route
    const destination_latitude = destinationCoords.latitude
    const destination_longitude = destinationCoords.longitude
    //coords of waypoint added by user
    let node_latitude = 0
    let node_longitude = 0
    //coords of a waypoint added to route automatically when route passes through a report, in order to create a safest route
    let waypoint_latitude = waypointLatitude
    let waypoint_longitude = waypointLongitude 
    //if user selected a waypoint, set the node coords with those of the waypoint
    if(nodeCoords!=null){
      node_latitude = nodeCoords.latitude
      node_longitude = nodeCoords.longitude
    }
    // since node coords shouldn't be null (or else the fetch function below wouldn't work properly), if user didn't select a waypoint,
    // set the node coords with the coords of start point (this way it's like there is no waypoint)
    else {
      node_latitude = startCoords.latitude
      node_longitude =  startCoords.longitude
    }
    //if the waypoint which is added to route automatically isn't defined yet, set an initial value like the node coords above
    if(waypoint_latitude==null && waypoint_longitude==null){
      waypoint_latitude = destinationCoords.latitude
      waypoint_longitude = destinationCoords.longitude
    }
    //fetch a route from google directions api based on start,destination and node points selected by user, as well as the waypoint added automatically
    fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${start_latitude}%2C${start_longitude}&destination=${destination_latitude}%2C${destination_longitude}&waypoints=via:${node_latitude}%2C${node_longitude}%7Cvia:${waypoint_latitude}%2C${waypoint_longitude}&mode=walking&key=AIzaSyATSLZhx7JSLaiSmqviVGRII7i_cjzJwpM`).then(res => {return res.json()})
    .then(result => {
      //path stores the coords of each point of the route as object ([{latitude:lat, longitude:lng}, {...}]) - this format will be used in the component <Polyline>
      let path = []
      //polylineGeoJSON stores the coords of each point of the route as GeoJSON ([lat,lng], [...]) - this format will be used in the pointToLineDistance function
      let polylineGeoJSON = []
      result.routes[0].legs[0].steps.map(step => {
          polyline.decode(step.polyline.points).map(step => {
            path.push({latitude:step[0],longitude:step[1]})
            polylineGeoJSON.push([step[0],step[1]])
          })  
      })
      
      //after google directions api returns a route, check if the route is safe (it doesn't pass by an incident)
      //if it passes by an incident, the route is recreated, by adding a waypoint to the route, the coords of which
      //are the coords of the incident but displaced by a random value. Every time the route is checked and is still not safe
      //the random value is increased by a constant value. This process is repeated until the recreated route is safe or the 
      //iteration count reaches a value (50)
      //check for every report
      for(let j=0; j<reports.length; j++){
        // try recreating the route only up to 50 times
        if(i<50){
          //if the route passes by a report (the distance between the report point and the route is less than 40 meters)
          //and if that report is recent enough based on user's selection in dropdown menu
          //then the route isn't safe and should be recreated 
          if((turf.pointToLineDistance([reports[j].latitude_coords, reports[j].longitude_coords], polylineGeoJSON, {units: 'meters'})<40) && ((Math.floor(((new Date().getTime() - new Date(reports[j].date_time).getTime())/ (1000 * 60 * 60)+3)/24))<=value)){
            //increase the iteration count of recreating the route
            i++;
            //the sign of the random value added to each waypoint coord is randomly set
            let n1 = Math.round(Math.random())
            let n2 = Math.round(Math.random())
            let sign1;
            let sign2;
            if(n1 == 0) sign1 = -1
            else sign1 = 1
            if(n2 == 0) sign2 = -1
            else sign2 = 1
            //set the waypoint coords as the report coords displaced by a random value
            setWaypointLatitude(reports[j].latitude_coords + sign1*i*0.00005)
            setWaypointLongitude(reports[j].longitude_coords + sign2*i*0.00005)
            //the value of refetch is set to random (which means that its value gonna change every time), so as the useEffect function 
            //based on the changes of this value to be called and thus the fetchRoutePoints function to be called again, in order 
            //to fetch a new route based on the new waypoint and repeat all the necessary checks
            setRefetch(Math.random())
            //break the for loop since there is already a report close to the route and there is no need to check the other reports 
            break;
          }
          // if the report is neither close to the route nor recent enough 
          else {
            //and if all the reports are checked then the route is safe and can be rendered
            if(j==reports.length-1){
              //set the points of the route using the result returned by the google directions api
              setPoints(path)
              //render route on map
              setRenderRoute(true);
              //set this value to false, so as the fetchRoutePoints function inside the useEffect function won't be called again
              setCreateSafestRoute(false)
              //set this value to false, so as the fetchRoutePoints function inside the useEffect function won't be called again
              setRecreateSafestRoute(false)  
              //hide loading screen, since a safe route has been found    
              setShowLoading(false)      
            }
          }
        }
        //if the iteration count reaches to 50 and a safe route has not been found yet
        else {        
          //set to false so as the fetchRoutePoints function inside the useEffect function won't be called again
          setCreateSafestRoute(false)
          setRecreateSafestRoute(false)  
          //hide loading screen    
          setShowLoading(false) 
          //if there is a route rendered on map from a previous route search, hide the route
          setRenderRoute(false)
          //if the user changes the value of how recent the reports should be, retry to create a route 
          setRetry(true)
          //alert user that a safe route can't be found
          Alert.alert('Σφάλμα', 'Αδυναμία εύρεσης ασφαλούς διαδρομής', [{text: 'Ok'}])
          break;
        }
      }     
      
    })
  }


  //function called when user requests a safe route - called repeatedly until a safe one is found 
  useEffect(() => {
    if(createSafestRoute || recreateSafestRoute) {fetchRoutePoints();}
  }, [reFetch, createSafestRoute, recreateSafestRoute])

  //function called every time user changes the value of how recent the reports should be in dropdown menu
  //when called a new route is created
  useEffect(() => {
    //if there was already a route rendered on map or a safe route couldn't be found
    if(renderRoute || retry) {
      //since a new route is created, iteration count and waypoint coords must reset
      i=0
      setWaypointLatitude(null)
      setWaypointLongitude(null)
      //hide previous route rendered on map
      setRenderRoute(false);
      setRetry(false)
      //set to true so that the fetchRoutePoints is called and a new route is created
      setRecreateSafestRoute(true)
      //show loading screen
      setShowLoading(true)
      }
  }, [value])

  
  const [showSafestRouteButton, setShowSafestRouteButton] = useState(true)
  const [showSelectRouteWindow, setShowSelectRouteWindow] = useState(false)

  //show/hide the map when user selects start,destination and waypoint 
  const [selectStartMapVisible, setSelectStartMapVisible] = useState(false);
  const [selectDestinationMapVisible, setSelectDestinationMapVisible] = useState(false);
  const [selectNodeMapVisible, setSelectNodeMapVisible] = useState(false);

  const [showMarker, setShowMarker] = useState(false);
  const [MarkerCoords, setMarkerCoords] = useState({"latitude":0, "longitude": 0});
  const [showStartAddress, setShowStartAddress] = useState(false)
  const [showNodeAddress, setShowNodeAddress] = useState(false)
  const [showDestinationAddress, setShowDestinationAddress] = useState(false)

  const [startAddressMarked, setStartAddressMarked] = useState(null) 
  const [destinationAddressMarked, setDestinationAddressMarked] = useState(null) 
  const [nodeAddressMarked, setNodeAddressMarked] = useState(null) 
  const [renderMarkerbySearch, setRenderMarkerbySearch] = useState(false);

  const [isError, setIsError] = useState(false);

  const [renderStartMarker, setRenderStartMarker] = useState(false)
  const [renderNodeMarker, setRenderNodeMarker] = useState(false)
  const [renderDestinationMarker, setRenderDestinationMarker] = useState(false)

  //used for incidents occured the past 3 hours - the date of the incident that is rendered on the map fades in&out
  const fadeIn = {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  };

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
              selectedTextStyle={{color:'#C9C4C9'}}
              itemTextStyle= {{color:'black', height:20, bottom:10}}
              itemContainerStyle={{borderRadius:5, borderBottomWidth:0.2, height:40}}
              activeColor='#DBD9D9'
              data={[{label: '1 μήνα πριν', value:'31'}, {label: '2 εβδομάδες πριν', value:'14'}, {label: '1 εβδομάδα πριν', value:'7'}, {label: '2 ημέρες πριν', value:'1'}, {label: '1 ημέρα πριν', value:'0'}]}
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
          <MapView style={{width:360, height:'100%'}}
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
            showsUserLocation={true}
          >
          {/* render a marker for every report*/}
          {renderMarker && reports.map(report => 
            { 
              // render the marker only if the report is recent enough, based on user's selection in dropdown list
              // to check how recent a report is, subtract the date of the report from current date 
              // the result is in milliseconds, so divide by 1000*60*60*24 to turn it into days
              // when the result is in hours, add 3 since Date() returns date that is 3 hours behind the current time
              if((Math.floor(((new Date().getTime() - new Date(report.date_time).getTime())/ (1000 * 60 * 60)+3)/24))<=value){                
                return (
                  <Marker key={report.report_id}
                          // by pressing on the marker , a bubble with the report's details appears - index of the report in the array of reports is also stored
                          onPress={e=> {setMarkerBubbleVisible(true); setReportIndex(reports.indexOf(report)); }} 
                          // marker coordinates
                          coordinate={{latitude: report.latitude_coords, longitude: report.longitude_coords}}>                                          
                  </Marker>)          
              }
              
            })}  
            {/* except for the marker icon, a text is also rendered next to the marker, that contains the date of the report */}
            {/* the text is rendered as a marker in order to stay at the same spot even after moving the map */}
            {renderMarker && reports.map(report => 
            { 
              // render the text only if the respective marker in rendered
              if((Math.floor(((new Date().getTime() - new Date(report.date_time).getTime())/ (1000 * 60 * 60)+3)/24))<=value){
                //if the incident didnt happen the past 3 hours
                if((Math.floor(((new Date().getTime() - new Date(report.date_time).getTime())/ (1000 * 60 * 60)+3)))>3){
                  return (
                    <Marker key={report.report_id} 
                            //set an offset to the text's position to not overlap the marker
                            anchor={{x:-0.05,y:0.3}}
                            // by pressing on the text, the bubble with the report's details can also appear
                            onPress={e=> {setMarkerBubbleVisible(true); setReportIndex(reports.indexOf(report));}} 
                            coordinate={{latitude: report.latitude_coords, longitude: report.longitude_coords}}>
                      <Text style={styles.markerLabel}>{formatDateTime(report.date_time)}</Text>               
                    </Marker>)
                }
                //if the incident happened the past 3 hours, the date of the incident that is rendered on the map fades in&out
                else{
                  return (
                    <Marker key={report.report_id} 
                            //set an offset to the text's position to not overlap the marker
                            anchor={{x:-0.05,y:0.3}}
                            // by pressing on the text, the bubble with the report's details can also appear
                            onPress={e=> {setMarkerBubbleVisible(true); setReportIndex(reports.indexOf(report));}} 
                            coordinate={{latitude: report.latitude_coords, longitude: report.longitude_coords}}>
                      <Animatable.Text  animation={fadeIn} iterationCount='infinite' style={styles.markerLabel}>{formatDateTime(report.date_time)}</Animatable.Text>               
                    </Marker>)
                }
              }
              
            })}
            
            {/* render the safe route on map */}
            {renderRoute && <Polyline coordinates={points} strokeWidth={4} strokeColor="blue" />}

            {/* render a purple cycle with the letter A as marker for the start point selected by user */}
            {renderStartMarker && 
              <Marker coordinate={{latitude:startCoords.latitude, longitude:startCoords.longitude}}>
                <View style={styles.routePointMarker}>
                  <Text style={styles.routePointMarkerText}>A</Text>
                </View>                
              </Marker>}
            {/* render a purple cycle as marker for the waypoint selected by user */}
            {renderNodeMarker && 
              <Marker coordinate={{latitude:nodeCoords.latitude, longitude:nodeCoords.longitude}}>
                <View style={styles.routePointMarker}></View>
              </Marker>}
            {/* render a purple cycle with the letter B as marker for the destination point selected by user */}
            {renderDestinationMarker && 
              <Marker coordinate={{latitude:destinationCoords.latitude, longitude:destinationCoords.longitude}}>
                <View style={styles.routePointMarker}>
                  <Text style={styles.routePointMarkerText}>B</Text>
                </View>
              </Marker>}
          </MapView>
          {/* render the bubble with the report's details only when the marker or the text is pressed (when markerBubbleVisible is set true)*/}
          {markerBubbleVisible && 
            <View style={styles.markerBubble}>
              {/* type of incident */}
              <View style={styles.typeOfIncidentHeader}>
                <Text style={styles.typeOfIncidentText}>{reports[reportIndex].type_of_incident}</Text>
              </View>
              {/* date */}
              <View style={styles.dateTimeHeader}>
                <Text style={{width: 30, height:30}}>
                  <Image
                    source={require("./icons/time.png")}
                    resizeMode="center"
                    style={styles.timeIcon}
                  ></Image>
                </Text>
                <Text style={styles.dateTimeText}>{formatDateTime(reports[reportIndex].date_time)}</Text> 
              </View>   
              {/* address */}
              <View style={styles.locationHeader}>
                <Text style={{width: 30, height:35}}>
                  <Image
                    source={require("./icons/spot.png")}
                    resizeMode="center"
                    style={styles.locationIcon}
                  ></Image>
                </Text>
                <Text style={styles.locationText}>{reports[reportIndex].address}</Text> 
              </View> 
              {/* description of perpetrator */}
              <View style={styles.descriptionHeader}>
                <Text style={{width: 30, height:30}}>
                  <Image
                    source={require("./icons/perpetrator.png")}
                    resizeMode="center"
                    style={styles.perpetratorIcon}
                  ></Image>
                </Text>
                <Text style={styles.descriptionText}>{reports[reportIndex].description}</Text> 
              </View>  
               {/* details_comments (if given) */}
              {reports[reportIndex].details_comments!='null' && <View style={styles.detailsHeader}>
                <Text style={{width: 30, height:30}}>
                  <Image
                    source={require("./icons/victim.png")}
                    resizeMode="center"
                    style={styles.detailsIcon}
                  ></Image>
                </Text>
                <Text style={styles.detailsText}>{reports[reportIndex].details_comments}</Text> 
              </View>}  
               {/* if details not given */}
              {reports[reportIndex].details_comments=='null' && <View style={styles.detailsHeader}>
                <Text style={{width: 30, height:30}}>
                  <Image
                    source={require("./icons/victim.png")}
                    resizeMode="center"
                    style={styles.detailsIcon}
                  ></Image>
                </Text>
                <Text style={styles.detailsText}>(Χωρίς λεπτομέρειες)</Text> 
              </View>}  
              {/* close button */}
              <View style={styles.closeMapButton}>
                <TouchableOpacity onPress={() => setMarkerBubbleVisible(false)}>
                  <Text style={styles.closeMapButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        </View>

        {/* find safest route button */}
        {showSafestRouteButton && <TouchableOpacity style={styles.findSafestRoute} onPress={()=>{setShowSelectRouteWindow(true); setShowSafestRouteButton(false)}}>
          <Text style={styles.findSafestRouteText}>Εύρεση ασφαλέστερης διαδρομής</Text>
        </TouchableOpacity>}
        
        {/* popup window where user selects start, destination and waypoint of route */}
        {showSelectRouteWindow && (
          <View style={styles.findSafestRouteWindow}>
              {/* hide popup window button */}
              <View style={styles.closeSafestRouteWindow}>
                <TouchableOpacity onPress={()=>{setShowSelectRouteWindow(false); setShowSafestRouteButton(true)}}>
                  <Image
                      source={require("./icons/show-hide-icon.png")}
                      resizeMode='stretch'
                      style={styles.closeSafestRouteWindowIcon}
                  ></Image>
                </TouchableOpacity>
              </View>

              <Text style={styles.findSafestRouteText2}>Εύρεση ασφαλέστερης διαδρομής</Text>
              {/* start point */}
              <View style={styles.selectHeader}>
                <Text style={styles.selectHeaderText}>Αφετηρία:</Text>
                {/* use current location button */}
                <TouchableOpacity style={styles.useCurrentLocationButton} onPress={() => {getLocation(); setShowStartAddress(true); setStartAddressMarked('Τρέχουσα τοποθεσία');}}>
                  <Text style={styles.useCurrentLocationButtonText}>Χρήση τρέχουσας τοποθεσίας</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.select}>
                {!showStartAddress && (<Text style={styles.selectText}>Επιλέξτε αφετηρία</Text>)}
                {showStartAddress && (<ScrollView style={{height:32, top:5}}><Text style={[styles.selectedAddress, {width:230}]}>{startAddressMarked}</Text></ScrollView>)}
                {/* popup map  */}
                <Modal  animationType="fade" transparent={true} visible={selectStartMapVisible}>
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
                        onPress={ (event) => {setShowMarker(true); setMarkerCoords(event.nativeEvent.coordinate); setStartCoords(event.nativeEvent.coordinate); setRenderStartMarker(true);
                                              {mapRef.addressForCoordinate(event.nativeEvent.coordinate).then((address) => {
                                                setStartAddressMarked(address.thoroughfare + ' ' + address.name + ', ' + address.locality);
                                                // console.log(addressMarked); 
                                                }).catch((err) => {
                                                  console.log('err', err); 
                                                })}
                                                setShowStartAddress(true)
                                                setFocusLatitude(event.nativeEvent.coordinate.latitude); 
                                                setFocusLongitude(event.nativeEvent.coordinate.longitude); 
                                                setLatDelta(0.02);
                        } }
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                      >
                        {/* render a marker where user pressed on map */}
                        {showMarker && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                        {/* render a marker for the selected-by-user search result */}
                        {renderMarkerbySearch && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                      </MapView>
                    </View>

                    {/* close map button */}
                    <View style={styles.closeMapButton}>
                      <TouchableOpacity onPress={() => setSelectStartMapVisible(false)}>
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
                                                            setStartCoords({'latitude':details.geometry.location.lat, 'longitude':details.geometry.location.lng});
                                                            setFocusLatitude(details.geometry.location.lat); 
                                                            setFocusLongitude(details.geometry.location.lng); 
                                                            setLatDelta(0.02);
                                                            setShowStartAddress(true);
                                                            setStartAddressMarked(data.description);
                                                            setRenderStartMarker(true);
                                                          }}
                        textInputProps={{placeholderTextColor:'grey'}}
                        styles={{textInput:{color:'black'}, description:{color:'black'}}}
                      />
                    </View>
                  </View>
                </Modal>
                
                {/* Open map button */}
                {/* When map opens , user is asked to grant permission for access to their location */}
                <TouchableOpacity onPress={() => {setSelectStartMapVisible(true); getLocation(); setShowMarker(false); setRenderMarkerbySearch(false);}}>
                  <Image
                        source={require("./icons/map.png")}
                        resizeMode="contain"
                        style={styles.icon}
                  ></Image>
                </TouchableOpacity>
              </View>

              {/* waypoint */}
              <Text style={styles.selectHeaderText}>Ενδιάμεσοι κόμβοι: (προαιρετικά)</Text>
              <View style={styles.select}>
                {!showNodeAddress && (<Text style={styles.selectText}>Επιλέξτε ενδιάμεσο κόμβο</Text>)}
                {showNodeAddress && (<ScrollView style={{height:32, top:5}}><Text style={[styles.selectedAddress, {width:230}]}>{nodeAddressMarked}</Text></ScrollView>)}
                {/* popup map  */}
                <Modal  animationType="fade" transparent={true} visible={selectNodeMapVisible}>
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
                        onPress={ (event) => {setShowMarker(true); setMarkerCoords(event.nativeEvent.coordinate); setNodeCoords(event.nativeEvent.coordinate); setRenderNodeMarker(true);
                                              {mapRef.addressForCoordinate(event.nativeEvent.coordinate).then((address) => {
                                                setNodeAddressMarked(address.thoroughfare + ' ' + address.name + ', ' + address.locality);
                                                // console.log(addressMarked); 
                                                }).catch((err) => {
                                                  console.log('err', err); 
                                                })}
                                                setShowNodeAddress(true)
                        } }
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                      >
                        {/* render a marker where user pressed on map */}
                        {showMarker && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                        {/* render a marker for the selected-by-user search result */}
                        {renderMarkerbySearch && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                      </MapView>
                    </View>

                    {/* close map button */}
                    <View style={styles.closeMapButton}>
                      <TouchableOpacity onPress={() => setSelectNodeMapVisible(false)}>
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
                                                            setNodeCoords({'latitude':details.geometry.location.lat, 'longitude':details.geometry.location.lng});
                                                            setFocusLatitude(details.geometry.location.lat); 
                                                            setFocusLongitude(details.geometry.location.lng); 
                                                            setLatDelta(0.02);
                                                            setShowNodeAddress(true);
                                                            setNodeAddressMarked(data.description);
                                                            setRenderNodeMarker(true);
                                                          }}
                        textInputProps={{placeholderTextColor:'grey'}}
                        styles={{textInput:{color:'black'}, description:{color:'black'}}}
                      />
                    </View>
                  </View>
                </Modal>

                {/* Open map button */}
                {/* When map opens , user is asked to grant permission for access to their location */}
                <TouchableOpacity onPress={() => {setSelectNodeMapVisible(true); getLocation(); setShowMarker(false); setRenderMarkerbySearch(false);}}>
                  <Image
                        source={require("./icons/map.png")}
                        resizeMode="contain"
                        style={styles.icon}
                  ></Image>
                </TouchableOpacity>
              </View>

              {/* destination */}
              <Text style={styles.selectHeaderText}>Προορισμός:</Text>
              <View style={styles.select}>
                {!showDestinationAddress && (<Text style={styles.selectText}>Επιλέξτε προορισμό</Text>)}
                {showDestinationAddress && (<ScrollView style={{height:32, top:5}}><Text style={[styles.selectedAddress, {width:230}]}>{destinationAddressMarked}</Text></ScrollView>)}
                {/* popup map  */}
                <Modal  animationType="fade" transparent={true} visible={selectDestinationMapVisible}>
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
                        onPress={ (event) => {setShowMarker(true); setMarkerCoords(event.nativeEvent.coordinate); setDestinationCoords(event.nativeEvent.coordinate); setRenderDestinationMarker(true);
                                              {mapRef.addressForCoordinate(event.nativeEvent.coordinate).then((address) => {
                                                setDestinationAddressMarked(address.thoroughfare + ' ' + address.name + ', ' + address.locality);
                                                // console.log(addressMarked); 
                                                }).catch((err) => {
                                                  console.log('err', err); 
                                                })}
                                                setShowDestinationAddress(true)
                        } }
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                      >
                        {/* render a marker where user pressed on map */}
                        {showMarker && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                        {/* render a marker for the selected-by-user search result */}
                        {renderMarkerbySearch && <Marker coordinate={{latitude: MarkerCoords.latitude, longitude: MarkerCoords.longitude}}/>} 
                      </MapView>
                    </View>

                    {/* close map button */}
                    <View style={styles.closeMapButton}>
                      <TouchableOpacity onPress={() => setSelectDestinationMapVisible(false)}>
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
                                                            setDestinationCoords({'latitude':details.geometry.location.lat, 'longitude':details.geometry.location.lng});
                                                            setFocusLatitude(details.geometry.location.lat); 
                                                            setFocusLongitude(details.geometry.location.lng); 
                                                            setLatDelta(0.02);
                                                            setShowDestinationAddress(true);
                                                            setDestinationAddressMarked(data.description);
                                                            setRenderDestinationMarker(true);
                                                          }}
                        textInputProps={{placeholderTextColor:'grey'}}
                        styles={{textInput:{color:'black'}, description:{color:'black'}}}
                      />
                    </View>
                  </View>
                </Modal>

                {/* Open map button */}
                {/* When map opens , user is asked to grant permission for access to their location */}
                <TouchableOpacity onPress={() => {setSelectDestinationMapVisible(true); getLocation(); setShowMarker(false); setRenderMarkerbySearch(false);}}>
                  <Image
                        source={require("./icons/map.png")}
                        resizeMode="contain"
                        style={styles.icon}
                  ></Image>
                </TouchableOpacity>
              </View>
              
              {/* show error message if user didnt select start or destinstion*/}
              {isError && <Text style={[{color: 'red',marginTop:5, alignSelf:'center'}]}>Start and destination fields are required!</Text>}

              <View style={{flexDirection:'row-reverse', justifyContent:'space-around'}}>  
                {/* proceed the search of safe route button */}
                <TouchableOpacity style={styles.proceedButton} 
                  onPress={() =>{
                      //if user didnt select start or destinstion, show error message
                      if(startAddressMarked==null || destinationAddressMarked==null){
                        setIsError(true)
                      }
                      else {
                        //if user pressed the use current location, set the coords of their location as the start coords 
                        if(startAddressMarked=='Τρέχουσα τοποθεσία'){
                          setStartCoords({'latitude':focusLatitude, 'longitude':focusLongitude})
                        }
                        setIsError(false)
                        //hide the popup where user sets points of the route
                        setShowSelectRouteWindow(false)
                        setShowSafestRouteButton(true)
                        //render the markers for start destination and waypoint (if given)
                        setRenderStartMarker(true)
                        setRenderDestinationMarker(true)
                        if(nodeCoords!=null) setRenderNodeMarker(true)
                        //hide previous route rendered on map
                        setRenderRoute(false)
                        //reset iteration count and waypoint coords
                        i=0
                        setWaypointLatitude(null)
                        setWaypointLongitude(null)
                        //set to true to call the fetchRoutePoints function
                        setCreateSafestRoute(true)
                        //show loading screen
                        setShowLoading(true)
                      }
                  }}>
                  <Image
                    source={require("./icons/arrow.png")}
                    resizeMode='stretch'
                    style={styles.proceedButtonIcon}
                  ></Image>
                </TouchableOpacity>

                {/* clear start,destination and waypoint fields button */}
                <TouchableOpacity style={styles.clearButton} 
                  onPress={() =>{
                    setShowStartAddress(false)
                    setShowNodeAddress(false)
                    setShowDestinationAddress(false)
                    setStartAddressMarked(null)
                    setNodeAddressMarked(null)
                    setDestinationAddressMarked(null)
                    setRenderRoute(false)
                    setRenderStartMarker(false)
                    setRenderNodeMarker(false)
                    setRenderDestinationMarker(false)
                    setNodeCoords(null)
                  }}>
                  <Text style={styles.clearButtonText}>Εκκαθάριση</Text>
                </TouchableOpacity>
              </View>
          </View>
        )}

        {/* loading screen when safe route is created */}
        {showLoading && 
          (<View style={styles.loadingWindow}>
            <View style={styles.blurBackground}></View>
            <Animatable.View style={styles.loadingAnimation}>
              <Animatable.Text animation='pulse' iterationCount='infinite' style={styles.loadingAnimationText}>Εύρεση ασφαλούς διαδρομής...</Animatable.Text>
            </Animatable.View>
          </View>)
        }
      </View>
    </LinearGradient>
  );
};



export default App;