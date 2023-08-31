import { Icon } from "@iconify/react";
import { useState } from "react";
export default function ImageList({ images }) {
    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-5">
            {
                images.map((image, key) => (
                    <div className="col-span-1" key={key}>
                        <Image image={image} key={key} />
                    </div>
                ))
            }
        </div>
    )
}

export function Image({ image }) {
    const [checked, setChecked] = useState(false);
    return (
        <div className="relative rounded bg-slate-500 p-1" >
            <div className="absolute cursor-pointer" onClick={() => { image.status = !Boolean(image.status); setChecked(image.status);}}>
            {checked ?
                <Icon icon="icon-park-solid:check-one" className="m-2 text-3xl text-slate-500 rounded-full bg-white " />
                : <Icon icon="icon-park-outline:check-one" className="m-2 text-3xl text-slate-500 rounded-full bg-white " />
            }
        </div>
            <img className="object-cover w-full h-64" src={`http://localhost:8000/${image.path}`} />
        </div>
    )
}
