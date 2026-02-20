import { ArrowLeft, Save } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { MasterDivisionFormState } from '@/features/master-division/model/types';

type MasterDivisionFormPanelProps = {
  form: MasterDivisionFormState;
  editingUuid: string | null;
  submitting: boolean;
  error: string;
  onFormChange: (next: MasterDivisionFormState) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function MasterDivisionFormPanel({
  form,
  editingUuid,
  submitting,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: MasterDivisionFormPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <h2 className="mb-4 text-sm font-semibold text-mono">{editingUuid ? 'Edit Division' : 'Create Division'}</h2>
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
            <Input id="name" value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="code">
              Code <span className="text-destructive">*</span>
            </Label>
            <Input id="code" value={form.code} onChange={(e) => onFormChange({ ...form, code: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div>
            <Label htmlFor="isActive">
              Status <span className="text-destructive">*</span>
            </Label>
            <AutocompleteSelect
              value={form.isActive ? 'true' : 'false'}
              onValueChange={(value) => onFormChange({ ...form, isActive: value === 'true' })}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              placeholder="Select status"
              searchPlaceholder="Search status..."
              emptyText="No status found."
              required
              triggerClassName="h-8.5 text-[0.8125rem]"
            />
          </div>
        </div>

        <Accordion type="single" collapsible variant="outline">
          <AccordionItem value="advanced-input">
            <AccordionTrigger>Advanced Input</AccordionTrigger>
            <AccordionContent>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => onFormChange({ ...form, description: e.target.value })}
                />
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
