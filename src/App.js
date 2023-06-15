import React, { useState, useRef, useEffect } from "react";
import cityList from "./city.json";
import LoadData from "./API/LoadData";
import { useGeolocated } from "react-geolocated";

function App() {
	const [search, setSearch] = useState("");
	const [searchIcon, setSearchIcon] = useState("search.svg");
	const [load, setLoad] = useState(0);
	const [data, setData] = useState();
	const [city, setCity] = useState("");
	const [cloudiness, setCloudiness] = useState([]);
	const { coords, isGeolocationAvailable, isGeolocationEnabled } =
		useGeolocated({
			positionOptions: {
				enableHighAccuracy: false,
			},
			userDecisionTimeout: 5000,
		});

	useEffect(() => {
		setLoad(0);
		if (typeof data === "undefined") {
			setCloudiness(["", "", "cloudiness/sunny/sunny5.jpg"]);
			return;
		}
		let cloudy = [];
		let rand_num = Math.floor(Math.random() * 8) + 1;
		if (data.cloudCover <= 30) {
			cloudy = ["sunny.svg", "Ясно", `cloudiness/sunny/sunny${rand_num}.jpg`];
		}
		if (data.cloudCover > 30 && data.cloudCover <= 70) {
			cloudy = [
				"partly_cloudy.svg",
				"Обласно с прояснениями",
				`cloudiness/partly_cloudy/partly_cloudy${rand_num}.jpg`,
			];
		}
		if (data.cloudCover > 70 && data.cloudCover <= 80) {
			cloudy = [
				"clody.svg",
				"Облачно",
				`cloudiness/cloudy/cloudy${rand_num}.jpg`,
			];
		}
		if (data.cloudCover > 80) {
			cloudy = ["clody.svg", "Пасмурно", `cloudiness/dull/dull${rand_num}.jpg`];
		}
		if (data.rainIntensity > 0) {
			console.log("Идет дождь");
			if (data.uvIndex > 2) {
				cloudy = [
					"rainy.svg",
					"Может быть гроза",
					`storm/storm${rand_num}.jpg`,
				];
			} else {
				cloudy = ["rainy.svg", "Идет дождь", `rainy/rainy${rand_num}.jpg`];
			}
		}

		if (data.snowIntensity > 0) {
			console.log("Идет снег");
			cloudy = ["snow.svg", "Идет снег", `snow/snow${rand_num}.jpg`];
		}
		setCloudiness(cloudy);
	}, [data]);

	function setSearchStr(str) {
		let find = cityList.find((city) => city.name == str);
		let wordArr = str.split(" ");
		wordArr = wordArr.map((word) => {
			let firstLetter = word.charAt(0).toUpperCase();
			let rest = word.substring(1);
			return firstLetter + rest;
		});
		str = wordArr.join(" ");
		setSearch(str);

		if (!str) {
			setSearchIcon("search.svg");
			return;
		}
		if (find) {
			setSearchIcon("happy.svg");
			setLoad(1);
			setCity(find.name);
			LoadData(find, setData);
		} else {
			setSearchIcon("travel_explorer.svg");
		}
	}

	return (
		<div
			className='app'
			style={{
				backgroundImage: "url(/images/background/" + cloudiness[2] + ")",
			}}
		>
			<div className='weather'>
				<div className='weather__up'>
					<div className='weather__up_search'>
						<input
							placeholder='Поиск города..'
							value={search}
							onChange={(e) => setSearchStr(e.target.value)}
						/>
						<div className='icons_search'>
							<img src={"/images/icons/" + searchIcon} />
						</div>
					</div>
					{load == 0 ? (
						<div className='weather__up_render'>
							{typeof data === "undefined" ? (
								""
							) : (
								<React.Fragment>
									<span className='weather__up_render__name'>
										Погода в городе {city}
									</span>
									<span className='weather__up_render__temperature'>
										{data.temperature} °C
									</span>
									<div className='weather__up_render__cloudiness'>
										<img src={`/images/icons/weather/${cloudiness[0]}`} />
										<span className='weather__up_render__cloudiness__span'>
											{cloudiness[1]}
										</span>
									</div>
									<div className='weather__up_render__cloudiness down_parametr'>
										<span className='weather__up_render__cloudiness__span'>
											Влажность:
										</span>
										<span className='weather__up_render__cloudiness__span'>
											{data.humidity}%
										</span>
									</div>
									<div className='weather__up_render__cloudiness down_parametr'>
										<span className='weather__up_render__cloudiness__span'>
											Скорость ветра:
										</span>
										<span className='weather__up_render__cloudiness__span'>
											{data.windSpeed} м/с
										</span>
									</div>
								</React.Fragment>
							)}
						</div>
					) : (
						<img src='/images/icons/load.svg' className='load' />
					)}
				</div>
				<div className='weather__down'></div>
			</div>
		</div>
	);
}

export default App;
