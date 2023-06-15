function LoadData(city, setData) {
	const latitude = city.coords.lat;
	const longitude = city.coords.lon;

	const url = `https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&units=metric&apikey=JpKfAT8lVlu1EkZcdfTefsp9mwVmsABH`;

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			data = data.data.values;
			console.log(data);
			setData(data);
		})
		.catch((error) => console.error(error));
}

export default LoadData;
