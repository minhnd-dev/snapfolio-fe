import { Icon } from "@iconify/react";
import { useContext, useState, useEffect } from "react";
import { AllFilesContext, UserFile } from "../..";
import FileViewer from "./file-viewer";

const PAGE_SIZE = 15

interface FileListProps {
    tagId: number | null,
    selectAll: boolean
}
export default function FileList({ tagId, selectAll }: FileListProps) {
    const { files, setFiles } = useContext(AllFilesContext)
    const [page, setPage] = useState(0);
    const [totalImage, setTotalImage] = useState(0);

    const [inSelectMode, setInSelectMode] = useState(false);
    const toggleSelectHandler = (imageId: number) => {
        setFiles(files.map((file) => {
            if (file.id === imageId) file.status = !Boolean(file.status);
            return file;
        }));
        setInSelectMode(files.some((file) => file.status === true) ? true : false);
    }

    useEffect(() => {
        setPage(0);
        getFiles(0);
    }, [tagId])

    const fetchNextPage = async () => {
        await getFiles(page + 1);
        setPage(page + 1);
    }


    const getFiles = async (nextPage: number) => {
        let url = `http://localhost:8000/files${tagId !== null ? `/by-tag/${tagId}?` : '?'}`
        const param = new URLSearchParams();

        if ((nextPage) * PAGE_SIZE > totalImage && totalImage !== 0) return;

        param.append("limit", PAGE_SIZE.toString());
        param.append("offset", ((nextPage ) * PAGE_SIZE).toString());
        const response = await fetch(
            `${url}${param.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })

        if (response.status === 200) {
            let data = await response.json();
            if (selectAll && inSelectMode) {
                data = data?.data.map((file: UserFile) => ({...file, status: true}));
            }
            setFiles(nextPage === 0? data?.data : [...files, ...data?.data]);
            setTotalImage(data.total);
        } else if (response.status === 401) {
            window.location.href = "/login";
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); }
    }, [files]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
            return;
        }
        fetchNextPage();
    };

    return (
        <>
        {
            files.some(file => file.isCurrent === true) && 
            <FileViewer 
                fetchNextPage={fetchNextPage}
            />
        }
        <div className="m-2 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
            {
                files.map((file) => {
                    return (
                        <div className="col-span-1" key={file.id}>
                            <FileItem
                                image={file}
                                toggleStatus={toggleSelectHandler}
                                status={Boolean(file.status)}
                                inSelectMode={inSelectMode}
                            />
                        </div>
                    )
                })
            }
        </div>
        </>
    )
}

interface ImageProps {
    image: UserFile,
    status: boolean,
    inSelectMode: boolean,
    toggleStatus: (id: number) => void,
}
function FileItem({ image, status, inSelectMode, toggleStatus }: ImageProps) {
    const { files, setFiles } = useContext(AllFilesContext)
    const clickImageHandler = () => {
        if (inSelectMode) {
            toggleStatus(image.id);
        }

        if (!(image.status === true || inSelectMode)) {
            setFiles(
                files.map(
                    file => (file.id === image.id ? { ...file, isCurrent: true } : file)
                )
            )
        }
    }
    return (
        <div className={`relative h-40 md:h-64 ${status ? 'p-8' : ''}`} >
            <div className="absolute cursor-pointer" onClick={() => toggleStatus(image.id)}>
                {status ?
                    <Icon icon="icon-park-solid:check-one" className="m-2 text-3xl text-sky-700 rounded-full bg-white " />
                    : <Icon icon="icon-park-outline:check-one" className="m-2 text-3xl text-sky-700 rounded-full bg-white " />
                }
            </div>
            <img
                className="object-cover w-full h-full rounded-xl cursor-pointer"
                src={`http://localhost:8000/files/${image.code}`}
                onClick={clickImageHandler} />
        </div>
    )
}
