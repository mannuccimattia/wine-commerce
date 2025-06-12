import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const ReviewForm = ({ wine_id, reloadReviews }) => {
    const initialData = { full_name: "", review_text: "", rating: "", email: "" };


    const [formData, setFormData] = useState(initialData);

    const setFieldValue = (e) => {
        const { value, name } = e.target;

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`http://127.0.0.1:3000/api/wines/${wine_id}/review`, {
            wine_id,
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
                                name='full_name'
                                placeholder='inserisci nome'
                                required
                                value={formData.full_name}
                                onChange={setFieldValue}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className='control-label'>Email</label>
                            <input
                                type="email"
                                className='form-control'
                                name='email'
                                placeholder='inserisci email'
                                required
                                value={formData.email}
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
                                name='rating'
                                placeholder='inserisci voto'
                                required
                                value={formData.rating}
                                onChange={setFieldValue}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className='control-label'>Testo</label>
                            <textarea name="review_text" id="text" className='form-control' value={formData.review_text} onChange={setFieldValue}></textarea>
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
