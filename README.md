# [VélôSéoul](https://veloseoul-604e9.firebaseapp.com/)

Visualizing real time status of seoul bike(따릉이) stations.\
Built with React, Redux, [Kakao Maps API](http://apis.map.kakao.com) and [Seoul Bike API](http://data.seoul.go.kr/dataList/OA-15493/A/1/datasetView.do).\
Styled with [styled-components](https://styled-components.com/).

## Getting Started

Install dependencies.

```
npm install
```

Get your own Kakao maps and Seoul bike API keys and create .env file in the project's root directory.

```
REACT_APP_KAKAO_MAPS_API_KEY=YOUR_API_KEY
REACT_APP_SEOUL_BIKE_API_KEY=YOUR_API_KEY
```

You can start a Webpack development server and test out the project.

```
npm start
```

## Todo

1. ~~Create search functionality.~~
2. ~~If there's no station in the map bounds, show modal saying "No stations found near your location."~~
3. ~~Implement Redux. (Currently, The app has excessive number of prop-drilling.)~~
4. Apply better directory structure.
5. Firebase hosting은 https인데 서울 공공데이터 API endpoint는 http여서 `mixed content` 오류가 남, firebase functions 사용하여 우회할 것

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
