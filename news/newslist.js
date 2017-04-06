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
var page = 0;

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
        // console.log('fetchData()' + json.data[1].data);
        var data = json.data[1].data;
        // console.log('fetchData() + data: ' + data);
        for (var i = 0; i < data.length; i+=2) {
          var item = [];
          item.push(data[i]);
          if (i+1 < data.length) {
            item.push(data[i+1]);
          }
          newsList.push(item);
        }
        page = 1;
        // console.log('fetchData() with newsList: ' + newsList);
        this.setState( {
          isRefreshing: false,
          isLoaded: true,
          dataSource: this.state.dataSource.cloneWithRows(newsList),
          message: "Loaded"
        });
        // latestDate = json.date;
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
    this.setState({
      isLoading: true
    });
    var historicalUrl = historical_news_lst + (page+1);
    console.log('fetchHistoricalData() with url:' + historicalUrl);
    fetch(historicalUrl)
      .then((response) => {
        console.log('fetchHistoricalData() on response with ' + response);
        return response.json();
      })
      .then((json) => {
        console.log('fetchHistoricalData() on parsed response with json: ' + json.date + '\ndata:' + json.stories);
        var data = json.data.data;
        var lastData = newsList[newsList.length-1];
        var k = 0;
        if (lastData.length<2) {
          lastData.push(data[0]);
          k = 1
        }
        for (var i = k; i < data.length; i+=2) {
          var item = [];
          item.push(data[i]);
          if (i+1 < data.length) {
            item.push(data[i+1]);
          }
          newsList.push(item);
        }
        page+=1;
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
    if (item.length < 2) {
      return (
        <View>
        </View>
      )
    }

    var item1 = item[0];
    var item2 = item[1];

    return(
      <View style={styles.container}>
        <View>
          <Image style={styles.image1}
            source={{uri: item1.thumb}}>
              <Text style={styles.tag}>{item1.tag}</Text>
          </Image>
          <View style={styles.pannelContainer}>
            <Text style={styles.title1}>{item1.desc}</Text>
            <Text style={styles.subTitle1}>{item1.name}</Text>
          </View>
        </View>
        <View>
          <Image style={styles.image2}
            source={{uri: item2.thumb}}>
            <Text style={styles.tag}>{item2.tag}</Text>
          </Image>
          <View style={styles.pannelContainer}>
            <Text style={styles.title2}>{item2.desc}</Text>
            <Text style={styles.subTitle2}>{item2.name}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const latest_news_list = "https://idx.3g.yy.com/mobyy/nav/index/idx";
const historical_news_lst = "https://idx.3g.yy.com/mobyy/module/index/idx/8?page=";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  pannelContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  title1: {
    flex:2,
    fontSize: 10,
    textAlign: 'left',
    color: '#333333'
  },
  subTitle1: {
    flex:1,
    fontSize: 8,
    textAlign: 'right',
    color: '#666666',
    marginRight: 4
  },
  title2: {
    flex:2,
    fontSize: 10,
    textAlign: 'left',
    color: '#333333',
    marginLeft: 4,
  },
  subTitle2: {
    flex:1,
    fontSize: 8,
    textAlign: 'right',
    color: '#666666',
  },
  image1: {
    width: 176,
    height: 160,
    marginTop: 4,
    marginRight: 4,
    resizeMode: Image.resizeMode.cover
  },
  image2: {
    width: 176,
    height: 160,
    marginLeft: 4,
    marginTop: 4,
    resizeMode: Image.resizeMode.cover
  },
  tag:{
    fontSize: 8,
    backgroundColor: 'rgba(0.3, 0.3, 0.3, 0.5)',
    color: '#ffdd00'
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
