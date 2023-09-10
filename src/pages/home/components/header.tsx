import { Icon } from '@iconify/react';
import PopUp from './popup';
import { useState, useRef, useEffect } from 'react';
export default function Header({ toggleRightSideBar }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const clickUserHandler = () => {
        setShowUserMenu(!showUserMenu);
    }

    const signOutHandler = () => {
        localStorage.removeItem("username")
        localStorage.removeItem("token")
        localStorage.removeItem("refresh")

        location.href = "/login"
    }

    const changePasswordHandler = () => {
        location.href = "/change-password"
    }

    const upload = async (uploadedFile) => {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        fetch('http://localhost:8000/files/upload', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            method: 'POST',
            body: formData
        });
    }

    const clickUploadHandler = (e) => {
        [...e.target.files].map(async (file) => await upload(file));
        window.location.href = "/"
    }

    return (
        <>
            <div className="grid grid-cols-4 gap-2 p-2 fixed top-0 border-b-[1px] border-slate-400 bg-slate-100 w-full max-h-16">
                <div className="col-span-2 md:col-span-1 justify-start gap-3 flex items-center" >
                    <Icon icon="ci:hamburger-md" className="visible md:invisible font-bod text-sky-700 text-4xl cursor-pointer" onClick={toggleRightSideBar} />
                    <p className="text-4xl font-bold">Snapfolio</p>
                </div>
                <input type="text" className="md:hidden invisible md:visible md:col-span-2" />
                <div className="col-span-1 flex justify-end gap-3 items-center">
                    <div>

                        <input id="upload" type="file" multiple accept="image/*" className="hidden" onChange={clickUploadHandler} />
                        <label htmlFor='upload'>
                            <Icon className="font-bold text-sky-700 text-4xl cursor-pointer" onClick={clickUploadHandler} icon="basil:upload-solid" />
                        </label>
                    </div>

                    <div className="relative">
                        <Icon icon="solar:user-bold" className="font-bold text-4xl text-sky-700 cursor-pointer" onClick={clickUserHandler} />
                        {showUserMenu &&
                            <DropdownMenu
                                className="top-12 w-[160px] left-[-130px]"
                                setShowMenu={setShowUserMenu}
                                content={
                                    <>
                                        <p className="text-2xl font-bold p-1">{localStorage.getItem("username")}</p>
                                        <p className="text-md hover:bg-sky-200 cursor-pointer p-1" onClick={signOutHandler}>Sign out</p>
                                        <p className="text-md hover:bg-sky-200 cursor-pointer p-1" onClick={changePasswordHandler}>Change password</p>
                                    </>
                                }
                            />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

function DropdownMenu({ content, className, setShowMenu }) {
    const ref = useRef();
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref])
    return (
        <div ref={ref} className={`p-2 rounded-lg shadow absolute bg-white ${className}`}>
            {content}
        </div>
    )
}
