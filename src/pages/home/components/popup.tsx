export default function PopUp({ closeHandler, content }) {
    const clickOutsideHandler = (e) => {
        if (e.target === e.currentTarget) {
            closeHandler();
        }
    }
    return (
        <>
            <div className="relative z-10">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" ></div>
                <div className="fixed inset-0 z-10">
                    <div className="flex min-h-full justify-center p-4 text-center items-center" onClick={clickOutsideHandler}>
                        <div className="p-2 relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-lg">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

