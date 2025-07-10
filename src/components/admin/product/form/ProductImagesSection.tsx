import React from 'react';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList } from 'ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { Crown } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useProductImagesSection, ProductImagesSectionProps } from 'hooks/useProductImagesSection';
import DraggableColorTab from './imagesSection/DraggableColorTab';
import AddColorDialog from './imagesSection/AddColorDialog';
import AddImageDialog from './imagesSection/AddImageDialog';
import ColorImagePanel from './imagesSection/ColorImagePanel';
import NoColorsState from './imagesSection/NoColorsState';
import { uploadImagesToCloudinary } from 'lib/upload/cloudinary';

const ProductImagesSection: React.FC<ProductImagesSectionProps> = (props) => {
  const section = useProductImagesSection(props);
  const {
    showAddColorDialog, setShowAddColorDialog,
    showAddImageDialog, setShowAddImageDialog,
    newImageColor, setNewImageColor,
    newImageUrl, setNewImageUrl,
    selectedColorForImage, setSelectedColorForImage,
    addImageTab, setAddImageTab,
    selectedFiles, setSelectedFiles,
    uploading, setUploading,
    uploadError, setUploadError,
    uploadProgress, setUploadProgress,
    uploadStatus, setUploadStatus,
    uploadErrors, setUploadErrors,
    addColor, addImage, reorderImages, removeImage, removeColor, handleColorDragEnd,
    onImagesChange, images, activeColorTab, onActiveColorTabChange
  } = section;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const colorVariants = Object.keys(images);

  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-4">
        Product Images
      </label>

      <Tabs value={activeColorTab} onValueChange={onActiveColorTabChange} className="w-full">
        <div>
          {colorVariants.length > 0 && (
            <>
              <div className="hidden xs:block mb-2">
                <label htmlFor="product-color-tab-select" className="sr-only">
                  Select color
                </label>
                <Select value={activeColorTab} onValueChange={onActiveColorTabChange}>
                  <SelectTrigger
                    id="product-color-tab-select"
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-900 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold hover:border-luxury-gold transition-colors duration-200"
                  >
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    {colorVariants.map((color, idx) => (
                      <SelectItem
                        key={color}
                        value={color}
                        className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:bg-luxury-gold hover:text-luxury-black focus:bg-luxury-gold focus:text-luxury-black cursor-pointer transition-colors duration-200"
                      >
                        <span className="flex items-center gap-2">
                          {/* Color dot */}
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                            style={{
                              backgroundColor: color === 'cream' ? '#F5F5DC' :
                                color === 'navy' ? '#000080' :
                                color === 'red' ? '#DC2626' :
                                color === 'green' ? '#059669' :
                                color === 'blue' ? '#2563EB' :
                                color === 'purple' ? '#7C3AED' :
                                color === 'pink' ? '#EC4899' :
                                color === 'yellow' ? '#EAB308' :
                                color === 'orange' ? '#EA580C' :
                                color === 'brown' ? '#92400E' :
                                color === 'gray' ? '#6B7280' :
                                color === 'black' ? '#000000' :
                                color === 'white' ? '#FFFFFF' : color
                            }}
                          />
                          <span className="capitalize">{color}</span>
                          <span className="text-xs">({images[color]?.length || 0})</span>
                          {idx === 0 && (
                            <Crown size={14} className="text-luxury-gold ml-1" />
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="block xs:hidden" style={{ touchAction: 'none' }}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleColorDragEnd}
                  onDragStart={(event) => {
                    if (event.active.data.current?.type === 'pointer') {
                      event.active.data.current.point = event.active.data.current.point;
                    }
                  }}
                >
                  <TabsList
                    className={`flex ${colorVariants.length >= 3 ? 'justify-center sm:justify-start' : 'justify-start'} flex-wrap w-full gap-2 h-auto p-1 bg-luxury-gray/10`}
                  >
                    <SortableContext
                      items={colorVariants}
                      strategy={horizontalListSortingStrategy}
                    >
                      {colorVariants.map((color, index) => (
                        <DraggableColorTab
                          key={color}
                          color={color}
                          imageCount={images[color]?.length || 0}
                          isActive={activeColorTab === color}
                          onValueChange={onActiveColorTabChange}
                          index={index}
                          className="min-w-[120px] px-3 py-2"
                        />
                      ))}
                    </SortableContext>
                  </TabsList>
                </DndContext>
              </div>
            </>
          )}
          <button
            type="button"
            onClick={() => setShowAddColorDialog(true)}
            className={`flex items-center justify-center gap-2 w-full mt-2 px-3 py-2 text-sm bg-luxury-gold/20 text-luxury-black rounded-lg hover:bg-luxury-gold/30 transition-colors duration-200${colorVariants.length > 0 ? '' : ' mt-0'}`}
          >
            <Plus size={16} />
            Add Color
          </button>
        </div>

        {colorVariants.map((color, index) => (
          <TabsContent key={color} value={color} className="mt-4">
            <ColorImagePanel
              color={color}
              images={images[color] || []}
              onReorder={(newImages) => reorderImages(color, newImages)}
              onRemove={(idx) => removeImage(color, idx)}
              onRemoveColor={() => removeColor(color)}
              onAddImage={() => {
                setSelectedColorForImage(color);
                setAddImageTab('device');
                setShowAddImageDialog(true);
              }}
              isPrimary={index === 0}
              imageCount={images[color]?.length || 0}
            />
          </TabsContent>
        ))}
        {colorVariants.length === 0 && <NoColorsState />}
      </Tabs>

      <AddColorDialog
        show={showAddColorDialog}
        onClose={() => {
          setShowAddColorDialog(false);
          setNewImageColor('');
        }}
        newImageColor={newImageColor}
        setNewImageColor={setNewImageColor}
        onAddColor={addColor}
      />

      <AddImageDialog
        show={showAddImageDialog}
        onClose={() => {
          setShowAddImageDialog(false);
          setNewImageUrl('');
          setSelectedFiles([]);
          setSelectedColorForImage('');
          setUploadError(null);
          setUploadProgress({});
          setUploadStatus({});
          setUploadErrors({});
        }}
        selectedColorForImage={selectedColorForImage}
        addImageTab={addImageTab}
        setAddImageTab={setAddImageTab}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        uploading={uploading}
        uploadError={uploadError}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        uploadStatus={uploadStatus}
        setUploadStatus={setUploadStatus}
        uploadErrors={uploadErrors}
        setUploadErrors={setUploadErrors}
        onAddImage={async () => {
          setUploadError(null);
          if (addImageTab === 'url') {
            addImage();
          } else if (addImageTab === 'device') {
            if (!selectedFiles.length) {
              setUploadError('Please select image file(s).');
              return;
            }
            // validate all files
            for (const file of selectedFiles) {
              if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setUploadError('Only JPG, PNG, or WebP images are allowed.');
                return;
              }
              if (file.size > 5 * 1024 * 1024) {
                setUploadError('Each file must be 5MB or less.');
                return;
              }
            }
            setUploading(true);
            setUploadProgress({});
            setUploadStatus(Object.fromEntries(selectedFiles.map(f => [f.name, 'uploading'])));
            setUploadErrors({});
            try {
              const results = await uploadImagesToCloudinary(selectedFiles, (file, percent) => {
                setUploadProgress(prev => ({ ...prev, [file.name]: percent }));
              });
              results.forEach(({ file, url, error }) => {
                if (url) {
                  setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
                } else {
                  setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
                  setUploadErrors(prev => ({ ...prev, [file.name]: error || 'Upload failed.' }));
                }
              });
              const uploadedUrls = results.filter(r => r.url).map(r => r.url as string);
              if (uploadedUrls.length > 0) {
                onImagesChange({
                  ...images,
                  [selectedColorForImage]: images[selectedColorForImage]
                    ? [...images[selectedColorForImage], ...uploadedUrls]
                    : [...uploadedUrls]
                });
                setShowAddImageDialog(false);
                setSelectedFiles([]);
                setSelectedColorForImage('');
                setUploadProgress({});
                setUploadStatus({});
                setUploadErrors({});
              } else {
                setUploadError('All uploads failed.');
              }
            } finally {
              setUploading(false);
            }
          }
        }}
      />
    </div>
  );
};

export default ProductImagesSection;
