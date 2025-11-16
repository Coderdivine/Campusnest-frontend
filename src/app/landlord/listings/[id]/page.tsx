'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LandlordLayout from '@/components/layouts/LandlordLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { DetailPageSkeleton } from '@/components/ui/Skeleton';
import { Notification, useNotification } from '@/components/ui/Notification';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts';
import { listingAPI } from '@/lib/api/listing.api';
import { cn } from '@/lib/utils';

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const { notification, showNotification, clearNotification } = useNotification();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    lodgeName: '',
    lodgeAddress: '',
    area: '',
    pricePerYear: '',
    availableSlots: '',
    distanceFromUNN: '',
    description: '',
    photos: [] as string[],
    status: 'active' as 'active' | 'closed',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'landlord') {
        router.push('/login');
        return;
      }
      loadListing();
    }
  }, [user, authLoading, params.id]);

  const loadListing = async () => {
    try {
      const listingId = params.id as string;
      const response = await listingAPI.getById(listingId);
      const listingData = response.data as Listing;
      
      setListing(listingData);
      setFormData({
        lodgeName: listingData.lodgeName,
        lodgeAddress: listingData.lodgeAddress,
        area: listingData.area,
        pricePerYear: listingData.pricePerYear.toString(),
        availableSlots: listingData.availableSlots.toString(),
        distanceFromUNN: listingData.distanceFromUNN.toString(),
        description: listingData.description,
        photos: listingData.photos || [],
        status: listingData.status,
      });
    } catch (error: any) {
      console.error('Failed to load listing:', error);
      showNotification('error', 'Failed to load listing');
      router.push('/landlord/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      photos: images,
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.lodgeName.trim()) {
      showNotification('error', 'Lodge name is required');
      return;
    }
    if (!formData.lodgeAddress.trim()) {
      showNotification('error', 'Lodge address is required');
      return;
    }
    if (!formData.area.trim()) {
      showNotification('error', 'Area is required');
      return;
    }
    if (!formData.pricePerYear || parseFloat(formData.pricePerYear) <= 0) {
      showNotification('error', 'Valid price is required');
      return;
    }
    if (!formData.availableSlots || parseInt(formData.availableSlots) <= 0) {
      showNotification('error', 'Valid available slots is required');
      return;
    }
    if (!formData.distanceFromUNN || parseFloat(formData.distanceFromUNN) < 0) {
      showNotification('error', 'Valid distance is required');
      return;
    }
    if (!formData.description.trim()) {
      showNotification('error', 'Description is required');
      return;
    }
    if (formData.photos.length === 0) {
      showNotification('error', 'At least one photo is required');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        lodgeName: formData.lodgeName,
        lodgeAddress: formData.lodgeAddress,
        area: formData.area,
        pricePerYear: parseFloat(formData.pricePerYear),
        availableSlots: parseInt(formData.availableSlots),
        distanceFromUNN: parseFloat(formData.distanceFromUNN),
        description: formData.description,
        photos: formData.photos,
        status: formData.status,
      };

      const listingId = (listing?.listing_id || listing?.id) as string;
      const response = await listingAPI.update(listingId, updateData);
      
      setListing(response.data as Listing);
      setIsEditing(false);
      showNotification('success', 'Listing updated successfully');
    } catch (error: any) {
      console.error('Failed to update listing:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to update listing';
      showNotification('error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      const listingId = (listing?.listing_id || listing?.id) as string;
      await listingAPI.delete(listingId);
      showNotification('success', 'Listing deleted successfully');
      router.push('/landlord/listings');
    } catch (error: any) {
      console.error('Failed to delete listing:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to delete listing';
      showNotification('error', errorMessage);
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <LandlordLayout>
        <DetailPageSkeleton />
      </LandlordLayout>
    );
  }

  if (!listing) return null;

  return (
    <LandlordLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/landlord/listings">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold uppercase">
                {isEditing ? 'Edit Listing' : 'Listing Details'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isEditing ? 'Update your listing information' : 'View your listing information'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Listing
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={saving}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    loadListing();
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={saving}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold',
                formData.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              {formData.status}
            </span>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lodge Name *</label>
                <Input
                  name="lodgeName"
                  value={formData.lodgeName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter lodge name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area *</label>
                <Input
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., Odim, Alor-Uno"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lodge Address *</label>
              <Input
                name="lodgeAddress"
                value={formData.lodgeAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Full address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price Per Year (₦) *</label>
                <Input
                  type="number"
                  name="pricePerYear"
                  value={formData.pricePerYear}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="150000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Available Slots *</label>
                <Input
                  type="number"
                  name="availableSlots"
                  value={formData.availableSlots}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Distance from UNN (km) *</label>
                <Input
                  type="number"
                  step="0.1"
                  name="distanceFromUNN"
                  value={formData.distanceFromUNN}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={cn(
                  'w-full px-4 py-3 border border-gray-200 rounded-xl',
                  'focus:outline-none focus:ring-2 focus:ring-black',
                  'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
                )}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Description</h3>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={6}
              placeholder="Describe your lodge, amenities, and features..."
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Images</h3>
            <p className="text-sm text-gray-500">
              Upload images of your lodge. The first image will be used as the cover photo.
            </p>
            {isEditing ? (
              <ImageUpload
                images={formData.photos}
                onChange={handleImagesChange}
                maxImages={10}
                maxSizeMB={5}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo}
                      alt={`Lodge photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}
    </LandlordLayout>
  );
}
