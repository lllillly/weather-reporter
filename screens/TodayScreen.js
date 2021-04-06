import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import * as Location from "expo-location";
import { getCurrentDate } from "../src/commonUtil";
import { LinearGradient } from "expo-linear-gradient";
import TypeWriter from "react-native-typewriter";

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
  const [weatherImg, setWeatherImg] = useState(null);

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
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Fsun.png?alt=media&token=80fe39ed-0318-410d-ae2d-3700c0652d3e"
                );
                break;
              case "few clouds":
                setWeatherStatus("조금 흐리네요.");
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Fclouds.png?alt=media&token=dc7ca589-d24e-4e0f-84d6-cedb3058247a"
                );
                break;

              case "scattered clouds":
                setWeatherStatus("구름이 많아요. 운전에 유의하세요.");
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Fclouds.png?alt=media&token=dc7ca589-d24e-4e0f-84d6-cedb3058247a"
                );
                break;

              case "broken clouds":
                setWeatherStatus("비가 올 수도 있어요. 우산을 챙겨주세요.");
                weatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Ftwo-black-clouds.png?alt=media&token=579a6842-d490-4f2c-9188-f32427b9b7b0"
                );
                break;

              case "shower rain":
                setWeatherStatus("비가 오고있어요. 우산은 필수에요");
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Frain.png?alt=media&token=cf43b298-d1b9-4d69-a318-23f8eb7f7183"
                );

                break;

              case "moderate rain":
                setWeatherStatus("비가 오고 있어요. 우산은 챙기셨나요?");
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Frain.png?alt=media&token=cf43b298-d1b9-4d69-a318-23f8eb7f7183"
                );

                break;

              case "rain":
                setWeatherStatus("비가 오고있어요. 우산은 필수에요");
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Frain.png?alt=media&token=cf43b298-d1b9-4d69-a318-23f8eb7f7183"
                );

                break;

              case "thunderstorm":
                setWeatherStatus("천둥번개가 치고 있어요. 외출을 자제해주세요");
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Fthunderstorm.png?alt=media&token=36555151-9884-4130-a975-c7df3b926e03"
                );
                break;

              case "snow":
                setWeatherStatus(
                  "눈이 내리고 있어요. 눈사람을 만들어보는건 어떠신가요?"
                );
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Fsnow.png?alt=media&token=4473b2d3-399b-481c-a617-7088e7ae1289"
                );
                break;

              case "mist":
                setWeatherStatus("안개가 짙어요. 안전운전하세요");
                setWeatherImg(
                  "https://firebasestorage.googleapis.com/v0/b/weather-reporter-54fbd.appspot.com/o/WEATHER_ICON%2Ffog.png?alt=media&token=44274949-612c-4c33-9e00-c489161a6b62"
                );
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
      <LinearGradient
        colors={[`#E29585`, `#E87D75`, `#E29585`]}
        style={styles.gbox}
      >
        {/* <Text>{location_S && location_S.coords.latitude}</Text>
      <Text>{location_S && location_S.coords.longitude}</Text> */}
        <View style={styles.box_1}>
          <Text style={styles.timeText}>{viewTime}</Text>
          <Text style={styles.dateText}>{viewDate}</Text>
        </View>
        <View style={styles.box_2}>
          {weatherImg && (
            <Image
              style={styles.weatherImg}
              source={{
                uri: weatherImg,
              }}
            />
          )}
          <Text style={styles.statusText}>
            <TypeWriter typing={1}>{weatherStatus}</TypeWriter>
          </Text>
          <Text style={styles.tempText}>{currentTemp}°C</Text>
          <View style={styles.tempUnderLine}></View>
        </View>
        <View style={styles.box_3}>
          <Text style={styles.cityText}>{currentCity}</Text>
        </View>
        <View style={styles.box_4}>
          {/* <View style={styles.box_4_box}>
          <Text style={styles.tempGuideText}>최저기온</Text>
          <Text style={styles.minMaxText}>{minTemp}°C</Text>
        </View>
        <View style={styles.box_4_box}>
          <Text style={styles.tempGuideText}>최고기온</Text>
          <Text style={styles.minMaxText}>{maxTemp}°C</Text>
        </View> */}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    width: `100%`,
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
    color: `#fdf8ef`,
  },
  timeText: {
    fontSize: 34,
    fontWeight: `700`,
    color: `#fdf8ef`,
  },
  statusText: {
    fontSize: 19,
    fontWeight: `600`,
    color: `#fdf8ef`,
    marginBottom: 20,
    marginTop: 20,
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
    color: `#2e2e2e`,
  },
  tempUnderLine: {
    width: `60%`,
    height: 4,
    backgroundColor: "#fdf8ef",
    borderRadius: 20,
    marginTop: -10,
    marginBottom: 10,
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
    color: `#fdf8ef`,
  },
  box_4: {
    flex: 2,
    width: `100%`,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#ffdcb8",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    backgroundColor: `#ffdcb8`,
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
  },
  gbox: {
    width: `100%`,
    height: `100%`,
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
  weatherImg: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
});

export default TodayScreen;

// 1. location (위치) 위도 , 경도를 구해야함
// ex ) 공주 , 대전

// expo install expo-location 을 하여 Location 을 install 한다.
