import React from 'react';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList } from 'ui/tabs';
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
        distance: 8,
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

      {/* color tabs for images */}
      <Tabs value={activeColorTab} onValueChange={onActiveColorTabChange} className="w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleColorDragEnd}
        >
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto p-1 bg-luxury-gray/10">
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
                />
              ))}
            </SortableContext>

            {/* add color button */}
            <button
              type="button"
              onClick={() => setShowAddColorDialog(true)}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-luxury-gold/20 text-luxury-black rounded-lg hover:bg-luxury-gold/30 transition-colors duration-200"
            >
              <Plus size={16} />
              Add Color
            </button>
          </TabsList>
        </DndContext>

        {/* color add dialog */}
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

        {/* image upload dialog */}
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

        {/* color image panels */}
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

        {/* show message when no colors exist */}
        {colorVariants.length === 0 && <NoColorsState />}
      </Tabs>
    </div>
  );
};

export default ProductImagesSection;
