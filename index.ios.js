'use strict'
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f5',
  }
});

var ZHDNewsList = require('./news/newslist.js');

export default class ZhihuDaily extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'YY LIVE',
          component: ZHDNewsList
        }} />
    );
  }
}

AppRegistry.registerComponent('ZhihuDaily', () => ZhihuDaily);
