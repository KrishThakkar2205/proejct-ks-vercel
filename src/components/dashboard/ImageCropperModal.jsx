import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

const ImageCropperModal = ({ file, onClose, onCrop }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [baseWidth, setBaseWidth] = useState(0);
    const [baseHeight, setBaseHeight] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [cropping, setCropping] = useState(false);

    const imgRef = useRef(null);
    const containerRef = useRef(null);

    // Load file as data URL
    useEffect(() => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
    }, [file]);

    // Handle touch/mouse events for panning
    const handleDragStart = (clientX, clientY) => {
        setIsDragging(true);
        setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
    };

    const handleDragMove = (clientX, clientY) => {
        if (!isDragging || !baseWidth || !baseHeight) return;

        const displayedWidth = baseWidth * zoom;
        const displayedHeight = baseHeight * zoom;

        // Limit translation to keep the image covering the 256x256 crop area
        const limitX = Math.max(0, (displayedWidth - 256) / 2);
        const limitY = Math.max(0, (displayedHeight - 256) / 2);

        const newX = Math.max(-limitX, Math.min(limitX, clientX - dragStart.x));
        const newY = Math.max(-limitY, Math.min(limitY, clientY - dragStart.y));

        setOffset({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Mouse handlers
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleDragStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        handleDragMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        handleDragEnd();
    };

    // Touch handlers
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        if (e.touches.length === 1) {
            handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const handleTouchEnd = () => {
        handleDragEnd();
    };

    // Keep event listeners active on window to handle mouse release outside viewport
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragStart, zoom, baseWidth, baseHeight]);

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        
        // Fit the image to cover the 256x256 viewport
        let baseW, baseH;
        if (naturalWidth > naturalHeight) {
            // Landscape: fit height, scale width
            baseH = 256;
            baseW = (naturalWidth / naturalHeight) * 256;
        } else {
            // Portrait/Square: fit width, scale height
            baseW = 256;
            baseH = (naturalHeight / naturalWidth) * 256;
        }
        
        setBaseWidth(baseW);
        setBaseHeight(baseH);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    };

    // Constrain offset whenever zoom changes to prevent transparent gaps
    useEffect(() => {
        if (!baseWidth || !baseHeight) return;
        
        const displayedWidth = baseWidth * zoom;
        const displayedHeight = baseHeight * zoom;
        
        const limitX = Math.max(0, (displayedWidth - 256) / 2);
        const limitY = Math.max(0, (displayedHeight - 256) / 2);
        
        setOffset(prev => ({
            x: Math.max(-limitX, Math.min(limitX, prev.x)),
            y: Math.max(-limitY, Math.min(limitY, prev.y))
        }));
    }, [zoom, baseWidth, baseHeight]);

    const handleApplyCrop = () => {
        if (!imgRef.current) return;
        setCropping(true);

        setTimeout(() => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 400;
                const ctx = canvas.getContext('2d');

                // Enable high quality image scaling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Fill background with white
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 400, 400);

                // Map 256x256 viewport to 400x400 canvas
                const scale = 400 / 256;
                ctx.scale(scale, scale);

                const displayedWidth = baseWidth * zoom;
                const displayedHeight = baseHeight * zoom;
                const left = 128 + offset.x - (displayedWidth / 2);
                const top = 128 + offset.y - (displayedHeight / 2);

                ctx.drawImage(imgRef.current, left, top, displayedWidth, displayedHeight);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const croppedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        onCrop(croppedFile);
                    } else {
                        console.error('Failed to create blob from canvas');
                    }
                    setCropping(false);
                }, 'image/jpeg', 0.9);
            } catch (err) {
                console.error('Error cropping image:', err);
                setCropping(false);
            }
        }, 100);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Modal Box */}
            <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col transform scale-100 transition-transform">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-deep-black">Crop & Resize Photo</h3>
                    <button 
                        onClick={onClose} 
                        disabled={cropping}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center gap-6">
                    
                    {/* Viewport Area */}
                    <div 
                        ref={containerRef}
                        className="relative w-[256px] h-[256px] overflow-hidden rounded-xl bg-gray-900 shadow-inner select-none cursor-move"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {imageSrc && (
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop Target"
                                onLoad={handleImageLoad}
                                style={{
                                    position: 'absolute',
                                    width: `${baseWidth * zoom}px`,
                                    height: `${baseHeight * zoom}px`,
                                    left: `calc(50% + ${offset.x}px)`,
                                    top: `calc(50% + ${offset.y}px)`,
                                    transform: 'translate(-50%, -50%)',
                                    maxWidth: 'none',
                                    maxHeight: 'none',
                                }}
                                draggable={false}
                            />
                        )}
                        
                        {/* Circular Overlay Mask */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div 
                                className="w-[256px] h-[256px] rounded-full border-2 border-dashed border-primary-orange absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                                style={{
                                    boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)'
                                }}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        Drag the photo to reposition, and use the slider to zoom.
                    </p>

                    {/* Controls */}
                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Zoom</span>
                            <span className="font-semibold">{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ZoomOut size={16} className="text-gray-400" />
                            <input
                                type="range"
                                min="1"
                                max="3"
                                step="0.01"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-orange"
                            />
                            <ZoomIn size={16} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
                    <Button 
                        variant="white" 
                        size="sm" 
                        onClick={onClose} 
                        disabled={cropping}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={handleApplyCrop} 
                        disabled={cropping || !imageSrc}
                        className="min-w-[100px]"
                    >
                        {cropping ? (
                            <span className="flex items-center justify-center gap-1.5">
                                <Loader2 size={16} className="animate-spin" />
                                Applying...
                            </span>
                        ) : (
                            'Apply Crop'
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default ImageCropperModal;
