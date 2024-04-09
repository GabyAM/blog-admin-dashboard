import { useState } from 'react';
import '../styles/imageinput.css';
import { ImageIcon } from './Icons';

export function ImageInput({ initialValue, onChange }) {
    function handleInputChange(e) {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        }
    }

    return (
        <div
            className={`image-input-container ${initialValue ? 'uploaded' : ''}`}
        >
            <label htmlFor="image-file-input" className="custom-image-input">
                <div className="flex-col">
                    <span>Upload an image</span>
                    <ImageIcon width={96} height={96}></ImageIcon>
                </div>
            </label>
            <input
                id="image-file-input"
                type="file"
                onChange={handleInputChange}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            ></input>
            <img src={initialValue}></img>
        </div>
    );
}
