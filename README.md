# VélôSéoul

Visualizing real time status of seoul bike(따릉이) stations.\
Built with React, [Kakao Maps API](http://apis.map.kakao.com) and [Seoul Bike API](http://data.seoul.go.kr/dataList/OA-15493/A/1/datasetView.do).\
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
2. Create InfoWindow to show detailed status of individual station.
3. If there's no station in the map bounds, show modal saying "No stations found near your location."

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
