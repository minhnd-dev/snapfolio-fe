import { useState } from "react"

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        console.log(username, password);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const res = await fetch('http://localhost:8000/token', {
            method: 'POST',
            body: formData
        });
        if (res.status === 200) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('refresh', data.refresh);
            window.location.href = '/';
        } else {
            alert("Invalid username or password");
        }
    }
    return (
        <>
            <div className="bg-white p-8 mx-auto mt-[20vh] max-w-lg rounded-xl drop-shadow-md">
                <p className="block text-center font-bold text-2xl p-4">Login</p>
                <div className="m-auto max-w-sm">
                    <div className="space-y-2">
                        <label>Username</label>
                        <input type="text" placeholder="username" onChange={(e) => { setUsername(e.target.value) }} />
                        <label>Password</label>
                        <input type="password" onChange={(e) => { setPassword(e.target.value) }} />
                        <input type="submit" hidden />
                    </div>
                    <div className="m-1 flex justify-between">
                        <div className="flex space-x-2 ">
                            <input type="checkbox" id="remember" name="remember" value="remember" />
                            <p className="text-sm">Remember me</p>
                        </div>
                        <a href="/" className="text-sm font-semibold hover:underline">Forgot password</a>
                    </div>
                    <button className="block my-8 w-full" onClick={login}>Login</button>
                </div>
            </div>
        </>
    )
}
