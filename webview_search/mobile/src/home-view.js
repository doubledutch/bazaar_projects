import React, { Component } from 'react';
import ReactNative from 'react-native';
import Update from 'react-addons-update'
import DD from './dd-bindings'

const { Alert, Text, View, WebView } = ReactNative
import Bazaar from 'bazaar-client'
const packageInfo = require('../package.json')
const bazaarInfo = require('../bazaar.json')

var eventID = ''
const isSandboxed = false

class HomeView extends Component {
  constructor() {
    super()

    eventID = DD.currentEvent.EventId

    const options = {
      isSandboxed,
      featureName: packageInfo.name,
      eventID,
      horizonHost: isSandboxed ? 'localhost:7171' : 'bazaar.doubledutch.me'
    }

    this.api = new Bazaar.Client(DD, options)
    this.state = { user: null }
  }

  componentDidMount() {
    this.api.connect().then((user) => {
      this.setState({user})
      DD.setTitle(`${user.FirstName} ${user.LastName}`)      
    }).catch((err) => {
      Alert.alert('Error: ' + err)
    })
  }

  render() {
    const { user } = this.state
    return (
      user
        ? <WebView source={{uri: `https://google.com/search?q=${encodeURIComponent(searchText(user))}`}} />
        : <View><Text>Loading...</Text></View>
    )
  }
}

function searchText(user) {
  if (!user || !user.details) return ''

  return (user.details.FirstName || user.details.LastName) ? `${user.details.FirstName} ${user.details.LastName}` : user.details.EmailAddress
}

const styles = ReactNative.StyleSheet.create({
})

export default HomeView
