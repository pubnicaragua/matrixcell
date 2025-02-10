import { useState } from "react"
import { FaPlay } from "react-icons/fa"

interface VideoTutorial {
    title: string
    description: string
    driveId: string
}

const tutorials: VideoTutorial[] = [
    {
        title: "Lista de Clientes y Operaciones",
        description: "Tutorial sobre cómo gestionar la lista de clientes y operaciones en el sistema.",
        driveId: "1Idi2pJghCNV2xffqIxc3ewk3punU7Atj",
    },
    {
        title: "Gestión de Usuarios",
        description: "Aprende a gestionar usuarios en el sistema.",
        driveId: "1LqYKkpKKfkGsJhq0V0Xl6bW43dIG-77d",
    },
    {
        title: "Gestión de Dispositivos",
        description: "Tutorial sobre la gestión de dispositivos móviles.",
        driveId: "1AIatk0RFr_v5Qn2o1RpPMwCSI0HoP2fU",
    },
    {
        title: "Servicios Técnicos",
        description: "Aprende a manejar los servicios técnicos en el sistema.",
        driveId: "1HphW6SOPzkhyCvUzvfgAg53wl_dTeosP",
    },
    {
        title: "Reporte Equifax",
        description: "Tutorial sobre la generación de reportes y consolidados.",
        driveId: "1dnZJd9CiZpZvPIEtTLZ1iGHPo5X4VDXS",
    },
]

export default function UserManual() {
    const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null)

    // Función para extraer el ID del video de Google Drive
    const getEmbedUrl = (driveId: string) => {
        return `https://drive.google.com/file/d/${driveId}/preview`
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Manual de Usuario</h1>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Lista de videos */}
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
                    {tutorials.map((tutorial, index) => (
                        <div
                            key={index}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${selectedVideo?.driveId === tutorial.driveId ? "bg-green-50 border-green-500" : "hover:bg-gray-50"
                                }`}
                            onClick={() => setSelectedVideo(tutorial)}
                        >
                            <h2 className="text-lg font-semibold flex items-center">
                                <FaPlay
                                    className={`mr-2 ${selectedVideo?.driveId === tutorial.driveId ? "text-green-600" : "text-gray-600"}`}
                                />
                                {tutorial.title}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">{tutorial.description}</p>
                        </div>
                    ))}
                </div>

                {/* Reproductor de video */}
                <div className="sticky top-4">
                    {selectedVideo ? (
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    src={getEmbedUrl(selectedVideo.driveId)}
                                    allow="autoplay"
                                    className="w-full h-full"
                                    title={selectedVideo.title}
                                ></iframe>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-2">{selectedVideo.title}</h2>
                                <p className="text-sm text-gray-600">{selectedVideo.description}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-center">
                                <FaPlay className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">Selecciona un video para comenzar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

