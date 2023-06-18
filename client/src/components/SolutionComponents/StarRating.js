import React, {useState} from 'react';
import {FaStar} from 'react-icons/fa';

const StarRating = ({totalStars = 5, initialStars, onRating, readonly}) => {
    const [selectedStars, setSelectedStars] = useState(initialStars || 0);
    const handleSelect = (i) => {
        setSelectedStars(i + 1);
        if (onRating) onRating(i + 1);
    };
    return (
        <>
            {[...Array(totalStars)].map((n, i) => (
                <Star
                    key={i}
                    selected={selectedStars > i}
                    onSelect={() => readonly ? {} : handleSelect(i)}
                />
            ))}
        </>
    );
};

const Star = ({selected = false, onSelect = (f) => f}) => (
    <FaStar
        color={selected ? 'gold' : 'grey'}
        size={30}
        onClick={onSelect}
    />
);

export default StarRating;
