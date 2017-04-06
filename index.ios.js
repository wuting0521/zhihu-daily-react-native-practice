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
    backgroundColor: '#F5FCFF',
  }
});

var ZHDNewsList = require('./news/newslist.js');

export default class ZhihuDaily extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: '知乎日报',
          component: ZHDNewsList
        }} />
    );
  }
}

AppRegistry.registerComponent('ZhihuDaily', () => ZhihuDaily);
