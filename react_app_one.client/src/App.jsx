import { useEffect, useState } from 'react';

function App() {
    const [forecasts, setForecasts] = useState();

    useEffect(() => {
        populateWeatherData();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>

        :
        <div class="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th class="text-center" id="Date">Date</th>
                        <th class="text-center">Temp. (C)</th>
                        <th class="text-center">Temp. (F)</th>
                        <th class="text-center">Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr class="text-center"  key={forecast.date}>
                            <td class="text-center">{forecast.date}</td>
                            <td class="text-center">{forecast.temperatureC}</td>
                            <td class="text-center">{forecast.temperatureF}</td>
                            <td class="text-center">{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        ;



    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header card-header-icon card-header-rose">
                            <div class="card-icon">
                                <i class="material-icons">assignment</i>
                            </div>
                            <h4 class="card-title ">Simple Table</h4>
                        </div>
                        <div class="card-body">
                            {contents}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        if (response.ok) {
            const data = await response.json();
            setForecasts(data);
        }
    }
}

export default App;