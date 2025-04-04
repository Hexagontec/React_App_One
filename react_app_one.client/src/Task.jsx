import { useEffect, useState } from 'react';
import './css_customs/task_cc.css';

function App() {
    const [forecasts, setForecasts] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        populateTaskData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const task_save = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await populateTaskData(); // Refresh the task list
                setFormData({ title: '', description: '' }); // Reset form
            }
        } catch (error) {
            console.error('Error submitting task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const task_delete = async (taskId) => {
        try {
            const response = await fetch(`task/${taskId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await populateTaskData(); // Refresh the task list
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const task_complte = async (taskId) => {
        try {
            const response = await fetch(`task/${taskId}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                await populateTaskData(); // Refresh the task list
            }
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };


    const contents_1 = forecasts.length === 0 ? <p>No data found!</p> :
        <div className="row">
            {forecasts.filter(forecast => !forecast.is_Task_Completed).slice(0, 5).map(forecast =>
                <div className="card card_margin_bottom" key={forecast.id} >
                    <div className="card-body">
                        <h4 className="card-title"><b>Title</b>: {forecast.title}</h4>
                        <p className="card-category"><b>Description</b>: {forecast.description}</p>
                        <div class="d-flex justify-content-between">
                            <button type="button" className="btn btn-rose btn-sm pull-left" onClick={() => $.sweetModal.confirm('Do you need to remove this task(' + forecast.title + ')?', function () { task_delete(forecast.id) })}><span class="material-icons">delete</span></button>
                            <button type="button" className="btn btn-success btn-sm pull-right" onClick={() => $.sweetModal.confirm('Do you need to complete this task(' + forecast.title + ')?', function () { task_complte(forecast.id) })}><span class="material-icons">done</span></button>
                        </div>
                    </div>
                </div>
            )}
        </div>;

    const contents_2 = forecasts.length === 0 ? <p>No data found!</p> :
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center">Title</th>
                        <th className="text-center">Description</th>
                        <th className="text-center">Insert Datetime</th>
                        <th className="text-center">Task Status</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr className="text-center" key={forecast.id}>
                            <td className="text-center">{forecast.id}</td>
                            <td className="text-center">{forecast.title}</td>
                            <td className="text-center">{forecast.description}</td>
                            <td className="text-center"> {new Date(forecast.insert_Datetime).toLocaleString()}</td>
                            <td className="text-center">{forecast.is_Task_Completed ? <span class="badge badge-pill badge-info">Conmpleted</span> : <span class="badge badge-pill badge-danger">Pending</span>}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>;

    return (
        <div className="row">
            <div className="col-md-6">
                <form id="TypeValidation" className="form-horizontal" onSubmit={task_save}>
                    <div className="card ">
                        <div class="card-header card-header-rose card-header-icon">
                            <div class="card-icon">
                                <i class="material-icons">add</i>
                            </div>
                        </div>
                        <div className="card-body ">
                            <div className="row">
                                <label className="col-sm-2 col-form-label">Title</label>
                                <div className="col-sm-7">
                                    <div className="form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <label className="col-sm-3 label-on-right">
                                    <code>*</code>
                                </label>
                            </div>
                            <div className="row">
                                <label className="col-sm-2 col-form-label">Description</label>
                                <div className="col-sm-7">
                                    <div className="form-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <label className="col-sm-3 label-on-right">
                                    <code>*</code>
                                </label>
                            </div>
                        </div>
                        <div className="card-footer ml-auto mr-auto">
                            <button type="submit" className="btn btn-rose" disabled={isLoading}>
                                {isLoading ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </form>
                <div class="card ">
                    <div class="card-header card-header-rose card-header-text">
                        <div class="card-text">
                            <h4 class="card-title">All Task Details</h4>
                        </div>
                    </div>
                    <div class="card-body ">
                        {contents_2}
                    </div>
                </div>
               
            </div>
            <div className="col-md-6 scroll_container_1">
                {contents_1}
            </div>
        </div>
    );

    async function populateTaskData() {
        try {
            const response = await fetch('task');
            if (response.ok) {
                const data = await response.json();
                setForecasts(data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }
}

export default App;