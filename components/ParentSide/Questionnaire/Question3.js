import React, { Component } from "react";
import { View, Button, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import MobileStepper from "@bit/mui-org.material-ui.mobile-stepper";
import * as Font from "expo-font";
import StepIndicator from 'react-native-step-indicator';
import MobileStepper from '@material-ui/core/MobileStepper';
import { AppLoading } from "expo";

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

let customFonts = {
    'SF': require("../../../assets/fonts/SF/SF-Pro-Rounded-Medium.otf")
    // 'SF-Pro-Rounded-Semibold': require("../../../assets/fonts/SF/SF-Pro-Rounded-Semibold.otf"),
    // 'SF-Pro-Rounded-Regular': require("../../../assets/fonts/SF/SF-Pro-Rounded-Regular.otf")
}



var radio_props = [
    {label: 'Reads well', value: 0 },
    {label: 'Can read but needs visuals for better understanding', value: 1 },
    {label: 'Cannot read', value: 2 }
    // {label: 'Other', value: 3 }
  ];

export default class Question1 extends Component {
    constructor(props) {
        super(props);
        const { navigate } = this.props.navigation;
        this.navigate = navigate;
        this.state = {
        prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
        fontsLoaded: false,
        currentPosition: 2,
        selected: false
        // steps: 3
        };
      }

    static navigationOptions = ({ navigation }) => ({
        title: 'Questionnaire',
        prevScreenTitle: 'Back'
    });

    // onContinueClicked = () => {
    //     this.props.navigation.navigate("Question2");
    // }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }

    componentDidMount() {
    this._loadFontsAsync();
    }
    
    render () {
        // if (this.state.fontsLoaded) {
            return (
                // console.log("radio button options", radio_props[1].value),

                <View style={{backgroundColor:"#FFFCF9"}}>
                    <Text style={styles.pageHeader}>Create your child's profile</Text>

                    <StepIndicator
                        customStyles={customStyles}
                        stepCount= {3}
                        currentPosition={this.state.currentPosition}
                        // labels={labels}
                    />
                {/* <View>
                    <MobileStepper
                        variant="dots"
                        steps={4}
                        // position="static"
                    ></MobileStepper>
                </View> */}
                    

                <View style={styles.pageBodyContainer}>
                <Text style={styles.pageBodyText}>3. How would you describe your child's reading ability?</Text>

                    {/* <View style={styles.radioButtonsContainer}> */}

                    <View style={styles.radioButtons}>

                        <RadioForm 
                        radio_props={radio_props}
                        initial={0}
                        buttonColor={'#352D39'}
                        labelStyle={{margin: 8, fontSize: 22, color: '#352D39'}}
                        // labelWrapStyle ={{lineHeight: 5}}
                        labelColor={'#352D39'}
                        selectedButtonColor={'#352D39'}
                        onPress={(choice) => {this.setState({value:choice}); this.state.selected = true} }
                        //it shows the value of previously selected choice. don't know why¯\_(ツ)_/¯
                        />
                    </View>
                </View>
                    

                    {/* </View> */}
                    
                <View style={styles.buttonContainer}>

                <TouchableOpacity
                style={this.state.selected
                        ? styles.buttonPrimary
                        : styles.buttonSecondary}
                onPress={() => {this.navigate("ParentRoutines",{prevScreenTitle: 'Back'}); console.log("valueee", this.state.value); console.log("clickkk")}}
                >
                <View>
                <Text style={this.state.selected
                        ? styles.buttonPrimaryText
                        : styles.buttonSecondaryText}>Continue</Text>
                </View>
                
                
                </TouchableOpacity>
                

                </View>
                    
           </View>
            )

        }
        
    }


const pastelRed = '#FF6978';
const spaceBlack = '#352D39';

const styles = StyleSheet.create({
    pageHeader: {
        fontFamily: 'SF',
        fontSize: 32,
        color: spaceBlack,
        textAlign: 'center',
        margin: 30,
        textTransform: 'uppercase'
    },

    pageBodyText: {
        // fontFamily: 'SF-Pro-Rounded-Medium',
        color: spaceBlack,
        fontSize: 24,
        textAlign: 'center',
    },

    // radioButtonsContainer: {
    //     alignContent: 'center',
    //     display: "flex",
    //     justifyContent: 'center',
        
    // },

    pageBodyContainer: {
        marginTop: '15%'
    },
    
    radioButtons: {
        // fontFamily: 'SF-Pro-Rounded-Regular',
        fontSize: 24,
        textAlign: 'center',
        marginLeft: '20%',
        marginTop: '5%'
    },

    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        display: "flex",
        marginBottom: 800
    },

    buttonSecondary: {
        alignContent: 'center',
        borderRadius: 30,
        width: 290,
        height: 60,
        paddingVertical: 10,
        paddingHorizontal: 76,
        borderWidth: 2,
        borderColor: pastelRed,
        backgroundColor: 'white',
        marginTop: '50%'
    },
    
      buttonPrimary: {
        backgroundColor: pastelRed,
        borderRadius: 30,
        width: 290,
        height: 60,
        paddingVertical: 10,
        paddingHorizontal: 76,
        borderWidth: 2,
        borderColor: pastelRed,
        alignContent: 'center',
        marginTop: '50%'
      },
    
      buttonSecondaryText: {
        // fontFamily: 'SF-Pro-Rounded-Semibold',
        fontSize: 30,
        fontWeight: "600",
        textAlign: 'center',
        color: pastelRed
      },
    
      buttonPrimaryText: {
        // fontFamily: 'SF-Pro-Rounded-Semibold',
        fontSize: 30,
        fontWeight: "600",
        textAlign: 'center',
        color: 'white'
      }
    
})

const customStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 0,
    currentStepStrokeWidth: 2,
    stepStrokeCurrentColor: '#FF6978',
    stepStrokeWidth: 1,
    stepStrokeFinishedColor: '#FF6978',
    stepStrokeUnFinishedColor: '#C4C4C4',
    // separatorFinishedColor: '#fe7013',
    // separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#FF6978',
    stepIndicatorUnFinishedColor: '#C4C4C4',
    stepIndicatorCurrentColor: '#FF6978',
    // stepIndicatorLabelFontSize: 13,
    // currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#FF6978',
    stepIndicatorLabelFinishedColor: '#FF6978',
    stepIndicatorLabelUnFinishedColor: '#C4C4C4',
    labelColor: '#999999',
    margin: '50%'
    // labelSize: 13,
    // currentStepLabelColor: '#fe7013'
  }