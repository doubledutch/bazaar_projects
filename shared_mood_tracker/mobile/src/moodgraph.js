import React, { Component } from 'react';
import ReactNative from 'react-native';
import Update from 'react-addons-update'

const { Alert, TouchableOpacity, Text, View, ScrollView, Image, Modal,TextInput,Button} = ReactNative

// This is the root of our View tree. We will export this as the default
// component from this file.
class MoodView extends Component{
	render(){
		return(
			<View>
				<MoodGraph {...this.props} />
				<MoodStats {...this.props} />
				<MoodChoice addSample={this.props.addSample} />
			</View>
		)
	}
}

// The MoodGraph renders our mood samples as a simple barchart using the MoodBar component
class MoodGraph extends Component{
	render(){	
		return(
			<View style={{flexDirection:'row',justifyContent:'center',marginTop:50,marginBottom:10}}>
				{this.props.samples.slice(-Math.min(20,this.props.samples.length)).map((sample)=>{
					return (
						<MoodBar value={sample} />
					)
				})}
			</View>
		)
	}
}

// The MoodBar component renders a single samole in the MoodGraph
class MoodBar extends Component{
	render(){
		if(this.props.value>0){
			return(
				<View style={{width:10,height:50,marginTop:0,marginBottom:50,marginLeft:1,backgroundColor:"#AAFF55"}} />
			)
		}else{
			return(
				<View style={{width:10,height:50,marginTop:50,marginBottom:0,marginLeft:1,backgroundColor:"#FF0055"}} />
			)
		}
	}
}

// The MoodStats component provides the user with simple stats on his mood samples
class MoodStats extends Component{
	render(){
		// If we don't have any samples yet, don't render this component
		if(this.props.samples.length==0){
			return null
		}
		// Set the text based on the current sum
		var text
		if(this.props.sum==0){
			text="You are just as happy as you are sad"
		}else if(this.props.sum>0){
			text="You are more happy than you are sad"
		}else{
			text="You are more sad than you are happy"
		}
		if(this.props.world_sum==this.props.sum){
			text+=". You are about as happy as everyone else."
		}else if(this.props.world_sum>this.props.sum){
			text+=". You are sadder than everyone else."
		}else{
			text+=". You are happier than everyone else."
		}
		// Return a view containing the current text
		return(
			<View style={{backgroundColor:"#FFFFFF",margin:10,padding:10,borderRadius:10}}>
				<Text style={{textAlign:"left"}}>{text}</Text>
			</View>
		)
	}
}

// The MoodChoice component shows the user buttons to add new happy and sad samples.
// Notice that we are calling the addSample method from HomeView that was passed in through props.
// Since the method was already bound to this, it will be called within the context of the HomeView instance.
class MoodChoice extends Component{
	render(){
		return (
			<View style={{flexDirection: 'column',backgroundColor:"#FFFFFF",margin:10,padding:10,borderRadius:10}}>
				<Button title="Happy" style={{flex:1}} onPress={()=>this.props.addSample(1)} />
				<View style={{height:1,backgroundColor:"#EEEEEE"}}></View>
				<Button title="Sad" style={{flex:1}} onPress={()=>this.props.addSample(-1)} />
			</View>
		)
	}
}

export default MoodView