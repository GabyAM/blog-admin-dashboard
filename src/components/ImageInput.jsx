import '../styles/imageinput.css';
import { ImageIcon } from './Icons';
import { useController } from 'react-hook-form';

export function ImageInput({ control }) {
    const {
        field: { onChange, onBlur, value, ref, name }
    } = useController({ name: 'image', control });
    function handleInputChange(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            onChange({
                url: URL.createObjectURL(file),
                file
            });
        }
    }

    return (
        <div className={`image-input-container ${'uploaded'}`}>
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
                onBlur={onBlur}
                ref={ref}
                name={name}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            ></input>
            <img src={value.url}></img>
        </div>
    );
}
