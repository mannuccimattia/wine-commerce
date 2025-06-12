import React from 'react';

const Stars = ({ vote }) => {
    return (
        <span style={{ color: 'gold', fontSize: '20px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={`${star <= vote ? 'fas' : 'far'} fa-star`}
                    style={{ marginRight: '5px' }}
                />
            ))}
        </span>
    );
};

export default Stars;
