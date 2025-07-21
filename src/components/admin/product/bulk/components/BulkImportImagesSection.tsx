import React from 'react';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList } from 'ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { Crown } from 'lucide-react';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useProductImagesSection } from 'hooks/useProductImagesSection';
import { useProductImagesSectionUI } from 'hooks/useProductImagesSectionUI';
import { useBulkImportImages } from 'hooks/useBulkImportImages';
import DraggableColorTab from 'components/admin/product/form/imagesSection/DraggableColorTab';
import AddColorDialog from 'components/admin/product/form/imagesSection/AddColorDialog';
import ColorImagePanel from 'components/admin/product/form/imagesSection/ColorImagePanel';
import NoColorsState from 'components/admin/product/form/imagesSection/NoColorsState';
import AddImageDialog from 'components/admin/product/form/imagesSection/AddImageDialog';

interface BulkImportImagesSectionProps {
  imageData: Record<string, { hex: string; images: string[] }>;
  onSave: (imageData: Record<string, { hex: string; images: string[] }>) => void;
  onRealTimeUpdate?: (imageData: Record<string, { hex: string; images: string[] }>) => void;
}

const BulkImportImagesSection: React.FC<BulkImportImagesSectionProps> = ({ imageData, onSave, onRealTimeUpdate }) => {
  // convert bulk import format to ProductImagesSection format
  const { images, onImagesChange } = useBulkImportImages(imageData, onRealTimeUpdate);

  const [activeColorTab, setActiveColorTab] = React.useState<string>('');
  const onActiveColorTabChange = (color: string) => setActiveColorTab(color);

  // auto-select first color when images change
  React.useEffect(() => {
    const colorKeys = Object.keys(images);
    if (colorKeys.length > 0 && !activeColorTab) {
      setActiveColorTab(colorKeys[0]);
    } else if (!colorKeys.includes(activeColorTab) && colorKeys.length > 0) {
      setActiveColorTab(colorKeys[0]);
    }
  }, [images, activeColorTab]);

  const {
    showAddColorDialog, setShowAddColorDialog,
    showAddImageDialog, setShowAddImageDialog,
    newImageColor, setNewImageColor,
    newImageColorName, setNewImageColorName,
    newImageUrl, setNewImageUrl,
    selectedColorForImage, setSelectedColorForImage,
    addImageTab, setAddImageTab,
    selectedFiles, setSelectedFiles,
    uploading, setUploading,
    uploadError, setUploadError,
    uploadProgress, setUploadProgress,
    uploadStatus, setUploadStatus,
    uploadErrors, setUploadErrors,
    deletingImages,
    addColor, addImage, reorderImages, removeImage, removeColor, handleColorDragEnd
  } = useProductImagesSection({ images, onImagesChange, activeColorTab, onActiveColorTabChange });

  const {
    sensors, handleDragStart,
    colorVariants, getColorBackground,
    getImageCount, isPrimaryColor,
    handleAddColorDialogClose, handleAddImageDialogClose,
    handleAddImageClick, handleAddColorClick,
    handleImageUpload
  } = useProductImagesSectionUI({
    images,
    showAddColorDialog, setShowAddColorDialog,
    showAddImageDialog, setShowAddImageDialog,
    newImageColor, setNewImageColor,
    newImageColorName, setNewImageColorName,
    newImageUrl, setNewImageUrl,
    selectedColorForImage, setSelectedColorForImage,
    addImageTab, setAddImageTab,
    selectedFiles, setSelectedFiles,
    setUploading, setUploadError,
    setUploadProgress, setUploadStatus, setUploadErrors,
    addColor, addImage, onImagesChange
  });

  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-4">
        Bulk Import Images
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
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                            style={{
                              backgroundColor: getColorBackground(color)
                            }}
                          />
                          <span className="capitalize">{color}</span>
                          <span className="text-xs">({getImageCount(color)})</span>
                          {isPrimaryColor(idx) && (
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
                  onDragStart={handleDragStart}
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
                          hexCode={images[color]?.hex}
                          imageCount={getImageCount(color)}
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
            onClick={handleAddColorClick}
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
              images={images[color]?.images || []}
              onReorder={(newImages) => reorderImages(color, newImages)}
              onRemove={(idx) => removeImage(color, idx)}
              onRemoveColor={() => removeColor(color)}
              onAddImage={() => handleAddImageClick(color)}
              isPrimary={isPrimaryColor(index)}
              imageCount={getImageCount(color)}
              deletingImages={deletingImages}
            />
          </TabsContent>
        ))}
        {colorVariants.length === 0 && <NoColorsState />}
      </Tabs>

      <AddColorDialog
        show={showAddColorDialog}
        onClose={handleAddColorDialogClose}
        newImageColor={newImageColor}
        newImageColorName={newImageColorName}
        setNewImageColorName={setNewImageColorName}
        setNewImageColor={setNewImageColor}
        onAddColor={addColor}
      />

      <AddImageDialog
        show={showAddImageDialog}
        onClose={handleAddImageDialogClose}
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
        onAddImage={handleImageUpload}
      />
    </div>
  );
};

export default BulkImportImagesSection;

