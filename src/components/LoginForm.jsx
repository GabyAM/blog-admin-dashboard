import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
    const navigate = useNavigate();
    const { token, loading, updateToken } = useAuth();

    useEffect(() => {
        if (token && !loading) {
            return navigate('/');
        }
    }, [token, loading]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [serverErrors, setServerErrors] = useState(null);
    async function onSubmit(formData) {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });
        const jsonResponse = await response.json();
        if (!response.ok) {
            if (!jsonResponse.errors) {
                throw new Error('Something went wrong while fetching data');
            }
            setServerErrors(jsonResponse.errors);
        } else {
            setServerErrors(null);
            updateToken(jsonResponse.accessToken);
            navigate('/');
        }
    }

    function getFormErrors(clientErrors, serverErrors) {
        const mappedClientErrors = {};
        Object.keys(clientErrors).forEach((key) => {
            mappedClientErrors[key] = clientErrors[key].message;
        });
        return Object.assign(mappedClientErrors, serverErrors);
    }
    const formErrors = getFormErrors(errors, serverErrors);

    function handleInputChange(e) {
        const { name } = e.target;

        if (serverErrors[name]) {
            const newErrors = { ...serverErrors };
            delete newErrors[name];
            setServerErrors(newErrors);
        }
    }

    if (!token && !loading) {
        return (
            <div className="login-layout flex-col">
                <div className="logo-container">
                    <img src="logo.png"></img>
                </div>
                <div className="form-container flex-col">
                    <h1 className="title-primary">Welcome</h1>
                    <form
                        className="flex-col"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h2>Log in as an admin</h2>
                        <div className="form-input-container">
                            <input
                                className="form-input"
                                type="text"
                                name="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message:
                                            'Email must be in the correct format'
                                    }
                                })}
                                onChange={handleInputChange}
                                placeholder="Email"
                            />
                            {formErrors.email && (
                                <span className="form-error flex-row">
                                    <span>{formErrors.email}</span>
                                </span>
                            )}
                        </div>

                        <div className="form-input-container">
                            <input
                                className="form-input"
                                type="password"
                                name="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message:
                                            'Password must have at least 8 characters'
                                    }
                                })}
                                onChange={handleInputChange}
                                placeholder="Password"
                            />
                            {formErrors.password && (
                                <span className="form-error flex-row">
                                    <span>{formErrors.password}</span>
                                </span>
                            )}
                        </div>

                        <button className="login-button">Log in</button>
                    </form>
                </div>
            </div>
        );
    }
}
