import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/loginform.css';
import { ErrorLabel } from './ErrorLabel';
import { submitLogin } from '../api/auth';

export function LoginForm() {
    const navigate = useNavigate();
    const { token, loading, updateToken } = useAuth();

    useEffect(() => {
        if (token && !loading) {
            return navigate('/');
        }
    }, [token, loading, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm();

    function onSubmit(formData) {
        return submitLogin(formData)
            .then((res) => {
                if (res.errors) {
                    const errors = res.errors;
                    Object.keys(errors).forEach((key) => {
                        setError(key, { type: 'server', message: errors[key] });
                    });
                } else {
                    updateToken(res.accessToken);
                    navigate('/');
                }
            })
            .catch((e) => {
                setError('root.serverError', {
                    type: 'server',
                    message: 'There was an error'
                });
            });
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
                        <div className="info flex-row">
                            <div className="green-line"></div>
                            <div className="text">
                                <h2>Log in as an admin</h2>
                                <p>
                                    or get limited access by logging in as a
                                    user
                                </p>
                            </div>
                        </div>
                        <div className="inputs flex-col">
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
                                    placeholder="Email"
                                />
                                {errors.email && (
                                    <ErrorLabel>
                                        {errors.email.message}
                                    </ErrorLabel>
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
                                    placeholder="Password"
                                />
                                {errors.password && (
                                    <ErrorLabel>
                                        {errors.password.message}
                                    </ErrorLabel>
                                )}
                            </div>
                        </div>

                        <button className="login-button">Log in</button>
                        {errors && errors.root && errors.root.serverError && (
                            <ErrorLabel>
                                {errors.root.serverError.message}
                            </ErrorLabel>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}
