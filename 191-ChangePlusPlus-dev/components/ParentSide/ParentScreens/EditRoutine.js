//  TO DO: FOR NEW ROUTINES: i need to figure out how to insert all required fields into
// the DB so that its valid which might require doing it all at once or doing
// the name first, getting back the routine ID, then storing the rest

// TO DO: fix switch bug
import React, {Component} from 'react';
import { Dimensions, ScrollView, Text, Switch, StyleSheet, View } from 'react-native';
import {TextField} from 'react-native-material-textfield';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RaisedTextButton} from 'react-native-material-buttons';
import DatePicker from 'react-native-datepicker';

const {width: WIDTH} = Dimensions.get('window');

Icon.loadFont();

export default class EditRoutine extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Edit Routine',
    /* DONE BUTTON
        
        headerRight: () => <Button onPress={ () => {
           var alr = "";
            if(navigation.state.params.currentRoutineName === '' || !navigation.state.params.currentRoutineName)
            {
                alr += "Must have a routine name\n"
            }
            if(navigation.state.params.amount_of_activities < 1 || !navigation.state.params.amount_of_activities)
            {
                alr += "Must have more than one activity\n";
            }
            if(navigation.state.params.amount_of_rewards < 1 || !navigation.state.params.amount_of_rewards)
            {
                alr += "Must have more than one reward\n"
            }
            if(alr !== '')
            {
                alert(alr);
            }
            else{
                navigation.navigate('ParentNavigation', {
                    prevScreenTitle: 'Routines'
                });
            }
        }}
        title="Done"
        color="#352D39"
        accessibilityLabel="Done with Routine Button"/>*/
  });

  constructor(props) {
    super(props);

    const {navigate} = this.props.navigation;
    this.navigate = navigate;

    this.state = {
      prevScreenTitle: this.props.navigation.state.params.prevScreenTitle,
      currentRoutineName: this.props.navigation.state.params.currentRoutineName,
      currentRoutineId: this.props.navigation.state.params.currentRoutineId,
      currentRoutineStartTime: this.props.navigation.state.params.currentRoutineStartTime,
      currentRoutineEndTime: this.props.navigation.state.params.currentRoutineEndTime,
      currentRoutineApproval: this.props.navigation.state.params.currentRoutineApproval,
      currentRewards: this.props.navigation.state.params.currentRewards,
      currentApproval: this.props.navigation.state.params.is_approved,
      amount_of_activities: this.props.navigation.state.params.amount_of_activities,
      amount_of_rewards: this.props.navigation.state.params.amount_of_rewards,

      monday: this.props.navigation.state.params.monday,
      tuesday: this.props.navigation.state.params.tuesday,
      wednesday: this.props.navigation.state.params.wednesday,
      thursday: this.props.navigation.state.params.thursday,
      friday: this.props.navigation.state.params.friday,
      saturday: this.props.navigation.state.params.saturday,
      sunday: this.props.navigation.state.params.sunday,

      activities: null,
      loaded: false,
      date: '2016-05-15',
    };
  }

  // Update the DB
  async changeRoutineComponent(tag, value) {

    if (tag === 'is_approved'){
      this.setState({currentRoutineApproval: !this.state.currentRoutineApproval})
    }
    console.log('routine id below');
    console.log(this.state.currentRoutineId);
    var data = {
      [tag]: value,
    };
    try {
      let response = await fetch(
        'http://localhost:3000/updateRoutine/' + this.state.currentRoutineId,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      if (response.status >= 200 && response.status < 300) {
        console.log('SUCCESSFUL CALL');
        this.addCalendar();
      }
    } catch (errors) {
      alert(errors);
    }
  }

  // TO DO: there needs to be a new routine ID for this item before this happens
  componentDidMount() {
    // Get the activities data from the db
    fetch('http://localhost:3000/routine/' + this.state.currentRoutineId)
      .then(response => response.json())
      .then(responseJson => {
        return responseJson;
      })
      .then(activities => {
        this.setState({activities: activities});
        this.setState({loaded: true});
      })
      .catch(error => {
        console.error(error);
      });
  }

  swapDateValue(value, tag) {
    if (value === 1) {
      this.setState({[tag]: 0});
      return 0;
    }
    this.setState({[tag]: 1});
    return 1;
  }

  getCurrentSwitchState(){
    console.log('in switch function');
    console.log(this.state.currentRoutineApproval);
    if (this.state.currentRoutineApproval === 1){
      return true;
    }
    return false;
  }

  displayList(listName) {
    var itemNumCounter = 0;
    var mappingVal = this.state.activities;
    if (listName === 'reward') {
      if (this.state.currentRewards === null) {
        return;
      }
      mappingVal = this.state.currentRewards;
    }

    //  this is the loop where activities populate and rewards populate
    return mappingVal.map(item => {
      itemNumCounter += 1;
      return (
        <View style={styles.formIndent}>
          <View style={styles.editRoutineButtonAndList}>
            <Text style={styles.redNumbers}>{itemNumCounter}</Text>
            <Text style={styles.activityText}>{item.activity_name}</Text>
          </View>
        </View>
      );
    });
  }

  addNewItemButtonToList(lns) {
    console.log('LISTNAME' + lns);
    lns === 'activity'
      ? (textfield = 'Add an activity')
      : (textfield = 'Add a reward');

    return (
      <View style={styles.formIndent}>
        <View style={styles.editRoutineButtonAndList}>
          <RaisedTextButton
            style={styles.roundAddButton}
            titleStyle={{
              color: '#FFFFFF',
              fontSize: 10,
              padding: 0,
              margin: 0,
              fontWeight: 'bold',
            }}
            title="+"
            titleColor="white"
            color="#FF6978"
            onPress={() => this.naviHelper(lns)}
          />
          <View
            style={{
              borderBottomColor: '#C4C4C4',
              borderBottomWidth: 1,
              width: WIDTH * 0.6,
            }}>
            <Text style={styles.activityText}>{textfield}</Text>
          </View>
        </View>
      </View>
    );
  }

  naviHelper(lmn) {
    if (!this.state.amount_of_activities) this.state.amount_of_activities = 0;
    if (!this.state.amount_of_rewards) this.state.amount_of_rewards = 0;

    if (lmn === 'activity') {
      var ct = this.state.amount_of_activities + 1;
      this.setState({amount_of_activities: ct});
      this.navigate('Activity', {
        prevScreenTitle: 'Edit Routines',
      });
    } else {
      var ct = this.state.amount_of_rewards + 1;
      this.setState({amount_of_rewards: ct});
      this.navigate('ParentRewards', {
        prevScreenTitle: 'Edit Routines',
      });
    }
  }

  displayToggle() {
    return (
      <View>
        <View style={styles.editRoutineIconAndTitle}>
          <Icon style={styles.routineDetailsIcon} name="check-all" />
          <Text style={styles.editRoutineSectionName}>Approve Completion</Text>
        </View>
        <View style={styles.editRoutineIconAndTitle}>
          <Text style={styles.editRoutinesInstructionsText}>
            Would you like to approve routine completion before your child
            receives their final reward?{' '}
          </Text>
          <Switch
            style={{padding: 10}}
            trackColor={{false: '#767577', true: '#FF6978'}}
            value={this.getCurrentSwitchState()}
            onValueChange={() =>
              this.changeRoutineComponent(
                'is_approved',
                !this.state.currentRoutineApproval,
              )

            }
          />
        </View>
      </View>
    );
  }

  defineTimeText(text) {
    if (text === 'Start') {
      if (this.state.currentRoutineStartTime === '00:00') {
        console.log('RETURNING THE START TIME TEXT');
        return 'Select a Start Time';
      }
      return 'Start Time';
    }
    if (text === 'End') {
      if (this.state.currentRoutineEndTime === '00:00') {
        return 'Select an End Time';
      }
      return 'End Time';
    }
  }

  defineTime(text) {
    if (text === 'Start') {
      if (this.state.currentRoutineStartTime === '00:00') {
        return '00:00';
      }
      return this.state.currentRoutineStartTime;
    }
    if (text === 'End') {
      if (this.state.currentRoutineEndTime === '00:00') {
        return '00:00';
      }
      return this.state.currentRoutineEndTime;
    }
  }

  timeMarginDefinition(text) {
    if (text === 'Start') {
      if (this.state.currentRoutineStartTime === '00:00') {
        return 260;
      }
      return 320;
    } else {
      if (this.state.currentRoutineEndTime === '00:00') {
        return 260;
      }
      return 330;
    }
  }

  getDateButtonTextColor(value) {
    if (value === 1) {
      return '#FFFFFF';
    } else {
      return '#FF6978';
    }
  }

  getDateButtonColor(value) {
    if (value === 1) {
      return '#FF6978';
    } else {
      return '#FFFFFF';
    }
  }

  addCalendar() {
    console.log('adding to cal');
    buttonstyle = {
      fontSize: 10,
      padding: 0,
      margin: 0,
      fontWeight: 'bold',
    };
    return (
      <View>
        <Text style={{fontSize: 15, marginTop: 10}}>Select Days</Text>

        <View style={styles.routinesCalendar}>
          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="M"
            titleColor={this.getDateButtonTextColor(this.state.monday)}
            onPress={
              (this._onPress,
              () => {
                this.changeRoutineComponent(
                  'monday',
                  this.swapDateValue(this.state.monday, 'monday'),
                );
              })
            }
            color={this.getDateButtonColor(this.state.monday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="T"
            titleColor={this.getDateButtonTextColor(this.state.tuesday)}
            onPress={
              (this._onPress,
              () => {
                this.changeRoutineComponent(
                  'tuesday',
                  this.swapDateValue(this.state.tuesday, 'tuesday'),
                );
              })
            }
            color={this.getDateButtonColor(this.state.tuesday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="W"
            titleColor={this.getDateButtonTextColor(this.state.wednesday)}
            onPress={
              (this._onPress,
              () => {
                this.changeRoutineComponent(
                  'wednesday',
                  this.swapDateValue(this.state.wednesday, 'wednesday'),
                );
              })
            }
            color={this.getDateButtonColor(this.state.wednesday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="Th"
            titleColor={this.getDateButtonTextColor(this.state.thursday)}
            onPress={
              (this._onPress,
              () => {
                this.changeRoutineComponent(
                  'thursday',
                  this.swapDateValue(this.state.thursday, 'thursday'),
                );
              })
            }
            color={this.getDateButtonColor(this.state.thursday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="F"
            titleColor={this.getDateButtonTextColor(this.state.friday)}
            onPress={
              (this._onPress,
              () => {
                this.changeRoutineComponent(
                  'friday',
                  this.swapDateValue(this.state.friday, 'friday'),
                );
              })
            }
            color={this.getDateButtonColor(this.state.friday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="Sa"
            titleColor={this.getDateButtonTextColor(this.state.saturday)}
            onPress={
              (this._onPress,
              () => {
                this.changeRoutineComponent(
                  'saturday',
                  this.swapDateValue(this.state.saturday, 'saturday'),
                );
              })
            }
            color={this.getDateButtonColor(this.state.saturday)}
          />

          <RaisedTextButton
            style={styles.roundDateButton}
            titleStyle={buttonstyle}
            title="Su"
            titleColor={this.getDateButtonTextColor(this.state.sunday)}
            onPress={
              (this._onPress,
              () => {
                this.changeRoutineComponent(
                  'sunday',
                  this.swapDateValue(this.state.sunday, 'sunday'),
                );
              })
            }
            color={this.getDateButtonColor(this.state.sunday)}
          />
        </View>
      </View>
    );
  }

  fieldRef = React.createRef();

  onSubmit = () => {
    let {current: field} = this.fieldRef;
    console.log(field.value());
  };

  formatText = text => {
    return text.replace(/[^+\d]/g, '');
  };

  _onSubmit = () => {
    var alr = '';

    if (
      this.state.currentRoutineName === '' ||
      !this.state.currentRoutineName
    ) {
      alr += 'Must have a routine name\n';
    }
    if (
      this.state.amount_of_activities < 1 ||
      !this.state.amount_of_activities
    ) {
      alr += 'Must have more than one activity\n';
    }
    if (this.state.amount_of_rewards < 1 || !this.state.amount_of_rewards) {
      alr += 'Must have more than one reward\n';
    }
    if (alr !== '') {
      alert(alr);
    } else {
      this.navigate('ParentNavigation', {
        prevScreenTitle: 'Routines',
      });
    }
  };

  render() {

    if (this.state.activities !== null) {
      console.log(this.state.activities);
    } else {
      return null;
    }
    return (
      <View style={styles.textFields}>
        <ScrollView>
          <View style={styles.editRoutineFormContainer}>
            {this.state.loaded && (
              <View>
                {/** ROUTINE NAME **/}
                {/* TO DO: fix floating label */}
                <TextField
                  id="routineNameField"
                  placeholder="Routine Name"
                  value={this.state.currentRoutineName}
                  style={(styles.textfieldWithFloatingLabel, styles.textFields)}
                  textInputStyle={{flex: 1}}
                  onFocus={e => console.log('Focus', !!e)}
                  onBlur={e => console.log('Blur', !!e)}
                  onEndEditing={e => {
                    this.changeRoutineComponent(
                      'routine_name',
                      this.state.currentRoutineName,
                    );
                  }}
                  onSubmitEditing={e => console.log('SubmitEditing', !!e)}
                  onChangeText={text =>
                    this.setState({currentRoutineName: text})
                  }
                />

                <View style={styles.editRoutineIconAndTitle}>
                  <Icon
                    style={styles.routineDetailsIcon}
                    name="playlist-check"
                  />
                  <Text style={styles.editRoutineSectionName}>Activities</Text>
                </View>

                <Text style={styles.editRoutinesInstructionsText}>
                  Add activities that you want your child to complete for this
                  routine.
                </Text>

                {/* Call the displayActivities function to loop over the returned activities */}
                {this.displayList('activity')}
                {this.addNewItemButtonToList('activity')}
              </View>
            )}

            {/** REWARDS NAME **/}
            {/*  TO DO: if there is a reward for the routine, populate it here, if not, leave empty */}
            <View>
              <View style={styles.editRoutineIconAndTitle}>
                <Icon style={styles.routineDetailsIcon} name="gift" />
                <Text style={styles.editRoutineSectionName}>Rewards</Text>
              </View>

              <Text style={styles.editRoutinesInstructionsText}>
                {/* TO DO: only say routine in the text string if the word isnt in the routine title */}
                Add a reward that your child receives when they complete their{' '}
                {this.state.currentRoutine}.
              </Text>
              {this.displayList('reward')}
              {this.addNewItemButtonToList('reward')}
            </View>

            {/** DEADLINES **/}
            <View>
              <View style={styles.editRoutineIconAndTitle}>
                <Icon style={styles.routineDetailsIcon} name="clock-outline" />
                <Text style={styles.editRoutineSectionName}>Set Deadlines</Text>
              </View>

              <Text style={styles.editRoutinesInstructionsText}>
                {/* TO DO: only say routine in the text string if the word isnt in the routine title */}
                Add deadlines for the given routine by selecting what days the
                routine must be completed and the frequency of the routine.
              </Text>
              {this.addCalendar()}
            </View>

            <View style={styles.timePicker}>
              <Text style={{fontSize: 18}}>{this.defineTimeText('Start')}</Text>
              <DatePicker
                style={{marginLeft: this.timeMarginDefinition('Start')}}
                date={this.defineTime('Start')}
                mode="time"
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => {
                  {
                    this.changeRoutineComponent('start_time', date);
                  }
                  this.setState({currentRoutineStartTime: date});
                }}
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    fontWeight: 200,
                  },
                }}
              />
            </View>

            <View style={styles.timePicker}>
              <Text style={{fontSize: 18}}>{this.defineTimeText('End')}</Text>
              <DatePicker
                style={{
                  marginLeft: this.timeMarginDefinition('End'),
                  fontSize: 25,
                }}
                date={this.defineTime('End')}
                mode="time"
                showIcon={false}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => {
                  {
                    this.changeRoutineComponent('end_time', date);
                  }

                  this.setState({currentRoutineEndTime: date});
                }}
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    fontWeight: 200,
                    fontSize: 20,
                  },
                }}
              />
            </View>

            {this.displayToggle()}
          </View>

          <View
            style={{
              alignItems: 'center',
            }}>
            <RaisedTextButton
              onPress={() => this._onSubmit()}
              style={{width: 100}}
              titleStyle={buttonstyle}
              title="Submit"
              titleColor={'white'}
              color={'#FF6978'}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // EDIT ROUTINES

  redNumbers: {
    marginLeft: 10,
    color: '#FF6978',
    fontSize: 20,
    padding: 0,
    margin: 0,
    marginTop: 3,
    fontWeight: 'bold',
  },
  activityText: {
    fontSize: 20,
    marginTop: 0,
    marginLeft: 10,
    marginBottom: 10,
  },
  editRoutineFormContainer: {
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 50,
  },
  editRoutineSectionName: {
    fontSize: 20,
    marginLeft: 15,
    marginTop: 5,
  },
  editRoutineIconAndTitle: {
    flexDirection: 'row',
    marginTop: 20,
  },
  routineDetailsIcon: {
    color: '#355C7D',
    fontSize: 30,
    color: '#FF6978',
  },
  textFields: {
    padding: 5,
    margin: 2,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  roundDateButton: {
    paddingLeft: 2,
    paddingRight: 2,
    marginLeft: 4,
    marginRight: 4,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 10,
    height: 35,
    minWidth: 35,
    width: 35,
    borderRadius: 50,
    color: 'white',
    fontWeight: 'bold',
  },
  routinesCalendar: {
    flexDirection:'row',
    marginLeft: 110,
  },
  timePicker: {
    fontSize: 30,
    marginRight: 200,
    flexDirection: 'row',
    marginTop: 20,
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 1,
    marginBottom: 30,
  },
  editRoutineButtonAndList: {
    flexDirection: 'row',
  },
  roundAddButton: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 10,
    height: 35,
    minWidth: 35,
    width: 35,
    borderRadius: 50,
    color: 'white',
    fontWeight: 'bold',
  },

  editRoutinesInstructionsText: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    width: 600,
  },
  formIndent: {
    marginLeft: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  imageButton: {
    marginTop: 50,
    marginLeft: 100,
  },
  descriptionBox: {
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 15,
  },
  descriptionLines: {
    marginBottom: 4,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 10,
  },
  routineDetails: {
    fontSize: 10,
    paddingTop: 15,
    paddingLeft: 15,
  },
  detailsContainer: {
    padding: 2,
    paddingTop: 10,
    paddingBottom: 15,
  },
  routines: {
    paddingLeft: 3,
    textAlignVertical: 'center',
    width: WIDTH * 0.3,
    height: 100,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 3,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowOffset: {width: 5, height: 5},
    shadowColor: 'black',
    shadowOpacity: 0.1,
    borderWidth: 0,
  },
  routineTitle: {
    fontSize: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});