import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { getCurrentDate } from "../src/commonUtil";

const WEATHER_API_KEY = "d5463ce650cc583333f40ffbbaa16be4";

// _S 는 state이다.
// useEffect(실행함수, [배열]);

const TodayScreen = () => {
  const [location_S, setLocation_S] = useState(null);
  const [errMsg_S, setErrMsg_S] = useState(``);

  const [viewDate, setViewDate] = useState(`0000. 00. 00 (0)`);
  const [viewTime, setviewTime] = useState(`00:00`);

  const [currentTemp, setCurrentTemp] = useState(`0`);
  const [currentCity, setCurrentCity] = useState(``);

  const [minTemp, setMinTemp] = useState(``);
  const [maxTemp, setMaxTemp] = useState(``);

  const [weatherStatus, setWeatherStatus] = useState(``);

  setInterval(() => {
    const { currentDate, currentTime } = getCurrentDate();

    setViewDate(currentDate);
    setviewTime(currentTime);
  }, 1000);

  useEffect(() => {
    const { currentDate, currentTime } = getCurrentDate();

    setViewDate(currentDate);
    setviewTime(currentTime);
    (async () => {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        setErrMsg_S("Refuse Permission This Device.");
        return;
      }

      const locData = await Location.getCurrentPositionAsync({});
      setLocation_S(locData);

      try {
        const weather = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${locData.coords.latitude}&lon=${locData.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric`
        )
          .then((res) => {
            return res.json();
          })
          .then((json) => {
            const temp = String(json.main.temp).split(".")[0];
            const minTemp = String(json.main.temp_min).split(".")[0];
            const maxTemp = String(json.main.temp_max).split(".")[0];

            /* floor을 이용해서 소수점을 자르려면 인티져 타입이어야 해서 복잡해서 split 을 이용해 점을 기준으로 나누어서 0번째 배열의 수를 가져옴 */

            setCurrentCity(json.name);
            setCurrentTemp(temp);
            setMinTemp(minTemp);
            setMaxTemp(maxTemp);

            const status = json.weather[0].description;

            switch (status) {
              case "clear sky":
                setWeatherStatus("날씨가 좋아요. 외출은 어떠신가요?");
                break;
              case "few clouds":
                setWeatherStatus("조금 흐리네요.");
                break;

              case "scattered clouds":
                setWeatherStatus("구름이 많아요. 운전에 유의하세요.");
                break;

              case "broken clouds":
                setWeatherStatus("비가 올 수도 있어요. 우산을 챙겨주세요.");
                break;

              case "shower rain":
                setWeatherStatus("비가 오고있어요. 우산은 필수에요");
                break;

              case "moderate rain":
                setWeatherStatus("비가 오고 있어요. 우산은 챙기셨나요?");
                break;

              case "rain":
                setWeatherStatus("비가 오고있어요. 우산은 필수에요");
                break;

              case "thunderstorm":
                setWeatherStatus("천둥번개가 치고 있어요. 외출을 자제해주세요");
                break;

              case "snow":
                setWeatherStatus(
                  "눈이 내리고 있어요. 친구들과 눈싸움을 즐겨보는 건 어떠신가요?"
                );
                break;

              case "mist":
                setWeatherStatus("안개가 짙어요. 안전운전하세요");
                break;
            }
          });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text>{location_S && location_S.coords.latitude}</Text>
      <Text>{location_S && location_S.coords.longitude}</Text> */}
      <View style={styles.box_1}>
        <Text style={styles.timeText}>{viewTime}</Text>
        <Text style={styles.dateText}>{viewDate}</Text>
      </View>
      <View style={styles.box_2}>
        <Text style={styles.statusText}>{weatherStatus}</Text>
        <Text style={styles.tempText}>{currentTemp}°C</Text>
        <View style={styles.tempUnderLine}></View>
      </View>
      <View style={styles.box_3}>
        <Text style={styles.cityText}>{currentCity}</Text>
      </View>
      <View style={styles.box_4}>
        <View style={styles.box_4_box}>
          <Text style={styles.tempGuideText}>최저기온</Text>
          <Text style={styles.minMaxText}>{minTemp}°C</Text>
        </View>
        <View style={styles.box_4_box}>
          <Text style={styles.tempGuideText}>최고기온</Text>
          <Text style={styles.minMaxText}>{maxTemp}°C</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,

    alignItems: `center`,
    justifyContent: `center`,
  },
  box_1: {
    flex: 2.5,
    width: `100%`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  dateText: {
    fontSize: 19,
    color: `#34495e`,
  },
  timeText: {
    fontSize: 34,
    fontWeight: `700`,
  },
  statusText: {
    fontSize: 18,
    color: `#333`,
    marginBottom: 100,
  },
  box_2: {
    flex: 3,
    width: `100%`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `flex-end`,
  },
  tempText: {
    fontWeight: `500`,
    fontSize: 90,
  },
  tempUnderLine: {
    width: `70%`,
    height: 5,
    backgroundColor: "#666",
    borderRadius: 20,
    marginTop: -10,
  },
  box_3: {
    flex: 1,
    width: `100%`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `flex-start`,
  },
  cityText: {
    fontSize: 20,
    fontWeight: `500`,
    color: `#888`,
  },
  box_4: {
    flex: 2,
    width: `100%`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  box_4_box: {
    flex: 1,
    width: `40%`,
    height: `100%`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  tempGuideText: {
    fontSize: 26,
    fontWeight: `500`,
    padding: 5,
  },
  minMaxText: {
    fontWeight: `400`,
    fontSize: 20,
  },
});

export default TodayScreen;

// 1. location (위치) 위도 , 경도를 구해야함
// ex ) 공주 , 대전

// expo install expo-location 을 하여 Location 을 install 한다.
