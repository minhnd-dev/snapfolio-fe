export default function Header({clickUploadHandler, clickDeleteHandler}) {
    return (
        <div className="grid grid-cols-4 gap-2 p-2 fixed top-0 border-b-[1px] border-slate-400 bg-slate-100 w-full">
            <p className="col-span-1 text-4xl font-bold">Snapfolio</p>
                <input type="text" className="col-span-2"/>
            <div className="col-span-1 flex justify-end gap-2">
                <button onClick={clickUploadHandler} className="rounded">Upload</button>
                <button onClick={clickDeleteHandler} className="rounded bg-red-700">Delete</button>
            </div>
        </div>
    )
}
