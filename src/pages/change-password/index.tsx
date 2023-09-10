import { useEffect, useRef, useState } from "react";

export function ChangePassword() {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [verifyNewPassword, setVerifyNewPassword] = useState("");


    const changePasswordHandler = async () => {
        if (newPassword !== verifyNewPassword) {
            alert("Unmatched passwords");
        }

        const searchParams = new URLSearchParams();
        searchParams.append("old_password", password);
        searchParams.append("new_password", newPassword);

        const res = await fetch(`http://localhost:8000/user/password?${searchParams.toString()}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: {
                old_password: password,
                new_password: newPassword
            }
        });
        if (res.status === 200) {
            window.location.href = '/';
        } else if (res.status === 401) {
            alert("Wrong password");
        }

    }
    return (
        <>
            <div className="bg-white p-8 mx-auto mt-[20vh] max-w-lg rounded-xl drop-shadow-md">
                <p className="block text-center font-bold text-2xl p-4">Change Password</p>
                <div className="m-auto max-w-sm">
                    <div className="space-y-2">
                        <label>Old password</label>
                        <input type="password" onChange={(e) => { setPassword(e.target.value) }} />
                        <label>New password</label>
                        <input type="password" onChange={(e) => { setNewPassword(e.target.value) }} />
                        <label>Repeat new password</label>
                        <input type="password" onChange={(e) => { setVerifyNewPassword(e.target.value) }} />
                        <input type="submit" hidden />
                    </div>
                    <button className="block my-8 w-full" onClick={changePasswordHandler}>Save</button>
                </div>
            </div>
        </>
    )
}
