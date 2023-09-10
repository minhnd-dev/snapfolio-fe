import { useState } from "react";

export function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verify, setVerify] = useState("");

    const signUp = async () => {
        if (password !== verify) {
            alert("Mật khẩu không khớp");
            return;
        }
        const res = await fetch('http://localhost:8000/user', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        });
        if (res.status === 200) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            window.location.href = '/';
        } else {
            alert("Lỗi đăng ký");
        }
    }
    return (
        <>
            <div className="bg-white p-8 mx-auto mt-[20vh] max-w-lg rounded-xl drop-shadow-md">
                <p className="block text-center font-bold text-2xl p-4">Sign Up</p>
                <div className="m-auto max-w-sm">
                    <form>
                        <div className="space-y-2">
                            <label>Username</label>
                            <input type="text" placeholder="username" required minLength={2} value={username} onChange={(e) => { setUsername(e.target.value) }} />
                            <label>Password</label>
                            <input type="password" placeholder="password" minLength={8} onChange={(e) => { setPassword(e.target.value) }} />
                            <label>Verify Password</label>
                            <input type="password" placeholder="verify password" minLength={8} onChange={(e) => { setVerify(e.target.value) }} />
                        </div>
                        <button className="block my-8 p-2 w-full bg-slate-500 text-white font-bold" onClick={signUp}>Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    )
}
