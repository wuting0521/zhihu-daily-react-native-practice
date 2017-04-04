'use strict'
import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  View,
  Text,
  Image
} from 'react-native';

const latest_news_list = "https://news-at.zhihu.com/api/4/news/latest"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginLeft: 8,
    textAlign: 'left',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 8,
    marginTop: 8,
    marginRight: 8
  },
  listView: {
    paddingTop: 64,
    backgroundColor: '#F5FCFF',
  }
});

class ZHDNewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      message: "Loading..."
    }
  }

  componentDidMount() {
    // console.log('[ZHDNewsList][UI]componentDidMount()');
    this.fetchData();
  }

  fetchData() {
    // console.log('[ZHDNewsList][Network]fetchData() fetching');
    fetch(latest_news_list)
      .then((response) => response.json())
      .then((json) => {
        // console.log('[ZHDNewsList][Network][Response] response items: ' + json.stories);
        this.setState( {
          loaded: true,
          dataSource: this.state.dataSource.cloneWithRows(json.stories),
          message: "Loaded"
        });
      })
      .catch((error) => {
        // console.log('[ZHDNewsList][Network][Error]fetchData() with error: ' + error);
        this.setState( {
          message: "Error"
        });
      })
      .done()
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    // console.log('[ZHDNewsList][UI]render list');
    return(
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderNewsItem.bind(this)}
        style={styles.listView} />
    );
  }

  renderLoadingView() {
    // console.log('[ZHDNewsList][UI]render loading');
    return(
      <View style={styles.container}>
        <Text>{this.state.message}</Text>
      </View>
    );
  }

  renderNewsItem(item) {
    // console.log('[ZHDNewsList][UI]render list cell item: ' + item.images);
    return(
      <View style={styles.container}>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Image
          source={{uri: item.images[0]}}
          style={styles.image} />
      </View>
    );
  }
}

module.exports = ZHDNewsList;