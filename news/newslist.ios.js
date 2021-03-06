'use strict'
import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  View,
  Text,
  Image,
  RefreshControl
} from 'react-native';

var newsList = []
var latestDate = "";

class ZHDNewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      isLoaded: false,
      isLoading: false,
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
    if (this.state.isRefreshing) {
      console.log('fetchData() in the middle of refreshing');
    }
    this.setState({
      isRefreshing: true
    });
    // console.log('[ZHDNewsList][Network]fetchData() fetching');
    fetch(latest_news_list)
      .then((response) => response.json())
      .then((json) => {
        // console.log('[ZHDNewsList][Network][Response] response items: ' + json.stories);
        // console.log('fetchData() with json.stories are array: ' + Array.isArray(newsList));
        newsList = [];
        // newsList.concat.call(json.stories);
        for (var i = 0; i < json.stories.length; i++) {
          newsList.push(json.stories[i]);
        }
        console.log('fetchData() with newsList: ' + newsList);
        this.setState( {
          isRefreshing: false,
          isLoaded: true,
          dataSource: this.state.dataSource.cloneWithRows(newsList),
          message: "Loaded"
        });
        latestDate = json.date;
      })
      .catch((error) => {
        // console.log('[ZHDNewsList][Network][Error]fetchData() with error: ' + error);
        this.setState( {
          isRefreshing: false,
          message: "Error"
        });
      })
      .done();
  }

  onEndReached() {
    console.log('onEndReached()');
    this.fetchHistoricalData();
  }

  fetchHistoricalData() {
    if (this.state.isLoading) {
      console.log('fetchHistoricalData() is in the middle of loading more');
      return;
    }
    if (latestDate == "") {
      console.log('fetchHistoricalData() parameter error, latestDate can\'t be empty');
      return;
    }
    this.setState({
      isLoading: true
    });
    var historicalUrl = historical_news_lst + latestDate;
    console.log('fetchHistoricalData() with url:' + historicalUrl);
    fetch(historicalUrl)
      .then((response) => {
        console.log('fetchHistoricalData() on response with ' + response);
        return response.json();
      })
      .then((json) => {
        console.log('fetchHistoricalData() on parsed response with json: ' + json.date + '\ndata:' + json.stories);
        for (var i = 0; i < json.stories.length; i++) {
          newsList.push(json.stories[i]);
        }
        this.setState({
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(newsList)
        });
        latestDate = json.date;
      })
      .catch((error) => {
        console.error('fetchHistoricalData() error with ' + error);
        this.setState({
          isLoading: false
        });
      })
      .done()
  }

  render() {
    if (!this.state.isLoaded) {
      return this.renderLoadingView();
    }

    // console.log('[ZHDNewsList][UI]render list');
    return(
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.fetchData.bind(this)} />}
        onEndReached={this.onEndReached.bind(this)}
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
      <View>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Image
            source={{uri: item.images[0]}}
            style={styles.image} />
        </View>
        <View style={styles.separator}>
        </View>
      </View>
    );
  }
}

const latest_news_list = "https://news-at.zhihu.com/api/4/news/latest";
const historical_news_lst = "https://news-at.zhihu.com/api/4/news/before/";
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
    backgroundColor: '#F5FCFF'
  },
  separator: {
    height: 0.5,
    backgroundColor: '#dddddd'
  }
});

module.exports = ZHDNewsList;
