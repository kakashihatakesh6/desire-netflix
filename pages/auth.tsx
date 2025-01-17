/* eslint-disable @next/next/no-img-element */
import Input from "@/components/input";
import axios from "axios";
import { useCallback, useState } from "react";
import { signIn } from 'next-auth/react';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const Auth = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<any>()
    const [resStaus, setResStatus] = useState(false)

    const [variant, setVariant] = useState('login');

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login')
    }, [])


    const login = useCallback(async () => {
        try {
            await signIn('credentials', {
                email,
                password,
                redirect: true,
                callbackUrl: '/profiles'
                // callbackUrl: '/'
            });

        } catch (error) {
            console.log(error);
        }
    }, [email, password])


    const register = useCallback(async () => {
        try {
            const newUser = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/api/register`, {
                email,
                name,
                password
            });
            const res = newUser.data;
            console.log("New User Created! ", res);
            // setResStatus(true);
            
            login();

        } catch (error) {
            console.log(error)
            setError(error)
        }


    }, [email, name, password, login]);




    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bt-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-15 py-5">
                    <img src="/images/logo.png" alt="Logo" className="h-12" />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Sign in' : 'Register'}
                            <p className="text-sm text-white mt-2"><em>Email: </em> admin <em>Pasword:</em> admin</p>
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant === 'register' && (

                                <Input
                                    label="Username"
                                    onchange={(e: any) => { setName(e.target.value) }}
                                    id='name'
                                    type='text'
                                    value={name}
                                /> 

                            )}
                            <Input
                                label="Email"
                                onchange={(e: any) => { setEmail(e.target.value) }}
                                id='email'
                                type='email'
                                value={email}
                            />
                            <Input
                                label="Password"
                                onchange={(e: any) => { setPassword(e.target.value) }}
                                id='password'
                                type='password'
                                value={password}
                            />
                        </div>
                        <button onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 mt-10 text-white rounded-md w-full">
                            {variant === 'login' ? 'Login' : 'Register'}
                        </button>
                        <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                            <div
                                onClick={() => signIn('google', { callbackUrl: '/profiles' })}
                                className="
                                    w-10
                                    h-10
                                    bg-white
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    hover:opacity-80
                                    trasition
                                ">
                                <FcGoogle size={30} />
                            </div>

                            <div
                                onClick={() => signIn('github', { callbackUrl: '/profiles' })}
                                className="
                                    w-10
                                    h-10
                                    bg-white
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    hover:opacity-80
                                    trasition
                                ">
                                <FaGithub size={30} />
                            </div>
                        </div>
                        {/* {error &&
                            <p className="text-red-300 py-1 w-full justify-center flex">{variant === 'login' ? 'Please Enter the Right Credentials!' : 'User Already Exists!'}</p>
                        }
                        {resStaus &&
                            <p className="text-red-300 py-1 w-full justify-center flex">User Registered Successfully!</p>
                        } */}

                        <p className="text-neutral-500 mt-12">
                            {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                {variant === 'login' ? 'Create an account' : 'Login'}
                            </span>
                        </p>




                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;