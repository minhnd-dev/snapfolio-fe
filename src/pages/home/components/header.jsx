import { Icon } from '@iconify/react';
export default function Header({ clickUploadHandler, clickDeleteHandler, toggleRighSideBar }) {
    return (
        <div className="grid grid-cols-4 gap-2 p-2 fixed top-0 border-b-[1px] border-slate-400 bg-slate-100 w-full">
            <div className="col-span-2 md:col-span-1 justify-start gap-3 flex items-center" >
                <Icon icon="ci:hamburger-md" className="visible md:invisible font-bod text-sky-700 text-4xl cursor-pointer" onClick={toggleRighSideBar} />
                <p className="text-4xl font-bold">Snapfolio</p>
            </div>
            <input type="text" className="md:hidden invisible md:visible md:col-span-2" />
            <div className="col-span-1 flex justify-end gap-3 items-center">
                <Icon className="font-bold text-sky-700 text-4xl" onClick={clickUploadHandler} icon="basil:upload-solid" />
                <Icon icon="solar:tag-bold" className="font-bold text-4xl text-sky-700" />
                <Icon className="font-bold text-4xl text-red-700" onClick={clickDeleteHandler} icon="fluent:delete-12-filled" />
            </div>
        </div>
    )
}
