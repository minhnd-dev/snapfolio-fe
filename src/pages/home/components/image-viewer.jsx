export default function ImageViewer({image, clickNextHandler, clickBackHander, closeHandler }) {
    const handleOnClick = (e) => {
        if (e.target === e.currentTarget) {
            closeHandler();
        }
    }
    return (
        <div className="relative z-10">
            <div className="md:grid md:grid-cols-10 fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="md:col-span-7 flex justify-between items-center md:h-screen h-[50vh]" onClick={handleOnClick}>
                    <button className="bg-transparent text-white font-bold text-5xl" onClick={() => clickBackHander(image.id)}>&lt;</button>
                    <div className="h-full flex justify-center items-center" onClick={handleOnClick}>
                        <img className="my-auto max-h-full" src={`http://localhost:8000/${image.path}`} />
                    </div>
                    <button className="bg-transparent text-white font-bold text-5xl" onClick={() => clickNextHandler(image.id)}>&gt;</button>
                </div>
                <div className="md:col-span-3 md:h-screen h-[50vh] bg-white ">
                    <p>Hehe</p>
                </div>
            </div>
        </div>

    )
}

