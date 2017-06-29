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
    console.log(DD.currentEvent.EventId)
    // Setup DoubleDutch API bridge
    this.api = new Bazaar.Client(DD,{
      featureName: packageInfo.name,
      eventID: DD.currentEvent.EventId,
      isSandboxed: false,
      horizonHost: 'bazaar.doubledutch.me'
    })
    // We are going to store the happy and sad samples in an array in the homeview state
    var data=[]
    this.state = {
      samples:data,
      sum:0,
      user_sums:{},
      world_sum:0
    }
  }

  componentDidMount() {
    // Open a connection to horizon
    this.api.connect().then((user) => {
      // Open a streaming query. This will get all current documents in our collection as well as future documents
      // when they are inserted or updated
      this.api.fetchDocumentsInCollection(collection = 'mood_samples', query = null, watch = true).subscribe((results) => {
        // We need to update our state based on the data we receive. We will collect all changes in
        // this temporary object and merge it into state after each result set
        var changeState={
          user_sums:this.state.user_sums
        }
        // Go through each document in this result set
        results.map((result)=>{
          if(this.api.getUserID()==result.user_id){
            // Our own data
            changeState.samples=result.samples
            changeState.sum=result.sum
          }else{
            // Someone elses data
            var user_sum={}
            user_sum[result.user_id]=result.sum
            changeState.user_sums=Object.assign({},changeState.user_sums,user_sum)
          }
        })
        // Calculate a new world mood sum
        var world_sum=0
        for(var key in changeState.user_sums){
          if(changeState.user_sums.hasOwnProperty(key)){
            world_sum=changeState.user_sums.get(key)
          }
        }
        // Update our internal state
        this.setState(Object.assign({},this.state,changeState,{world_sum:world_sum}))
      })
    }).catch((err) => {
      // debugger
      console.log("got error")
      console.log(err)
    })
  }

  // This method will be used to add happy and sad samples
  // Since this method relies on "this" we need to remember to bind it when
  // we pass it on to other components 
  addSample(value){
    // Inorder to maintain state as an immutable object, we will add new values
    // to the sample array by first making a shallow copy
    var data=this.state.samples.slice(0,this.state.samples.length)
    data.push(value)
    
    // We are going to create a separate object that we upsert into horizon
    const doc={id:this.api.getUserID(),user_id: this.api.getUserID(),sum:this.state.sum+value,samples:data,created:new Date().getTime()}
    // Inorder to avoid having to merge state, we only update our internal state after the change has been saved
    this.api.upsertInCollection('mood_samples', doc).subscribe(()=>{
      // Notice that we have to calculate sum again... the setState call is async.
      // We won't see changes to it until after this call
      // We will use Object.assign to merge our changes with the current state
      // inorder to not change the original state object
      this.setState(Object.assign({},this.state,{samples:data,sum:this.state.sum+value}))
      // Calling setState will trigger a rerender, so at this point there is
      // nothing else we need to do inorder to have the new state rendered
    })
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
