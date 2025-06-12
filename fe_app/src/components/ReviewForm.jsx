import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const ReviewForm = ({ movie_id, reloadReviews }) => {
    const initialData = { name: "", text: "", vote: "" };


    const [formData, setFormData] = useState(initialData);

    const setFieldValue = (e) => {
        const { value, name } = e.target;

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`http://127.0.0.1:3000/movies/${movie_id}/review`, {
            movie_id,
            ...formData
        }, {
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            setFormData(initialData);
            reloadReviews();
        });
    };

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    <h4>Aggiungi la tua recensione</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="" className='control-label'>Nome</label>
                            <input
                                type="text"
                                className='form-control'
                                name='name'
                                placeholder='inserisci nome'
                                required
                                value={formData.name}
                                onChange={setFieldValue}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className='control-label'>Voto</label>
                            <input
                                min={1}
                                max={5}
                                type="number"
                                className='form-control'
                                name='vote'
                                placeholder='inserisci voto'
                                required
                                value={formData.vote}
                                onChange={setFieldValue}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className='control-label'>Testo</label>
                            <textarea name="text" id="text" className='form-control' value={formData.text} onChange={setFieldValue}></textarea>
                        </div>
                        <div className="form-group">
                            <button className='btn btn-main btn-outline-primary mt-2' type='submit'>
                                <i className="fas fa-paper-plane"></i> Invia
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReviewForm
