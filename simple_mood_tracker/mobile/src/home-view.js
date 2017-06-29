import React, { Component } from 'react';
import ReactNative from 'react-native';
import Update from 'react-addons-update'
const { Text, View } = ReactNative

import DD from './dd-bindings'
import Bazaar from 'bazaar-client'
const packageInfo = require('../package.json')
const bazaarInfo = require('../bazaar.json')

// We are storing all of our custom components in the moodgraph.js file
import MoodGraphView from './moodgraph.js'

// Primary React Component that will be shown for this feature
class HomeView extends Component {
  constructor({ ddOverride }) {
    super()
    // Setup DoubleDutch API bridge
    this.api = new Bazaar.Client(DD,{
      featureName: packageInfo.name,
      eventID: DD.currentEvent.EventId,
    })
    // We are going to store the happy and sad samples in an array in the homeview state
    var data=[]
    this.state = {
      samples:data,
      sum:0
    }
  }

  // This method will be used to add happy and sad samples
  // Since this method relies on "this" we need to remember to bind it when
  // we pass it on to other components 
  addSample(value){
    // Inorder to maintain state as an immutable object, we will add new values
    // to the sample array by first making a shallow copy
    var data=this.state.samples.slice(0,this.state.samples.length)
    data.push(value)
    // We will use Object.assign to merge our changes with the current state
    // inorder to not change the original state object
    this.setState(Object.assign({},this.state,{samples:data,sum:this.state.sum+value}))
    // Calling setState will trigger a rerender, so at this point there is
    // nothing else we need to do inorder to have the new state rendered
  }

  render() {
    // This is the main render function... notice that we are passing both the
    // state and the addSample method to the MoodGraphView component
    return (
      <View title="" style={{ flex: 1,backgroundColor:"#AADDFF" }}>
        <Text style={{textAlign:'center',fontSize:35,marginTop:150,color:"#77AACC"}}>Mood Tracker</Text>
        <MoodGraphView addSample={this.addSample.bind(this)} {...this.state} />
      </View>
    )
  }
}

export default HomeView
