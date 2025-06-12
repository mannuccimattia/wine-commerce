import React from 'react';


const WineGlasses = ({ condition }) => {
    let conditionNumber
    if (condition === "Excellent") {
        conditionNumber = 5;
    }
    if (condition === "Very Good") {
        conditionNumber = 4;
    }
    if (condition === "Good") {
        conditionNumber = 3;
    }
    if (condition === "Decent") {
        conditionNumber = 2;
    }
    if (condition === "Poor") {
        conditionNumber = 1;
    }
    const renderGlasses = () => {
        return [1, 2, 3, 4, 5].map((_, i) => {
            return <i
                key={`glass-${i}`}
                className={`fa-solid color-wine ${i < conditionNumber ? "fa-wine-glass" : "fa-wine-glass-empty"}`}
                style={{ marginRight: '5px' }}
            ></i>
        })
    }
    return (
        <div>
            {renderGlasses()}
        </div>
    );
};

export default WineGlasses;