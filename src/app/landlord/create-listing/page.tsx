'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LandlordLayout from '@/components/layouts/LandlordLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Notification, useNotification } from '@/components/ui/Notification';
import { UNN_AREAS } from '@/lib/constants';

export default function CreateListingPage() {
  const router = useRouter();
  const { notification, showNotification, clearNotification } = useNotification();
  const [formData, setFormData] = useState({
    lodgeName: '',
    lodgeAddress: '',
    area: UNN_AREAS[0],
    pricePerYear: '',
    availableSlots: '',
    distanceFromUNN: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      showNotification('success', 'Listing created successfully!');
      setTimeout(() => {
        router.push('/landlord/listings');
      }, 1500);
    }, 1000);
  };

  return (
    <LandlordLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">
            Create New Listing
          </h1>
          <p className="text-gray-600">
            Fill in the details about your property
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Lodge Name"
                  name="lodgeName"
                  value={formData.lodgeName}
                  onChange={handleChange}
                  placeholder="e.g., Sunshine Lodge"
                  required
                />

                <Select
                  label="Area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  options={UNN_AREAS.map(area => ({ value: area, label: area }))}
                  required
                />

                <div className="md:col-span-2">
                  <Input
                    label="Lodge Address"
                    name="lodgeAddress"
                    value={formData.lodgeAddress}
                    onChange={handleChange}
                    placeholder="e.g., 15 Peace Street, Odenigwe, Nsukka"
                    required
                  />
                </div>

                <Input
                  label="Price Per Year (₦)"
                  name="pricePerYear"
                  type="number"
                  value={formData.pricePerYear}
                  onChange={handleChange}
                  placeholder="150000"
                  required
                />

                <Input
                  label="Available Slots"
                  name="availableSlots"
                  type="number"
                  value={formData.availableSlots}
                  onChange={handleChange}
                  placeholder="8"
                  required
                />

                <Input
                  label="Distance from UNN (km)"
                  name="distanceFromUNN"
                  type="number"
                  step="0.1"
                  value={formData.distanceFromUNN}
                  onChange={handleChange}
                  placeholder="1.2"
                  required
                />
              </div>

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property, amenities, and what makes it special..."
                rows={6}
                required
              />

              <div className="pt-4 flex gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  Create Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Info Card */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-3">
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Ensure all information provided is accurate and up-to-date</li>
              <li>• Photos and videos can be added later by editing the listing</li>
              <li>• Your listing will be visible to students immediately after creation</li>
              <li>• You can edit or close your listing at any time</li>
            </ul>
          </CardContent>
        </Card>
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
