import { Icon } from "@iconify/react";
import { useState } from "react";
export default function ImageList({ images, updateImages }) {
    const [inSelectMode, setInSelectMode] = useState(false);
    const toggleSelectHandler = (imageId) => {
        updateImages(images.map((image) => {
            if (image.id === imageId) image.status = !Boolean(image.status);
            return image;
        }));
    
        setInSelectMode(images.some((image) => image.status === true) ? true : false);
    }
    return (
        <div className="m-2 grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-5">
            {
                images.map((image, key) => {
                    return (
                        <div className="col-span-1" key={key}>
                            <Image image={image} toggleStatus={toggleSelectHandler} status={Boolean(image.status)} inSelectMode={inSelectMode}/>
                        </div>
                    )
                })
            }
        </div>
    )
}

function Image({ image, status, toggleStatus, inSelectMode }) {
    const clickImageHandler = () => {
        if (inSelectMode) {
            toggleStatus(image.id);
        }
    }
    return (
        <div className="relative" >
            <div className="absolute cursor-pointer" onClick={() => toggleStatus(image.id)}>
                {status ?
                    <Icon icon="icon-park-solid:check-one" className="m-2 text-3xl text-slate-500 rounded-full bg-white " />
                    : <Icon icon="icon-park-outline:check-one" className="m-2 text-3xl text-slate-500 rounded-full bg-white " />
                }
            </div>
            <img className="object-cover w-full h-64 rounded-xl cursor-pointer" src={`http://localhost:8000/${image.path}`} onClick={clickImageHandler}/>
        </div>
    )
}
