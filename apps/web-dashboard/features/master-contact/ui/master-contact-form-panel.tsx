import { ArrowLeft, Save } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  type ContactFormState,
  type ContactType,
} from '@/features/master-contact/model/types';
import { slugifyCode } from '@/features/master-contact/model/utils';

type MasterContactFormPanelProps = {
  form: ContactFormState;
  editingUuid: string | null;
  submitting: boolean;
  loadingCity: boolean;
  error: string;
  cityAutocompleteOptions: Array<{ value: string; label: string; keywords?: string }>;
  onFormChange: (next: ContactFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
  onCitySelect: (value: string) => void;
};

export function MasterContactFormPanel({
  form,
  editingUuid,
  submitting,
  loadingCity,
  error,
  cityAutocompleteOptions,
  onFormChange,
  onSubmit,
  onBack,
  onCitySelect,
}: MasterContactFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit Contact' : 'Create Contact'}</h2>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => {
                const nextName = e.target.value;
                onFormChange({
                  ...form,
                  name: nextName,
                  code: slugifyCode(nextName),
                });
              }}
              required
            />
          </div>
          <div>
            <Label htmlFor="code">
              Code <span className="text-destructive">*</span>
            </Label>
            <Input id="code" value={form.code} onChange={(e) => onFormChange({ ...form, code: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="type">
              Type <span className="text-destructive">*</span>
            </Label>
            <AutocompleteSelect
              value={form.type}
              onValueChange={(value) => onFormChange({ ...form, type: value as ContactType })}
              options={[
                { value: 'customer', label: 'Customer' },
                { value: 'supplier', label: 'Supplier' },
                { value: 'company', label: 'Company' },
              ]}
              placeholder="Select type"
              searchPlaceholder="Search type..."
              emptyText="No type found."
              required
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => onFormChange({ ...form, contactEmail: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="contactPhone">Phone</Label>
            <Input id="contactPhone" value={form.contactPhone} onChange={(e) => onFormChange({ ...form, contactPhone: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <AutocompleteSelect
              value={form.city}
              onValueChange={onCitySelect}
              options={cityAutocompleteOptions}
              placeholder={loadingCity ? 'Loading city...' : 'Select city'}
              searchPlaceholder="Search city..."
              emptyText="No city found."
              disabled={loadingCity}
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
          </div>
        </div>

        <Accordion type="single" collapsible variant="outline">
          <AccordionItem value="advanced-input">
            <AccordionTrigger>Advanced Input</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div>
                  <Label htmlFor="tax">Tax</Label>
                  <Input id="tax" value={form.tax} onChange={(e) => onFormChange({ ...form, tax: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={form.website} onChange={(e) => onFormChange({ ...form, website: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="street">Street</Label>
                  <Input id="street" value={form.street} onChange={(e) => onFormChange({ ...form, street: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    value={form.province}
                    onChange={(e) => onFormChange({ ...form, province: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" value={form.zipCode} onChange={(e) => onFormChange({ ...form, zipCode: e.target.value })} />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={form.address} onChange={(e) => onFormChange({ ...form, address: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="contactFirstName">Contact Name</Label>
                  <Input
                    id="contactFirstName"
                    value={form.contactFirstName}
                    onChange={(e) => onFormChange({ ...form, contactFirstName: e.target.value })}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            <Save />
            {submitting ? 'Saving...' : editingUuid ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft />
            Back to List
          </Button>
        </div>
      </form>
    </div>
  );
}
